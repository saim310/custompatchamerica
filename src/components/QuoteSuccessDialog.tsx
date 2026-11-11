"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";

export default function QuoteSuccessDialog({ reference, onClose }: { reference: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <motion.dialog
      ref={dialog}
      aria-labelledby="quote-success-title"
      aria-describedby="quote-success-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: reducedMotion ? 1 : 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, duration: reducedMotion ? 0 : undefined }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[460px] overflow-y-auto rounded-[28px] border-0 bg-white p-7 text-center text-[#071c3d] shadow-2xl backdrop:bg-[#071c3d]/60 backdrop:backdrop-blur-sm sm:p-10"
    >
      <button type="button" autoFocus onClick={onClose} aria-label="Close thank-you message" className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full text-[#587092] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#ed1e2b]">
        <X aria-hidden="true" className="size-5" />
      </button>
      <motion.div
        initial={{ scale: reducedMotion ? 1 : 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15, delay: reducedMotion ? 0 : 0.15 }}
        className="mx-auto mb-6 mt-3 grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50"
      >
        <Check aria-hidden="true" className="size-10" strokeWidth={2.5} />
      </motion.div>
      <h2 id="quote-success-title" className="text-3xl font-bold tracking-tight">Thank you!</h2>
      <p id="quote-success-description" className="mt-3 text-base leading-relaxed text-[#587092]">Your quote request has been received. We look forward to bringing your patch idea to life.</p>
      <div className="mt-6 rounded-xl border border-[#d6e2ef] bg-[#f5f9fe] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#587092]">Your reference number</p>
        <p className="mt-2 break-all font-mono text-sm select-all">{reference}</p>
        <p className="mt-2 text-xs text-[#587092]">Keep this number for follow-up.</p>
      </div>
      <button type="button" onClick={onClose} className="mt-6 h-12 w-full cursor-pointer rounded-xl bg-[#ed1e2b] font-bold text-white transition-colors hover:bg-[#d91825] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1e2b]">Got it, thank you!</button>
    </motion.dialog>,
    document.body,
  );
}
