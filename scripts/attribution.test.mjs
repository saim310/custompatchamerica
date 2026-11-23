import assert from "node:assert/strict";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL("../src/" + specifier.slice(2) + ".ts", import.meta.url).href, context);
    }
    return next(specifier === "./attribution" ? "./attribution.ts" : specifier, context);
  },
});

const { POST } = await import("../src/app/api/quotes/route.ts");
const { ATTRIBUTION_RETENTION_MS } = await import("../src/lib/attribution.ts");
const origin = "https://patches.example";
const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
globalThis.window = new EventTarget();
globalThis.document = {};
Object.defineProperty(globalThis, "navigator", { value: {}, configurable: true });
Object.assign(process.env, {
  QUOTE_SITE_ORIGIN: origin,
  RESEND_API_KEY: "test-only",
  RESEND_FROM_EMAIL: "website@patches.example",
  RESEND_TO_EMAIL: "inbox@patches.example",
});

let email;
let confirmation;
globalThis.fetch = async (url, options) => {
  if (url === "/api/quotes") return POST(new Request(origin + url, {
    ...options, headers: { Origin: origin },
  }));
  assert.equal(url, "https://api.resend.com/emails");
  const payload = JSON.parse(options.body);
  if (options.headers["Idempotency-Key"].startsWith("confirmation/")) confirmation = payload;
  else email = payload;
  return Response.json({ id: "mock-receipt" });
};

let visit = 0;
async function land(path = "/", referrer = "") {
  window.location = new URL(path, origin);
  document.referrer = referrer;
  const client = await import("../src/lib/attribution-client.ts?visit=" + visit++);
  client.captureAttribution();
  return client;
}

function enquiry(source) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    source, name: "Test Customer", email: "customer@example.com", phone: "15551234567",
    patchType: "Embroidered", quantity: "100", backing: "Sew-On", message: "Test enquiry\n<img src=x>",
  })) form.set(key, value);
  return form;
}

async function submit(client, source = "contact-us") {
  confirmation = undefined;
  const response = await client.submitEnquiry(enquiry(source));
  assert.equal(response.status, 201, await response.text());
  assert.deepEqual(email.to, ["inbox@patches.example"]);
  assert.equal(email.reply_to, "customer@example.com");
  assert.match(email.text, /name: Test Customer\n[\s\S]*CUSTOMER TRAFFIC SOURCE/);
  assert.match(email.text, /Submission Time: \d{4}-\d\d-\d\dT/);
  assert.match(email.html, /Customer details[\s\S]*Test enquiry<br>&lt;img src=x&gt;[\s\S]*CUSTOMER TRAFFIC SOURCE/);
  assert.equal(email.from, "Custom Patch America <website@patches.example>");
  assert.deepEqual(confirmation.to, ["customer@example.com"]);
  assert.equal(confirmation.from, email.from);
  assert.equal(confirmation.reply_to, "inbox@patches.example");
  assert.match(confirmation.html, /Thank you for reaching out/);
  assert.doesNotMatch(confirmation.text, /CUSTOMER TRAFFIC SOURCE|Test enquiry/);
  assert.equal(confirmation.attachments, undefined);
  return email.text;
}

const google = "/?utm_source=google&utm_medium=cpc&utm_campaign=patches&utm_content=ad_01&utm_term=custom+patches&gclid=google-test&gbraid=gb-test&wbraid=wb-test&email=ignored@example.com";
const facebook = "/woven-patches?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta_patches&fbclid=meta-test";
let client = await land(google);
assert.match(await submit(client), /Traffic Source: Direct \/ Unknown/);
assert.equal(storage.size, 0);
client.setAttributionConsent(true);
client = await land(google);
window.location = new URL("/embroidered-patches", origin);
client.captureAttribution();
window.location = new URL("/contact-us", origin);
let message = await submit(client);
for (const expected of ["First Touch: Google Ads", "Latest Touch: Google Ads", "UTM Campaign: patches",
  "UTM Content: ad_01", "UTM Term: custom patches", "gclid: google-test", "gbraid: gb-test",
  "wbraid: wb-test", "First Landing Page: /\n", "Submission Page: /contact-us"]) assert.ok(message.includes(expected), expected);
