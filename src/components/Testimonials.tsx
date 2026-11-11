"use client";

import { useState } from "react";
import { BadgeCheck, MessageSquareQuote, Pause, Play, Star } from "lucide-react";
import { reviews } from "@/data/homepage";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [paused, setPaused] = useState(false);
  const rows = [reviews, [...reviews.slice(2), ...reviews.slice(0, 2)]];

  return (
    <section id="reviews" aria-labelledby="testimonials-heading" className={`${styles.section} ${paused ? styles.paused : ""}`}>
      <header className={styles.heading}>
        <span className={styles.eyebrow}><MessageSquareQuote size={14} aria-hidden="true" /> Customer reviews</span>
        <h2 id="testimonials-heading">Custom Patches Reviews &mdash; Feedback from <span>Our Customers</span></h2>
        <p>Real stories from customers who trust us with their custom patches.</p>
      </header>
      <div className={styles.rows}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.viewport} tabIndex={0} role="region" aria-label={`Customer reviews, row ${rowIndex + 1}`}>
            <div className={`${styles.track} ${rowIndex === 1 ? styles.reverse : ""}`}>
              {[0, 1].map(copy => (
                <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
                  {row.map(({ name, role, quote }, index) => (
                    <article key={index} className={styles.card}>
                      <div role="img" aria-label="5 out of 5 stars" className={styles.stars}>
                        {Array.from({ length: 5 }, (_, star) => <Star key={star} size={18} fill="currentColor" aria-hidden="true" />)}
                      </div>
                      <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                      <div className={styles.profile}>
                        <span className={styles.avatar} aria-hidden="true">{name.split(" ").map(part => part[0]).join("")}</span>
                        <div><h3>{name}</h3><p className={styles.customer}><BadgeCheck size={14} aria-hidden="true" />{role}</p></div>
                      </div>
                      <blockquote>&ldquo;{quote}&rdquo;</blockquote>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className={styles.control}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}{paused ? "Resume scrolling" : "Pause scrolling"}
      </button>
    </section>
  );
}