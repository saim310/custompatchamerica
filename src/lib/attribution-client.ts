"use client";

import { cleanCampaign, cleanPage, cleanReferrer, parseAttribution, type Attribution, type Touch } from "./attribution";

const consentKey = "cpa-attribution-consent";
const historyKey = "cpa-attribution";
const consentEvent = "cpa-attribution-consent-change";
let memoryConsent = false;
let memoryHistory: Attribution | undefined;
let historyWriteFailed = false;
let lastArrival: string | undefined;
let observedDocument = false;

export function privacySignalEnabled() {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true ||
    navigator.doNotTrack === "1";
}

export function attributionAllowed() {
  if (privacySignalEnabled()) return false;
  try {
    return localStorage.getItem(consentKey) === "granted";
  } catch {
    return memoryConsent;
  }
}

export function setAttributionConsent(allowed: boolean) {
  memoryConsent = allowed && !privacySignalEnabled();
  try {
    if (memoryConsent) localStorage.setItem(consentKey, "granted");
    else localStorage.removeItem(consentKey);
  } catch {
    // The visitor's choice still applies in this document.
  }
  if (!memoryConsent) captureAttribution();
  window.dispatchEvent(new Event(consentEvent));
}

export function subscribeToAttributionConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

export function captureAttribution() {
  const isDocumentArrival = !observedDocument;
  observedDocument = true;
  if (!attributionAllowed()) {
    memoryHistory = undefined;
    historyWriteFailed = false;
    lastArrival = undefined;
    try { localStorage.removeItem(historyKey); } catch { /* Storage unavailable. */ }
    return;
  }

  const { origin, pathname, search } = window.location;
  const now = Date.now();
  let stored: string | null = null;
  try {
    stored = historyWriteFailed && memoryHistory ? JSON.stringify(memoryHistory) : localStorage.getItem(historyKey);
  } catch {
    if (memoryHistory) stored = JSON.stringify(memoryHistory);
  }
  const history = parseAttribution(stored, origin, now)?.history;
  const touch: Touch = {
    page: cleanPage(pathname),
    referrer: isDocumentArrival ? cleanReferrer(document.referrer, origin) : undefined,
    at: new Date(now).toISOString(),
    campaign: cleanCampaign(Object.fromEntries(new URLSearchParams(search))),
  };
  const arrival = JSON.stringify([touch.page, touch.campaign]);
  const newCampaign = arrival !== lastArrival && Object.keys(touch.campaign).length > 0;
  lastArrival = arrival;
  if (history && !newCampaign && !touch.referrer) {
    memoryHistory = history;
    return history;
  }
  const updated = { first: history?.first ?? touch, latest: touch };
  memoryHistory = updated;
  try {
    localStorage.setItem(historyKey, JSON.stringify(updated));
    historyWriteFailed = false;
  } catch {
    historyWriteFailed = true;
  }
  return updated;
}

export function submitEnquiry(form: FormData) {
  const history = captureAttribution();
  form.set("attribution", JSON.stringify({
    ...history,
    submissionPage: cleanPage(window.location.pathname),
  }));
  return fetch("/api/quotes", { method: "POST", body: form });
}
