import { Binary, type Db } from "mongodb";
import { blogDatabase } from "@/lib/mongodb";
import { posts } from "@/data/blog";
import type { BlogPost } from "@/lib/blog-types";

type PostDocument = BlogPost & { _id: string };
type ImageDocument = { _id: string; data: Binary; contentType: string; createdAt: Date };
const initialized = new WeakMap<Db, Promise<void>>();
async function postCollection() {
  const db = await blogDatabase();
  let setup = initialized.get(db);
  if (!setup) {
    setup = (async () => {
      const collection = db.collection<PostDocument>("blog_posts");
      await collection.bulkWrite(posts.map(post => ({ updateOne: {
        filter: { _id: post.slug },
        update: { $setOnInsert: { ...post, status: "published", updatedAt: "", revision: "seed" } }, upsert: true,
      } })), { ordered: false });
    })();
    initialized.set(db, setup);
    setup.catch(() => initialized.delete(db));
  }
  await setup;
  return db.collection<PostDocument>("blog_posts");
}
export async function mongoListPosts(includeDrafts: boolean): Promise<BlogPost[]> {
  const collection = await postCollection();
  const documents = await collection.find(includeDrafts ? {} : { status: "published" }, { projection: { _id: 0 } }).sort({ updatedAt: -1, slug: 1 }).toArray();
  return documents.map(document => ({ slug: document.slug, title: document.title, category: document.category, image: document.image, excerpt: document.excerpt, service: document.service, sections: document.sections, status: document.status, updatedAt: document.updatedAt, revision: document.revision }));
}
export async function mongoSavePost(post: BlogPost, revision: unknown) {
  const collection = await postCollection();
  if (revision) {
    if (typeof revision !== "string") throw new Error("Invalid post revision.");
    const result = await collection.replaceOne({ _id: post.slug, revision }, post);
    if (!result.matchedCount) throw new Error("This post changed in another tab. Reload before editing.");
  } else {
    try { await collection.insertOne({ ...post, _id: post.slug }); }
    catch (error) {
      if ((error as { code?: number }).code === 11000) throw new Error("This URL already exists. Choose a different slug.");
      throw error;
    }
  }
  return post;
}
// Covers are capped at 5 MB, safely below MongoDB's document size limit.
export async function mongoSaveImage(name: string, data: Buffer, contentType: string) {
  const db = await blogDatabase();
  await db.collection<ImageDocument>("blog_images").insertOne({ _id: name, data: new Binary(data), contentType, createdAt: new Date() });
}
export async function mongoReadImage(name: string) {
  const db = await blogDatabase();
  const image = await db.collection<ImageDocument>("blog_images").findOne({ _id: name });
  return image ? Buffer.from(image.data.buffer) : null;
}
