"use client";

import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// One shared Lenis instance so dialogs can pause scrolling and pages can scroll to anchors.
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

const OFFSET = -84; // keeps anchored sections clear of the sticky header

export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: OFFSET, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085, // lower = silkier glide
      wheelMultiplier: 0.95,
      anchors: { offset: OFFSET, duration: 1.4 },
      stopInertiaOnNavigate: true,
    });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // On a new page: start at the top, or glide to the #section the link asked for
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    const t = setTimeout(() => scrollToTarget(decodeURIComponent(hash)), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
