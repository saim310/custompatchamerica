import { randomUUID } from "node:crypto";
import { isAdmin, json, readBody, sameOrigin } from "@/lib/admin-auth";
import { saveBlogImage } from "@/lib/blog-images";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return json({ error: "Please sign in again." }, 401);
  try {
    const type = request.headers.get("content-type") || "";
    if (!type.startsWith("multipart/form-data")) return json({ error: "Please upload an image." }, 415);
    const bytes = await readBody(request, 5 * 1024 * 1024 + 16384);
    const form = await new Response(bytes, { headers: { "Content-Type": type } }).formData();
    const file = form.get("image");
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) return json({ error: "Choose an image up to 5 MB." }, 400);
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png"
      : file.type === "image/jpeg" && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 ? "jpg"
      : file.type === "image/webp" && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" ? "webp" : null;
    if (!ext) return json({ error: "Upload a valid PNG, JPG or WebP image." }, 400);
    const name = `${randomUUID()}.${ext}`;
    await saveBlogImage(name, buffer, file.type);
    return json({ url: `/api/blog-images/${name}` });
  } catch (error) { console.error("Blog upload failed", error); return json({ error: "Upload failed. Check the 5 MB limit and server storage configuration." }, 400); }
}
