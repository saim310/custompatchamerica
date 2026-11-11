import fs from "node:fs/promises";
import sharp from "sharp";

// Pass the local generation manifest; original PNG outputs remain untouched.
const manifest = JSON.parse(await fs.readFile(process.argv[2], "utf8"));
await fs.mkdir("public/images/woven", { recursive: true });
await fs.mkdir("artifacts/woven", { recursive: true });
const cells = [];
for (const [index, asset] of manifest.entries()) {
  const image = sharp(asset.path);
  const meta = await image.metadata();
  const file = `public/images/woven/${asset.name}.webp`;
  const info = await image.resize({ width: 800, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100 }).toFile(file);
  if (asset.name === "why-choose-woven") {
    const { data, info: raw } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const cornerAlpha = [data[3], data[(raw.width - 1) * 4 + 3], data[(raw.height - 1) * raw.width * 4 + 3], data[data.length - 1]];
    if (!meta.hasAlpha || cornerAlpha.some(alpha => alpha !== 0)) throw new Error("Why Choose artwork needs transparent corners before use.");
    console.log("Transparent image alpha and all four corners verified.");
  }
  cells.push({ input: await sharp(file).resize(280, 260, { fit: "contain", background: "#e8ebef" }).png().toBuffer(), left: index % 3 * 300 + 10, top: Math.floor(index / 3) * 280 + 10 });
  console.log(`${file}: ${info.width}x${info.height}, ${info.size} bytes`);
}
await sharp({ create: { width: 900, height: Math.ceil(manifest.length / 3) * 280, channels: 3, background: "#ffffff" } }).composite(cells).png().toFile("artifacts/woven/generated-preview.png");
