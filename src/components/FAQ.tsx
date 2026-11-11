"use client";

import { useId, useState } from "react";

const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer: "We offer no minimum order, so you can request the quantity that works for you. Share your patch type and quantity when requesting a quote.",
  },
  {
    question: "What types of custom patches do you offer?",
    answer: "We offer embroidered, PVC, woven, chenille, leather, and sublimated patches, along with iron-on and Velcro options. Our team can help you choose the right option for your design.",
  },
  {
    question: "How long does production take?",
    answer: "Our ordering process lists delivery in 10–12 days after an order is placed. Contact our team to confirm the production schedule and delivery timing for your specific order.",
  },
  {
    question: "Can I get a sample before placing a bulk order?",
    answer: "You can review a free digital mockup before production. If you need a physical sample before ordering in bulk, ask our team about availability and any associated costs.",
  },
  {
    question: "What file formats do you accept?",
    answer: "Share your logo, artwork, or design idea with your quote request. Let us know which file format you have, and our team will confirm whether it is suitable or help with the next steps.",
  },
  {
    question: "Do you offer design assistance?",
    answer: "Yes! We offer free design support and digital mockups to help bring your idea to life. You can review your design and request revisions before approving it for production.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship across the USA and worldwide. Include your delivery destination in your quote request so our team can confirm the shipping details for your order.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();

  return (
    <section
      id="faq"
      aria-labelledby={`${id}-heading`}
      className="bg-[radial-gradient(ellipse_at_50%_35%,#eaf3fc_0%,transparent_70%),linear-gradient(180deg,#f8fafc_0%,#f0f6fc_55%,#f8fafc_100%)] section-spacing"
    >
      <div className="mx-auto max-w-[1050px]">
        <div className="mb-[clamp(24px,3vw,36px)] text-center">
          <h2 id={`${id}-heading`} className="section-heading text-navy">
            Frequently Asked <span className="text-brand-red">Questions</span>
          </h2>
          <p className="mx-auto max-w-[580px] text-[#526b88] section-copy mt-3">
            Helpful answers to get your custom patch project started.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const questionId = `${id}-question-${index}`;
            const answerId = `${id}-answer-${index}`;

            return (
              <div key={question} className={`rounded-xl border bg-white transition-[box-shadow,border-color] duration-350 motion-reduce:transition-none ${isOpen ? "border-[#cdddec] shadow-[0_4px_16px_#061b3d06]" : "border-[#dfe8f2]"}`}>
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left text-[clamp(15px,1.3vw,18px)] leading-snug font-semibold text-navy outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand-red sm:px-7 sm:py-5"
                  >
                    <span className="min-w-0 break-words">{question}</span>
                    <span aria-hidden="true" className={`relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-350 motion-reduce:transition-none ${isOpen ? "bg-brand-red text-white" : "bg-[#edf3fa] text-navy"}`}>
                      <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                      <span className={`absolute h-0.5 w-3 rounded-full bg-current transition-[transform,opacity] duration-350 motion-reduce:transition-none ${isOpen ? "rotate-0 opacity-0" : "rotate-90 opacity-100"}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-350 ease-in-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 text-[clamp(14px,1.1vw,16px)] leading-[1.75] text-[#526b88] sm:pr-20 sm:pb-6 sm:pl-7">{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
