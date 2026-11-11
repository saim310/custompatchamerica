import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const { chromium } = await import(process.env.PLAYWRIGHT_ENTRY ? pathToFileURL(process.env.PLAYWRIGHT_ENTRY).href : "playwright");
const base = process.env.CHECK_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const report = [];
await fs.mkdir("artifacts/woven", { recursive: true });
try {
  const page = await browser.newPage();
  page.on("pageerror", error => errors.push(`${page.url()}: ${error.message}`));
  page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()} ${response.url()}`); });

  // Compare rendered DOM, excluding React's text-boundary comments and preload hints.
  for (const [route, beforeFile] of [["/embroidered-patches", "embroidered-before.html"], ["/", "home-before.html"]]) {
    const before = await fs.readFile(`artifacts/woven/${beforeFile}`, "utf8");
    const after = await (await fetch(`${base}${route}`)).text();
    const normalized = await page.evaluate(({ before, after }) => {
      const normalize = html => {
        const document = new DOMParser().parseFromString(html, "text/html");
        const main = document.querySelector("main");
        main.querySelectorAll("link[rel=preload]").forEach(node => node.remove());
        return main.innerHTML.replace(/<!--.*?-->/gs, "");
      };
      return [normalize(before), normalize(after)];
    }, { before, after });
    assert.equal(normalized[1], normalized[0], `${route} main content changed`);
    report.push(`${route}: existing main DOM preserved`);
  }

  for (const width of [375, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal((await page.goto(`${base}/woven-patches`)).status(), 200);
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.locator("h1").count(), 1);
    assert.match(await page.locator("h1").innerText(), /Custom Woven\s+Patches/);
    assert.equal(await page.locator("main > section").count(), 9);
    assert.equal(await page.locator("#quote").count(), 1);
    assert.equal(await page.locator("form").count(), 1);
    assert.equal(await page.locator("#testimonials-heading").count(), 1);
    assert.match(await page.title(), /Custom Woven Patches/);

    for (const section of await page.locator("main > section").all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    }
    const tabs = page.getByRole("tab");
    await tabs.nth(1).click();
    await page.getByRole("heading", { name: "Woven Polyester Base", exact: true }).waitFor();
    assert.equal(await page.getByRole("tabpanel").locator("article").count(), 2);
    assert.match(await page.getByRole("tabpanel").innerText(), /Fine Thread Fabric/);
    await tabs.nth(1).press("ArrowRight");
    await page.getByRole("heading", { name: "Laser Cut Edge", exact: true }).waitFor();
    assert.equal(await page.getByRole("tabpanel").locator("article").count(), 3);
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    await tabs.nth(2).press("Home");
    await page.getByRole("heading", { name: "Sew-On", exact: true }).waitFor();
    assert.equal(await page.getByRole("tabpanel").locator("article").count(), 4);
    await tabs.nth(0).press("End");
    await page.getByRole("heading", { name: "Merrowed Edge", exact: true }).waitFor();
    await tabs.nth(2).press("ArrowRight");
    await page.getByRole("heading", { name: "Sew-On", exact: true }).waitFor();

    for (const name of ["Fine Detail Weave", "Balanced Weave", "High Detail Weave"]) assert.equal(await page.getByRole("heading", { name, exact: true }).count(), 1);
    assert.equal(await page.getByRole("heading", { name: /% Embroidery Coverage/ }).count(), 0);
    const track = page.locator("#categories div[aria-hidden=true]").first();
    assert.equal(await track.isVisible(), width >= 1024);
    const carousel = page.getByRole("region", { name: "Customer reviews" });
    await carousel.scrollIntoViewIfNeeded();
    const visibleSlides = carousel.locator("article[aria-hidden=false]");
    assert.equal(await visibleSlides.count(), width >= 1024 ? 3 : width >= 768 ? 2 : 1);
    await carousel.getByRole("button", { name: /^Show reviews/ }).nth(1).click();
    assert.equal(await carousel.getByRole("button", { name: /^Show reviews/ }).nth(1).getAttribute("aria-current"), "true");

    const quote = page.locator("#quote");
    await quote.getByRole("textbox", { name: "Full Name", exact: true }).fill("Woven layout check");
    await quote.getByRole("combobox", { name: "Patch Type" }).selectOption("Woven");
    assert.equal(await quote.getByRole("combobox", { name: "Patch Type" }).inputValue(), "Woven");

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    if (width < 1024) await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await page.getByRole("button", { name: "Service", exact: true }).click();
    const menuLink = page.locator(width < 1024 ? "#mobile-services" : "#desktop-services").getByRole("link", { name: "Woven Patches" });
    assert.equal(await menuLink.getAttribute("href"), "/woven-patches");
    await menuLink.click();
    await page.waitForURL(`${base}/woven-patches`);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let top = 0; top < pageHeight; top += 450) {
      await page.evaluate(position => window.scrollTo({ top: position, behavior: "instant" }), top);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(900);
    await page.waitForFunction(() => [...document.images].filter(image => { const rect = image.getBoundingClientRect(); return rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight; }).every(image => image.complete && image.naturalWidth > 0));
    const broken = await page.locator("img").evaluateAll(images => images.filter(image => { const rect = image.getBoundingClientRect(); return rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && (!image.complete || image.naturalWidth === 0); }).map(image => image.src));
    assert.deepEqual(broken, [], `Broken images at ${width}px`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `artifacts/woven/page-${width}.png`, fullPage: true });
    report.push(`${width}px: section order/count, images, overflow, tabs + keyboard, carousel, form fields, and navigation passed`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/woven-patches`);
  const track = page.locator("#categories div[aria-hidden=true]").first();
  await page.getByRole("heading", { name: "Branding & Logo Patches", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const beamBefore = await track.locator("div").first().evaluate(node => node.getBoundingClientRect().height);
  await page.getByRole("heading", { name: "Club, Team & Organization Patches", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const beamAfter = await track.locator("div").first().evaluate(node => node.getBoundingClientRect().height);
  assert.ok(beamAfter > beamBefore, "Scroll-driven timeline beam should advance");
  const brandImage = page.getByAltText(/Apex Solutions/);
  await brandImage.scrollIntoViewIfNeeded();
  const box = await brandImage.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .3);
  await page.waitForTimeout(500);
  assert.match(await brandImage.evaluate(image => image.parentElement.style.transform), /rotate[XY]/);
  report.push("Timeline progress and pointer tilt verified");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/woven-patches`);
  await page.locator("#story").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  assert.equal(await page.locator("#story [data-reveal]").first().evaluate(node => getComputedStyle(node).opacity), "1");
  assert.equal(await page.locator("#story [data-reveal]").first().evaluate(node => getComputedStyle(node).transform), "none");
  report.push("Reduced-motion reveals visible and transforms disabled");

  for (const file of await fs.readdir("public/images/woven")) {
    const metadata = await sharp(`public/images/woven/${file}`).metadata();
    assert.ok(metadata.width > 0 && metadata.height > 0);
    assert.equal((await fetch(`${base}/images/woven/${file}`)).status, 200);
  }
  assert.deepEqual(errors, []);
  report.push("All local woven images decoded and served; no browser errors or failed local responses");
  // The shared homepage quote component is intentionally unchanged by this task.
  report.push("Existing limitation: shared QuoteSection has no submit handler, artwork upload, or success/error feedback; no live quote was sent.");
  await fs.writeFile("artifacts/woven/verification.json", JSON.stringify(report, null, 2));
  console.log(report.join("\n"));
} finally {
  await browser.close();
}
