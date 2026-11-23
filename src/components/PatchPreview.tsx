"use client";

import Image from "next/image";
import { useId, useState } from "react";
import chenillePreview from "../../public/images/patch-preview/Chinelle-Preview.png";
import embroideredPreview from "../../public/images/patch-preview/Embroidered-Preview.png";
import leatherPreview from "../../public/images/patch-preview/Leather-Preview.png";
import printedPreview from "../../public/images/patch-preview/Printed-Preview.png";
import pvcPreview from "../../public/images/patch-preview/PVC-Preview.png";
import wovenPreview from "../../public/images/patch-preview/Woven-Preview.png";

const patchTypes = ["Embroidered", "PVC", "Printed", "Woven", "Chenille", "Leather"] as const;

const previewImages = {
  Embroidered: embroideredPreview,
  PVC: pvcPreview,
  Printed: printedPreview,
  Woven: wovenPreview,
  Chenille: chenillePreview,
  Leather: leatherPreview,
};

const patchFilters: Record<(typeof patchTypes)[number], string> = {
  Embroidered: "none",
  PVC: "saturate(1.2) contrast(1.12)",
  Printed: "saturate(1.1) brightness(1.04)",
  Woven: "saturate(0.82) contrast(0.94)",
  Chenille: "saturate(1.14) contrast(1.06)",
  Leather: "sepia(0.32) saturate(0.9) contrast(1.16)",
};

export default function PatchPreview() {
  const [selectedType, setSelectedType] = useState<(typeof patchTypes)[number]>("Embroidered");
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const previewImage = previewImages[selectedType];
  const sketchFilter = useId();

  return (
    <section id="patch-preview" className="bg-white section-spacing">
      <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
        <defs>
          <filter id={sketchFilter} colorInterpolationFilters="sRGB">
            <feFlood floodColor="white" result="paper" />
            <feComposite in="SourceGraphic" in2="paper" operator="over" />
            <feColorMatrix type="saturate" values="0" result="grayscale" />
            <feGaussianBlur stdDeviation="0.85" result="softened" />
            <feBlend in="grayscale" in2="softened" mode="difference" />
            <feComponentTransfer result="edges">
              <feFuncR type="linear" slope="-5.5" intercept="1.04" />
              <feFuncG type="linear" slope="-5.5" intercept="1.04" />
              <feFuncB type="linear" slope="-5.5" intercept="1.04" />
            </feComponentTransfer>
            <feTurbulence type="fractalNoise" baseFrequency="0.18 0.38" numOctaves="2" seed="7" result="grain" />
            <feDisplacementMap in="edges" in2="grain" scale="1.15" xChannelSelector="R" yChannelSelector="G" result="pencilLines" />
            <feOffset in="pencilLines" dx="0.7" dy="-0.55" />
            <feComponentTransfer result="lightStrokes">
              <feFuncR type="linear" slope="0.28" intercept="0.72" />
              <feFuncG type="linear" slope="0.28" intercept="0.72" />
              <feFuncB type="linear" slope="0.28" intercept="0.72" />
            </feComponentTransfer>
            <feBlend in="pencilLines" in2="lightStrokes" mode="multiply" result="linework" />
            <feComponentTransfer in="grayscale" result="shading">
              <feFuncR type="linear" slope="0.10" intercept="0.90" />
              <feFuncG type="linear" slope="0.10" intercept="0.90" />
              <feFuncB type="linear" slope="0.10" intercept="0.90" />
            </feComponentTransfer>
            <feBlend in="linework" in2="shading" mode="multiply" />
          </filter>
        </defs>
      </svg>
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="section-heading text-navy">
          Turn Your Artwork Into a <span className="text-[#ed172b]">Real Patch</span>
        </h2>
        <p className="text-[#7185a8] section-copy mt-3">
          Choose a patch type below to see how your design looks in that style.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-5">
          {patchTypes.map((type) => {
            const isSelected = type === selectedType;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedType(type)}
                className={`min-w-[145px] rounded-full border px-6 py-3 text-[16px] font-bold transition-colors duration-200 max-[767px]:min-w-[132px] max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[15px] ${
                  isSelected
                    ? "border-[#ed172b] bg-[#ed172b] text-white"
                    : "border-[#cbd5e1] bg-white text-[#031832] hover:border-[#ed172b] hover:bg-[#ed172b] hover:text-white"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <div className="relative mt-9 overflow-hidden rounded-[20px] bg-white shadow-[0_14px_42px_#0b25451a] max-[767px]:mt-7 max-[767px]:rounded-[16px]">
          <div className="relative aspect-[1.72/1] min-h-[300px] w-full max-[767px]:aspect-[1.05/1] max-[500px]:min-h-[270px]">
            <Image
              src={previewImage}
              alt={`${selectedType} patch preview`}
              fill
              sizes="(max-width: 767px) 100vw, 1200px"
              className="object-contain p-[clamp(18px,3vw,40px)]"
              style={{ filter: patchFilters[selectedType] }}
            />
            <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}>
              <Image
                src={previewImage}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 1200px"
                className="object-contain p-[clamp(18px,3vw,40px)]"
                style={{ filter: `url("#${sketchFilter}")` }}
              />
            </div>

            <div className="pointer-events-none absolute top-0 bottom-0 z-10 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_8px_#03183238]" style={{ left: `${comparisonPosition}%` }}>
              <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[28px] leading-none text-[#ed172b] shadow-[0_4px_15px_#0b254526] max-[767px]:size-11 max-[767px]:text-[23px]" aria-hidden="true">
                ‹›
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={comparisonPosition}
              onChange={(event) => setComparisonPosition(Number(event.target.value))}
              aria-label="Compare original sketch with finished patch"
              className="absolute inset-0 z-20 h-full w-full cursor-col-resize opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
