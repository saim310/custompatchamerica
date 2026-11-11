"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { asset, optionsContent } from "@/data/embroidered";
import type { OptionsContent } from "@/data/service-page";
import { Reveal, SectionHeading } from "./Motion";
import styles from "./styles";

export default function EmbroideredOptions({ content = optionsContent }: { content?: OptionsContent }) {
  const optionGroups = content.groups;
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const group = optionGroups[selected];
  const singleCenteredCard = content.centerCards && group.items.length === 1;
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % optionGroups.length;
    else if (event.key === "ArrowLeft") next = (index + optionGroups.length - 1) % optionGroups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = optionGroups.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return <section id="patch-options" className={`${styles.section} ${styles.light}`} aria-label="Patch backing and border options"><div className={styles.container}>
    <Reveal direction="right"><SectionHeading eyebrow={content.eyebrow} title={content.title}>{content.description}</SectionHeading></Reveal>
    <div role="tablist" aria-label="Customize your patch" className={styles.tabs}>{optionGroups.map((option, index) => <button key={option.id} ref={element => { tabs.current[index] = element; }} className={styles.tab} type="button" role="tab" id={`tab-${option.id}`} aria-controls={`panel-${option.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{option.label}</button>)}</div>
    <div className={styles.optionsPanel}><AnimatePresence mode="wait" initial={false}><motion.div key={group.id} role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`} tabIndex={0} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .15 }}>
      <p className={styles.tabDescription}>{group.description}</p><div className={`${styles.optionGrid}${content.centerCards && group.items.length === 2 ? " min-[1024px]:[&>article:first-child]:col-start-2" : ""}${singleCenteredCard ? " grid-cols-1! justify-items-center [&>article]:w-full [&>article]:max-w-[340px] min-[1024px]:[&>article]:max-w-[280px]" : ""}`}>{group.items.map(item => <article className={styles.optionCard} key={item.name}><div className={styles.optionImage}><Image src={item.image.startsWith("/") ? item.image : asset(item.image)} alt={item.alt} fill sizes="(max-width: 430px) 340px, (max-width: 1023px) 45vw, 280px" /></div><div className={styles.optionContent}><h3>{item.name}</h3><p>{item.description}</p></div></article>)}</div>
    </motion.div></AnimatePresence></div>
  </div></section>;
}
