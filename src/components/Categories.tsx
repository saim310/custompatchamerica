"use client";

import { motion, useReducedMotion } from "framer-motion";
import { categories } from "@/data/homepage";
import Image from "next/image";

export default function Categories() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="categories"
      className="bg-[linear-gradient(180deg,#fff_0%,#f7fbff_100%)] section-spacing"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <h2 className="section-heading text-navy">
            Find the Perfect Patch for Your <span className="text-[#ED172B]">Vision</span>
          </h2>
          <p className="mx-auto max-w-[800px] text-[#476489] section-copy mt-3">
            From timeless embroidered patches to modern PVC and leather options, we create patches that fit your style, purpose, and budget.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-4 gap-[clamp(16px,1.4vw,20px)] max-[1199px]:grid-cols-2 max-[440px]:grid-cols-1">
          {categories.map(({ name, image, href }, index) => (
            <motion.a
              key={name}
              href={href ?? "#quote"}
              initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reducedMotion ? undefined : { y: -7, transition: { duration: 0.2, delay: 0 } }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="group flex h-[clamp(290px,21vw,320px)] min-w-0 flex-col items-center justify-center rounded-[18px] border border-[#e2eaf4] bg-white p-[clamp(16px,1.5vw,24px)] text-center shadow-[0_12px_30px_#1230550d] transition-shadow duration-300 motion-reduce:transition-none hover:shadow-[0_18px_38px_#1230551c] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f84bd] max-[1199px]:h-[clamp(270px,28vw,320px)] max-[767px]:h-[clamp(230px,42vw,300px)] max-[767px]:p-3 max-[440px]:h-[285px]"
            >
              <motion.span
                initial={{ y: 0, rotate: 0 }}
                whileInView={reducedMotion ? { y: 0, rotate: 0 } : { y: [0, -9, 0], rotate: [0, index % 2 === 0 ? 1.5 : -1.5, 0] }}
                viewport={{ amount: 0.1 }}
                transition={{ duration: 3.6 + (index % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
                className="flex min-h-0 w-full flex-1 items-center justify-center"
              >
                <Image
                  src={image}
                  width={220}
                  height={220}
                  alt={`${name} patch`}
                  className="h-full max-h-[220px] w-full max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none"
                />
              </motion.span>
              <b className="mt-3 block shrink-0 text-[clamp(18px,1.3vw,21px)] leading-[1.15] font-extrabold text-navy max-[767px]:text-[16px]">
                {name}
                <br />
                Patches
              </b>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
