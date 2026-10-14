"use client";

import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { img as imgPath } from "@/lib/site";

export type Silk =
  | "crimson" | "rose" | "ivory" | "pearl" | "emerald"
  | "plum" | "marigold" | "sky" | "lilac" | "noir";

type Props = {
  silk: Silk;
  className?: string;
  style?: React.CSSProperties;
  /** photo file name in /public/images */
  src?: string;
  alt?: string;
  /** how wide the frame is on screen, so phones download a small version of the photo */
  sizes?: string;
  /** fades the figure at the bottom, for labelled tiles */
  tile?: boolean;
  /** load this photo first (only for the first photo people see at the top of a page) */
  priority?: boolean;
  /** how far (px) the figure drifts while the frame crosses the screen; the silk drifts the other way */
  depth?: number;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  onLoaded?: (ok: boolean) => void;
  children?: React.ReactNode;
};

// useLayoutEffect warns during server rendering; this runs it only in the browser
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Parallax only on large screens with a mouse, where it's smooth. Phones and tablets get a still frame. */
function useParallaxAllowed() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)");
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return ok;
}

/**
 * A silk-backed frame. The photo sits on top of the silk. On desktop the photo and the silk
 * move at slightly different speeds as you scroll, which gives each frame a quiet sense of depth.
 */
export default function Fabric({
  silk, className = "", style, src, alt = "", sizes = "(max-width: 768px) 92vw, 45vw", tile, priority, depth = 36,
  href, onClick, onLoaded, children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "failed">(src ? "loading" : "failed");
  const parallax = useParallaxAllowed();

  // Copy the frame's corner radii into --r so the inner layer is cut to exactly the same shape
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const cs = getComputedStyle(el);
      const first = (v: string) => v.split(" ")[0] || "0px";
      el.style.setProperty("--r", [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(first).join(" "));
    };
    sync();
    const ro = new ResizeObserver(sync); // radii change at breakpoints (e.g. rounded-[2rem] sm:rounded-[2.5rem])
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const iy = useTransform(scrollYProgress, [0, 1], [depth * 0.5, -depth * 0.5]);
  const py = useTransform(scrollYProgress, [0, 1], [-depth * 0.6, depth * 0.6]);
  useMotionValueEvent(iy, "change", (v) => { if (parallax) ref.current?.style.setProperty("--iy", `${v.toFixed(1)}px`); });
  useMotionValueEvent(py, "change", (v) => { if (parallax) ref.current?.style.setProperty("--py", `${v.toFixed(1)}px`); });
  useEffect(() => {
    if (!parallax) { ref.current?.style.removeProperty("--iy"); ref.current?.style.removeProperty("--py"); }
  }, [parallax]);

  const loaded = useCallback(() => setState("ok"), []);
  const failed = useCallback(() => setState("failed"), []);
  useEffect(() => {
    if (state !== "loading") onLoaded?.(state === "ok");
  }, [state, onLoaded]);

  // Frames with a rounded top get extra headroom for the photo (see globals.css "curved frames")
  const curved = /(^|\s)arch(\s|$)|rounded-t-/.test(className) ? "" : undefined;
  const cls = `fabric silk-${silk} ${state === "ok" ? "has-img" : ""} ${tile ? "tile" : ""} ${className}`;
  const content = (
    <>
      <span className="fabric-art" aria-hidden={alt ? undefined : true}>
        {src && state !== "failed" && (
          <span className="fabric-photo" data-tile={tile ? "" : undefined}>
            <Image
              src={imgPath(src)}
              alt={alt}
              fill
              sizes={sizes}
              preload={priority}
              loading={priority ? "eager" : "lazy"}
              onLoad={loaded}
              onError={failed}
              ref={(el) => { if (el?.complete && el.naturalWidth > 0) loaded(); }}
            />
          </span>
        )}
      </span>
      {children}
    </>
  );

  if (href) {
    const isLocal = href.startsWith("#");
    return isLocal ? (
      <a data-curve={curved} ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={onClick} className={cls} style={style}>{content}</a>
    ) : (
      <Link data-curve={curved} ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={onClick} className={cls} style={style}>{content}</Link>
    );
  }
  return (
    <div data-curve={curved} ref={ref as React.Ref<HTMLDivElement>} onClick={onClick} className={cls} style={style}>{content}</div>
  );
}
