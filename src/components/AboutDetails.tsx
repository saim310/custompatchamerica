import Image from "next/image";
import { ArrowDown, ArrowRight, CircleCheck, MessageCircleMore, Package, Pencil, Plus, Settings } from "lucide-react";

const steps = [
  { title: "Share Your Idea", description: "Tell us about your design, size, quantity, and needs.", icon: MessageCircleMore },
  { title: "Design Review", description: "We refine the details and prepare a digital mockup.", icon: Pencil },
  { title: "Production", description: "Your patches are crafted with care and precision.", icon: Settings },
  { title: "Delivery", description: "We package and ship your order on time.", icon: Package },
];

export function AboutProcess() {
  return (
    <section aria-labelledby="about-process-heading" className="mx-auto max-w-[1200px] px-6 pb-16">
      <div className="rounded-3xl bg-[#f0f6ff] px-5 py-10 sm:px-8 lg:px-12">
        <h2 id="about-process-heading" className="text-center text-2xl font-bold text-navy sm:text-3xl">How We Bring Your Patches to Life</h2>
        <p className="mt-3 text-center text-sm leading-6 text-[#587092]">A simple, collaborative process from idea to delivery.</p>
        <ol className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="relative rounded-2xl border border-[#dce8f6] bg-white px-4 py-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#edf5ff] text-[#0963d6]"><Icon size={32} strokeWidth={1.8} aria-hidden="true" /></span>
              <h3 className="mt-4 text-base font-bold text-navy">{index + 1}. {title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#587092]">{description}</p>
              {index < steps.length - 1 && <>
                <ArrowRight className="absolute top-1/2 -right-9 hidden size-6 -translate-y-1/2 text-[#0963d6] lg:block" aria-hidden="true" />
                <ArrowDown className="absolute -bottom-8 left-1/2 size-5 -translate-x-1/2 text-[#0963d6] sm:hidden" aria-hidden="true" />
              </>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutCraftsmanship() {
  return (
    <section aria-labelledby="about-craft-heading" className="mx-auto grid max-w-[1200px] items-center gap-8 px-6 pb-16 md:grid-cols-2 lg:gap-12">
      <div className="overflow-hidden rounded-3xl border border-[#dce8f6] bg-[#f2f7ff]">
        <Image src="/images/embroidered/craftsmanship-patches.webp" alt="Detailed embroidered eagle, mountain, and floral patches showing threadwork and finished edges" width={800} height={650} sizes="(max-width: 767px) 90vw, 550px" className="aspect-[1.5] w-full object-contain p-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0963d6]">Your vision, our craftsmanship</p>
        <h2 id="about-craft-heading" className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">From Your Idea to a<br className="hidden lg:block" /> Finished Patch.</h2>
        <p className="mt-4 text-base leading-7 text-[#587092]">Every great patch starts with an idea. Whether you&apos;re creating patches for a business, club, team, or personal project, we help turn your concept into a design you can proudly wear, display, or share.</p>
        <ul className="mt-6 grid gap-x-5 gap-y-3 sm:grid-cols-2">
          {["Custom design support", "Multiple styles & backings", "High-quality production", "Bulk order options"].map(feature => <li key={feature} className="flex items-start gap-2 text-sm font-medium text-navy"><CircleCheck size={19} fill="#0963d6" stroke="white" className="mt-0.5 shrink-0" aria-hidden="true" />{feature}</li>)}
        </ul>
      </div>
    </section>
  );
}

const aboutFaqs = [
  { question: "Can I create patches using my own design?", answer: "Yes. Share your artwork, logo, or idea with us. We can help refine the details and prepare a digital mockup for you to review before production." },
  { question: "What types of custom patches are available?", answer: "Choose from embroidered, woven, chenille, PVC, sublimated, and leather patches. We can help you select the material and backing that suit your design and how you plan to use it." },
  { question: "Can I order patches for my business or team?", answer: "Yes. We create custom patches for businesses, clubs, teams, and personal projects. Include your quantity and requirements when requesting a quote so we can help with the options." },
  { question: "How do I get started?", answer: "Visit our Get a Quote page and share your design idea, patch type, size, quantity, and preferred backing. Our team will help you with the next steps." },
];

export function AboutFAQ() {
  return (
    <section id="about-faq" aria-labelledby="about-faq-heading" className="mx-auto max-w-[1100px] px-6 pb-16">
      <h2 id="about-faq-heading" className="text-center text-3xl font-bold text-navy">Frequently Asked Questions</h2>
      <p className="mt-3 text-center text-base leading-7 text-[#587092]">Find quick answers to common questions about our custom patches.</p>
      <div className="mt-8 space-y-3">
        {aboutFaqs.map(({ question, answer }) => (
          <details key={question} className="group rounded-lg border border-[#dce8f6] bg-white open:border-[#aac8ee]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-5 py-4 text-sm font-bold text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0963d6] sm:text-base [&::-webkit-details-marker]:hidden">
              {question}<Plus size={20} className="shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-7 text-[#587092]">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
