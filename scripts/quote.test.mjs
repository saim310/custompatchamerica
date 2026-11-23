import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtemp, readFile, readdir, unlink, rmdir, mkdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

// Compile the actual TypeScript modules in memory; no test-only copy of the logic.
const moduleURL = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const compile = code => ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const validationURL = moduleURL(compile(await readFile("src/lib/quote-validation.ts", "utf8")));
const attributionURL = moduleURL(compile(await readFile("src/lib/attribution.ts", "utf8")));
const emailURL = moduleURL(compile((await readFile("src/lib/quote-email.ts", "utf8"))
  .replace('"./attribution"', JSON.stringify(attributionURL))));
const source = (await readFile("src/app/api/quotes/route.ts", "utf8"))
  .replace('"@/lib/quote-validation"', JSON.stringify(validationURL))
  .replace('"@/lib/quote-email"', JSON.stringify(emailURL));
const { POST } = await import(moduleURL(compile(source)));
await mkdir("artifacts", { recursive: true });
const directory = await mkdtemp(path.resolve("artifacts/quote-test-"));
const keys = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_TO_EMAIL", "NODE_ENV", "QUOTE_STORAGE_DIR", "QUOTE_WEBHOOK_URL", "QUOTE_WEBHOOK_TOKEN", "QUOTE_SITE_ORIGIN", "QUOTE_TRUST_PROXY"];
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
for (const key of keys) delete process.env[key];
process.env.NODE_ENV = "production";
process.env.QUOTE_STORAGE_DIR = directory;

function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: "Quote Test", email: "quote-test@example.invalid", phone: "+1 202 555 0100", company: "Automated test", patchType: "Embroidered", quantity: "100", message: "Local verification only", ...overrides })) data.set(key, value);
  return data;
}
const request = (body, origin = "http://localhost:3000", extras = {}) => new Request("http://localhost:3000/api/quotes", { method: "POST", headers: { Origin: origin, ...extras }, body });

after(async () => {
  globalThis.fetch = originalFetch;
  for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; }
  // Remove only records created in this test's unique, validated directory.
  assert.ok(directory.startsWith(path.resolve("artifacts") + path.sep));
  for (const name of await readdir(directory)) { assert.match(name, /^[0-9a-f-]+\.json$/); await unlink(path.join(directory, name)); }
  await rmdir(directory);
});

test("valid quote is actually persisted before a success receipt is returned", async () => {
  const response = await POST(request(form()));
  assert.equal(response.status, 201);
  const result = await response.json();
  const saved = JSON.parse(await readFile(path.join(directory, `${result.id}.json`), "utf8"));
  assert.equal(saved.email, "quote-test@example.invalid"); assert.equal(saved.quantity, 100); assert.equal(saved.artwork, null);
});
test("valid artwork bytes survive private storage with a safe filename", async () => {
  const data = form();
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=", "base64");
  data.set("artwork", new File([png], "../../test.png", { type: "image/png" }));
  const response = await POST(request(data)); assert.equal(response.status, 201);
  const result = await response.json();
  const saved = JSON.parse(await readFile(path.join(directory, `${result.id}.json`), "utf8"));
  assert.equal(saved.artwork.base64, png.toString("base64")); assert.ok(!saved.artwork.name.includes("/"));
});
test("invalid required fields return accessible field errors", async () => {
  const response = await POST(request(form({ name: "", email: "wrong", phone: "", quantity: "0", patchType: "unknown" })));
  assert.equal(response.status, 422); const result = await response.json();
  for (const name of ["name", "email", "phone", "quantity", "patchType"]) assert.ok(result.errors[name]);
});
test("cross-origin submissions and unsupported request formats are rejected", async () => {
  assert.equal((await POST(request(form(), "https://other.example"))).status, 403);
  assert.equal((await POST(request("{}", undefined, { "Content-Type": "application/json" }))).status, 415);
});
test("honeypot submission is rejected without a success claim", async () => {
  assert.equal((await POST(request(form({ website: "spam" })))).status, 400);
});
test("disguised upload and oversized payload are rejected", async () => {
  const fake = form(); fake.set("artwork", new File(["not an image"], "fake.png", { type: "image/png" }));
  assert.equal((await POST(request(fake))).status, 422);
  const large = form(); large.set("artwork", new File([new Uint8Array(4 * 1024 * 1024)], "large.png", { type: "image/png" }));
  // Serialize like a network request, rather than cancelling Node's FormData encoder.
  const encoded = new Response(large);
  const bytes = await encoded.arrayBuffer();
  assert.equal((await POST(request(bytes, undefined, { "Content-Type": encoded.headers.get("content-type") }))).status, 413);
});
test("production without a destination never reports success", async () => {
  delete process.env.QUOTE_STORAGE_DIR;
  try { assert.equal((await POST(request(form()))).status, 503); }
  finally { process.env.QUOTE_STORAGE_DIR = directory; }
});
test("webhook failures never report success; accepted requests include artwork and ID", async () => {
  process.env.QUOTE_WEBHOOK_URL = "https://quote-receiver.example.invalid/quotes";
  process.env.QUOTE_WEBHOOK_TOKEN = "test-token";
  try {
    globalThis.fetch = async () => new Response("Failed", { status: 500 });
    assert.equal((await POST(request(form()))).status, 502);
    globalThis.fetch = async (url, init) => {
      assert.equal(url.protocol, "https:"); assert.equal(init.headers.Authorization, "Bearer test-token");
      const payload = JSON.parse(init.body.get("request"));
      assert.equal(payload.id, init.headers["Idempotency-Key"]); assert.equal(payload.source, "embroidered-patches");
      return new Response(null, { status: 201 });
    };
    assert.equal((await POST(request(form()))).status, 201);
  } finally { delete process.env.QUOTE_WEBHOOK_URL; delete process.env.QUOTE_WEBHOOK_TOKEN; globalThis.fetch = originalFetch; }
});
test("quote builder supports all patch types and preserves specifications and source", async () => {
  for (const patchType of ["Embroidered", "PVC", "Woven", "Leather", "Chenille", "Sublimated"]) {
    const message = "Patch specifications:\nunit: Inches\nwidth: 3\nheight: 2\nshape: Shield\nbacking: Sew on";
    const response = await POST(request(form({ patchType, source: "get-a-quote", message })));
    assert.equal(response.status, 201);
    const { id } = await response.json();
    const saved = JSON.parse(await readFile(path.join(directory, `${id}.json`), "utf8"));
    assert.equal(saved.source, "get-a-quote");
    assert.equal(saved.patchType, patchType);
    assert.equal(saved.message.replace(/\r\n/g, "\n"), message);
  }
});

