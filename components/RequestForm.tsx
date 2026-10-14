"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { OUTFITS, TEL_HREF, waLink } from "@/lib/site";
import Fabric, { type Silk } from "./Fabric";
import { PhoneIcon, WaIcon } from "./Icons";
import { Reveal } from "./Motion";

const MAX_IMAGES = 5, MAX_MB = 10;
const PICK_EVENT = "bt:pick-outfit";

/** Call from any outfit tile: chooses the outfit in the form and glides down to it. */
export function pickOutfit(outfit: string) {
  window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: outfit }));
}

/** A "What we make" tile that fills the form with its outfit when tapped. */
export function OutfitTile({ outfit, silk, src, alt, className, sizes = "(max-width: 768px) 48vw, 300px", children }: {
  outfit: string; silk: Silk; src: string; alt: string; className?: string; sizes?: string; children: React.ReactNode;
}) {
  return (
    <Fabric href="#book" silk={silk} src={src} alt={alt} tile sizes={sizes} className={className}
      onClick={() => pickOutfit(outfit)}>
      {children}
    </Fabric>
  );
}

type Preview = { file: File; url: string };
type Sent = { name: string; whatsapp: string; pictures: number };

const EASE = [0.2, 0.7, 0.1, 1] as const;

/** Shrinks a photo in the browser (longest side 1600px, JPEG) so it uploads fast on mobile data. */
async function shrink(file: File, maxSide = 1600, quality = 0.82): Promise<{ data: string; type: string }> {
  const toBase64 = (blob: Blob) => new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] || "");
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url;
    });
    URL.revokeObjectURL(url);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); // transparent PNGs get a white background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob) throw new Error("encode");
    return { data: await toBase64(blob), type: "image/jpeg" };
  } catch {
    // The browser couldn't read it (e.g. some HEIC photos): send the original if it's small enough
    if (file.size > 3 * 1024 * 1024) throw new Error(`${file.name} couldn’t be prepared. Try a screenshot of it instead.`);
    return { data: await toBase64(file), type: file.type || "image/jpeg" };
  }
}

