"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { GoogleReviews } from "@/lib/google-reviews";
import { TESTIMONIALS } from "@/lib/site";
import { Stagger, StaggerItem } from "./Motion";

const EASE = [0.2, 0.7, 0.1, 1] as const;

/** One shape for both live Google reviews and the written fallback testimonials. */
type Item = {
  id: string;
  text: string;
  author: string;
  sub?: string; // "Bridal gown" for written ones, "2 weeks ago" for Google ones
  rating?: number;
  photo?: string;
  authorUrl?: string;
  url?: string;
  translated?: boolean;
};

function toItems(google: GoogleReviews | null): { items: Item[]; live: boolean } {
  if (google && google.reviews.length > 0) {
    return {
      live: true,
      items: google.reviews.map((r) => ({
        id: r.id, text: r.text, author: r.author, sub: r.when, rating: r.rating,
        photo: r.photo, authorUrl: r.authorUrl, url: r.url, translated: r.translated,
      })),
    };
  }
  return { live: false, items: TESTIMONIALS.map((t) => ({ id: t.who, text: t.q, author: t.who, sub: t.what })) };
}

function clip(text: string, max: number) {
  if (text.length <= max) return { text, clipped: false };
  const cut = text.slice(0, max);
  return { text: cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:!?\s]+$/, "") + "…", clipped: true };
}

/* ---------------- small pieces ---------------- */

export function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  const full = Math.round(value * 2) / 2;
  return (
    <span className={`inline-flex gap-0.5 text-gold ${className}`} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = full >= i + 1 ? 1 : full >= i + 0.5 ? 0.5 : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={`s${i}-${fill}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity=".22" />
              </linearGradient>
            </defs>
            <path fill={`url(#s${i}-${fill})`} d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
          </svg>
        );
      })}
    </span>
  );
}

