import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";

const base = process.env.CHECK_BASE_URL || "http://localhost:3000";
const response = await fetch(`${base}/embroidered-patches`);
assert.equal(response.status, 200);
const html = await response.text();
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal((html.match(/<section\b/g) || []).length, 9);
assert.ok(html.includes("Custom Embroidered Patches | American Custom Patch"));
for (const id of ["main-content", "categories", "patch-options", "quote", "story"]) assert.ok(html.includes(`id="${id}"`));
const manifest = JSON.parse(await fs.readFile("docs/embroidered-assets.json", "utf8"));
for (const asset of manifest.assets) {
  const filename = `public/images/embroidered/${asset.name}.webp`;
  const meta = await sharp(filename).metadata();
  assert.ok(meta.width && meta.height);
  const image = await fetch(`${base}/images/embroidered/${asset.name}.webp`);
  assert.equal(image.status, 200, asset.name);
}
const optimized = await fetch(`${base}/_next/image?url=%2Fimages%2Fembroidered%2Fhero-patches.webp&w=640&q=75`);
assert.equal(optimized.status, 200);
console.log(`PASS: route HTTP 200, nine sections, one H1, metadata, anchors, ${manifest.assets.length} valid WebP assets, Next.js image optimization.`);
