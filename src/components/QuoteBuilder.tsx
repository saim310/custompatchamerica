"use client";

import { submitEnquiry } from "@/lib/attribution-client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Upload, ArrowRight } from "lucide-react";
import { ARTWORK_ACCEPT, PATCH_TYPES, validateQuote } from "@/lib/quote-validation";

type Option = { label: string; image?: string; shape?: string; color?: string };
const image = (label: string, path: string): Option => ({ label, image: `/images/${path}` });
const patchImages: Record<string, string> = { Embroidered: "EMBROIDERY", Chenille: "CHENILLE", Woven: "WOVEN", PVC: "PVC", Leather: "LEATHER", Sublimated: "SUBLIMATED" };
const coverage = [50, 75, 100].map((n) => image(`${n}% embroidered`, `embroidered/coverage-${n}.webp`));
const shapes: Option[] = [
  { label: "Circle", shape: "rounded-full" }, { label: "Oval", shape: "rounded-[50%] !h-12" },
  { label: "Square", shape: "rounded-none" }, { label: "Rounded square", shape: "rounded-xl" },
  { label: "Rectangle", shape: "!h-12 rounded-sm" }, { label: "Diamond", shape: "rotate-45 !size-12" },
  { label: "Shield", shape: "rounded-t-lg rounded-b-[50%]" }, { label: "Custom shape", shape: "rounded-[40%_60%_65%_35%]" },
];
const backings = [image("Sew on", "embroidered/backing-sew-on.webp"), image("Iron on", "embroidered/backing-iron-on.webp"), image("Adhesive", "embroidered/backing-adhesive.webp"), image("Hook and loop", "embroidered/backing-velcro.webp")];
const borders = [image("Merrowed", "embroidered/border-merrowed.webp"), image("Embroidered", "embroidered/border-embroidered.webp"), image("Laser cut", "embroidered/border-laser-cut.webp")];
const threads: Option[] = [{ label: "Standard", color: "linear-gradient(135deg, #e51c2a 0% 25%, #f5bb32 25% 50%, #28639a 50% 75%, #2d8652 75%)" }, { label: "Metallic gold", color: "linear-gradient(110deg, #927037, #f9e0a0, #ae823c)" }, { label: "Metallic silver", color: "linear-gradient(110deg, #8c939d, #f0f2f5, #a0a8b4)" }, { label: "Glow in the dark", color: "linear-gradient(110deg, #9bc89a, #e1f4ba, #8dc7a5)" }];
const field = "mt-2 min-h-12 w-full rounded-lg border border-[#cbd7e5] bg-white px-3 py-3 text-sm outline-none focus:border-[#28639a] focus:ring-2 focus:ring-[#28639a]/20";
const section = "border-b border-[#e4eaf1] pb-8";

function Choices({ name, title, options, required = false, defaultValue }: { name: string; title: string; options: Option[]; required?: boolean; defaultValue?: string }) {
  return <fieldset className={section}><legend className="mb-5 text-base font-semibold">{title} {required && <span className="text-brand-red">*</span>}</legend>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
      {options.map((option) => <label key={option.label} className="relative cursor-pointer">
        <input type="radio" name={name} value={option.label} required={required} defaultChecked={defaultValue === option.label} className="peer sr-only" />
        <span className="flex h-full flex-col items-center rounded-xl border border-[#e0e6ef] bg-[#fafbfd] p-3 text-center transition-colors hover:border-[#28639a]/60 peer-checked:border-[#28639a] peer-checked:bg-[#eaf2fb] peer-checked:ring-1 peer-checked:ring-[#28639a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#28639a] motion-reduce:transition-none">
          <span className="relative mb-3 flex aspect-square w-full max-w-[130px] items-center justify-center">
            {option.image ? <Image src={option.image} alt="" fill sizes="(max-width: 639px) 35vw, 130px" className="object-contain p-1" /> : option.shape ? <span className={`h-16 w-20 border-[3px] border-[#28639a] bg-[#e3edf8] ${option.shape}`} /> : <span className="h-20 w-14 rounded-lg border border-black/10 shadow-sm" style={{ background: option.color }} />}
          </span><span className="text-xs font-medium leading-5 sm:text-sm">{option.label}</span>
        </span>
      </label>)}
    </div>
  </fieldset>;
}

