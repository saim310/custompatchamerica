import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmbroideredHero from "@/components/services/embroidered/EmbroideredHero";
import EmbroideredApplications from "@/components/services/embroidered/EmbroideredApplications";
import EmbroideredBenefits from "@/components/services/embroidered/EmbroideredBenefits";
import EmbroideredOptions from "@/components/services/embroidered/EmbroideredOptions";
import EmbroideredCTA from "@/components/services/embroidered/EmbroideredCTA";
import EmbroideredCoverage from "@/components/services/embroidered/EmbroideredCoverage";
import EmbroideredStory from "@/components/services/embroidered/EmbroideredStory";
import QuoteSection from "@/components/QuoteSection";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Custom Embroidered Patches | American Custom Patch",
  description: "Create high-quality custom embroidered patches for uniforms, businesses, clubs, and teams. Explore backing options, embroidery coverage, and custom designs.",
};
export default function EmbroideredPatchesPage() {
  return <div id="top" className="overflow-x-clip text-[16px] leading-[1.7] text-[#111]"><a className="absolute z-[100] -translate-y-[200%] bg-white px-[18px] py-3 text-[#0b1c48] focus:translate-y-0" href="#main-content">Skip to content</a><Header servicePage /><main id="main-content"><EmbroideredHero /><EmbroideredApplications /><EmbroideredBenefits /><EmbroideredOptions /><EmbroideredCTA /><EmbroideredCoverage /><QuoteSection /><EmbroideredStory /><Testimonials /></main><Footer servicePage /></div>;
}
