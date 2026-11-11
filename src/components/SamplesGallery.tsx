"use client";

import Image from "next/image";
import { useState } from "react";

const categories = ["All", "Embroidered", "PVC", "Chenille", "Leather", "Woven", "Sublimated"] as const;
type Category = (typeof categories)[number];

const samples: { category: Category; image: string; alt: string }[] = [
  { category: "Embroidered", image: "/images/embroidered/biker-patch.webp", alt: "Custom embroidered biker patch sample" },
  { category: "PVC", image: "/images/pvc/raised-3d.webp", alt: "Raised three-dimensional PVC patch sample" },
  { category: "Chenille", image: "/images/chenille/style-full-chenille.webp", alt: "Full chenille patch with a textured yarn finish" },
  { category: "Woven", image: "/images/woven/high-detail-weave.webp", alt: "Detailed woven patch sample" },
  { category: "Leather", image: "/images/leather/engraved-leather.webp", alt: "Engraved leather patch sample" },
  { category: "Sublimated", image: "/images/sublimated/custom-finish.webp", alt: "Custom sublimated patch finish" },
  { category: "Embroidered", image: "/images/embroidered/military-patch.webp", alt: "Military style embroidered patch sample" },
  { category: "PVC", image: "/images/pvc/flat-2d.webp", alt: "Flat two-dimensional PVC patch sample" },
  { category: "Chenille", image: "/images/chenille/style-chenille-embroidery.webp", alt: "Chenille and embroidery combination patch" },
  { category: "Leather", image: "/images/leather/embossed-debossed.webp", alt: "Embossed and debossed leather patch details" },
  { category: "Woven", image: "/images/woven/fine-weave.webp", alt: "Fine weave patch with detailed artwork" },
  { category: "Sublimated", image: "/images/sublimated/laser-cut-edge.webp", alt: "Sublimated patch with a laser cut edge" },
  { category: "Embroidered", image: "/images/embroidered/sports-patch.webp", alt: "Embroidered sports patch sample" },
  { category: "PVC", image: "/images/pvc/border-custom-shape.webp", alt: "Custom shaped PVC patch sample" },
  { category: "Chenille", image: "/images/chenille/style-mixed-design.webp", alt: "Mixed design chenille patch sample" },
  { category: "Leather", image: "/images/leather/printed-leather.webp", alt: "Printed leather patch sample" },
  { category: "Woven", image: "/images/woven/balanced-weave.webp", alt: "Balanced weave patch sample" },
  { category: "Sublimated", image: "/images/sublimated/merrowed-border.webp", alt: "Sublimated patch with a merrowed border" },
  { category: "Embroidered", image: "/images/categories/EMBROIDERY.png", alt: "Colorful embroidered mountain and lake patch" },
  { category: "PVC", image: "/images/categories/PVC.png", alt: "Custom PVC patch design" },
  { category: "Chenille", image: "/images/categories/CHENILLE.png", alt: "Chenille bear patch design" },
  { category: "Leather", image: "/images/categories/LEATHER.png", alt: "Custom leather patch design" },
  { category: "Woven", image: "/images/categories/WOVEN.png", alt: "Custom woven patch design" },
  { category: "Sublimated", image: "/images/categories/SUBLIMATED.png", alt: "Full color sublimated patch design" },
];

export default function SamplesGallery() {
  const [category, setCategory] = useState<Category>("All");
  const visibleSamples = category === "All" ? samples : samples.filter((sample) => sample.category === category);

  return (
    <div className="mt-9 sm:mt-11">
      <div role="group" aria-label="Filter patch samples" className="mb-7 flex flex-wrap justify-center gap-x-2 gap-y-1 sm:gap-x-4">
        {categories.map((item) => (
          <button key={item} type="button" aria-pressed={category === item} aria-controls="samples-grid" onClick={() => setCategory(item)} className="min-h-11 cursor-pointer border-b-2 border-transparent px-2 py-2 text-sm font-medium text-navy transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red aria-pressed:border-navy motion-reduce:transition-none">
            {item}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">Showing {visibleSamples.length} {category === "All" ? "patch" : category.toLowerCase()} samples</p>
      <ul id="samples-grid" aria-label={`${category} patch samples`} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
        {visibleSamples.map((sample) => (
          <li key={sample.image} className="group relative aspect-square overflow-hidden bg-[#f8f9fb]">
            <Image src={sample.image} alt={sample.alt} fill sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 250px" className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:p-4" />
          </li>
        ))}
      </ul>
    </div>
  );
}
