import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mongoConfigured } from "@/lib/mongodb";
import { mongoReadImage, mongoSaveImage } from "@/lib/blog-mongo";
import { storageDirectory } from "@/lib/blog-store";

export async function saveBlogImage(name: string, buffer: Buffer, contentType: string) {
  if (mongoConfigured()) return mongoSaveImage(name, buffer, contentType);
  const dir = path.join(storageDirectory(), "images");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer, { flag: "wx" });
}
export async function readBlogImage(name: string) {
  if (mongoConfigured()) {
    const image = await mongoReadImage(name);
    if (image) return image;
  }
  // Keep pre-migration covers available while local storage still exists.
  try { return await readFile(path.join(storageDirectory(), "images", name)); }
  catch (error) {
    if (mongoConfigured() && !process.env.BLOG_STORAGE_DIR && process.env.NODE_ENV === "production") return null;
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
