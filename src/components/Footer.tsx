import Image from "next/image";
import { ArrowRight, Mail, Phone } from "lucide-react";
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
    <footer id="footer" className="bg-[radial-gradient(ellipse_at_30%_110%,#0c3261,#041832_70%)] px-6 pt-9 text-xs leading-6 text-[#c3d0e0] sm:px-8 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-8 md:grid-cols-3 md:gap-6 xl:grid-cols-[1.2fr_1.1fr_.85fr_1.4fr_1fr] xl:gap-6 xl:pb-8">
          <div className="col-span-2 min-w-0 md:col-span-1">
            <a href={servicePage ? "/" : "#top"} aria-label="Custom Patch America home" className="mb-5 block w-[190px] max-w-full">
              <Image src={footerLogo} alt="Custom Patch America" sizes="190px" className="h-auto w-full" />
            </a>
            <p className="max-w-[280px]">Custom patches for businesses, teams, and creators across the United States.</p>
            <p className="mt-4 max-w-[280px] text-[#9fc4ee]">Quality patches. Bigger stories.<br />Made for your brand.</p>
          </div>
          {[{ heading: "Products", links: products }, { heading: "Company", links: company }].map(({ heading, links }) => (
            <nav key={heading} aria-label={`Footer ${heading}`} className={columnClass}>
              <h3 className={headingClass}>{heading}</h3>
              <ul className="space-y-1.5">
                {links.map(({ label, href }) => <li key={label}><a href={href} className={linkClass}>{label}</a></li>)}
              </ul>
            </nav>
          ))}
          <div className={`${columnClass} col-span-2 border-t border-white/15 pt-5 md:col-span-1 md:border-t-0 md:pt-0`}>
            <h3 className={headingClass}>Get in Touch</h3>
            <a href="mailto:info@custompatchamerica.com" className={`${linkClass} flex items-start gap-2`}>
              <Mail size={16} className="mt-1 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-words">info@custompatchamerica.com</span>
            </a>
            <a href="tel:+18608351486" className={`${linkClass} mt-3 flex items-center gap-2`}>
              <Phone size={16} className="shrink-0" aria-hidden="true" />+1 (860) 835-1486
            </a>
            <div className="mt-4">
              <p className="font-semibold text-white">Here to Help</p>
              <p>Free digital mockups<br />Exclusive bulk discounts<br />Expert customer support 24/7</p>
            </div>
          </div>
          <div className={`${columnClass} col-span-2 border-t border-white/15 pt-5 md:col-span-1 md:border-t-0 md:pt-0`}>
            <h3 className={headingClass}>Discuss Your Requirements</h3>
            <p className="max-w-[260px]">Tell us your patch type, quantity, artwork, and preferred backing.</p>
            <a href="/get-a-quote" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#ed1c24] px-4 py-2 font-bold text-white shadow-[0_5px_20px_#ed1c2425] transition-colors hover:bg-[#d81720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Request a Quote <ArrowRight size={16} aria-hidden="true" />
            </a>
            <p className="mt-4 font-semibold text-white">Your Custom Patch Partner</p>
            <p>From your first idea<br />to the finished patch.</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 border-t border-white/20 py-4 text-center text-[11px] md:flex-row md:justify-between md:gap-6 md:text-left">
          <p>&#169; 2026 Custom Patch America. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/privacy-policy" className={linkClass}>Privacy Policy</a>
            <a href="/terms-of-service" className={linkClass}>Terms of Service</a>
          </div>
          <p>Proudly Serving the USA</p>
        </div>
      </div>
    </footer>
  );
}
