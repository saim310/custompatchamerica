import { readBlogImage } from "@/lib/blog-images";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name)) return new Response(null, { status: 404 });
  try {
    const bytes = await readBlogImage(name);
    if (!bytes) return new Response(null, { status: 404 });
    const type = name.endsWith(".png") ? "image/png" : name.endsWith(".jpg") ? "image/jpeg" : "image/webp";
    return new Response(bytes, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox" } });
  } catch { return new Response(null, { status: 404 }); }
}
