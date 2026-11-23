import Image from "next/image";
import { ArrowRight, ChevronDown, Mail, Phone } from "lucide-react";
import footerLogo from "@/data/CPA FOOTER LOGO.png";

const products = [
  { label: "Embroidered Patches", href: "/embroidered-patches" },
  { label: "PVC Patches", href: "/pvc-patches" },
  { label: "Woven Patches", href: "/woven-patches" },
  { label: "Leather Patches", href: "/leather-patches" },
  { label: "Chenille Patches", href: "/chenille-patches" },
  { label: "Sublimated Patches", href: "/sublimated-patches" },
  { label: "All Products", href: "/#categories" },
];
const company = [
  { label: "About Us", href: "/about-us" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "Our Samples", href: "/samples" },
  { label: "Reviews", href: "/#reviews" },
  { label: "How to Order", href: "/#process" },
  { label: "FAQs", href: "/#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];
const headingClass = "mb-4 text-[13px] font-bold text-white";
const columnClass = "min-w-0 xl:border-l xl:border-white/15 xl:pl-6";
const linkClass = "transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function Footer({ servicePage = false }: { servicePage?: boolean }) {
  return (
    <footer id="footer" className="bg-[radial-gradient(ellipse_at_30%_110%,#0c3261,#041832_70%)] px-5 pt-6 text-xs leading-5 text-[#c3d0e0] sm:px-8 md:pt-9 md:leading-6 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 pb-4 md:grid-cols-3 md:gap-6 md:pb-8 xl:grid-cols-[1.2fr_1.1fr_.85fr_1.4fr_1fr]">
          <div className="col-span-2 min-w-0 text-center md:col-span-1 md:text-left">
            <a href={servicePage ? "/" : "#top"} aria-label="Custom Patch America home" className="mx-auto mb-2 block w-[155px] max-w-full md:mx-0 md:mb-5 md:w-[190px]">
              <Image src={footerLogo} alt="Custom Patch America" sizes="(max-width: 767px) 155px, 190px" className="h-auto w-full" />
            </a>
            <p className="mx-auto max-w-[280px] md:mx-0">Custom patches for businesses, teams, and creators across the United States.</p>
            <p className="mt-4 hidden max-w-[280px] text-[#9fc4ee] md:block">Quality patches. Bigger stories.<br />Made for your brand.</p>
          </div>
          {[{ heading: "Products", links: products }, { heading: "Company", links: company }].map(({ heading, links }) => {
            const list = (
              <ul className="space-y-1.5">
                {links.map(({ label, href }) => <li key={label}><a href={href} className={`${linkClass} max-md:block max-md:py-1`}>{label}</a></li>)}
              </ul>
            );
            return (
              <nav key={heading} aria-label={`Footer ${heading}`} className={columnClass}>
                <details className="group border-y border-white/15 md:hidden">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 font-bold text-white [&::-webkit-details-marker]:hidden">
                    {heading}
                    <ChevronDown aria-hidden="true" size={16} className="shrink-0 group-open:rotate-180" />
                  </summary>
                  <div className="pb-2">{list}</div>
                </details>
                <div className="hidden md:block">
                  <h3 className={headingClass}>{heading}</h3>
                  {list}
                </div>
              </nav>
            );
          })}
          <div className={`${columnClass} col-span-2 md:col-span-1`}>
            <h3 className="mb-2 text-[13px] font-bold text-white md:mb-4">Get in Touch</h3>
            <a href="mailto:info@custompatchamerica.com" className={`${linkClass} flex items-start gap-2`}>
              <Mail size={16} className="mt-1 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-words">info@custompatchamerica.com</span>
            </a>
            <a href="tel:+15097432605" className={`${linkClass} mt-1.5 flex items-center gap-2 md:mt-3`}>
              <Phone size={16} className="shrink-0" aria-hidden="true" />+1 (509) 743-2605
            </a>
            <div className="mt-4 hidden md:block">
              <p className="font-semibold text-white">Here to Help</p>
              <p>Free digital mockups<br />Exclusive bulk discounts<br />Expert customer support 24/7</p>
            </div>
          </div>
          <div className={`${columnClass} col-span-2 md:col-span-1`}>
            <h3 className={`${headingClass} hidden md:block`}>Discuss Your Requirements</h3>
            <p className="hidden max-w-[260px] md:block">Tell us your patch type, quantity, artwork, and preferred backing.</p>
            <a href="/get-a-quote" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#ed1c24] px-4 py-2 font-bold text-white shadow-[0_5px_20px_#ed1c2425] transition-colors hover:bg-[#d81720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:mt-4">
              Request a Quote <ArrowRight size={16} aria-hidden="true" />
            </a>
            <p className="mt-4 hidden font-semibold text-white md:block">Your Custom Patch Partner</p>
            <p className="hidden md:block">From your first idea<br />to the finished patch.</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 border-t border-white/20 py-3 text-[11px] md:flex-row md:items-center md:justify-between md:gap-6 md:py-4">
          <p>&#169; 2026 Custom Patch America. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/privacy-policy" className={linkClass}>Privacy Policy</a>
            <a href="/terms-of-service" className={linkClass}>Terms of Service</a>
          </div>
          <p className="hidden md:block">Proudly Serving the USA</p>
        </div>
      </div>
    </footer>
  );
}
