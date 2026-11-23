"use client";

import { submitEnquiry } from "@/lib/attribution-client";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { PATCH_TYPES, type QuoteErrors } from "@/lib/quote-validation";

const field = "mt-2 w-full rounded-lg border border-[#d6e2ef] bg-white px-4 py-3 text-sm text-navy outline-none focus:border-[#0963d6] focus:ring-2 focus:ring-[#dceafb]";

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<QuoteErrors>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    setPending(true);
    setNotice("");
    setErrors({});
    setSuccess(false);
    try {
      const response = await submitEnquiry(new FormData(form));
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setNotice(result.error || "Your request could not be sent. Please try again.");
      } else {
        setSuccess(true);
        setNotice(`${result.message} Reference: ${result.id}`);
        form.reset();
      }
    } catch {
      setNotice("We could not connect. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} aria-label="Contact us" className="rounded-3xl border border-[#e0eafa] bg-white p-6 shadow-[0_16px_55px_#244a7810] sm:p-9">
      <input type="hidden" name="source" value="contact-us" />
      <h2 className="text-2xl font-bold">Tell us about your project</h2>
      <p className="mt-2 text-sm text-[#587092]">Fields marked * are required.</p>
      <fieldset disabled={pending} className="mt-6 grid gap-5 sm:grid-cols-2">
        {([
          ["name", "Full name", "text", "name", true],
          ["email", "Email address", "email", "email", true],
          ["phone", "Phone number", "tel", "tel", true],
          ["company", "Company or organization", "text", "organization", false],
        ] as const).map(([name, label, type, autoComplete, required]) => <label key={name} className="text-sm font-medium">{label}{required && " *"}<input name={name} type={type} autoComplete={autoComplete} required={required} maxLength={name === "company" ? 120 : name === "email" ? 254 : name === "phone" ? 40 : 100} minLength={name === "name" ? 2 : undefined} className={field} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <span id={`${name}-error`} className="mt-1 block text-xs text-red-700">{errors[name]}</span>}</label>)}
        <label className="text-sm font-medium">Patch type *<select name="patchType" required defaultValue="" className={field} aria-invalid={!!errors.patchType}><option value="" disabled>Select a patch type</option>{PATCH_TYPES.map(type => <option key={type}>{type}</option>)}</select>{errors.patchType && <span className="text-xs text-red-700">{errors.patchType}</span>}</label>
        <label className="text-sm font-medium">Quantity *<input name="quantity" type="number" min={1} max={100000} step={1} required className={field} aria-invalid={!!errors.quantity} />{errors.quantity && <span className="text-xs text-red-700">{errors.quantity}</span>}</label>
        <label className="text-sm font-medium sm:col-span-2">Your message<textarea name="message" rows={5} maxLength={4000} placeholder="Tell us about your design, size, deadline, or questions…" className={`${field} resize-y`} aria-invalid={!!errors.message} />{errors.message && <span className="text-xs text-red-700">{errors.message}</span>}</label>
        <button type="submit" className="flex items-center justify-center gap-3 rounded-lg bg-brand-red px-6 py-4 font-bold text-white hover:bg-[#d91825] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60 sm:col-span-2">{pending ? "Sending…" : "Send request"}<ArrowRight size={19} aria-hidden="true" /></button>
      </fieldset>
      <p role="status" aria-live="polite" className={`mt-4 break-words text-sm ${success ? "text-green-700" : "text-red-700"}`}>{notice}</p>
    </form>
  );
}