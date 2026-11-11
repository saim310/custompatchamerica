import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "cpa_admin";
export const SESSION_SECONDS = 60 * 60 * 8;
export function authConfigured() {
  return (process.env.ADMIN_PASSWORD?.length ?? 0) >= 12 && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}
export function equal(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
function sign(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value + ":" + process.env.ADMIN_PASSWORD).digest("hex");
}
export function createSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return expires + "." + sign(expires);
}
export async function isAdmin() {
  if (!authConfigured()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature, extra] = value.split(".");
  return !extra && !!signature && /^\d+$/.test(expires) && Number(expires) > Date.now() && equal(signature, sign(expires));
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === (process.env.ADMIN_SITE_ORIGIN || new URL(request.url).origin);
}
export function json(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export async function readBody(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty request.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new Error("Request exceeds the upload limit."); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
