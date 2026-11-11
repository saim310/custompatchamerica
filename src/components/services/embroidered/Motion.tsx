"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type ReactNode, type PointerEvent } from "react";
import styles from "./styles";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, direction = "up", className = "", delay = 0, duration = .8 }: { children: ReactNode; direction?: "left" | "right" | "up" | "scale"; className?: string; delay?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const offset = direction === "left" ? { x: -50 } : direction === "right" ? { x: 50 } : direction === "scale" ? { scale: .85 } : { y: 40 };
  return <motion.div data-reveal className={className} initial={reduced ? false : { opacity: 0, ...offset }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : duration, ease, delay: reduced ? 0 : delay }}>{children}</motion.div>;
}

export function TypewriterBadge({ text }: { text: string }) {
  const reduced = useReducedMotion();
  // Keep the first browser render identical to SSR when reduced motion is enabled.
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setLength(current => {
      if (current >= text.length) clearInterval(timer);
      return Math.min(current + 1, text.length);
    }), 60);
    return () => clearInterval(timer);
  }, [text, reduced]);
  return <span className={styles.badge} aria-label={text}><span className={styles.badgeSizer} aria-hidden>{text}</span><span aria-hidden>{hydrated && reduced ? text : text.slice(0, length)}</span></span>;
}

export function AnimatedUnderline({ repeat = false }: { repeat?: boolean }) {
  const reduced = useReducedMotion();
  return <svg className={styles.underline} viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M3 10C83 0 225 0 316 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: !repeat }} transition={{ duration: reduced ? 0 : repeat ? 1.6 : .8, ease: "easeOut", repeat: repeat && !reduced ? Infinity : 0, repeatDelay: .6 }} /></svg>;
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className={styles.sectionHead}>{eyebrow && <p className={styles.eyebrow}>{eyebrow}<AnimatedUnderline /></p>}<h2 className={styles.heading}>{title}</h2>{children && <p className={styles.copy}>{children}</p>}</div>;
}

export function TiltImage({ src, alt, width, height, sizes, className = "", maxTilt = 10, scale = 1.06, preload = false }: { src: string; alt: string; width?: number; height?: number; sizes?: string; className?: string; maxTilt?: number; scale?: number; preload?: boolean }) {
  const dimensions = width && height ? { width, height } : src.includes("military-patch") ? { width: 800, height: 742 } : src.includes("biker-patch") ? { width: 800, height: 533 } : src.includes("craftsmanship-patches") ? { width: 800, height: 667 } : { width: 1024, height: 1024 };
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });
  const zoom = useSpring(1, { stiffness: 200, damping: 25 });
  function reset() { rotateX.set(0); rotateY.set(0); zoom.set(1); }
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    rotateX.set(-(event.clientY - box.top - box.height / 2) / (box.height / 2) * maxTilt);
    rotateY.set((event.clientX - box.left - box.width / 2) / (box.width / 2) * maxTilt);
    zoom.set(scale);
  }
  return <div className={`${styles.patch} ${className}`} onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset}><motion.div style={reduced ? undefined : { rotateX, rotateY, scale: zoom }}><Image src={src} alt={alt} {...dimensions} sizes={sizes ?? (preload ? "(max-width: 767px) 340px, (max-width: 1023px) 410px, 510px" : "(max-width: 767px) 270px, 420px")} preload={preload} /></motion.div></div>;
}
