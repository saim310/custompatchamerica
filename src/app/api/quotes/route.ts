import { randomUUID, createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { MAX_QUOTE_BYTES, validArtworkSignature, validateQuote } from "@/lib/quote-validation";

export const runtime = "nodejs";

// Bounded per-instance abuse guard. Use edge rate limiting on multi-instance hosting.
const attempts = new Map<string, { count: number; expires: number }>();
function rateLimited(request: Request) {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.expires < now) attempts.delete(key);
  // Only trust forwarded headers if the hosting proxy overwrites them.
  const identity = process.env.QUOTE_TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown" : "shared";
  const key = createHash("sha256").update(identity).digest("hex");
  const entry = attempts.get(key) ?? { count: 0, expires: now + 60_000 };
  entry.count += 1;
  if (attempts.size >= 10000 && !attempts.has(key)) return true;
  attempts.set(key, entry);
  return entry.count > (identity === "shared" ? 60 : 10);
}
const reply = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const expectedOrigin = process.env.QUOTE_SITE_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin) return reply({ error: "Please submit your request from this website." }, 403);
  if (rateLimited(request)) return reply({ error: "Too many requests. Please wait a minute and try again." }, 429);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return reply({ error: "Please use the quote form to submit your request." }, 415);
  if (Number(request.headers.get("content-length")) > MAX_QUOTE_BYTES) return reply({ error: "Your upload is too large. The artwork limit is 3 MB." }, 413);
  let form: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "The request is empty." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_QUOTE_BYTES) { await reader.cancel(); return reply({ error: "Your upload is too large. The artwork limit is 3 MB." }, 413); }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
  } catch { return reply({ error: "The form could not be read. Please try again." }, 400); }
  if (form.get("website")) return reply({ error: "Your request could not be accepted." }, 400);
  const { details, errors, artwork } = validateQuote(form);
  if (Object.keys(errors).length) return reply({ error: "Please check the highlighted fields.", errors }, 422);
  const bytes = artwork ? new Uint8Array(await artwork.arrayBuffer()) : null;
  if (artwork && bytes && !validArtworkSignature(bytes, artwork.type)) return reply({ error: "The artwork file does not match its format.", errors: { artwork: "Upload a valid PNG, JPG, WebP or PDF." } }, 422);
  const submittedSource = String(form.get("source"));
  const source = ["get-a-quote", "contact-us", "homepage", "quote-popup"].includes(submittedSource) ? submittedSource : "embroidered-patches";
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const safeName = artwork?.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  try {
    if (source === "quote-popup" || process.env.RESEND_API_KEY || process.env.RESEND_FROM_EMAIL || process.env.RESEND_TO_EMAIL) {
      const key = process.env.RESEND_API_KEY?.trim();
      const from = process.env.RESEND_FROM_EMAIL?.trim();
      const to = process.env.RESEND_TO_EMAIL?.split(",").map(value => value.trim()).filter(Boolean);
      if (!key || !from || !to?.length) return reply({ error: "Online requests are temporarily unavailable. Please try again later." }, 503);
      const text = Object.entries({ reference: id, submitted: createdAt, source, ...details }).map(([label, value]) => label + ": " + value).join("\n\n");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", redirect: "error", signal: AbortSignal.timeout(15000),
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "Idempotency-Key": id },
        body: JSON.stringify({ from, to, reply_to: details.email,
          subject: "New " + (source === "contact-us" ? "contact" : "quote") + " request: " + details.patchType + " (" + details.quantity + ")",
          text,
          ...(artwork && bytes ? { attachments: [{ filename: safeName, content: Buffer.from(bytes).toString("base64") }] } : {}),
        }),
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        const providerMessage = typeof failure?.message === "string"
          ? failure.message.replaceAll(key, "[redacted]").replace(/re_[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 800)
          : "No provider details available.";
        console.error("Resend rejected form submission", { status: response.status, reference: id });
        return reply({
          error: "We could not send your request. Please try again later.",
          ...(process.env.NODE_ENV === "development" ? { error: "Email configuration error: " + providerMessage } : {}),
        }, 502);
      }
      const receipt = await response.json();
      if (typeof receipt.id !== "string" || !receipt.id) throw new Error("Missing email receipt");
      return reply({ id, message: "Thank you! Your request has been received. Keep your reference number for follow-up." }, 201);
    }
    if (process.env.QUOTE_WEBHOOK_URL) {
      const url = new URL(process.env.QUOTE_WEBHOOK_URL);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid webhook configuration");
      const payload = new FormData();
      payload.set("request", JSON.stringify({ id, createdAt, source, ...details }));
      if (artwork) payload.set("artwork", artwork, safeName);
      const response = await fetch(url, { method: "POST", body: payload, redirect: "error", signal: AbortSignal.timeout(15000), headers: { "Idempotency-Key": id, ...(process.env.QUOTE_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}` } : {}) } });
      if (!response.ok) return reply({ error: "We couldn’t confirm your request. Please try again later." }, 502);
      return reply({ id, message: "Thank you! Your quote request has been received. Keep your reference number for follow-up." }, 201);
    }
    const configuredDirectory = process.env.QUOTE_STORAGE_DIR;
    if (process.env.NODE_ENV === "production" && !configuredDirectory) return reply({ error: "Online quote requests are temporarily unavailable. Please try again later." }, 503);
    const directory = path.resolve(/* turbopackIgnore: true */ configuredDirectory || path.join(process.cwd(), ".data", "quotes"));
    const publicDirectory = path.resolve(process.cwd(), "public");
    const relative = path.relative(publicDirectory, directory);
    if (!relative || (!relative.startsWith("..") && !path.isAbsolute(relative))) throw new Error("Quote storage must be private");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    // One exclusive write keeps metadata and artwork together, without partial records.
    await writeFile(path.join(directory, `${id}.json`), JSON.stringify({ id, createdAt, source, ...details, artwork: artwork && bytes ? { name: safeName, type: artwork.type, base64: Buffer.from(bytes).toString("base64") } : null }, null, 2), { flag: "wx", mode: 0o600 });
    return reply({ id, message: "Thank you! Your quote request has been saved. Keep your reference number for follow-up." }, 201);
  } catch {
    console.error("Quote submission failed; check destination configuration and availability.");
    return reply({ error: "We couldn’t confirm your request. Please try again later." }, 503);
  }
}
