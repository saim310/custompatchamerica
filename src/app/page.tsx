import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import Categories from "@/components/Categories";
import Story from "@/components/Story";
import PatchPreview from "@/components/PatchPreview";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import QuoteSection from "@/components/QuoteSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <MarqueeStrip />
        <Categories />
        <PatchPreview />
        <Process />
        <WhyChooseUs />
        <Story />
        <QuoteSection />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
