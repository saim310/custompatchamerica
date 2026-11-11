import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteBuilder from "@/components/QuoteBuilder";

export const metadata: Metadata = {
  title: "Get a Free Quote | Custom Patch America",
  description: "Build your custom patch quote. Choose your patch style, size, shape, backing, border, and thread, then upload your artwork for a free quote.",
};

export default function QuotePage() {
  return <div id="top"><Header servicePage /><main>
    <section className="bg-gradient-to-r from-[#103968] via-[#28639a] to-[#79a9d1] px-6 py-12 text-center text-white sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/80">Your idea. Your details.</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Get a Free Quote</h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/85">Choose the details that make your patch yours. Share your design and we will help you take the next step.</p>
    </section>
    <div className="bg-[#f6f8fb] px-4 py-10 sm:px-6 sm:py-14"><QuoteBuilder /></div>
  </main><Footer servicePage /></div>;
}
