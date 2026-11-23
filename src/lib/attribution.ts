export const ATTRIBUTION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
export const ATTRIBUTION_MAX_LENGTH = 12_000;
const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const clickKeys = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;
const direct = "Direct / Unknown";

type Campaign = Partial<Record<(typeof utmKeys)[number] | (typeof clickKeys)[number], string>>;
export type Touch = { page?: string; referrer?: string; at: string; campaign: Campaign };
export type Attribution = { first: Touch; latest: Touch };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function clean(value: unknown, limit: number): string | undefined {
  if (typeof value !== "string" || value.length > limit || /[\p{Cc}\p{Cf}\uFFFD]/u.test(value)) return;
  return value.trim() || undefined;
}

export function cleanPage(value: unknown) {
  const page = clean(value, 512);
  if (!page?.startsWith("/") || page.startsWith("//") || /[?#\\\s]/u.test(page)) return;
  return page;
}

export function cleanReferrer(value: unknown, siteOrigin: string) {
  const referrer = clean(value, 2048);
  if (!referrer) return;
  try {
    const url = new URL(referrer);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return;
    const site = new URL(siteOrigin);
    const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
    if (host === site.hostname.toLowerCase().replace(/^www\./, "")) return;
    // Keep only the external origin to avoid collecting referrer paths and queries.
    return clean(url.origin, 512);
  } catch {
    return;
  }
}

export function cleanCampaign(value: unknown): Campaign {
  const raw = record(value);
  const campaign: Campaign = {};
  for (const key of utmKeys) {
    const entry = clean(raw[key], 256);
    if (entry) campaign[key] = entry;
  }
  for (const key of clickKeys) {
    const entry = clean(raw[key], 256);
    if (entry && /^[A-Za-z0-9._~-]+$/.test(entry)) campaign[key] = entry;
  }
  return campaign;
}

function cleanTouch(value: unknown, origin: string, now: number): Touch | undefined {
  const raw = record(value);
  const at = clean(raw.at, 24);
  if (!at || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(at)) return;
  const time = Date.parse(at);
  if (!Number.isFinite(time) || new Date(time).toISOString() !== at ||
      time > now + 60_000 || now - time >= ATTRIBUTION_RETENTION_MS) return;
  return { page: cleanPage(raw.page), referrer: cleanReferrer(raw.referrer, origin), at, campaign: cleanCampaign(raw.campaign) };
}

export function parseAttribution(value: unknown, origin: string, now = Date.now()) {
  if (typeof value !== "string" || value.length > ATTRIBUTION_MAX_LENGTH) return;
  try {
    const raw = record(JSON.parse(value));
    const first = cleanTouch(raw.first, origin, now);
    const latest = cleanTouch(raw.latest, origin, now);
    return {
      history: first ? { first, latest: latest && latest.at >= first.at ? latest : first } : undefined,
      submissionPage: cleanPage(raw.submissionPage),
    };
  } catch {
    return;
  }
}

function trafficSource(touch?: Touch): string {
  if (!touch) return direct;
  const tags = touch.campaign;
  const source = tags.utm_source?.toLowerCase();
  const medium = tags.utm_medium?.toLowerCase();
  const paid = /^(cpc|ppc|cpm|paid([ _-](social|search|media))?|ads|display)$/.test(medium ?? "");
  if (tags.gclid || tags.gbraid || tags.wbraid || (paid && /^(google|google[ _-]?ads)$/.test(source ?? ""))) return "Google Ads";
  if (tags.msclkid || (paid && /^(bing|microsoft|microsoft[ _-]?ads)$/.test(source ?? ""))) return "Bing Ads";
  if (tags.ttclid || (paid && /^(tiktok|tik[ _-]tok)$/.test(source ?? ""))) return "TikTok Ads";
  if (paid && /^(facebook|fb|instagram|ig|meta)$/.test(source ?? "")) {
    if (source === "facebook" || source === "fb") return "Facebook Ads";
    if (source === "instagram" || source === "ig") return "Instagram Ads";
    return "Meta Ads";
  }
  if (/^(e[ _-]?mail|newsletter)$/.test(medium ?? "") || /^(e[ _-]?mail|newsletter)$/.test(source ?? "")) return "Email Marketing";
  if (medium === "organic" && source === "google") return "Google Organic Search";
  if (medium === "organic" && source === "bing") return "Bing Organic Search";
  if (utmKeys.some(key => tags[key])) return "Other Campaign Traffic";
  if (touch.referrer) {
    const host = new URL(touch.referrer).hostname.replace(/\.$/, "");
    if (/^(www\.)?google\.(com|co\.uk|ca|de|fr|co\.in|com\.au|com\.pk|co\.jp)$/.test(host)) return "Google Organic Search";
    if (/^(www\.)?bing\.com$/.test(host)) return "Bing Organic Search";
    return "Referral Website";
  }
  return tags.fbclid ? "Meta Link Traffic" : direct;
}

export function attributionEmail(value: unknown, origin: string, submittedAt: string) {
  const parsed = parseAttribution(value, origin, Date.parse(submittedAt));
  const first = parsed?.history?.first;
  const latest = parsed?.history?.latest;
  const line = (label: string, entry?: string) => `${label}: ${entry ?? "Not available"}`;
  const touchLines = (touch?: Touch) => [
    line("Landing Page", touch?.page),
    line("Referrer", touch?.referrer),
    ...utmKeys.map(key => line("UTM " + key.slice(4).replace(/^./, char => char.toUpperCase()), touch?.campaign[key])),
    ...clickKeys.map(key => line(key, touch?.campaign[key])),
  ];
  return [
    "CUSTOMER TRAFFIC SOURCE",
    line("Traffic Source", trafficSource(latest)),
    line("First Landing Page", first?.page),
    line("Submission Page", parsed?.submissionPage),
    line("First Visit", first?.at),
    line("Submission Time", submittedAt),
    "",
    line("Latest Touch", latest && trafficSource(latest)),
    line("Latest Touch Time", latest?.at),
    ...touchLines(latest),
    "",
    line("First Touch", first && trafficSource(first)),
    ...touchLines(first),
  ].join("\n");
}
