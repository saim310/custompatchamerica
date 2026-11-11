"use client";

import { useEffect, useRef } from "react";
import { stats } from "@/data/homepage";

export default function Story() {
  const statsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let started = false;
    let observer: IntersectionObserver | undefined = undefined;
    const render = (progress: number) => {
      const values = [
        `${Math.round(10000 * progress).toLocaleString("en-US")}+`,
        `${(4.9 * progress).toFixed(1)}/5`,
        `${Math.round(100 * progress)}%`,
      ];
      countersRef.current.forEach((element, index) => {
        if (element) element.textContent = values[index];
      });
    };
    const finish = () => {
      started = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      render(1);
    };
    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    if (motion.matches || !("IntersectionObserver" in window)) {
      finish();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      if (started) return;
      const entry = entries[entries.length - 1];
      const viewport = entry.rootBounds;
      const cannotFit = viewport && (
        entry.boundingClientRect.height > viewport.height ||
        entry.boundingClientRect.width > viewport.width
      );
      if (!entry.isIntersecting || entry.intersectionRatio < (cannotFit ? 0.8 : 1)) return;
      started = true;
      observer?.disconnect();
      let start: number | undefined;
      const tick = (now: number) => {
        start ??= now;
        const elapsed = Math.min((now - start) / 2000, 1);
        render(elapsed === 1 ? 1 : 1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: [0, 0.8, 1] });
    observer.observe(container);
    motion.addEventListener("change", onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section
      id="story"
      className="relative isolate flex min-h-[400px] items-center overflow-hidden bg-[#031832] px-5 py-10 text-white max-[1000px]:min-h-0 max-[1000px]:py-14 max-[650px]:px-[20px] max-[650px]:py-9"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_60%]"
      >
        <source src="https://res.cloudinary.com/dcsgyp1xo/video/upload/v1791127564/WhatsApp_Video_2026-10-03_at_9.25.25_PM_s22gtj.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-[#031832]/60" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-[clamp(40px,6vw,100px)] max-[1000px]:flex max-[1000px]:flex-col max-[1000px]:items-start max-[1000px]:gap-8 max-[650px]:gap-0">
      <div className="max-[1000px]:w-full">
        <h2 className="section-heading text-white">
          Small Details.
          <br />
          Big <span className="text-[#ED172B]">Identities.</span>
        </h2>
        <p className="max-w-[410px] section-copy mt-3">
          Custom patches help teams, brands, and organizations stand out. Quality you can feel in every stitch.
        </p>
      </div>
      <div ref={statsRef} className="flex w-full max-w-[540px] items-center justify-end justify-self-center max-[1000px]:max-w-[620px] max-[1000px]:self-center max-[1000px]:justify-center max-[650px]:mt-[20px] max-[650px]:justify-end">
        {stats.map(({ icon, value, label }, index) => (
          <div key={value} className="flex min-w-0 flex-1 flex-col items-center gap-2 border-l border-white/25 px-[clamp(8px,1.2vw,18px)] text-center first:border-l-0 max-[650px]:w-[31%]">
            <span className="text-[clamp(26px,2vw,30px)] text-[#c5d8f1]">{icon}</span>
            <b className="relative whitespace-nowrap text-[clamp(29px,2.45vw,38px)] font-extrabold max-[650px]:text-[clamp(22px,6vw,30px)]">
              <span className="invisible motion-reduce:visible" aria-hidden="true">{value}</span>
              <span aria-hidden="true" ref={(element) => { countersRef.current[index] = element; }} className="absolute inset-0 text-center motion-reduce:hidden">{["0+", "0.0/5", "0%"][index]}</span>
              <span className="sr-only">{value}</span>
            </b>
            <small className="mt-1 block text-[clamp(11px,.9vw,14px)] text-[#d6e2f3]">{label}</small>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
