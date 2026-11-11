import { storyContent } from "@/data/embroidered";
import type { StoryContent } from "@/data/service-page";
import { Reveal, TiltImage } from "./Motion";
import styles from "./styles";

export default function EmbroideredStory({ content = storyContent }: { content?: StoryContent }) {
  return <section id="story" className={`${styles.section} ${styles.navy}`} aria-labelledby="craftsmanship-heading"><div className={`${styles.container} ${styles.split}`}><Reveal direction="left"><h2 id="craftsmanship-heading" className={styles.heading}>{content.heading[0]}<br />{content.heading[1]}</h2>{content.subheading && <h3 className="mt-5 text-[21px] font-medium leading-[1.5] max-[767px]:text-[19px]">{content.subheading}</h3>}{content.paragraphs.map(paragraph => <p key={paragraph} className={styles.copy}>{paragraph}</p>)}</Reveal><Reveal direction="right" className={`${styles.storyArt}${content.enlargeDesktopImage ? " min-[1024px]:w-4/5" : ""}`}><TiltImage {...content.image} className={content.enlargeDesktopImage ? "min-[1024px]:scale-125" : ""} sizes={content.enlargeDesktopImage ? "(max-width: 1023px) 350px, 525px" : undefined} maxTilt={6} scale={1.03} /></Reveal></div></section>;
}
