"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { name: "Embroidered Patches", image: "/images/categories/EMBROIDERY.png" },
  { name: "Chenille Patches", image: "/images/categories/CHENILLE.png" },
  { name: "Woven Patches", image: "/images/categories/WOVEN.png" },
  { name: "PVC Patches", image: "/images/categories/PVC.png" },
  { name: "Leather Patches", image: "/images/categories/LEATHER.png" },
  { name: "Sublimated Patches", image: "/images/categories/SUBLIMATED.png" },
] as const;
const patchTypes = slides.map((slide) => `Custom ${slide.name}`);

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [typedText, setTypedText] = useState<string>(patchTypes[0]);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    function startAnimation() {
      window.clearTimeout(timer);
      if (motionPreference.matches) {
        timer = window.setTimeout(() => setActiveSlide(0), 0);
        return;
      }

      let phraseIndex = 0;
      let characterCount = 0;
      let deleting = false;

      function tick() {
        const phrase = patchTypes[phraseIndex];
        characterCount += deleting ? -1 : 1;
        setTypedText(phrase.slice(0, characterCount));
        setActiveSlide(phraseIndex);

        let delay = deleting ? 40 : 80;
        if (!deleting && characterCount === phrase.length) {
          deleting = true;
          delay = 2000;
        } else if (deleting && characterCount === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % patchTypes.length;
          delay = 300;
        }
        timer = window.setTimeout(tick, delay);
      }

      timer = window.setTimeout(() => {
        setActiveSlide(0);
        setTypedText("");
        timer = window.setTimeout(tick, 80);
      }, 0);
    }

    startAnimation();
    motionPreference.addEventListener("change", startAnimation);
    return () => {
      window.clearTimeout(timer);
      motionPreference.removeEventListener("change", startAnimation);
    };
  }, []);

  return (
    <section className="relative overflow-x-clip bg-white px-3 pt-[110px] pb-10 text-navy sm:px-4 lg:px-5 max-[767px]:pt-8 max-[767px]:pb-6" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative isolate min-h-[670px] rounded-[34px] shadow-[0_20px_60px_#061b3d13] max-[1199px]:min-h-[640px] max-[767px]:flex max-[767px]:min-h-0 max-[767px]:flex-col max-[767px]:rounded-[24px]">
          <div className="absolute inset-0 overflow-hidden rounded-[34px] bg-gradient-to-r from-[#103968] via-[#28639a] to-[#79a9d1] max-[767px]:rounded-[24px]" aria-hidden="true" />
          <div className="relative z-20 flex h-[670px] w-[42%] flex-col justify-center pr-0 pl-[clamp(38px,4.6vw,78px)] max-[1199px]:h-[640px] max-[1199px]:w-[49%] max-[1199px]:pl-[38px] max-[767px]:h-auto max-[767px]:w-full max-[767px]:px-6 max-[767px]:pt-12 max-[767px]:pb-9 max-[390px]:px-5">
            <h1 id="hero-heading" className="max-w-[680px] text-[clamp(42px,3.5vw,54px)] leading-[1.12] font-extrabold tracking-[-.045em] text-white max-[1100px]:text-[clamp(39px,4vw,46px)] max-[767px]:text-[clamp(37px,8vw,52px)]">
              <span className="sr-only">{patchTypes[0]} </span>
              <span className="hero-typewriter" aria-hidden="true">
                {/* All phrases share a grid cell to reserve their maximum height without layout shifts. */}
                {patchTypes.map((phrase) => (
                  <span key={phrase} className="hero-typewriter-reserve">
                    {phrase}<span className="hero-typewriter-cursor">|</span>
                  </span>
                ))}
                <span className="hero-typewriter-text">
                  {typedText}<span className="hero-typewriter-cursor">|</span>
                </span>
                <span className="hero-typewriter-static">{patchTypes[0]}</span>
              </span>
              <span className="hero-heading-support">in the USA Made<br />Exactly Your Way</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-[clamp(15px,1.1vw,18px)] leading-[1.65] text-white/90 max-[767px]:mt-5 max-[767px]:text-[15px]">
              Premium custom patches for brands, teams, uniforms, events, and businesses across the United States. We focus on every detail, from material quality to color accuracy, with reliable nationwide delivery.
            </p>
            <a href="/get-a-quote" className="mt-8 inline-flex min-h-14 w-fit items-center justify-center rounded-[10px] bg-brand-red px-8 text-[16px] font-bold text-white shadow-[0_10px_24px_#e51c2a35] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red max-[767px]:mt-7">Get a Free Mockup</a>
          </div>
          <div className="absolute bottom-0 left-[42%] z-10 h-[112%] w-auto max-[1199px]:left-[47%] max-[1199px]:h-[105%] max-[767px]:relative max-[767px]:bottom-auto max-[767px]:left-auto max-[767px]:h-[400px] max-[767px]:w-full max-[767px]:overflow-hidden max-[480px]:h-[360px]">
            <Image src="/hero.png" alt="Woman wearing a custom patch on her jacket" width={1024} height={1536} priority sizes="(max-width: 767px) 320px, 540px" className="h-full w-auto max-w-none object-contain max-[767px]:absolute max-[767px]:bottom-0 max-[767px]:left-1/2 max-[767px]:h-full max-[767px]:-translate-x-1/2" />
          </div>
          <div className="absolute right-[clamp(32px,4vw,68px)] bottom-[30px] z-30 w-[clamp(205px,19vw,275px)] rounded-[20px] border border-[#e1eaf5] bg-white p-4 text-center shadow-[0_16px_45px_#061b3d35] max-[1100px]:right-6 max-[1100px]:w-[205px] max-[767px]:relative max-[767px]:right-auto max-[767px]:bottom-auto max-[767px]:mx-auto max-[767px]:mb-8 max-[767px]:w-[min(280px,calc(100%-48px))]" aria-label="Patch styles">
            <div className="relative aspect-[1.25/1] overflow-hidden rounded-[12px] bg-[#f2f6fc]">
              {slides.map((slide, index) => <Image key={slide.name} src={slide.image} alt={index === activeSlide ? slide.name : ""} aria-hidden={index !== activeSlide} fill sizes="(max-width: 767px) 248px, 250px" className={`object-contain p-2 transition-all duration-500 motion-reduce:transition-none ${index === activeSlide ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"}`} />)}
            </div>
            <strong className="mt-3 block text-[15px] font-bold text-navy" aria-live="polite">{slides[activeSlide].name}</strong>
          </div>
        </div>
      </div>
      <style jsx>{`
        #hero-heading {
          container-type: inline-size;
        }
        .hero-heading-support {
          display: block;
          margin-top: 0.2em;
          font-size: min(1em, 6cqw);
          line-height: 1.18;
          letter-spacing: -0.045em;
          white-space: nowrap;
        }
        .hero-typewriter {
          display: grid;
          container-type: inline-size;
          white-space: nowrap;
        }
        .hero-typewriter > span {
          grid-area: 1 / 1;
          min-width: 0;
          /* Keep the longest phrase on one line, larger than the supporting copy. */
          font-size: min(1.25em, 7.4cqw);
          letter-spacing: -0.045em;
        }
        .hero-typewriter-reserve {
          visibility: hidden;
          pointer-events: none;
        }
        .hero-typewriter-cursor {
          display: inline-block;
          width: 0.35em;
          font-weight: 400;
          animation: hero-cursor-blink 1s step-end infinite;
        }
        .hero-typewriter-static {
          display: none;
        }
        @keyframes hero-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 767px) {
          .hero-typewriter {
            white-space: normal;
          }
          .hero-typewriter > span {
            font-size: clamp(26px, 6.8vw, 38px);
          }
          .hero-heading-support {
            font-size: clamp(22px, 5.6vw, 30px);
            white-space: normal;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-typewriter-text { display: none; }
          .hero-typewriter-static { display: block; }
          .hero-typewriter-cursor { animation: none; }
        }
      `}</style>
    </section>
  );
}

