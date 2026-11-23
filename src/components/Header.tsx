"use client";

import Image from "next/image";
import headerLogo from "../../public/images/Custom Patch America Eagle Logoo.png";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

const baseNavigation = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "/about-us" },
  { label: "Samples", href: "/samples" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

const baseServiceLinks = [
  { label: "Embroidered Patches", href: "/embroidered-patches" },
  { label: "Woven Patches", href: "/woven-patches" },
  { label: "Chenille Patches", href: "/chenille-patches" },
  { label: "PVC Patches", href: "/pvc-patches" },
  { label: "Sublimated Patches", href: "/sublimated-patches" },
  { label: "Leather Patches", href: "/leather-patches" },
];

export default function Header({ servicePage = false }: { servicePage?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const resolveLink = (href: string) => servicePage && ["#top", "#story", "#process", "#footer", "#categories"].includes(href) ? (href === "#top" ? "/" : `/${href}`) : href;
  const navigation = baseNavigation.map(item => ({ ...item, href: resolveLink(item.href) }));
  const serviceLinks = baseServiceLinks.map(item => ({ ...item, href: resolveLink(item.href) }));

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsServiceOpen(false);
  };

  return (
    <header className="relative z-20 w-full border-t border-[#031832] bg-white" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
      <div aria-label="Announcements and contact information" className="bg-[#143d69] px-3 py-2 text-white sm:px-6">
        <div className={`${styles.announcementViewport} md:hidden`}>
          <div className={`${styles.announcementTrack} flex w-max items-center justify-between gap-4 whitespace-nowrap text-[11px] font-medium leading-5`}>
            <a href="mailto:info@custompatchamerica.com" className="inline-flex items-center gap-1 hover:underline">
              <Mail size={12} aria-hidden="true" />info@custompatchamerica.com
            </a>
            <p>Bulk discounts &middot; Free mockups &middot; 20% OFF first order</p>
            <a href="tel:+15097432605" className="inline-flex items-center gap-1 hover:underline">
              <Phone size={12} aria-hidden="true" />+1 (509) 743-2605
            </a>
          </div>
        </div>
        <div className="mx-auto hidden max-w-[1440px] grid-cols-2 items-center gap-x-4 gap-y-2 text-[12px] leading-5 md:grid lg:grid-cols-[1fr_auto_1fr] lg:text-[13px]">
          <a href="mailto:info@custompatchamerica.com" className="inline-flex items-center gap-2 justify-self-start font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-md:gap-1 max-md:whitespace-nowrap max-md:font-medium max-md:[&_svg]:size-3">
            <Mail size={14} className="shrink-0" aria-hidden="true" />info@custompatchamerica.com
          </a>
          <p className="col-span-2 row-start-2 text-center font-medium lg:col-span-1 lg:col-start-2 lg:row-start-1">Exclusive Bulk Discounts | Free Digital Mockups + 20% OFF your first order</p>
          <a href="tel:+15097432605" className="col-start-2 row-start-1 inline-flex items-center gap-2 justify-self-end whitespace-nowrap font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:col-start-3 max-md:gap-1 max-md:font-medium max-md:[&_svg]:size-3">
            <Phone size={14} className="shrink-0" aria-hidden="true" />+1 (509) 743-2605
          </a>
        </div>
      </div>
      <div className="relative mx-auto flex h-[100px] max-w-[1440px] items-center justify-between gap-4 px-6 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-12 max-md:h-[88px] max-md:justify-end max-md:px-4">
        <a href={servicePage ? "/" : "#top"} aria-label="Custom Patch America home" className="flex h-[80px] w-[280px] shrink-0 items-center lg:w-[230px] xl:w-[280px] max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:h-[76px] max-md:w-[220px] max-md:max-w-[calc(100%-112px)] max-md:-translate-x-1/2 max-md:-translate-y-1/2">
          <Image src={headerLogo} alt="Custom Patch America eagle logo" sizes="(max-width: 767px) 220px, (max-width: 1279px) 230px, 280px" className="h-full w-full object-contain" preload />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center justify-center gap-[clamp(16px,1.6vw,26px)] lg:flex">
          {navigation.slice(0, 2).map((item) => (
            <a key={item.label} href={item.href} className="whitespace-nowrap text-[15px] xl:text-[16px] font-medium text-[#031832] hover:text-brand-red">
              {item.label}
            </a>
          ))}

          <div className="relative">
            <button type="button" aria-expanded={isServiceOpen} aria-controls="desktop-services" onClick={() => setIsServiceOpen((open) => !open)} className="flex items-center gap-1 whitespace-nowrap text-[15px] xl:text-[16px] font-medium text-[#031832] hover:text-brand-red">
              Service <ChevronDown aria-hidden="true" className="size-4" strokeWidth={2.5} />
            </button>
            {isServiceOpen && (
              <div id="desktop-services" className="absolute left-1/2 top-full mt-4 w-48 -translate-x-1/2 border border-[#031832]/10 bg-white py-2 shadow-lg">
                {serviceLinks.map((item) => (
                  <a key={item.label} href={item.href} onClick={closeMenus} className="block px-4 py-2 text-[15px] font-medium text-[#031832] hover:bg-slate-50 hover:text-brand-red">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {navigation.slice(2).map((item) => (
            <a key={item.label} href={item.href} className="whitespace-nowrap text-[15px] xl:text-[16px] font-medium text-[#031832] hover:text-brand-red">
              {item.label}
            </a>
          ))}
        </nav>

        <button type="button" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen((open) => !open)} className="ml-auto grid size-11 place-items-center text-[#031832] lg:hidden max-md:absolute max-md:left-4 max-md:top-1/2 max-md:-translate-y-1/2">
          {isMenuOpen ? <X className="size-7" aria-hidden="true" /> : <Menu className="size-7" aria-hidden="true" />}
        </button>
        <a href="/get-a-quote" onClick={closeMenus} className="inline-flex min-h-11 shrink-0 justify-self-end items-center justify-center whitespace-nowrap rounded-lg bg-[#ed1c24] px-5 py-3 text-xs font-bold tracking-wide text-white shadow-[0_4px_14px_rgba(237,28,36,0.25)] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_5px_18px_rgba(237,28,36,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1c24] motion-reduce:transition-none max-md:hidden">GET A QUOTE</a>
      </div>

      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#031832]/10 bg-white px-6 py-5 lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {navigation.slice(0, 2).map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenus} className="border-b border-[#031832]/10 py-4 text-[17px] font-medium text-[#031832]">{item.label}</a>
            ))}
            <div className="border-b border-[#031832]/10">
              <button type="button" aria-expanded={isServiceOpen} aria-controls="mobile-services" onClick={() => setIsServiceOpen((open) => !open)} className="flex w-full items-center justify-between py-4 text-[17px] font-medium text-[#031832]">
                Service <ChevronDown aria-hidden="true" className={`size-4 ${isServiceOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
              </button>
              {isServiceOpen && (
                <div id="mobile-services" className="pb-3 pl-4">
                  {serviceLinks.map((item) => (
                    <a key={item.label} href={item.href} onClick={closeMenus} className="block py-2 text-[16px] font-medium text-[#031832]">{item.label}</a>
                  ))}
                </div>
              )}
            </div>
            {navigation.slice(2).map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenus} className="border-b border-[#031832]/10 py-4 text-[17px] font-medium text-[#031832]">{item.label}</a>
            ))}
            <a href="/get-a-quote" onClick={closeMenus} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#ed1c24] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(237,28,36,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1c24] md:hidden">GET A QUOTE</a>
          </div>
        </nav>
      )}
    </header>
  );
}
