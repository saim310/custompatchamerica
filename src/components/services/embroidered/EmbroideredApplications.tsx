"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Shield, Bike, Trophy, Building2, Shirt } from "lucide-react";
import { applicationsContent } from "@/data/embroidered";
import type { ApplicationsContent } from "@/data/service-page";
import { Reveal, SectionHeading, TiltImage } from "./Motion";
import styles from "./styles";

const icons = { shield: Shield, bike: Bike, trophy: Trophy, building: Building2, shirt: Shirt };

export default function EmbroideredApplications({ content = applicationsContent }: { content?: ApplicationsContent }) {
  const container = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [centers, setCenters] = useState([180, 540, 900]);
  const [height, setHeight] = useState(1080);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: container, offset: ["start center", "end center"] });
  const start = centers[0];
  const span = Math.max(1, centers[centers.length - 1] - start);
  const position = useTransform(scrollYProgress, value => Math.max(0, Math.min(span, value * height - start)));
  const smooth = useSpring(position, { stiffness: 120, damping: 30, mass: .8 });
  useMotionValueEvent(scrollYProgress, "change", value => {
    const current = value * height;
    let closest = 0;
    centers.forEach((center, index) => { if (Math.abs(current - center) < Math.abs(current - centers[closest])) closest = index; });
    setActive(previous => previous === closest ? previous : closest);
  });
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => {
      setCenters(rows.current.map(row => row ? row.offsetTop + row.offsetHeight / 2 : 0));
      setHeight(element.offsetHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    rows.current.forEach(row => { if (row) observer.observe(row); });
    return () => observer.disconnect();
  }, []);

  return <section id="categories" className={`${styles.section} ${styles.applications}`} aria-label={content.label}>
    <div className={styles.container}>
      <Reveal direction="left"><SectionHeading eyebrow={content.eyebrow} title={content.title}>{content.description}</SectionHeading></Reveal>
      <div ref={container} className={styles.timeline}>
        <div className={styles.track} style={{ top: start, height: span }} aria-hidden="true"><motion.div className={styles.beam} style={{ height: reduced ? position : smooth }} /><motion.div className={styles.indicator} style={{ y: reduced ? position : smooth }} /></div>
        {content.items.map((application, index) => {
          const Icon = icons[application.icon];
          const isActive = index === active;
          const reversed = index % 2 === 1;
          return <div key={application.title} ref={element => { rows.current[index] = element; }} className={styles.timelineRow}>
            <Reveal className={`${styles.applicationArt} ${reversed ? "col-start-2 row-start-1 max-[1023px]:col-auto max-[1023px]:row-auto" : ""}`} direction={reversed ? "right" : "left"}><TiltImage {...application.image} /></Reveal>
            <span className={`${styles.connector} ${reversed ? "-translate-x-full" : ""}`} data-active={isActive} aria-hidden="true" />
            <motion.article className={`${styles.applicationCard} ${reversed ? "col-start-1 row-start-1 max-[1023px]:col-auto max-[1023px]:row-auto" : ""}`} initial={false} animate={{ y: isActive && !reduced ? -6 : 0, backgroundColor: isActive ? "#ffffff" : "#f4f6f8", borderColor: isActive ? "#c91a2570" : "#d8dce0", boxShadow: isActive ? "0 12px 28px #c91a250c" : "0 0 0 #0000" }} transition={{ duration: reduced ? 0 : .35 }}>
              <motion.span className={styles.applicationIcon} animate={{ color: isActive ? "#c91a25" : "#7d8593", rotate: isActive && !reduced ? -7 : 0, scale: isActive && !reduced ? 1.08 : 1 }}><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></motion.span>
              <h3 style={{ color: isActive ? "#0b1c48" : "#2b2b2b" }}>{application.title}</h3><p>{application.description}</p>
            </motion.article>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
