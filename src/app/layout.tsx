import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Custom Patch America | Your Idea. Our Stitch.",
  description: "High-quality custom patches for businesses, teams, events, and brands across the USA.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white font-sans text-[14px] text-navy max-[650px]:text-[13px]">{children}</body>
    </html>
  );
}
