"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { heroContent } from "@/data/embroidered";
import type { HeroContent } from "@/data/service-page";
import { ease, TiltImage, TypewriterBadge } from "./Motion";
import styles from "./styles";

export default function EmbroideredHero({ content = heroContent, background = "gradient", primary = { label: "Get a Free Quote", href: "#quote" }, secondary = { label: "Explore our patches", href: "#categories" } }: { content?: HeroContent; background?: "gradient" | "textured"; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const item = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: .65, ease } } };
  const backgroundClass = background === "gradient"
    ? "bg-gradient-to-r from-[#103968] via-[#28639a] to-[#79a9d1] text-white [&_p]:text-[#e0e4ed]"
    : styles.navy;
  return <section ref={ref} className={`${styles.hero} ${backgroundClass} [&_h1]:mt-6 [&_h1]:text-[clamp(36px,4.1vw,54px)] [&_h1]:font-[650] [&_h1]:leading-[1.13] [&_h1]:tracking-[-.03em] [&_.embroidered-copy]:mt-[14px] [&_.embroidered-copy]:text-[16px] max-[1023px]:[&_h1]:max-w-[660px] max-[1023px]:[&_.embroidered-copy]:max-w-[700px] max-[430px]:[&_.quote-button]:w-full`} aria-labelledby={content.id}>
    <div className={`${styles.container} ${styles.split}`}>
      <motion.div data-reveal initial={reduced ? false : "hidden"} animate="visible" variants={{ visible: { transition: { staggerChildren: .12 } } }}>
        <motion.div variants={item}><TypewriterBadge text={content.badge} /></motion.div>
        <motion.h1 id={content.id} variants={item}>{content.heading[0]}<br />{content.heading[1]}</motion.h1>
        <motion.p className={styles.heroLead} variants={item}>{content.lead}</motion.p>
        <motion.p className={`${styles.copy} embroidered-copy`} variants={item}>{content.paragraphs[0]}</motion.p>
        {content.paragraphs[1] && <motion.p className={`${styles.copy} embroidered-copy`} variants={item}>{content.paragraphs[1]}</motion.p>}
        <motion.div className={styles.actions} variants={item}><a href={primary.href} className={`${styles.button} quote-button`}>{primary.label}</a><a href={secondary.href} className={styles.textLink}>{secondary.label}</a></motion.div>
      </motion.div>
      <motion.div className={styles.heroArt} style={reduced ? undefined : { y, rotate }}>
        <motion.div data-reveal initial={reduced ? false : { opacity: 0, scale: .85, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : .3, ease }}>
          <motion.div animate={reduced ? { y: 0 } : { y: [0, -12, 0, 12, 0] }} transition={{ duration: 6, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}><TiltImage {...content.image} preload maxTilt={6} scale={1.03} /></motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>;
}