function Avatar({ name, photo, size = 44 }: { name: string; photo?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (photo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt="" width={size} height={size} referrerPolicy="no-referrer" loading="lazy"
        onError={() => setFailed(true)}
        className="rounded-full object-cover ring-1 ring-gold/40 shrink-0" style={{ width: size, height: size }} />
    );
  }
  return (
    <span aria-hidden className="rounded-full bg-blush text-gold font-display italic grid place-items-center ring-1 ring-gold/40 shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.45 }}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Required credit when Google content is shown without a Google map. */
function GoogleCredit({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xs tracking-wide text-muted ${className}`}>
      Reviews from <span className="font-medium text-ink">Google Maps</span>
    </span>
  );
}

function Author({ it, align = "left" }: { it: Item; align?: "left" | "center" }) {
  const name = it.authorUrl
    ? <a href={it.authorUrl} target="_blank" rel="noopener nofollow" className="text-ink hover:text-gold transition-colors">{it.author}</a>
    : <span className="text-ink">{it.author}</span>;
  return (
    <figcaption className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
      {it.rating !== undefined && <Avatar name={it.author} photo={it.photo} />}
      <span className={`flex flex-col ${align === "center" && it.rating === undefined ? "items-center" : "items-start"} text-left`}>
        <span className="text-[15px]">{name}</span>
        {it.sub && <span className="text-sm text-muted">{it.sub}{it.translated ? " · Translated by Google" : ""}</span>}
      </span>
    </figcaption>
  );
}

/** "4.9 ★★★★★ · 37 Google reviews" with links to read all and write one. */
export function RatingSummary({ google, align = "center" }: { google: GoogleReviews | null; align?: "center" | "left" }) {
  if (!google || !google.rating) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${align === "center" ? "justify-center" : ""}`}>
      <a href={google.reviewsUrl} target="_blank" rel="noopener"
        className="group inline-flex items-center gap-3 rounded-full border border-line bg-chalk px-4 py-2 hover:border-gold transition-colors">
        <span className="font-display text-2xl leading-none">{google.rating.toFixed(1)}</span>
        <Stars value={google.rating} />
        <span className="text-sm text-muted group-hover:text-ink transition-colors">
          {google.count} review{google.count === 1 ? "" : "s"} on Google
        </span>
      </a>
      {google.writeUrl && (
        <a href={google.writeUrl} target="_blank" rel="noopener" className="text-sm underline underline-offset-4 decoration-gold hover:text-gold">
          Write a review
        </a>
      )}
    </div>
  );
}

function Notice({ live, className = "" }: { live: boolean; className?: string }) {
  if (!live) return null;
  return (
    <p className={`text-xs text-muted ${className}`}>
      <GoogleCredit /> · the most relevant reviews, as ordered by Google, shown in full on Google Maps.
    </p>
  );
}

/* ---------------- Home page: carousel ---------------- */

export function Testimonials({ google }: { google: GoogleReviews | null }) {
  const { items, live } = toItems(google);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  const go = useCallback((to: number, d: number) => { setDir(d); setI(((to % n) + n) % n); }, [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => go(i + 1, 1), 8000);
    return () => clearTimeout(t);
  }, [i, paused, go, n]);

  const it = items[i];
  const { text, clipped } = clip(it.text, 280);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <svg className="mx-auto" width="38" height="27" viewBox="0 0 42 30" aria-hidden><path d="M0 30V17C0 7 6 1 16 0v6c-5 1-8 5-8 10h8v14zm24 0V17c0-10 6-16 16-17v6c-5 1-8 5-8 10h8v14z" fill="var(--gold)" /></svg>
      <div className="mt-7 min-h-[280px] sm:min-h-[250px] relative" aria-live="polite">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={it.id}
            initial={{ opacity: 0, x: dir * 40, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -40, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            drag={n > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1, 1);
              else if (info.offset.x > 60) go(i - 1, -1);
            }}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {it.rating !== undefined && <Stars value={it.rating} size={18} className="mb-4" />}
            <blockquote className={`font-display leading-snug ${text.length > 170 ? "text-[1.2rem] sm:text-[1.7rem]" : "text-[1.45rem] sm:text-4xl"}`}>{text}</blockquote>
            {clipped && it.url && (
              <a href={it.url} target="_blank" rel="noopener" className="inline-block mt-3 text-sm underline underline-offset-4 decoration-gold hover:text-gold">Read the full review on Google</a>
            )}
            <div className="mt-6"><Author it={it} align="center" /></div>
          </motion.figure>
        </AnimatePresence>
      </div>
      {n > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button onClick={() => go(i - 1, -1)} className="w-11 h-11 rounded-full border border-line hover:border-ink transition-colors" aria-label="Previous review">‹</button>
          <div className="flex gap-2">
            {items.map((_, j) => (
              <button key={j} onClick={() => go(j, j > i ? 1 : -1)} aria-label={`Review ${j + 1}`}
                className="relative h-2.5 rounded-full border border-ink transition-[width] duration-500"
                style={{ width: j === i ? 28 : 10 }}>
                {j === i && <motion.span layoutId="dot" className="absolute inset-0 rounded-full bg-ink" />}
              </button>
            ))}
          </div>
          <button onClick={() => go(i + 1, 1)} className="w-11 h-11 rounded-full border border-line hover:border-ink transition-colors" aria-label="Next review">›</button>
        </div>
      )}
      <div className="mt-8 grid gap-3 justify-items-center">
        <RatingSummary google={google} />
        <Notice live={live} />
      </div>
    </div>
  );
}

/* ---------------- Our Works: cards ---------------- */

export function ReviewCards({ google }: { google: GoogleReviews | null }) {
  const { items, live } = toItems(google);
  return (
    <>
      <div className="mt-6"><RatingSummary google={google} /></div>
      <Stagger className="mt-10 grid md:grid-cols-3 gap-5">
        {items.slice(0, 3).map((it) => (
          <StaggerItem as="figure" key={it.id}
            className="bg-chalk rounded-3xl p-7 sm:p-8 border border-line flex flex-col transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,20,32,.4)]">
            {it.rating !== undefined && <Stars value={it.rating} className="mb-4" />}
            <blockquote className="font-display text-xl leading-snug line-clamp-[8]">“{it.text}”</blockquote>
            {live && it.url && (
              <a href={it.url} target="_blank" rel="noopener" className="mt-3 text-sm text-muted underline underline-offset-4 decoration-gold hover:text-gold self-start">Read on Google</a>
            )}
            <div className="mt-auto pt-5 text-sm"><Author it={it} /></div>
          </StaggerItem>
        ))}
      </Stagger>
      <Notice live={live} className="mt-6 text-center" />
    </>
  );
}