test("Resend delivers every form source with reply-to and artwork; failures never succeed", async () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_FROM_EMAIL = "forms@example.invalid";
  process.env.RESEND_TO_EMAIL = "sales@example.invalid,team@example.invalid";
  try {
    for (const source of ["homepage", "contact-us", "get-a-quote"]) {
      const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
      const data = form({ source });
      data.set("artwork", new File([bytes], "../design.png", { type: "image/png" }));
      const sent = [];
      globalThis.fetch = async (url, init) => {
        assert.equal(url, "https://api.resend.com/emails");
        assert.equal(init.headers.Authorization, "Bearer re_test");
        const payload = JSON.parse(init.body);
        sent.push(payload);
        if (init.headers["Idempotency-Key"].startsWith("confirmation/")) {
          return Response.json({ id: "confirmation-receipt" });
        }
        assert.equal(payload.reply_to, "quote-test@example.invalid");
        assert.deepEqual(payload.to, ["sales@example.invalid", "team@example.invalid"]);
        assert.ok(payload.text.includes("source: " + source));
        assert.ok(payload.text.includes(init.headers["Idempotency-Key"]));
        assert.equal(payload.attachments[0].content, bytes.toString("base64"));
        assert.ok(!payload.attachments[0].filename.includes("/"));
        return Response.json({ id: "test-receipt" });
      };
      assert.equal((await POST(request(data))).status, 201);
      assert.equal(sent.length, 2);
      assert.deepEqual(sent[1].to, ["quote-test@example.invalid"]);
      assert.equal(sent[1].attachments, undefined);
    }
    let attempts = 0;
    globalThis.fetch = async () => ++attempts === 1
      ? Response.json({ id: "test-receipt" })
      : new Response(null, { status: 403 });
    assert.equal((await POST(request(form()))).status, 201);
    assert.equal(attempts, 2);
    assert.equal((await POST(request(form({ email: "one,two@example.invalid" })))).status, 422);
    globalThis.fetch = async () => new Response(null, { status: 403 });
    assert.equal((await POST(request(form()))).status, 502);
    globalThis.fetch = async () => { throw new Error("Network unavailable"); };
    assert.equal((await POST(request(form()))).status, 503);
    globalThis.fetch = async () => Response.json({});
    assert.equal((await POST(request(form()))).status, 503);
    delete process.env.RESEND_FROM_EMAIL;
    globalThis.fetch = async () => { assert.fail("Incomplete configuration must not send"); };
    assert.equal((await POST(request(form()))).status, 503);
  } finally {
    for (const key of ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_TO_EMAIL"]) delete process.env[key];
    globalThis.fetch = originalFetch;
  }
});

test("rate limit bounds repeated submissions", async () => {
  let status;
  for (let index = 0; index < 65; index++) { status = (await POST(request(form({ email: "invalid" })))).status; if (status === 429) break; }
  assert.equal(status, 429);
});
