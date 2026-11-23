"use client";

import { submitEnquiry } from "@/lib/attribution-client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowRight, Box, Check, ChevronDown, FileText, Layers, Mail, ShieldCheck, UserRound } from "lucide-react";
import { PATCH_TYPES } from "@/lib/quote-validation";
import QuoteSuccessDialog from "@/components/QuoteSuccessDialog";

const field = "w-full rounded-[9px] border border-[#d6e2ef] bg-white text-[14px] text-[#536b8b] outline-none placeholder:text-[#8192a9] focus:border-[#829fc8] focus:ring-2 focus:ring-[#dceafb]";
const perks = [
  ["Free Digital Mockup", "See your design before production."],
  ["No Minimum Order", "Order the quantity that works for you."],
  ["Fast Turnaround", "Get your patches quickly without delays."],
  ["U.S. Based Support", "Clear communication and real support."],
];

function SelectField({ name, label, options, icon: Icon }: { name: string; label: string; options: string[]; icon: typeof Layers }) {
  return <div className="relative">
    <Icon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7089aa]" />
    <select name={name} required defaultValue="" aria-label={label} className={`${field} h-[52px] appearance-none pl-11 pr-9`}>
      <option value="" disabled>{label}</option>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-[17px] -translate-y-1/2 text-[#536b8b]" />
  </div>;
}

export default function QuoteSection() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [successReference, setSuccessReference] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("source", "homepage");
    setPending(true);
    setNotice("");
    try {
      const response = await submitEnquiry(data);
      const result = await response.json();
      if (!response.ok) setNotice(Object.values(result.errors ?? {}).join(" ") || result.error || "Please try again later.");
      else { setSuccessReference(result.id); form.reset(); }
    } catch { setNotice("We could not connect. Please check your connection and try again."); }
    finally { setPending(false); }
  }

  return <section id="quote" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_48%_48%,#dceafa_0%,#f5f9fe_45%,#fff_84%)] section-spacing">
    <Image src="/images/quote/patch-stack.png" alt="" aria-hidden="true" width={1224} height={1140} sizes="(max-width: 1024px) 220px, 380px" className="pointer-events-none absolute bottom-[-45px] left-[-95px] z-0 w-[clamp(230px,25vw,390px)] object-contain max-[1100px]:left-[-130px] max-[700px]:hidden" />
    <Image src="/images/quote/denim-jacket.png" alt="" aria-hidden="true" width={1336} height={1177} sizes="(max-width: 1024px) 240px, 430px" className="pointer-events-none absolute bottom-[-110px] right-[-155px] z-0 w-[clamp(260px,30vw,490px)] object-contain max-[1100px]:right-[-195px] max-[700px]:hidden" />
    <div className="relative z-10 mx-auto grid w-full max-w-[1155px] grid-cols-[minmax(0,45fr)_minmax(0,55fr)] items-center gap-[clamp(28px,3vw,48px)] max-[900px]:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] max-[700px]:grid-cols-1 max-[700px]:gap-10">
      <div className="max-w-[530px]">
        <h2 className="section-heading text-navy">Let&apos;s Bring Your Patch Idea to <span className="text-[#ED172B]">Life.</span></h2>
        <p className="max-w-[520px] text-[#587092] section-copy mt-3">Tell us what you have in mind and we&apos;ll help turn your idea into a custom patch made for your brand, team, event, or organization.</p>
        <ul className="mt-7 grid grid-cols-2 gap-x-5 gap-y-6 max-[900px]:gap-x-3 max-[420px]:grid-cols-1">
          {perks.map(([title, description]) => <li key={title} className="flex items-start gap-4 max-[900px]:gap-2.5">
            <span className="grid size-[58px] shrink-0 place-items-center rounded-full bg-[#e4f0fd] max-[900px]:size-[44px]"><span className="grid size-6 place-items-center rounded-full bg-[#06234b] text-white"><Check aria-hidden="true" className="size-4" strokeWidth={2.5} /></span></span>
            <span className="pt-1"><strong className="block text-[15px] font-bold leading-tight text-[#071c3d] max-[900px]:text-[13px]">{title}</strong><span className="mt-2 block text-[14px] leading-[1.4] text-[#587092] max-[900px]:text-[12px]">{description}</span></span>
          </li>)}
        </ul>
        <div className="mt-7 flex items-center justify-center gap-4 border-t border-[#d8e5f3] pt-5 text-[14px] text-[#5e7597] max-[700px]:justify-start"><ShieldCheck aria-hidden="true" className="size-6 shrink-0" /><span>No commitment. No setup fees.</span></div>
      </div>
      <form onSubmit={submit} aria-label="Homepage quote request" className="relative z-10 w-full rounded-[24px] bg-white px-[clamp(24px,2.6vw,40px)] py-[clamp(30px,3vw,44px)] shadow-[0_20px_55px_#244a7820]">
        <h3 className=" text-[clamp(26px,2.4vw,34px)] font-bold leading-[1.15] tracking-[-.035em] text-[#071c3d]">Tell Us About Your Patch</h3>
        <p className="mt-2 text-[16px] text-[#587092]">Share a few details and we&apos;ll take it from there.</p>
        <fieldset disabled={pending} className="mt-5 grid grid-cols-2 gap-4 max-[900px]:gap-2.5 max-[700px]:grid-cols-1">
          <div className="relative"><UserRound aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7089aa]" /><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full Name" aria-label="Full Name" className={`${field} h-[52px] pl-11 pr-4`} /></div>
          <div className="relative"><Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7089aa]" /><input name="email" required maxLength={254} type="email" autoComplete="email" placeholder="Email Address" aria-label="Email Address" className={`${field} h-[52px] pl-11 pr-4`} /></div>
          <SelectField name="patchType" label="Patch Type" options={PATCH_TYPES} icon={Layers} />
          <SelectField name="quantity" label="Quantity" options={["25", "50", "100", "200", "300", "500", "1000", "2000", "5000"]} icon={Box} />
        <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={40} placeholder="Phone number" aria-label="Phone number" className={field + " h-[52px] px-4 col-span-full"} />
        </fieldset>
        <div className="relative mt-4"><FileText aria-hidden="true" className="pointer-events-none absolute left-4 top-[17px] size-[18px] text-[#7089aa]" /><textarea name="message" maxLength={4000} disabled={pending} placeholder="Tell us about your design (optional)" aria-label="Design details" className={`${field} min-h-[94px] resize-y py-[14px] pl-11 pr-4`} /></div>
        <button type="submit" disabled={pending} className="mt-4 flex h-[56px] w-full cursor-pointer items-center justify-center gap-5 rounded-[10px] bg-[#ed1e2b] px-4 text-[16px] font-bold text-white shadow-[0_10px_20px_#ed1e2b21] hover:bg-[#d91825] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d91825]">{pending ? "Sending..." : "Get My Free Quote"} <ArrowRight aria-hidden="true" className="size-6" /></button>
        {notice && <p role="alert" className="mt-4 break-words text-sm text-red-700">{notice}</p>}
        <p className="mt-4 text-center text-[13px] text-[#7187a5]">Free mockup&nbsp; • &nbsp;No obligation&nbsp; • &nbsp;Fast response</p>
      </form>
    </div>
    {successReference !== null && <QuoteSuccessDialog reference={successReference} onClose={() => setSuccessReference(null)} />}
  </section>;
}
