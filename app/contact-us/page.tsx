import type { Metadata } from "next";
import Link from "next/link";
import Fabric from "@/components/Fabric";
import { Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/Motion";
import { WaLink } from "@/components/Chrome";
import { PhoneIcon, WaIcon } from "@/components/Icons";
import { ADDRESS, EMAIL, PHONE_DISPLAY, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Bend the Trend on WhatsApp or call ${PHONE_DISPLAY}. Visit our atelier in Mount Lavinia by appointment, Monday to Friday.`,
};

const q = encodeURIComponent(ADDRESS.join(", "));
const directions = `https://www.google.com/maps/search/?api=1&query=${q}`;
const mapSrc = `https://www.google.com/maps?q=${q}&z=14&output=embed`;

export default function Contact() {
  return (
    <>
      {/* ===== Hero: two ways to reach us ===== */}
      <section className="relative overflow-hidden">
        <Parallax speed={-0.06} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-24 lg:pb-24 text-center">
          <Reveal y={14}><p className="font-display italic text-gold text-lg">We’d love to hear from you</p></Reveal>
          <SplitHeading delay={0.1} text="Contact us" className="font-display text-[2.8rem] sm:text-6xl lg:text-7xl leading-[1.02] mt-2" />
          <Reveal delay={0.4} y={18}>
            <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-md mx-auto">Message us a photo of what you love, or call and speak to us directly. We reply within a day.</p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <WaLink msg="Hello Bend the Trend, I'd like to get in touch." className="btn flex items-center justify-center gap-2.5 px-7 py-4 whitespace-nowrap rounded-full bg-wa text-white hover:opacity-90">
                <WaIcon size={20} />Message on WhatsApp
              </WaLink>
              <a href={TEL_HREF} className="btn flex items-center justify-center gap-2.5 px-7 py-4 whitespace-nowrap rounded-full bg-ink text-chalk hover:opacity-90">
                <PhoneIcon size={18} />Call now
              </a>
            </div>
            <p className="mt-5 text-sm text-muted"><span className="text-ink font-medium">{PHONE_DISPLAY}</span> · calls and WhatsApp</p>
          </Reveal>
        </Parallax>
      </section>

      {/* ===== Details band ===== */}
      <section className="bg-plum text-[#F6EAE6]">
        <Stagger className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-[#4A2A3A] text-center">
          <StaggerItem className="md:px-8">
            <svg className="mx-auto" width="30" height="30" fill="none" stroke="#D4AA5E" strokeWidth={1.4} viewBox="0 0 24 24" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
            <h2 className="font-display italic text-[#D4AA5E] text-lg mt-4">Call or WhatsApp</h2>
            <a href={TEL_HREF} className="block font-display text-3xl mt-2 hover:text-[#D4AA5E] transition-colors">{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`} className="inline-block mt-2 text-sm text-[#D9C3C9] hover:text-white">{EMAIL}</a>
          </StaggerItem>
          <StaggerItem className="md:px-8">
            <svg className="mx-auto" width="30" height="30" fill="none" stroke="#D4AA5E" strokeWidth={1.4} viewBox="0 0 24 24" aria-hidden><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            <h2 className="font-display italic text-[#D4AA5E] text-lg mt-4">Visit the atelier</h2>
            <address className="not-italic font-display text-3xl leading-tight mt-2">
              {ADDRESS.map((l, i) => <span key={i} className="block">{l}</span>)}
            </address>
            <a href={directions} target="_blank" rel="noopener" className="inline-block mt-2 text-sm text-[#D9C3C9] underline underline-offset-4 decoration-[#D4AA5E] hover:text-white">Get directions</a>
          </StaggerItem>
          <StaggerItem className="md:px-8">
            <svg className="mx-auto" width="30" height="30" fill="none" stroke="#D4AA5E" strokeWidth={1.4} viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <h2 className="font-display italic text-[#D4AA5E] text-lg mt-4">Opening hours</h2>
            <p className="font-display text-3xl leading-tight mt-2">Monday – Friday</p>
            <p className="mt-2 text-sm text-[#D9C3C9]">10am – 7pm · by appointment</p>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ===== Map ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal y={50} className="relative rounded-[2rem] overflow-hidden border border-line aspect-[4/5] sm:aspect-[16/8]">
          <iframe src={mapSrc} title="Map showing Bend the Trend in Mount Lavinia" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-chalk rounded-2xl p-5 shadow-[0_20px_50px_-20px_rgba(42,20,32,.45)] max-w-[260px]">
            <p className="font-display text-xl">Bend the Trend</p>
            <p className="text-sm text-muted mt-1">{ADDRESS.join(", ")}</p>
            <a href={directions} target="_blank" rel="noopener" className="btn inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-ink text-chalk text-sm hover:opacity-90">Get directions</a>
          </div>
        </Reveal>
      </section>

      {/* ===== Call to action ===== */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <Reveal y={60} className="max-w-5xl mx-auto">
          <Fabric silk="rose" depth={90} className="rounded-[2rem] sm:rounded-[2.5rem] px-6 py-14 sm:p-16 text-center text-plum">
            <h2 className="font-display text-[2.2rem] sm:text-5xl leading-[1.05]">Ready to start a piece?</h2>
            <p className="mt-4 max-w-md mx-auto leading-relaxed">Tell us your idea and we’ll arrange your consultation.</p>
            <Link href="/customise-my-outfit#book" className="btn inline-block mt-8 px-8 py-4 bg-ink text-chalk rounded-full hover:opacity-90">Book consultation</Link>
          </Fabric>
        </Reveal>
      </section>
    </>
  );
}
