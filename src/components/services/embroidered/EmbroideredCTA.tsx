import { Reveal } from "./Motion";
import { ctaContent } from "@/data/embroidered";
import type { CTAContent } from "@/data/service-page";
import styles from "./styles";

export default function EmbroideredCTA({ content = ctaContent }: { content?: CTAContent }) {
  return <section className={`${styles.cta} ${styles.navy} [&_.cta-actions]:justify-center max-[767px]:[&_.cta-actions]:gap-5`} aria-labelledby="premium-heading"><div className={styles.container}><Reveal direction="scale" className={styles.ctaInner}><h2 id="premium-heading" className={styles.heading}>{content.heading[0]}<br />{content.heading[1]}</h2><p className={styles.copy}>{content.description}</p><div className={`${styles.actions} cta-actions`}><a href="#quote" className={styles.button}>Order Now</a><a className={styles.textLink} href="#categories">View Samples</a><a className={styles.textLink} href="#quote">Contact Us</a></div></Reveal></div></section>;
}
