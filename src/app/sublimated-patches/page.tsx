import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSection from "@/components/QuoteSection";
import Testimonials from "@/components/Testimonials";
import ServiceHero from "@/components/services/embroidered/EmbroideredHero";
import ServiceApplications from "@/components/services/embroidered/EmbroideredApplications";
import ServiceBenefits from "@/components/services/embroidered/EmbroideredBenefits";
import ServiceOptions from "@/components/services/embroidered/EmbroideredOptions";
import ServiceCTA from "@/components/services/embroidered/EmbroideredCTA";
import ServiceDetails from "@/components/services/embroidered/EmbroideredCoverage";
import ServiceStory from "@/components/services/embroidered/EmbroideredStory";
import { applications, benefits, cta, details, hero, options, story } from "@/data/sublimated";

export const metadata: Metadata = {
  title: "Custom Sublimated Patches | American Custom Patch",
  description: "Create premium custom sublimated patches with sharp full-color printing, detailed artwork, and flexible backing options for apparel, uniforms, brands, and teams.",
};

export default function SublimatedPatchesPage() {
  return (
    <div id="top" className="overflow-x-clip text-[16px] leading-[1.7] text-[#111] motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:scroll-auto motion-reduce:[&_[data-reveal]]:opacity-100! motion-reduce:[&_[data-reveal]]:transform-none!">
      <a className="absolute z-[100] -translate-y-[200%] bg-white px-[18px] py-3 text-[#0b1c48] focus:translate-y-0" href="#main-content">Skip to content</a>
      <Header servicePage />
      <main id="main-content">
        <ServiceHero content={hero} />
        <ServiceApplications content={applications} />
        <ServiceBenefits content={benefits} />
        <ServiceOptions content={options} />
        <ServiceCTA content={cta} />
        <ServiceDetails content={details} />
        <QuoteSection />
        <ServiceStory content={story} />
        <Testimonials />
      </main>
      <Footer servicePage />
    </div>
  );
}
