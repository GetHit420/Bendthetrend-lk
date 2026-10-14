"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { EMAIL, INSTAGRAM, NAV, PHONE_DISPLAY, TEL_HREF, waLink } from "@/lib/site";
import { PhoneIcon, WaIcon } from "./Icons";
import { ScrollProgress } from "./Motion";

/** A link that opens WhatsApp with a message ready to send. */
export function WaLink({ msg, className, children, ...rest }: {
  msg?: string; className?: string; children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={waLink(msg)} target="_blank" rel="noopener" className={className} {...rest}>{children}</a>;
}

export function Announcement() {
  return (
    <div className="bg-plum text-[#F3E3DE] text-center text-[13px] sm:text-sm px-4 py-2 leading-snug">
      By appointment only.{" "}
      <Link href="/customise-my-outfit#book" className="underline underline-offset-4 decoration-[#D4AA5E] whitespace-nowrap">Book a fitting</Link>
    </div>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header
      className={`sticky z-40 border-b transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled
          ? "bg-chalk lg:bg-chalk/85 lg:backdrop-blur-xl border-line shadow-[0_10px_30px_-24px_rgba(0,0,0,.6)]"
          : "bg-chalk border-line"
      }`}
      style={{ top: "env(safe-area-inset-top,0px)" }}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4`}>
        <Link href="/" className="flex items-center gap-2.5 lg:gap-3 shrink-0" aria-label="Bend the Trend home">
          <Image src="/brand/logo-mark.png" alt="" width={232} height={256} preload
            className="h-11 w-auto lg:h-14 drop-shadow-[0_2px_6px_rgba(212,170,94,.25)]" />
          <span className="font-display text-lg lg:text-xl tracking-wide">Bend the Trend</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[15px]" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative py-1 transition-colors ${isActive(n.href) ? "text-gold" : "hover:text-gold"}`}>
              {n.label}
              {isActive(n.href) && (
                <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-0.5 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a href={TEL_HREF} className="lg:hidden p-2.5 rounded-full border border-line" aria-label="Call Bend the Trend">
            <PhoneIcon size={18} />
          </a>
          <Link href="/customise-my-outfit#book" className="btn hidden lg:inline-flex items-center px-5 py-2.5 rounded-full bg-ink text-chalk text-sm hover:opacity-90">Book consultation</Link>
          <button onClick={() => setOpen(!open)} className={`lg:hidden ml-1 p-2.5 rounded-full border-[1.5px] border-gold text-gold transition-colors duration-300 ${open ? "bg-gold/15" : "bg-gold/5 hover:bg-gold/15"}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobileNav">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24">
              <motion.path animate={{ d: open ? "M6 6l12 12" : "M4 8h16" }} transition={{ duration: 0.35 }} />
              <motion.path animate={{ d: open ? "M6 18L18 6" : "M4 16h16" }} transition={{ duration: 0.35 }} />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobileNav"
            key="mnav"
            aria-label="Mobile"
            className="lg:hidden overflow-hidden border-t border-line"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
          >
            <div className="px-5 py-5 flex flex-col gap-4 text-xl font-display">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <Link href={n.href} onClick={() => setOpen(false)} aria-current={isActive(n.href) ? "page" : undefined}
                    className={isActive(n.href) ? "text-gold" : ""}>
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <ScrollProgress />
    </header>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl">Bend the Trend</p>
          <p className="mt-3 text-muted max-w-sm leading-relaxed">Made-to-measure bridal gowns, sarees and occasion wear. Designed and finished by hand in Sri Lanka.</p>
        </div>
        <div className="grid gap-2 content-start">
          <p className="font-display text-lg mb-1">What we make</p>
          <Link href="/#bridal" className="text-muted hover:text-ink">Bridal gowns</Link>
          <Link href="/customise-my-outfit#make" className="text-muted hover:text-ink">Sarees</Link>
          <Link href="/customise-my-outfit#make" className="text-muted hover:text-ink">Statement, engagement & party dresses</Link>
          <Link href="/customise-my-outfit#make" className="text-muted hover:text-ink">Kids & occasion wear</Link>
        </div>
        <div className="grid gap-2 content-start">
          <p className="font-display text-lg mb-1">Contact</p>
          <a href={TEL_HREF} className="text-muted hover:text-ink">{PHONE_DISPLAY}</a>
          <WaLink className="text-muted hover:text-ink">WhatsApp</WaLink>
          <a href={`mailto:${EMAIL}`} className="text-muted hover:text-ink">{EMAIL}</a>
          <a href={INSTAGRAM} className="text-muted hover:text-ink">Instagram</a>
        </div>
      </div>
      <div className="border-t border-line text-center text-xs text-muted py-6">© 2026 Bend the Trend. All rights reserved.</div>
    </footer>
  );
}

/** Mobile booking bar: always one tap from calling or messaging. Slides away while reading down, returns on the way up. */
export function MobileBar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev + 4 && v > 300);
    if (v < prev - 4) setHidden(false);
  });
  return (
    <motion.div
      className="action-bar lg:hidden fixed inset-x-0 bottom-0 z-50 bg-chalk border-t border-line px-4 pt-3 grid grid-cols-2 gap-3"
      animate={{ y: hidden ? "110%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
    >
      <a href={TEL_HREF} className="flex items-center justify-center gap-2 py-3 rounded-full bg-ink text-chalk text-[15px]">
        <PhoneIcon /> Book a fitting
      </a>
      <WaLink className="flex items-center justify-center gap-2 py-3 rounded-full bg-wa text-white text-[15px]">
        <WaIcon /> WhatsApp
      </WaLink>
    </motion.div>
  );
}
