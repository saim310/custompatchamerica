import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const manifest = JSON.parse(await fs.readFile(path.join(root, "docs/embroidered-assets.json"), "utf8"));
const destination = path.join(root, "public/images/embroidered");
await fs.mkdir(destination, { recursive: true });
for (const asset of manifest.assets) {
  const output = path.join(destination, `${asset.name}.webp`);
  const width = asset.name === "hero-patches" ? 1100 : asset.name === "navy-textile" ? 640 : 800;
  const info = await sharp(asset.source).resize({ width, withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 100, effort: 5 }).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(`${asset.name}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB, alpha=${meta.hasAlpha}`);
}
