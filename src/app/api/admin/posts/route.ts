import { isAdmin, json, readBody, sameOrigin } from "@/lib/admin-auth";
import { savePost } from "@/lib/blog-store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return json({ error: "Please sign in again." }, 401);
  try { return json({ post: await savePost(JSON.parse((await readBody(request, 900000)).toString())) }); }
  catch (error) { console.error("Blog save failed", error); return json({ error: error instanceof Error ? error.message : "Unable to save post." }, 400); }
}