function RequestForm() {
  const [outfit, setOutfit] = useState("");
  const [files, setFiles] = useState<Preview[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok?: boolean; action?: () => void } | null>(null);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [over, setOver] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  useEffect(() => {
    const onPick = (e: Event) => {
      setOutfit((e as CustomEvent<string>).detail);
      setInvalid((v) => v.filter((n) => n !== "outfit"));
    };
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, []);

  // Free the preview images when they're removed or the form unmounts
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(() => () => filesRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const say = (text: string, ok?: boolean) => setMsg({ text, ok });

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) { say(`${f.name} isn’t an image. Add JPG or PNG files.`); continue; }
      if (f.size > MAX_MB * 1048576) { say(`${f.name} is over ${MAX_MB} MB. Choose a smaller photo.`); continue; }
      if (next.length >= MAX_IMAGES) { say(`You can add up to ${MAX_IMAGES} photos.`); break; }
      next.push({ file: f, url: URL.createObjectURL(f) });
    }
    setFiles(next);
  }
  function removeFile(i: number) {
    URL.revokeObjectURL(files[i].url);
    setFiles(files.filter((_, j) => j !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const required = ["name", "whatsapp", "outfit"];
    const missing = required.filter((n) => !String(fd.get(n) || "").trim());
    setInvalid(missing);
    if (missing.length) {
      say("Please add your name, WhatsApp number and what we’ll be making.");
      (form.elements.namedItem(missing[0]) as HTMLElement | null)?.focus();
      return;
    }

    const d = Object.fromEntries(fd) as Record<string, string>;
    const summary = [
      `Hello Bend the Trend, I'd like to begin a piece.`,
      `Name: ${d.name}`, `WhatsApp: ${d.whatsapp}`, `Outfit: ${d.outfit}`,
      `Event date: ${d.date || "Not set"}`, `Budget: ${d.budget || "Not sure yet"}`, `Based in: ${d.location}`,
      d.idea ? `Idea: ${d.idea}` : "",
    ].filter(Boolean).join("\n");

    const openWhatsApp = () => {
      const note = files.length ? `\n\nI'll attach ${files.length} picture${files.length > 1 ? "s" : ""} here.` : "";
      window.open(waLink(summary + note), "_blank", "noopener");
    };

    setSending(true);
    say(files.length ? "Preparing your pictures…" : "Sending…", true);
    try {
      const images = [];
      for (const p of files) images.push(await shrink(p.file));
      say("Sending to the atelier…", true);
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, images }),
      });
      const res = await r.json().catch(() => ({}));
      if (res.notConfigured) {
        // The Google Sheet isn't connected yet: hand over to WhatsApp as before
        openWhatsApp();
        say(files.length ? "WhatsApp is opening. Please attach your pictures in the chat before sending." : "WhatsApp is opening with your details filled in.", true);
        return;
      }
      if (!r.ok || !res.ok) throw new Error(res.error || "send");
      setSent({ name: d.name.trim().split(" ")[0], whatsapp: d.whatsapp, pictures: files.length });
      form.reset(); setOutfit(""); files.forEach((p) => URL.revokeObjectURL(p.url)); setFiles([]); setMsg(null);
    } catch (err) {
      const m = err instanceof Error && err.message.includes("couldn’t be prepared") ? err.message
        : "Your request didn’t send. Check your connection and try again, or send it on WhatsApp instead.";
      setMsg({ text: m, ok: false, action: openWhatsApp });
    } finally {
      setSending(false);
    }
  }

  const inv = (n: string) => (invalid.includes(n) ? "true" : undefined);

  if (sent) return <ThankYou sent={sent} onAgain={() => setSent(null)} />;

  return (
    <form onSubmit={onSubmit} className="lg:col-span-3 px-6 py-10 sm:p-12 grid gap-6" noValidate>
      {/* Hidden from people; bots that fill every field get politely ignored */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="grid gap-2 text-sm">Your name *
          <input name="name" required autoComplete="name" className="field" aria-invalid={inv("name")} />
        </label>
        <label className="grid gap-2 text-sm">WhatsApp number *
          <input name="whatsapp" required type="tel" autoComplete="tel" placeholder="07X XXX XXXX or +44…" className="field" aria-invalid={inv("whatsapp")} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="grid gap-2 text-sm">What shall we make for you? *
          <select name="outfit" required value={outfit} onChange={(e) => setOutfit(e.target.value)} className="field bg-plum" aria-invalid={inv("outfit")}>
            <option value="">Please choose</option>
            {OUTFITS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm">Date of the occasion
          <input name="date" type="date" className="field [color-scheme:dark]" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="grid gap-2 text-sm">Budget (LKR)
          <select name="budget" className="field bg-plum" defaultValue="">
            <option value="">Not sure yet</option>
            <option>Under 25,000</option><option>25,000 – 50,000</option><option>50,000 – 100,000</option>
            <option>100,000 – 200,000</option><option>Over 200,000</option>
          </select>
        </label>
        <fieldset className="grid gap-2 text-sm">
          <legend className="mb-2">Where are you?</legend>
          <div className="flex gap-2">
            <label className="chip"><input type="radio" name="location" value="Sri Lanka" defaultChecked className="sr-only" />Sri Lanka</label>
            <label className="chip"><input type="radio" name="location" value="Overseas" className="sr-only" />Overseas</label>
          </div>
        </fieldset>
      </div>
      <label className="grid gap-2 text-sm">Tell us about it
        <textarea name="idea" rows={3} placeholder="Colours, neckline, sleeves, fabric — anything you have in mind" className="field resize-none" data-lenis-prevent />
      </label>

      <div>
        <p className="text-sm">Pictures you love <span className="text-[#BFA8B1]">— up to 5 images</span></p>
        <label
          className={`dropzone mt-3 flex flex-col items-center justify-center gap-2 border border-dashed border-[#8A6474] rounded-2xl px-4 py-7 text-center cursor-pointer hover:border-[#D4AA5E] transition-colors ${over ? "is-over" : ""}`}
          onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
          onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
        >
          <svg width="28" height="28" fill="none" stroke="#D4AA5E" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>
          <span>Tap to add pictures <span className="hidden sm:inline">or drop them here</span></span>
          <span className="text-xs text-[#BFA8B1]">Screenshots from Instagram or Pinterest are welcome</span>
          <input type="file" name="images" accept="image/*" multiple className="sr-only"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        <ul className="mt-3 grid grid-cols-5 gap-2">
          <AnimatePresence>
            {files.map((p, i) => (
              <motion.li key={p.url} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-[#3A2230]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Reference ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-7 h-7 rounded-full bg-[#2A1420] text-white text-sm leading-none" aria-label={`Remove photo ${i + 1}`}>×</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="min-h-[1.25rem]" role="status">
        {msg && (
          <p className="text-sm" style={{ color: msg.ok ? "#D4AA5E" : "#F2A3AE" }}>
            {sending && <span className="inline-block w-3 h-3 mr-2 align-[-1px] rounded-full border-2 border-current border-r-transparent animate-spin" />}
            {msg.text}
            {msg.action && (
              <button type="button" onClick={msg.action} className="ml-2 underline underline-offset-4 decoration-[#D4AA5E] text-[#F6EAE6]">Send on WhatsApp</button>
            )}
          </p>
        )}
      </div>
      <button disabled={sending} className="btn w-full sm:w-auto sm:justify-self-start px-8 py-4 rounded-full bg-[#D4AA5E] text-plum font-medium hover:bg-[#E2BC73] disabled:opacity-60">
        {sending ? "Sending…" : "Send to the atelier"}
      </button>
    </form>
  );
}

function ThankYou({ sent, onAgain }: { sent: Sent; onAgain: () => void }) {
  return (
    <motion.div
      key="thanks"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="lg:col-span-3 px-6 py-14 sm:p-14 flex flex-col justify-center"
      role="status"
    >
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <motion.circle cx="32" cy="32" r="30" fill="none" stroke="#D4AA5E" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE }} />
        <motion.path d="M20 33l8 8 16-17" fill="none" stroke="#D4AA5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: EASE }} />
      </svg>
      <h3 className="font-display text-[2rem] sm:text-5xl leading-[1.05] mt-7">Thank you, {sent.name}.</h3>
      <p className="mt-4 text-[#E3CFD5] leading-relaxed max-w-md">
        Your request{sent.pictures ? ` and ${sent.pictures} picture${sent.pictures > 1 ? "s" : ""}` : ""} reached the atelier.
        We’ll message you on WhatsApp at <span className="text-[#F6EAE6] whitespace-nowrap">{sent.whatsapp}</span> within a day to arrange your consultation.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <a href={waLink(`Hello Bend the Trend, I've just sent a request through your website. My name is ${sent.name}.`)} target="_blank" rel="noopener"
          className="btn inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-wa text-white hover:opacity-90"><WaIcon />Can’t wait? Message us now</a>
        <button type="button" onClick={onAgain} className="px-6 py-3.5 rounded-full border border-[#6A4556] hover:border-[#D4AA5E] transition-colors">Send another request</button>
      </div>
    </motion.div>
  );
}

/** The plum booking card: why + what happens next + direct contact, beside the form. */
export function BookSection({ title }: { title: string }) {
  return (
    <section id="book" className="px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
      <Reveal y={60} className="max-w-6xl mx-auto bg-plum text-[#F6EAE6] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden grid lg:grid-cols-5">
        <Fabric silk="plum" depth={70} className="lg:col-span-2 px-6 py-10 sm:p-12">
          <h2 className="font-display text-[2.2rem] sm:text-5xl leading-[1.05]">{title}</h2>
          <p className="mt-4 text-[#E3CFD5] leading-relaxed">Tell us about the occasion and share a few pictures you love. We’ll reply on WhatsApp to arrange your fitting.</p>
          <h3 className="font-display text-xl mt-9">What happens next</h3>
          <ol className="mt-3 grid gap-2.5 text-[#E3CFD5] text-[15px] leading-relaxed">
            <li className="flex gap-3"><span className="font-display italic text-[#D4AA5E]">1</span>We reply within a day.</li>
            <li className="flex gap-3"><span className="font-display italic text-[#D4AA5E]">2</span>We arrange your consultation.</li>
            <li className="flex gap-3"><span className="font-display italic text-[#D4AA5E]">3</span>Your quote follows once the design is settled.</li>
          </ol>
          <p className="mt-9 text-sm text-[#E3CFD5]">Prefer to speak with us?</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={TEL_HREF} className="btn flex items-center justify-center gap-2 px-4 py-3 bg-[#F6EAE6] text-plum rounded-full hover:bg-white"><PhoneIcon />Call</a>
            <a href={waLink()} target="_blank" rel="noopener" className="btn flex items-center justify-center gap-2 px-4 py-3 bg-wa text-white rounded-full hover:opacity-90"><WaIcon />WhatsApp</a>
          </div>
          <p className="mt-5 text-sm text-[#E3CFD5]">The atelier is open by appointment, Tuesday to Sunday, 10am–7pm.</p>
        </Fabric>
        <RequestForm />
      </Reveal>
    </section>
  );
}

