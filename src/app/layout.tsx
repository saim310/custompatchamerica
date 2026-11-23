import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import AttributionTracker from "@/components/AttributionTracker";
import QuotePopup from "@/components/QuotePopup";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Custom Patch America | Your Idea. Our Stitch.",
  description: "High-quality custom patches for businesses, teams, events, and brands across the USA.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white font-sans text-[14px] text-navy max-[650px]:text-[13px]">
        <Suspense fallback={null}><AttributionTracker /></Suspense>
        {children}
        <QuotePopup />
        <a
          href="https://wa.me/15097432605"
          aria-label="Chat with Custom Patch America on WhatsApp"
          className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center rounded-full bg-[#128044] text-white shadow-lg hover:bg-[#0e6b39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128044]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-7">
            <path d="M12.04 2a9.86 9.86 0 0 0-8.56 14.75L2.08 22l5.38-1.41A9.87 9.87 0 1 0 12.04 2Zm0 18.06a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.19.84.85-3.11-.2-.32a8.2 8.2 0 1 1 7 3.91Zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.63.8-.78.97-.14.16-.28.18-.53.06-.25-.13-1.04-.39-1.98-1.23a7.47 7.47 0 0 1-1.37-1.71c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.45-.6 1.66-1.17.2-.57.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