assert.ok(!message.includes("ignored@example.com"));

client = await land(facebook, "https://l.facebook.com/private?token=secret");
message = await submit(client, "quote-popup");
assert.match(message, /Latest Touch: Facebook Ads[\s\S]*Referrer: https:\/\/l.facebook.com[\s\S]*UTM Campaign: meta_patches[\s\S]*fbclid: meta-test[\s\S]*First Touch: Google Ads/);
assert.ok(!message.includes("token=secret"));
client = await land("/samples");
assert.match(await submit(client), /Latest Touch: Facebook Ads/);

const stored = JSON.parse(storage.get("cpa-attribution"));
stored.first.at = new Date(Date.now() - ATTRIBUTION_RETENTION_MS).toISOString();
storage.set("cpa-attribution", JSON.stringify(stored));
client = await land("/samples", "https://www.google.com/search?q=private");
message = await submit(client);
assert.match(message, /First Landing Page: \/samples[\s\S]*First Touch: Google Organic Search/);

client = await land("/contact-us?fbclid=organic-social", "https://www.facebook.com/");
assert.match(await submit(client), /Latest Touch: Referral Website/);
client = await land("/contact-us", "https://www.google.com.example.net/");
assert.match(await submit(client), /Latest Touch: Referral Website/);

client = await land("/?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile", "");
window.location = new URL("/get-a-quote", origin);
assert.match(await submit(client), /Latest Touch: Instagram Organic[\s\S]*UTM Campaign: profile/);
client = await land("/", "https://l.instagram.com/");
assert.match(await submit(client), /Latest Touch: Instagram Referral/);
client = await land("/?utm_source=instagram&utm_medium=paid_social");
assert.match(await submit(client), /Latest Touch: Instagram Ads/);
client = await land("/", "https://instagram.com.example.net/");
assert.match(await submit(client), /Latest Touch: Referral Website/);

storage.clear();
const instagramId = "PAdGRleAVxPZ_" + "0123456789_-".repeat(19);
const instagramBio = "/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=" + instagramId;
client = await land(instagramBio);
assert.equal(client.attributionConsent(), "unset");
assert.match(await submit(client), /Traffic Source: Direct \/ Unknown/);
client.setAttributionConsent(true, true);
window.location = new URL("/get-a-quote", origin);
message = await submit(client);
assert.match(message, /Traffic Source: Instagram\n[\s\S]*First Landing Page: \/\n[\s\S]*Submission Page: \/get-a-quote/);
assert.match(message, /UTM Source: ig\nUTM Medium: social\nUTM Campaign: Not available\nUTM Content: link_in_bio/);
assert.ok(message.includes("fbclid: " + instagramId));

client.setAttributionConsent(false);
assert.equal(storage.has("cpa-attribution"), false);
client = await land(instagramBio);
assert.equal(client.attributionConsent(), "declined");
for (const source of ["homepage", "get-a-quote", "contact-us", "quote-popup"]) {
  assert.match(await submit(client, source), /Traffic Source: Direct \/ Unknown[\s\S]*UTM Source: Not available/);
}

const malformed = enquiry("contact-us");
malformed.set("attribution", JSON.stringify({
  first: { at: "invalid", campaign: { gclid: "fake" } },
  submissionPage: "//malicious.example/path",
}));
assert.equal((await fetch("/api/quotes", { body: malformed, method: "POST" })).status, 201);
assert.match(email.text, /Submission Page: Not available/);
assert.doesNotMatch(email.text, /fake|malicious\.example/);

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  get() { throw new Error("Storage unavailable"); },
});
client = await land();
client.setAttributionConsent(true);
window.location = new URL("/?msclkid=bing-test", origin);
client.captureAttribution();
window.location = new URL("/get-a-quote", origin);
assert.match(await submit(client), /Latest Touch: Bing Ads/);
navigator.globalPrivacyControl = true;
assert.match(await submit(client), /Traffic Source: Direct \/ Unknown/);

console.log("Attribution and mocked Resend scenarios passed.");
