import fs from "node:fs/promises";
import sharp from "sharp";

// Reuse for other service manifests: node scripts/prepare-chenille-assets.mjs pvc
// Preserve the original generated PNGs; optimize selected outputs for the website.
const service = process.argv[2] || "chenille";
if (!/^[a-z]+(?:-[a-z]+)*$/.test(service)) throw new Error("Expected a service slug");
const { images } = JSON.parse(await fs.readFile(`docs/${service}-assets.json`, "utf8"));
await fs.mkdir(`public/images/${service}`, { recursive: true });
await fs.mkdir(`artifacts/${service}`, { recursive: true });
const cells = [];
for (const [index, asset] of images.entries()) {
  const source = sharp(asset.original);
  const meta = await source.metadata();
  if (!meta.hasAlpha) throw new Error(`${asset.name}: expected a transparent cutout`);
  const info = await source.resize(800, 800, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 100 }).toFile(asset.file);
  const { data, info: raw } = await sharp(asset.file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [data[3], data[(raw.width - 1) * 4 + 3], data[(raw.height - 1) * raw.width * 4 + 3], data[data.length - 1]];
  // A one-level alpha residue from the generator is visually transparent.
  if (corners.some(alpha => alpha > 1)) throw new Error(`${asset.name}: corners must be transparent`);
  cells.push({ input: await sharp(asset.file).resize(270, 250, { fit: "contain", background: "#e8ebef" }).flatten({ background: "#e8ebef" }).png().toBuffer(), left: index % 3 * 290 + 10, top: Math.floor(index / 3) * 270 + 10 });
  console.log(`${asset.file}: ${info.width}x${info.height}, ${info.size} bytes; alpha verified`);
}
await sharp({ create: { width: 870, height: Math.ceil(images.length / 3) * 270, channels: 3, background: "#ffffff" } })
  .composite(cells).png().toFile(`artifacts/${service}/generated-preview.png`);
