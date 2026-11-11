import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SamplesGallery from "@/components/SamplesGallery";
import styles from "./samples.module.css";

export const metadata: Metadata = {
  title: "Patch Samples & Portfolio | Custom Patch America",
  description: "Explore embroidered, woven, chenille, PVC, leather, and sublimated patch samples. Find inspiration for your next custom patch design.",
};

export default function SamplesPage() {
  return (
    <div id="top">
      <Header servicePage />
      <main id="main-content">
        <section aria-labelledby="samples-heading" className="relative overflow-hidden bg-gradient-to-r from-[#103968] via-[#28639a] to-[#79a9d1] px-6 text-white">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 py-12 sm:py-14 md:grid-cols-[1.2fr_1fr] md:gap-12 md:py-16">
            <div className={styles.bannerCopy}>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-white/80">The sample collection</p>
              <h1 id="samples-heading" className="mt-4 text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.08] tracking-[-.035em]"><span className={styles.headingFirst}>Small patches.</span><br /><span className={styles.headingSecond}>Big possibilities.</span></h1>
              <p className="mt-5 max-w-[440px] text-base leading-7 text-white/85">A little inspiration for your next big idea. Explore the styles, textures, and details that bring a custom patch to life.</p>
              <a href="#collection-heading" className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-white/50 py-2 text-sm font-semibold hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore our samples <span aria-hidden="true">&#8595;</span></a>
            </div>
            <div aria-hidden="true" className="relative mx-auto flex w-full max-w-[430px] items-center justify-center py-5 md:py-0">
              <div className={`${styles.ring} absolute size-[240px] rounded-full border border-white/40 sm:size-[300px]`} />
              <div className={`${styles.patchLeft} relative z-10 -mr-4 w-[34%] -rotate-12 rounded-2xl border border-white/50 bg-white p-3 shadow-[0_16px_40px_#061b3d30]`}>
                <Image src="/images/categories/EMBROIDERY.png" alt="" width={180} height={180} sizes="(max-width: 767px) 28vw, 146px" className="aspect-square w-full object-contain" />
              </div>
              <div className={`${styles.patchCenter} relative z-20 w-[43%] -translate-y-4 rounded-2xl border border-white/50 bg-white p-4 shadow-[0_20px_50px_#061b3d35]`}>
                <Image src="/images/categories/CHENILLE.png" alt="" width={220} height={220} sizes="(max-width: 767px) 35vw, 185px" className="aspect-square w-full object-contain" />
              </div>
              <div className={`${styles.patchRight} relative z-10 -ml-4 w-[34%] rotate-12 rounded-2xl border border-white/50 bg-white p-3 shadow-[0_16px_40px_#061b3d30]`}>
                <Image src="/images/categories/LEATHER.png" alt="" width={180} height={180} sizes="(max-width: 767px) 28vw, 146px" className="aspect-square w-full object-contain" />
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="collection-heading" className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[650px] text-center">
            <p className="inline-block rounded-full border border-brand-red px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-brand-red">Bold creations</p>
            <h2 id="collection-heading" className="mt-4 text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">Explore Our Exclusive Patch Collection</h2>
            <div className="mx-auto mt-5 h-px w-20 bg-navy" aria-hidden="true" />
            <p className="mt-5 text-sm leading-7 text-[#53647b] sm:text-base">Discover the textures, colors, and details that make every patch unique. From classic embroidery to bold PVC and finely woven designs, explore our collection and find inspiration for your own story.</p>
          </div>
          <SamplesGallery />
        </section>
      </main>
      <Footer servicePage />
    </div>
  );
}
