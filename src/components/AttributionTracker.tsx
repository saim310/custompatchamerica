"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cleanCampaign } from "@/lib/attribution";
import { attributionConsent, captureAttribution, setAttributionConsent, subscribeToAttributionConsent } from "@/lib/attribution-client";

export default function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useSyncExternalStore(subscribeToAttributionConsent, attributionConsent, () => null);
  useEffect(() => {
    captureAttribution();
  }, [pathname, searchParams]);
  if (consent !== "unset" || !Object.keys(cleanCampaign(Object.fromEntries(searchParams))).length) return null;

  return (
    <aside aria-label="Campaign tracking preference" className="fixed right-24 bottom-4 left-4 z-40 max-w-[22rem] rounded-xl border border-[#dce8f6] bg-white p-4 text-sm text-[#142b47] shadow-lg">
      <h2 className="font-bold">Allow campaign tracking?</h2>
      <p className="mt-1">Allow us to remember how you found us for 30 days and include it if you send an enquiry.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-[#0963d6] px-3 py-2 font-semibold text-white" onClick={() => setAttributionConsent(true, true)}>Allow</button>
        <button type="button" className="rounded-lg border border-[#dce8f6] px-3 py-2 font-semibold" onClick={() => setAttributionConsent(false)}>Decline</button>
      </div>
    </aside>
  );
}
