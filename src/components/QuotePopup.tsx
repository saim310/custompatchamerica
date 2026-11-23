"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Minus } from "lucide-react";
import { ARTWORK_ACCEPT, PATCH_BACKINGS, PATCH_TYPES, type QuoteErrors } from "@/lib/quote-validation";
import logo from "../../public/images/Custom Patch America Eagle Logoo.png";
import styles from "./QuotePopup.module.css";

const field = "mt-1 w-full rounded-lg border border-[#d6e2ef] bg-white px-3 py-2.5 text-base text-navy focus-visible:outline-2 focus-visible:outline-[#0963d6]";
const button = "flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 font-bold text-white hover:bg-[#d91825] disabled:opacity-60";

export default function QuotePopup() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const minimization = useRef<Animation | null>(null);
  const shown = useRef(false);
  const [minimized, setMinimized] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [reference, setReference] = useState("");

  const minimizeImmediately = useCallback(() => {
    minimization.current?.cancel();
    minimization.current = null;
    const modal = dialog.current;
    if (modal) {
      delete modal.dataset.minimizing;
      modal.close();
    }
    setMinimized(true);
  }, []);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal || /^\/admin(\/|$)/.test(pathname)) return;
    if (shown.current) return () => { if (modal.open) minimizeImmediately(); };
    let timeout: number | undefined;

    function open() {
      if (document.visibilityState !== "visible" || document.querySelector("dialog[open]") ||
          document.activeElement?.closest("input, select, textarea, [contenteditable]")) {
        timeout = window.setTimeout(open, 500);
        return;
      }
      modal?.showModal();
      shown.current = true;
    }

    function onScroll() {
      window.removeEventListener("scroll", onScroll, true);
      timeout = window.setTimeout(open, 10_000);
    }

    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    if (window.scrollY > 0) onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.clearTimeout(timeout);
      if (modal.open) minimizeImmediately();
    };
  }, [pathname, minimizeImmediately]);

  useEffect(() => {
    if (minimized) launcher.current?.focus({ preventScroll: true });
  }, [minimized]);

  function minimize() {
    const modal = dialog.current;
    const target = launcher.current;
    if (!modal?.open || !target || minimization.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !modal.animate) {
      minimizeImmediately();
      return;
    }

    const start = modal.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    modal.dataset.minimizing = "true";
    const x = end.left + end.width / 2 - start.left - start.width / 2;
    const y = end.top + end.height / 2 - start.top - start.height / 2;
    const animation = modal.animate([
      { transform: getComputedStyle(modal).transform, opacity: 1 },
      {
        transform: `translate(${x}px, ${y}px) scale(${end.width / start.width}, ${end.height / start.height})`,
        opacity: 0.15,
        borderRadius: "50%",
      },
    ], { duration: 420, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "forwards" });
    minimization.current = animation;
    animation.onfinish = minimizeImmediately;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const body = new FormData(event.currentTarget);
    setPending(true);
    setNotice("");
    setErrors({});
    try {
      const response = await fetch("/api/quotes", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || typeof result.id !== "string") {
        setErrors(result.errors ?? {});
        setNotice(result.error || "Your quote request could not be sent. Please try again.");
        return;
      }
      setReference(result.id);
    } catch {
      setNotice("We could not send your request. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function fieldError(name: keyof QuoteErrors) {
    return errors[name] && <span id={`quote-popup-${name}-error`} className="mt-1 block text-xs text-red-700">{errors[name]}</span>;
  }

  function fieldStatus(name: keyof QuoteErrors) {
    return { "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `quote-popup-${name}-error` : undefined };
  }

  return (
    <>
      <button
        ref={launcher}
        type="button"
        aria-label="Get A Quote Now"
        aria-haspopup="dialog"
        onClick={() => {
          dialog.current?.showModal();
          setMinimized(false);
        }}
        className={`${minimized && !/^\/admin(\/|$)/.test(pathname) ? "" : "invisible"} fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(max(1rem,env(safe-area-inset-bottom))_+_4.25rem)] z-30 grid size-14 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0963d6]`}
      >
        <span className="absolute right-0 bottom-full mb-2 whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-xs font-bold text-white shadow-md motion-safe:animate-pulse">
          Get A Quote Now
        </span>
        <span className="relative block size-14 overflow-hidden rounded-full drop-shadow-md motion-safe:animate-spin motion-safe:[animation-duration:6s]">
          <Image src={logo} alt="" sizes="204px" className="absolute -top-[5px] -left-[9px] h-auto w-[204px] max-w-none" />
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="quote-popup-title"
        onCancel={(event) => {
          event.preventDefault();
          minimize();
        }}
        className={`${styles.dialog} fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-2xl bg-white text-navy shadow-2xl`}
      >
        <header className="relative bg-gradient-to-br from-[#031832] to-[#245f92] py-5 pr-16 pl-5 text-white sm:pl-7">
          <h2 id="quote-popup-title" className="text-2xl font-bold sm:text-3xl">Get a Free Patch Quote</h2>
          <p className="mt-1 text-sm text-white/85">Tell us about your patches and we’ll email you back.</p>
          <button autoFocus type="button" aria-label="Minimize quote popup" onClick={minimize} className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white">
            <Minus aria-hidden="true" size={21} />
          </button>
        </header>
        {reference ? (
          <div className="p-6 sm:p-7">
            <div role="status">
              <CheckCircle2 aria-hidden="true" className="text-green-700" />
              <p className="mt-2 text-lg font-bold">Your quote request was sent.</p>
              <p className="mt-1 break-words text-sm">Reference {reference}</p>
            </div>
            <button type="button" className={`${button} mt-5`} onClick={minimize}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} aria-label="Patch quote request" className="p-5 sm:p-7">
            <input type="hidden" name="source" value="quote-popup" />
            <div hidden><input name="website" tabIndex={-1} autoComplete="off" /></div>
            <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">Name
                <input name="name" autoComplete="name" required minLength={2} maxLength={100} className={field} {...fieldStatus("name")} />
                {fieldError("name")}
              </label>
              <label className="text-sm font-medium">Phone number
                <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={40} className={field} {...fieldStatus("phone")} />
                {fieldError("phone")}
              </label>
              <label className="text-sm font-medium">Email
                <input name="email" type="email" autoComplete="email" required maxLength={254} className={field} {...fieldStatus("email")} />
                {fieldError("email")}
              </label>
              <label className="text-sm font-medium">Patch type
                <select name="patchType" required defaultValue="" className={field} {...fieldStatus("patchType")}>
                  <option value="" disabled>Select a patch type</option>
                  {PATCH_TYPES.map((type) => <option key={type}>{type}</option>)}
                </select>
                {fieldError("patchType")}
              </label>
              <label className="text-sm font-medium">Patch quantity
                <input name="quantity" type="number" required min={1} max={100000} step={1} className={field} {...fieldStatus("quantity")} />
                {fieldError("quantity")}
              </label>
              <label className="text-sm font-medium">Backing option
                <select name="backing" required defaultValue="" className={field} {...fieldStatus("backing")}>
                  <option value="" disabled>Select a backing option</option>
                  {PATCH_BACKINGS.map((backing) => <option key={backing}>{backing}</option>)}
                </select>
                {fieldError("backing")}
              </label>
              <label className="text-sm font-medium sm:col-span-2">Sample picture <span className="font-normal text-slate-600">(optional)</span>
                <input name="artwork" type="file" accept={ARTWORK_ACCEPT} className={`${field} border-dashed file:mr-3 file:rounded-md file:border-0 file:bg-[#eaf2fc] file:px-2 file:py-1 file:text-sm file:font-semibold file:text-navy`} {...fieldStatus("artwork")} aria-describedby={errors.artwork ? "quote-popup-artwork-hint quote-popup-artwork-error" : "quote-popup-artwork-hint"} />
                <span id="quote-popup-artwork-hint" className="mt-1 block text-xs text-slate-600">PNG, JPG, WebP or PDF up to 3 MB.</span>
                {fieldError("artwork")}
              </label>
              <button type="submit" className={`${button} sm:col-span-2`}>
                {pending ? "Sending…" : "Request My Quote"} <ArrowRight aria-hidden="true" size={18} />
              </button>
            </fieldset>
            {notice && <p role="alert" className="mt-3 break-words text-sm text-red-700">{notice}</p>}
          </form>
        )}
      </dialog>
    </>
  );
}
