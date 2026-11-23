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
globalThis.fetch = async (url, options) => {
  if (url === "/api/quotes") return POST(new Request(origin + url, {
    ...options, headers: { Origin: origin },
  }));
  assert.equal(url, "https://api.resend.com/emails");
  email = JSON.parse(options.body);
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
    patchType: "Embroidered", quantity: "100", backing: "Sew-On", message: "Test enquiry",
  })) form.set(key, value);
  return form;
}

async function submit(client, source = "contact-us") {
  const response = await client.submitEnquiry(enquiry(source));
  assert.equal(response.status, 201, await response.text());
  assert.deepEqual(email.to, ["inbox@patches.example"]);
  assert.equal(email.reply_to, "customer@example.com");
  assert.match(email.text, /name: Test Customer\n[\s\S]*CUSTOMER TRAFFIC SOURCE/);
  assert.match(email.text, /Submission Time: \d{4}-\d\d-\d\dT/);
  assert.equal(email.html, undefined);
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

client.setAttributionConsent(false);
assert.equal(storage.size, 0);
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
