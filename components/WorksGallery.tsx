"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WORKS, type Piece } from "@/lib/works";
import { img, waLink } from "@/lib/site";
import Fabric from "./Fabric";
import { WaIcon } from "./Icons";
import { getLenis } from "./SmoothScroll";

const EASE = [0.2, 0.7, 0.1, 1] as const;

function PieceCard({ p, index, onOpen, onLoaded }: {
  p: Piece; index: number; onOpen: () => void; onLoaded: (i: number, ok: boolean) => void;
}) {
  const loaded = useCallback((ok: boolean) => onLoaded(index, ok), [index, onLoaded]);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <button className="block w-full text-left group" onClick={onOpen}>
        <div className="transition-transform duration-700 ease-[cubic-bezier(.2,.7,.1,1)] group-hover:-translate-y-1.5">
          <Fabric silk={p.silk} src={p.photo} alt={p.title} depth={44} onLoaded={loaded} sizes="(max-width: 1024px) 46vw, 380px"
            className="arch aspect-[4/5] flex items-center justify-center">
            <span className="ph text-center px-4 py-3 rounded-2xl bg-chalk text-ink shadow-xs">
              <span className="block font-display italic text-gold">Add your photo</span>
              <span className="block text-xs text-muted mt-0.5">images/{p.photo}</span>
            </span>
          </Fabric>
        </div>
        <p className="mt-4 text-sm text-gold font-display italic">{p.type}</p>
        <h2 className="font-display text-xl sm:text-2xl leading-tight mt-0.5 group-hover:text-gold transition-colors">{p.title}</h2>
      </button>
    </motion.li>
  );
}

export default function WorksGallery() {
  const types = useMemo(() => ["All", ...Array.from(new Set(WORKS.map((w) => w.type)))], []);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [hasPhoto, setHasPhoto] = useState<Record<number, boolean>>({});
  const onLoaded = useCallback((i: number, ok: boolean) => setHasPhoto((h) => (h[i] === ok ? h : { ...h, [i]: ok })), []);

  const shown = WORKS.map((p, i) => ({ p, i })).filter(({ p }) => filter === "All" || p.type === filter);
  const piece = open !== null ? WORKS[open] : null;

  // Pause the page while the viewer is open; Esc closes it
  useEffect(() => {
    if (open === null) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <LayoutGroup>
      <div className="mt-9 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:overflow-visible sm:flex-wrap sm:justify-center" role="group" aria-label="Filter by type">
        {types.map((t) => (
          <button key={t} className="filter relative" aria-pressed={filter === t} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <section className="max-w-7xl mx-auto pt-10 lg:pt-12 pb-20 lg:pb-28">
        <motion.ul layout className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14">
          <AnimatePresence mode="popLayout">
            {shown.map(({ p, i }) => (
              <PieceCard key={i} p={p} index={i} onLoaded={onLoaded}
                onOpen={() => { if (hasPhoto[i]) setOpen(i); }} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      {/* ===== Piece viewer ===== */}
      <AnimatePresence>
        {piece && open !== null && (
          <motion.div
            key="viewer"
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog" aria-modal="true" aria-labelledby="vTitle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-[rgba(27,13,21,.72)] backdrop-blur-sm" onClick={() => setOpen(null)} />
            <motion.div
              data-lenis-prevent
              className="relative w-full max-w-[960px] bg-chalk rounded-[2rem] overflow-hidden flex flex-col md:grid md:grid-cols-2 max-h-[90vh] overflow-y-auto"
              initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.98 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <button onClick={() => setOpen(null)} autoFocus className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-chalk/90 border border-line hover:border-ink text-xl" aria-label="Close">×</button>
              <div className={`fabric silk-${piece.silk} has-img shrink-0 aspect-[4/5] md:aspect-auto md:min-h-[520px]`}>
                <span className="fabric-art">
                  <span className="fabric-photo" style={{ opacity: 1 }}>
                    <Image src={img(piece.photo)} alt={piece.title} fill sizes="(max-width: 768px) 100vw, 480px" />
                  </span>
                </span>
              </div>
              <motion.div className="p-7 sm:p-10 flex flex-col"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: EASE }}>
                <p className="font-display italic text-gold text-lg">{piece.type}</p>
                <h2 id="vTitle" className="font-display text-3xl sm:text-4xl leading-tight mt-1">{piece.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">{piece.desc}</p>
                <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                  {([["Fabric", piece.fabric], ["Work", piece.work], ["Time", piece.time]] as const).map(([k, v]) => (
                    <div key={k} className="py-3 flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-8 grid gap-3">
                  <a href={waLink(`Hello Bend the Trend, I'd like something like the "${piece.title}" from your works.`)} target="_blank" rel="noopener"
                    className="btn flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-wa text-white hover:opacity-90">
                    <WaIcon />I’d like something like this
                  </a>
                  <Link href="/customise-my-outfit#book" className="btn text-center px-6 py-3.5 rounded-full border border-ink hover:bg-ink hover:text-chalk">Start my design</Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