export default function QuoteBuilder() {
  const [patchType, setPatchType] = useState("Embroidered");
  const [quantity, setQuantity] = useState("100");
  const [filename, setFilename] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const configuration = ["unit", "width", "height", "shape", "backing", "border", "thread", ...(patchType === "Embroidered" ? ["coverage"] : [])].map((key) => `${key}: ${data.get(key) || "Not specified"}`).join("\n");
    data.set("message", `Patch specifications:\n${configuration}\n\nOrder comments:\n${data.get("comments") || "None"}`);
    data.set("source", "get-a-quote");
    setSuccess(false);
    setNotice("");
    const validation = validateQuote(data);
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) { setNotice("Please check the following details before submitting."); return; }
    setPending(true);
    try {
      const response = await submitEnquiry(data);
      const result = await response.json();
      if (!response.ok) { setErrors(result.errors ?? {}); setNotice(result.error || "Your request could not be sent. Please try again."); }
      else { setSuccess(true); setNotice(`${result.message} Reference: ${result.id}`); }
    } catch { setNotice("We could not connect. Please check your connection and try again."); }
    finally { setPending(false); }
  }

  return <form onSubmit={submit} aria-label="Custom patch quote request" className="mx-auto max-w-[960px] rounded-2xl border border-[#e0e7f0] bg-white p-5 shadow-[0_12px_45px_#061b3d08] sm:p-9">
    <p className="mb-7 text-sm text-[#53647b]">Fields marked <span className="text-brand-red">*</span> are required. Not sure about a detail? Choose your preference and tell us in the comments.</p>
    <fieldset disabled={pending || success} className="space-y-8 disabled:opacity-70">
      <div onChange={(event) => { const target = event.target; if (target instanceof HTMLInputElement) setPatchType(target.value); }}><Choices name="patchType" title="Select patch type" required defaultValue="Embroidered" options={PATCH_TYPES.map((type) => image(type, `categories/${patchImages[type]}.png`))} /></div>
      {patchType === "Embroidered" && <Choices name="coverage" title="Select embroidery coverage" required defaultValue="100% embroidered" options={coverage} />}
      <fieldset className={`${section} grid gap-5 sm:grid-cols-3`}><legend className="mb-5 text-base font-semibold">Patch dimensions <span className="text-brand-red">*</span></legend>
        <label className="text-sm font-medium">Unit<select name="unit" className={field} defaultValue="Inches"><option>Inches</option><option>Centimeters</option></select></label>
        <label className="text-sm font-medium">Width<input type="number" name="width" required min="0.1" max="100" step="0.1" placeholder="e.g. 3" className={field} /></label>
        <label className="text-sm font-medium">Height<input type="number" name="height" required min="0.1" max="100" step="0.1" placeholder="e.g. 3" className={field} /></label>
      </fieldset>
      <Choices name="shape" title="Select shape" required defaultValue="Circle" options={shapes} />
      <Choices name="backing" title="Select backing" required defaultValue="Sew on" options={backings} />
      <Choices name="border" title="Select border" required defaultValue="Merrowed" options={borders} />
      <Choices name="thread" title="Select thread / finish preference" required defaultValue="Standard" options={threads} />
      <fieldset className={section}><legend className="mb-5 text-base font-semibold">Select quantity <span className="text-brand-red">*</span></legend>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">{[25, 50, 100, 200, 300, 500, 1000, 2000, 5000].map((n) => <label key={n} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name="quantityChoice" value={n} checked={quantity === String(n)} onChange={() => setQuantity(String(n))} className="size-4 accent-[#28639a]" />{n.toLocaleString("en-US")}</label>)}</div>
        <label className="mt-4 block max-w-xs text-sm font-medium">Quantity (edit for a custom amount)<input id="quote-quantity" name="quantity" type="number" required min={1} max={100000} step={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} className={field} /></label>
      </fieldset>
      <div className={section}><label htmlFor="quote-artwork" className="block text-base font-semibold">Upload artwork</label><p id="artwork-help" className="mt-2 text-xs leading-6 text-[#53647b]">PNG, JPG, WebP, or PDF. Maximum 3 MB. No artwork yet? Describe your idea below.</p>
        <div className="relative mt-4 rounded-xl border-2 border-dashed border-[#cbd7e5] bg-[#fafcff] p-6 text-center focus-within:ring-2 focus-within:ring-[#28639a]">
          <Upload className="mx-auto size-7 text-[#28639a]" aria-hidden="true" /><p className="mt-3 text-sm font-medium">{filename || "Drop your artwork here or choose a file"}</p>
          <span className="mt-3 inline-block rounded-lg bg-[#28639a] px-4 py-2 text-sm font-semibold text-white">Choose file</span>
          <input id="quote-artwork" name="artwork" type="file" accept={ARTWORK_ACCEPT} aria-describedby="artwork-help" onChange={(event) => setFilename(event.target.files?.[0]?.name ?? "")} className="absolute inset-0 size-full cursor-pointer opacity-0" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{([
        ["name", "Full name", "text", "name", true], ["company", "Company", "text", "organization", false], ["email", "Email address", "email", "email", true], ["phone", "Phone number", "tel", "tel", true],
      ] as const).map(([name, label, type, autoComplete, required]) => <label key={name} className="text-sm font-medium">{label} {required && <span className="text-brand-red">*</span>}<input name={name} type={type} autoComplete={autoComplete} required={required} minLength={name === "name" ? 2 : undefined} maxLength={name === "email" ? 254 : name === "phone" ? 40 : name === "company" ? 120 : 100} className={field} aria-invalid={!!errors[name]} /></label>)}</div>
      <label className="block text-sm font-medium">Order comments<textarea name="comments" rows={5} maxLength={2500} placeholder="Tell us about your design, colors, deadline, or any questions. Options may vary by patch type; we will confirm the details with your quote." className={`${field} resize-y`} /></label>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-brand-red px-7 py-3 font-semibold text-white hover:bg-[#c91a25] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red sm:w-auto">{pending ? "Sending request..." : "Submit quote request"}<ArrowRight size={18} aria-hidden="true" /></button>
    </fieldset>
    <div role="status" aria-live="polite" className={`mt-5 break-words text-sm leading-6 ${success ? "text-green-800" : "text-red-700"}`}><p>{notice}</p>{Object.keys(errors).length > 0 && <ul className="mt-2 list-inside list-disc">{Object.entries(errors).map(([key, error]) => <li key={key}>{error}</li>)}</ul>}</div>
    {success && <button type="button" onClick={() => { setSuccess(false); setNotice(""); }} className="mt-4 min-h-11 text-sm font-semibold underline underline-offset-4">Edit and send another request</button>}
  </form>;
}
