import Image from "next/image";
import { detailContent } from "@/data/embroidered";
import type { DetailContent } from "@/data/service-page";
import { Reveal, SectionHeading } from "./Motion";
import styles from "./styles";

export default function EmbroideredCoverage({ content = detailContent }: { content?: DetailContent }) {
  return <section className={`${styles.section} ${styles.light}`} aria-label={content.label}><div className={styles.container}><Reveal><SectionHeading eyebrow={content.eyebrow} title={content.title}>{content.description}</SectionHeading><div className={styles.coverageGrid}>{content.cards.map(option => <article key={option.title} className={styles.coverageCard}><div className={styles.coverageImage}><Image src={option.image.src} alt={option.image.alt} fill sizes="(max-width: 767px) 270px, 330px" /></div><h3>{option.title}</h3><p>{option.description}</p></article>)}</div><p className={styles.note}>{content.note}</p></Reveal></div></section>;
}
