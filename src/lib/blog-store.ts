import { mkdir, readFile, readdir, rename, writeFile, open, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { posts } from "@/data/blog";
import { mongoConfigured } from "@/lib/mongodb";
import { mongoListPosts, mongoSavePost } from "@/lib/blog-mongo";
import type { BlogPost } from "@/lib/blog-types";

export function storageDirectory() {
  const configured = process.env.BLOG_STORAGE_DIR;
  if (configured && !path.isAbsolute(configured)) throw new Error("BLOG_STORAGE_DIR must be an absolute path.");
  if (!configured && process.env.NODE_ENV === "production") throw new Error("Set BLOG_STORAGE_DIR to a private persistent directory before saving posts.");
  return configured || path.join(process.cwd(), ".data", "blog");
}
export async function listPosts(includeDrafts = false): Promise<BlogPost[]> {
  if (mongoConfigured()) return mongoListPosts(includeDrafts);
  const merged = new Map<string, BlogPost>(posts.map(post => [post.slug, { ...post, status: "published", updatedAt: "", revision: "seed" }]));
  if (process.env.BLOG_STORAGE_DIR || process.env.NODE_ENV !== "production") {
    const dir = path.join(storageDirectory(), "posts");
    let names: string[];
    try { names = await readdir(dir); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; names = []; }
    for (const name of names.filter(name => /^[a-z0-9-]+\.json$/.test(name))) {
      const post: BlogPost = JSON.parse(await readFile(path.join(dir, name), "utf8"));
      merged.set(post.slug, post);
    }
  }
  return [...merged.values()].filter(post => includeDrafts || post.status === "published").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export async function savePost(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Invalid post.");
  const value = input as Record<string, unknown>;
  const text = (key: string, max: number, required = true) => {
    const field = value[key];
    if (typeof field !== "string" || field.length > max || (required && !field.trim())) throw new Error(`Please check ${key} (maximum ${max} characters).`);
    return field.trim();
  };
  const slug = text("slug", 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use lowercase letters, numbers and single hyphens in the URL slug.");
  const image = text("image", 200);
  if (!/^\/images\/[a-zA-Z0-9_./ -]+$/.test(image) && !/^\/api\/blog-images\/[a-f0-9-]+\.(png|jpg|webp)$/.test(image)) throw new Error("Please upload a cover image or select an existing image.");
  const service = text("service", 200);
  if (!/^\/(?!\/)[a-zA-Z0-9/#-]*$/.test(service)) throw new Error("The related page must be a local website path.");
  if (value.status !== "draft" && value.status !== "published") throw new Error("Invalid post status.");
  if (!Array.isArray(value.sections) || !value.sections.length || value.sections.length > 40) throw new Error("Add between 1 and 40 content sections.");
  const sections = value.sections.map(section => {
    if (!section || typeof section.heading !== "string" || !section.heading.trim() || section.heading.length > 200 || typeof section.text !== "string" || !section.text.trim() || section.text.length > 20000) throw new Error("Each section needs a heading and body (up to 20,000 characters).");
    return { heading: section.heading.trim(), text: section.text.trim() };
  });
  const post: BlogPost = { slug, title: text("title", 180), category: text("category", 80), excerpt: text("excerpt", 500), image, service, sections, status: value.status, updatedAt: new Date().toISOString(), revision: randomUUID() };
  if (mongoConfigured()) return mongoSavePost(post, value.revision);
  const dir = path.join(storageDirectory(), "posts");
  await mkdir(dir, { recursive: true });
  let lock;
  try { lock = await open(path.join(dir, ".write-lock"), "wx"); } catch { throw new Error("Another post is being saved. Please retry."); }
  const temporary = path.join(dir, `.${randomUUID()}.tmp`);
  try {
    const existing = (await listPosts(true)).find(item => item.slug === slug);
    if (existing && value.revision !== existing.revision) throw new Error("This URL already exists or the post changed in another tab. Reload before editing.");
    if (!existing && value.revision) throw new Error("The original post could not be found. Reload before editing.");
    await writeFile(temporary, JSON.stringify(post), { flag: "wx" });
    await rename(temporary, path.join(dir, `${slug}.json`));
  } finally {
    await unlink(temporary).catch(() => {});
    await lock.close();
    await unlink(path.join(dir, ".write-lock"));
  }
  return post;
}
