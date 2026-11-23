"use client";

import { useSyncExternalStore } from "react";
import { attributionAllowed, privacySignalEnabled, setAttributionConsent, subscribeToAttributionConsent } from "@/lib/attribution-client";

export default function AttributionPreferences() {
  const allowed = useSyncExternalStore(subscribeToAttributionConsent, attributionAllowed, () => false);
  const blocked = useSyncExternalStore(subscribeToAttributionConsent, privacySignalEnabled, () => false);
  return (
    <section className="mt-10 border-t border-[#dce8f6] pt-7">
      <h2 className="text-xl font-bold">Campaign tracking preference</h2>
      <p className="mt-3 text-base leading-8 text-[#496184]">
        If you allow campaign tracking, this site stores campaign tags, ad click IDs, page paths,
        referring website origins and visit times in this browser and uses that history for up to
        30 days. We include it with your enquiry to understand how you found us. Every enquiry
        includes the submission page and time.
      </p>
      <label className="mt-3 flex items-center gap-2 text-base text-[#496184]">
        <input type="checkbox" checked={allowed} disabled={blocked} onChange={event => setAttributionConsent(event.target.checked)} />
        Allow campaign tracking on this browser
      </label>
      {blocked && <p className="mt-2 text-[#496184]">Your browser privacy preference disables campaign tracking.</p>}
    </section>
  );
}
