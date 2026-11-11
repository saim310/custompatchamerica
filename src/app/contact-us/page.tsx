import contactBanner from "@/data/Custom Patches Contact Hub.png";
import PageBanner from "@/components/PageBanner";
import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Palette, PackageCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Custom Patch America",
  description: "Tell Custom Patch America about your custom patch project. Ask a question, discuss your design, or request a quote.",
};

const help = [
  { icon: MessageSquare, title: "Have a question?", text: "Ask about patch materials, backing options, quantities, or your next project." },
  { icon: Palette, title: "Bring your idea to life", text: "Share your design direction and the details you want your patches to capture." },
  { icon: PackageCheck, title: "Plan your order", text: "Tell us your quantity and deadline so we can help you choose the right options." },
];

export default function ContactPage() {
  return (
    <div id="top" className="overflow-x-clip">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
      <Header servicePage />
      <main id="main-content">
        <PageBanner image={{ src: contactBanner.src, width: contactBanner.width, height: contactBanner.height, alt: "Custom Patches Contact Hub" }} badge="Let's create something together" heading={["Let's talk", "custom patches."]} lead="Your next project starts with a conversation." description="A new idea, a question, or your next order. Tell us what you have in mind and we'll help you take the next step." primary={{ label: "Send us a message", href: "#contact-heading" }} secondary={{ label: "Explore our patches", href: "/#categories" }} />
        <section aria-labelledby="contact-heading" className="mx-auto grid max-w-[1155px] gap-12 px-6 py-14 lg:grid-cols-[.85fr_1.15fr] lg:py-20">
          <div>
            <h2 id="contact-heading" className="text-3xl font-bold text-navy">How can we help?</h2>
            <p className="mt-4 text-base leading-7 text-[#587092]">Share a few details using the form. Include your preferred style, size, and any timing requirements in your message.</p>
            <div className="mt-8 space-y-7">
              {help.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf3ff] text-[#0963d6]"><Icon size={23} aria-hidden="true" /></span><div><h3 className="text-base font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#587092]">{text}</p></div></div>)}
            </div>
            <div className="mt-9 rounded-2xl border border-[#dce8f6] bg-[#f7faff] p-6"><h3 className="font-bold">Still exploring your options?</h3><p className="mt-2 text-sm leading-6 text-[#587092]">Find the style that fits your brand, team, or event.</p><Link href="/#categories" className="mt-3 inline-block font-semibold text-[#0963d6] underline underline-offset-4">Explore our patch types</Link></div>
          </div>
          <ContactForm />
        </section>
      </main>
      <Footer servicePage />
    </div>
  );
}