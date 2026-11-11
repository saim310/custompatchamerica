import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const { chromium } = await import(process.env.PLAYWRIGHT_ENTRY ? pathToFileURL(process.env.PLAYWRIGHT_ENTRY).href : "playwright");
const base = process.env.CHECK_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [], errors = [];
await fs.mkdir("artifacts/sublimated", { recursive: true });
try {
  const page = await browser.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  for (const [route, name] of [["/", "home"], ["/embroidered-patches", "embroidered"], ["/woven-patches", "woven"], ["/chenille-patches", "chenille"], ["/pvc-patches", "pvc"]]) {
    const before = await fs.readFile(`artifacts/sublimated/${name}-before.html`, "utf8");
    const after = await (await fetch(`${base}${route}`)).text();
    const normalized = await page.evaluate(htmls => htmls.map(html => {
      const main = new DOMParser().parseFromString(html, "text/html").querySelector("main");
      main.querySelectorAll("link[rel=preload]").forEach(node => node.remove());
      return main.innerHTML.replace(/<!--.*?-->/gs, "");
    }), [before, after]);
    assert.equal(normalized[1], normalized[0], `${route}: main changed`);
    report.push(`${route}: existing main DOM unchanged`);
  }

  for (const width of [375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal((await page.goto(`${base}/sublimated-patches`)).status(), 200);
    assert.equal(await page.title(), "Custom Sublimated Patches | American Custom Patch");
    assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), "Create premium custom sublimated patches with sharp full-color printing, detailed artwork, and flexible backing options for apparel, uniforms, brands, and teams.");
    assert.equal(await page.locator("h1").count(), 1);
    assert.match(await page.locator("h1").innerText(), /Custom Sublimated\s+Patches/);
    assert.equal(await page.locator("main > section").count(), 9);
    const sections = page.locator("main > section");
    assert.equal(await sections.nth(1).getAttribute("id"), "categories");
    assert.equal(await sections.nth(3).getAttribute("id"), "patch-options");
    assert.equal(await sections.nth(5).getAttribute("aria-label"), "Sublimated patch finishing options");
    assert.equal(await sections.nth(6).getAttribute("id"), "quote");
    assert.equal(await sections.nth(7).getAttribute("id"), "story");
    assert.equal(await page.locator("form").count(), 1);
    assert.equal(await page.locator("#testimonials-heading").count(), 1);
    assert.equal(await page.getByRole("link", { name: "Order Now", exact: true }).getAttribute("href"), "#quote");

    const tabs = page.getByRole("tab");
    for (const [index, name, count] of [[0, "Sew-On", 4], [1, "Polyester Fabric Base", 2], [2, "Merrowed / Stitched Border", 2]]) {
      await tabs.nth(index).click();
      await page.getByRole("tabpanel").getByRole("heading", { name, exact: true }).waitFor();
      assert.equal(await page.getByRole("tabpanel").locator("article").count(), count);
      await page.waitForFunction(() => [...document.querySelectorAll('[role="tabpanel"] img')].every(img => img.complete && img.naturalWidth > 0));
      if (index > 0) assert.ok((await page.getByRole("tabpanel").locator("img").evaluateAll(images => images.map(img => decodeURIComponent(img.src)))).every(src => src.includes("/images/sublimated/")));
    }
    await tabs.nth(2).press("Home");
    await page.getByRole("tabpanel").getByRole("heading", { name: "Sew-On", exact: true }).waitFor();
    await tabs.nth(0).press("ArrowRight");
    await page.getByRole("tabpanel").getByRole("heading", { name: "Polyester Fabric Base", exact: true }).waitFor();
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    await tabs.nth(1).press("End");
    await page.getByRole("tabpanel").getByRole("heading", { name: "Laser-Cut Edge", exact: true }).waitFor();
    await tabs.nth(2).press("ArrowRight");
    await page.getByRole("tabpanel").getByRole("heading", { name: "Sew-On", exact: true }).waitFor();
    for (const name of ["Branding & Logo Patches", "Fashion & Lifestyle Patches", "Sports & Event Patches", "Merrowed Border", "Laser-Cut Edge", "Your Custom Finish"]) assert.equal(await page.getByRole("heading", { name, exact: true }).count(), 1);
    const carousel = page.getByRole("region", { name: "Customer reviews" });
    await carousel.scrollIntoViewIfNeeded();
    assert.equal(await carousel.locator("article[aria-hidden=false]").count(), width >= 1024 ? 3 : width >= 768 ? 2 : 1);
    await carousel.getByRole("button", { name: /^Show reviews/ }).nth(1).click();
    assert.equal(await carousel.getByRole("button", { name: /^Show reviews/ }).nth(1).getAttribute("aria-current"), "true");
    await page.getByRole("textbox", { name: "Full Name", exact: true }).fill("Sublimated layout check");

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    if (width < 1024) await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await page.getByRole("button", { name: "Service", exact: true }).click();
    const nav = page.locator(width < 1024 ? "#mobile-services" : "#desktop-services");
    assert.equal(await nav.getByRole("link", { name: "Sublimated Patches" }).getAttribute("href"), "/sublimated-patches");
    assert.equal(await page.locator("footer").getByRole("link", { name: "Sublimated Patches", exact: true }).getAttribute("href"), "/sublimated-patches");
    await nav.getByRole("link", { name: "Sublimated Patches" }).click();
    await page.waitForURL(`${base}/sublimated-patches`);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let top = 0; top < height; top += 450) {
      await page.evaluate(position => window.scrollTo({ top: position, behavior: "instant" }), top);
      await page.waitForTimeout(90);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px horizontal overflow`);
    }
    await page.waitForTimeout(900);
    const productImages = page.locator('main > section:not(#quote):not([aria-labelledby="testimonials-heading"]) img');
    const sources = await productImages.evaluateAll(images => images.filter(img => !img.closest('[role="region"]')).map(img => ({ src: decodeURIComponent(img.src), alt: img.alt, loaded: img.complete && img.naturalWidth > 0 })));
    assert.ok(sources.every(img => img.loaded), "All visible-section product images load after scrolling");
    assert.ok(sources.every(img => img.src.includes("/images/sublimated/") || /\/images\/embroidered\/backing-/.test(img.src)), "No unrelated service product imagery");
    assert.ok(sources.filter(img => img.src.includes("/images/sublimated/")).every(img => /Sublimated/i.test(img.alt)), "Sublimated-specific alt text");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `artifacts/sublimated/page-${width}.png`, fullPage: true });
    report.push(`${width}px: layout, images, tabs/keyboard, carousel, form fields, quote anchors, header/footer links passed`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/sublimated-patches`);
  const beam = page.locator('#categories div[aria-hidden=true]').first().locator("div").first();
  await page.getByRole("heading", { name: "Branding & Logo Patches", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const before = await beam.evaluate(el => el.getBoundingClientRect().height);
  await page.getByRole("heading", { name: "Sports & Event Patches", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  assert.ok(await beam.evaluate(el => el.getBoundingClientRect().height) > before);
  const patch = page.getByAltText(/^NORTH COAST sublimated/);
  await patch.scrollIntoViewIfNeeded();
  const box = await patch.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .3);
  await page.waitForTimeout(500);
  assert.match(await patch.evaluate(img => img.parentElement.style.transform), /rotate[XY]/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/sublimated-patches`);
  await page.locator("#story").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#story [data-reveal]").first().evaluate(el => getComputedStyle(el).opacity), "1");
  assert.equal(await page.locator("#story [data-reveal]").first().evaluate(el => getComputedStyle(el).transform), "none");
  report.push("Scroll timeline, pointer tilt and reduced-motion behavior passed");
  const files = await fs.readdir("public/images/sublimated");
  assert.equal(files.length, 11);
  for (const file of files) {
    const metadata = await sharp(`public/images/sublimated/${file}`).metadata();
    assert.ok(metadata.hasAlpha && metadata.width === 800 && metadata.height === 800);
    assert.equal((await fetch(`${base}/images/sublimated/${file}`)).status, 200);
  }
  assert.deepEqual(errors, []);
  report.push("11 optimized transparent WebP assets served; no browser errors or failed local responses");
  report.push("Existing shared quote form is presentation-only: no submit/upload handler, feedback or Sublimated selection. Its generic No Minimum Order copy is unchanged; no quote was sent.");
  await fs.writeFile("artifacts/sublimated/verification.json", JSON.stringify(report, null, 2));
  console.log(report.join("\n"));
} finally {
  await browser.close();
}
