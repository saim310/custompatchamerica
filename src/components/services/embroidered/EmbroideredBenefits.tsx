"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { benefitsContent } from "@/data/embroidered";
import type { BenefitsContent } from "@/data/service-page";
import { Reveal, TiltImage } from "./Motion";
import styles from "./styles";

export default function EmbroideredBenefits({ content = benefitsContent }: { content?: BenefitsContent }) {
  const reduced = useReducedMotion();
  return <section className={`${styles.section} ${styles.navy}`} aria-labelledby="benefits-heading"><div className={`${styles.container} ${styles.split}`}>
    <Reveal direction="left" className={styles.benefitArt}><TiltImage {...content.image} maxTilt={8} scale={1.04} /></Reveal>
    <Reveal direction="scale"><h2 id="benefits-heading" className={styles.heading}>{content.title}</h2><p className={styles.copy}>{content.intro}</p>
      <ul className={styles.benefits}>{content.benefits.map((benefit, index) => <motion.li key={benefit} data-reveal initial={reduced ? false : { x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : index * .1 }}><Check aria-hidden="true" size={19} /><span>{benefit}</span></motion.li>)}</ul>
      <p className={styles.copy}>{content.conclusion}</p>
    </Reveal>
  </div></section>;
}
