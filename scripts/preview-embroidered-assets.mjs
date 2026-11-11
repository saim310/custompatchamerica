import fs from "node:fs/promises";
import sharp from "sharp";

const { assets } = JSON.parse(await fs.readFile("docs/embroidered-assets.json", "utf8"));
const cells = await Promise.all(assets.map(async (asset, index) => ({
  input: await sharp(`public/images/embroidered/${asset.name}.webp`).resize(300, 280, { fit: "contain", background: "#eef0f3" }).png().toBuffer(),
  left: index % 3 * 320 + 10,
  top: Math.floor(index / 3) * 300 + 10,
})));
await fs.mkdir("artifacts", { recursive: true });
await sharp({ create: { width: 960, height: Math.ceil(assets.length / 3) * 300, channels: 3, background: "#ffffff" } }).composite(cells).png().toFile("artifacts/embroidered-assets.png");
console.log("Saved asset inspection sheet to artifacts/embroidered-assets.png");
