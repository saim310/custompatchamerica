import aboutBanner from "@/data/Embroidered About Us Patchwork Collage.png";
import PageBanner from "@/components/PageBanner";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, RefreshCw, MessageCircleMore, Handshake } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AboutProcess, AboutCraftsmanship, AboutFAQ } from "@/components/AboutDetails";

export const metadata: Metadata = {
  title: "About Us | Custom Patch America",
  description: "Meet Custom Patch America. Custom patches for businesses, teams, and creators, with a focus on thoughtful design and the details that represent you.",
};

const values = [
  { icon: BadgeCheck, title: "Quality", text: "Every patch is crafted with precision stitching, accurate colors, and a clean finish." },
  { icon: RefreshCw, title: "Consistency", text: "From single orders to bulk production, our standards never change." },
  { icon: MessageCircleMore, title: "Communication", text: "Get clear updates and responsive support from design review to delivery." },
  { icon: Handshake, title: "Trust", text: "We build long-term relationships through honest service, reliable timelines, and dependable quality." },
];

export default function AboutPage() {
  return (
    <div id="top" className="overflow-x-clip">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
      <Header servicePage />
      <main id="main-content">
        <PageBanner image={{ src: aboutBanner.src, width: aboutBanner.width, height: aboutBanner.height, alt: "Embroidered patchwork collage for Custom Patch America" }} badge="About Custom Patch America" heading={["Your story.", "Made into a patch."]} lead="Patches that represent who you are." description="We help businesses, teams, and creators turn the things they stand for into custom patches they can wear, share, and make their own." primary={{ label: "Tell us your idea", href: "/contact-us" }} secondary={{ label: "Explore our patches", href: "/#categories" }} />
        <section aria-labelledby="our-purpose" className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:grid-cols-2 lg:gap-20 lg:py-20">
          <div className="relative flex min-h-[330px] items-center justify-center rounded-[28px] border border-[#dce8f6] bg-[#f2f7ff] p-9 sm:min-h-[400px]">
            <Image src="/images/categories/EMBROIDERY.png" alt="Embroidered mountain and lake patch with a colorful sunset" width={400} height={400} sizes="(max-width: 767px) 280px, 400px" className="h-auto w-full max-w-[340px] object-contain" />
          </div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-[#0963d6]">Patches that represent</p><h2 id="our-purpose" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">More than a design.<br />A sense of belonging.</h2><p className="mt-5 text-base leading-8 text-[#587092]">A team emblem. A business logo. A reminder of a shared experience. A patch can carry a story in a small space, and our purpose is to help you tell yours clearly.</p><p className="mt-4 text-base leading-8 text-[#587092]">At Custom Patch America, we bring your idea and its intended use into the same conversation. The style, dimensions, colors, and attachment all play a part in creating something that feels right for you.</p><Link href="/contact-us" className="mt-6 inline-flex items-center gap-2 font-bold text-[#0963d6]">Tell us your idea <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </section>
        <section aria-labelledby="values-heading" className="relative isolate overflow-hidden bg-[#101e45] px-6 py-12 text-white lg:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[url('/images/about-values-background.webp')] bg-cover bg-center bg-no-repeat" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[#031b42]/55" />
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="inline-flex rounded-full border border-[#ff2838] bg-[#041832]/30 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff4650]">Our Values</p>
              <h2 id="values-heading" className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">What We Stand For</h2>
              <p className="mt-4 text-sm leading-7 text-white/95 sm:text-base">We value quality, consistency, clear communication, and customer trust. Every patch we make is guided by attention to detail, reliable production, and a commitment to delivering custom patches that meet professional standards.</p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, text }) => (
                <article key={title} className="relative rounded-2xl border border-[#a8d0ff]/70 bg-[#9abce8]/15 p-5 shadow-[inset_0_1px_0_#ffffff20,0_12px_35px_#00000015] backdrop-blur-md after:absolute after:-bottom-0.5 after:left-[22%] after:h-1 after:w-[56%] after:rounded-full after:bg-[#ff2838] lg:p-6">
                  <span className="inline-flex text-[#ff2838]"><Icon size={36} strokeWidth={2} aria-hidden="true" /></span>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/85">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section aria-labelledby="styles-heading" className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="mx-auto max-w-2xl text-center"><h2 id="styles-heading" className="text-3xl font-bold">Different styles. Your own expression.</h2><p className="mt-4 text-base leading-8 text-[#587092]">Explore textured embroidery, detailed woven designs, soft chenille, dimensional PVC, printed sublimated patches, and leather options. Start with the look you love, then talk to us about the details.</p></div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{[
            ["Embroidered", "EMBROIDERY", "embroidered"], ["Woven", "WOVEN", "woven"], ["Chenille", "CHENILLE", "chenille"], ["PVC", "PVC", "pvc"], ["Sublimated", "SUBLIMATED", "sublimated"], ["Leather", "LEATHER", "leather"],
          ].map(([name, image, slug]) => <Link key={slug} href={`/${slug}-patches`} className="rounded-2xl border border-[#dce8f6] p-4 text-center font-bold transition-colors hover:bg-[#f2f7ff]"><Image src={`/images/categories/${image}.png`} alt="" width={140} height={140} sizes="140px" className="mx-auto h-[120px] w-full object-contain" /><span className="mt-3 block text-sm">{name}</span></Link>)}</div>
        </section>
        <AboutProcess />
        <AboutCraftsmanship />
        <AboutFAQ />
        <section className="px-6 pb-16"><div className="mx-auto max-w-[1152px] rounded-3xl bg-navy px-7 py-12 text-center text-white"><h2 className="text-3xl font-bold">What will your patch represent?</h2><p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#c1d2e8]">Tell us about your brand, your team, or the idea you can&apos;t wait to bring to life.</p><Link href="/contact-us" className="mt-7 inline-flex items-center gap-3 rounded-lg bg-brand-red px-7 py-4 font-bold hover:bg-[#d91825]">Let&apos;s create something <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
      </main>
      <Footer servicePage />
    </div>
  );
}