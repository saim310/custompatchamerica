import { MongoClient, Binary } from 'mongodb';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { connectionUri, databaseName } from './blog-mongo-config.mjs';

const uri = connectionUri();
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
async function names(directory) {
  try { return await readdir(directory); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
try {
  await client.connect();
  const db = client.db(databaseName(uri));
  await db.command({ ping: 1 });
  const root = process.env.BLOG_STORAGE_DIR || path.join(process.cwd(), '.data', 'blog');
  let images = 0, posts = 0, skipped = 0;
  // Preserve filenames so all existing image URLs keep working.
  for (const name of (await names(path.join(root, 'images'))).filter(name => /^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name))) {
    const data = await readFile(path.join(root, 'images', name));
    if (data.length > 5 * 1024 * 1024) throw new Error('An image exceeds the 5 MB limit.');
    const contentType = name.endsWith('.png') ? 'image/png' : name.endsWith('.jpg') ? 'image/jpeg' : 'image/webp';
    const result = await db.collection('blog_images').updateOne({ _id: name }, { $setOnInsert: { data: new Binary(data), contentType, createdAt: new Date() } }, { upsert: true });
    images += result.upsertedCount;
  }
  for (const name of (await names(path.join(root, 'posts'))).filter(name => /^[a-z0-9-]+\.json$/.test(name))) {
    const post = JSON.parse(await readFile(path.join(root, 'posts', name), 'utf8'));
    if (post.slug + '.json' !== name || !['draft', 'published'].includes(post.status) || !post.revision || !Array.isArray(post.sections)) throw new Error('Invalid local blog record. Migration stopped.');
    // Replace seed data only; never overwrite a post already edited in MongoDB.
    const collection = db.collection('blog_posts');
    try {
      const result = await collection.replaceOne({ _id: post.slug, revision: 'seed' }, { ...post, _id: post.slug }, { upsert: true });
      if (result.modifiedCount || result.upsertedCount) posts++; else skipped++;
    } catch (error) { if (error.code === 11000) skipped++; else throw error; }
  }
  console.log(`MongoDB connected. Imported ${posts} posts and ${images} images; skipped ${skipped} existing posts. Local files were preserved.`);
} catch (error) {
  // Avoid logging connection strings or credentials.
  console.error('Migration failed:', error.name, error.code || '', 'Check MongoDB credentials, network access, and local blog data.');
  process.exitCode = 1;
} finally { await client.close(); }
