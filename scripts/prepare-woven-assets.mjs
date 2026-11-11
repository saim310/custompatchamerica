import fs from "node:fs/promises";
import sharp from "sharp";

const origin = "https://americancustompatch.com";
const sources = [
  ["hero", "/images/woven/hero.webp"],
  ["branding", "/images/woven/WOV-B&Logo.webp"],
  ["fashion", "/images/woven/WOV-F&Life.webp"],
  ["team", "/images/woven/WOV-Team.webp"],
  ["polyester-base", "/images/woven/WOV-Poly Base 1.webp"],
  ["fine-thread", "/images/woven/WOV-Fine Thread 1.webp"],
  ["fine", "/images/woven/fine.webp"],
  ["balanced", "/images/woven/balance.webp"],
  ["high-detail", "/images/woven/detailed.webp"],
  ["story", "/images/woven/last.webp"],
  ["why-choose", "/images/samples/Woven/WOV-Why Choose 1 (1).png"],
];

await fs.mkdir("public/images/woven", { recursive: true });
await fs.mkdir("artifacts/woven", { recursive: true });
const html = await (await fetch(`${origin}/woven-patches`)).text();
await fs.writeFile("artifacts/woven/reference.html", html);
console.log("REFERENCE COPY", [...html.matchAll(/<(?:h[1-3]|p)\b[^>]*>(.*?)<\/(?:h[1-3]|p)>/gs)].map(match => match[1].replace(/<[^>]+>/g, "")).join("\n"));
const manifest = [];
for (const [name, source] of sources) {
  const url = `${origin}${source.split("/").map(encodeURIComponent).join("/")}`;
  const response = await fetch(url);
  if (!response.ok) { console.log(`MISSING ${name}: ${response.status}`); continue; }
  const bytes = Buffer.from(await response.arrayBuffer());
  try {
    const image = sharp(bytes);
    const metadata = await image.metadata();
    const file = `public/images/woven/${name}.webp`;
    const info = await image.resize({ width: name === "hero" || name === "story" ? 1200 : 800, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100 }).toFile(file);
    manifest.push({ name, source: url, file, width: info.width, height: info.height, bytes: info.size, alpha: metadata.hasAlpha });
  } catch (error) { console.log(`INVALID ${name}: ${error.message}`); }
}
await fs.writeFile("artifacts/woven/assets.json", JSON.stringify(manifest, null, 2));
const cells = await Promise.all(manifest.map(async (asset, index) => ({
  input: await sharp(asset.file).resize(280, 260, { fit: "contain", background: "#e8ebef" }).png().toBuffer(),
  left: index % 3 * 300 + 10,
  top: Math.floor(index / 3) * 280 + 10,
})));
await sharp({ create: { width: 900, height: Math.ceil(manifest.length / 3) * 280, channels: 3, background: "#ffffff" } }).composite(cells).png().toFile("artifacts/woven/assets-preview.png");
console.log(JSON.stringify(manifest, null, 2));
