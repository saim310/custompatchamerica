import { cookies } from "next/headers";
import { authConfigured, createSession, equal, json, readBody, sameOrigin, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin-auth";
export const runtime = "nodejs";
// Shared per-instance limiter; use hosting-level rate limiting with multiple instances.
let failures = 0;
let resetAt = 0;
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Please sign in from this website." }, 403);
  if (!authConfigured()) return json({ error: "Set ADMIN_PASSWORD (12+ characters) and ADMIN_SESSION_SECRET (32+ characters) on the server first." }, 503);
  if (Date.now() > resetAt) { failures = 0; resetAt = Date.now() + 15 * 60 * 1000; }
  if (failures >= 10) return json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, 429);
  failures++;
  try {
    const { password } = JSON.parse((await readBody(request, 2048)).toString());
    if (typeof password !== "string" || !equal(password, process.env.ADMIN_PASSWORD!)) return json({ error: "Incorrect password." }, 401);
    (await cookies()).set(SESSION_COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return json({ ok: true });
  } catch { return json({ error: "Unable to sign in. Please try again." }, 400); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  (await cookies()).delete(SESSION_COOKIE);
  return json({ ok: true });
}
