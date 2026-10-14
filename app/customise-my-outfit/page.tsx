import type { Metadata } from "next";
import Fabric from "@/components/Fabric";
import { Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/Motion";
import { BookSection, OutfitTile } from "@/components/RequestForm";
import { Faq } from "@/components/Shared";
import { WaLink } from "@/components/Chrome";
import { Star } from "@/components/Icons";
import { OutfitMore } from "@/components/OutfitMore";

export const metadata: Metadata = {
  title: "Customise My Outfit",
  description: "Customise your outfit with Bend the Trend. Send a photo, and we design and make it to your measurements.",
};

const tile = "rounded-2xl flex items-end p-4 sm:p-6 h-full w-full";
const H2 = "font-display text-[2rem] sm:text-5xl leading-tight";

const TILES = [
  { outfit: "Bridal gown", silk: "pearl", src: "bridal 1.png", time: "10–12 weeks", text: "text-plum" },
  { outfit: "Saree", silk: "crimson", src: "saress.png", time: "4–8 weeks", text: "text-white" },
  { outfit: "Statement dress", silk: "noir", src: "statment dress.png", time: "4–6 weeks", text: "text-white" },
  { outfit: "Engagement dress", silk: "rose", src: "engagement dress.png", time: "4–6 weeks", text: "text-plum" },
  { outfit: "Party dress", silk: "plum", src: "party dress.png", time: "3–4 weeks", text: "text-white" },
  { outfit: "Occasion wear", silk: "emerald", src: "occation dress.png", time: "3–4 weeks", text: "text-white" },
  { outfit: "Kids wear", silk: "lilac", src: "kids wear.png", time: "2–3 weeks", text: "text-plum" },
] as const;

export default function Customise() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Parallax speed={-0.05} className="order-2 lg:order-1 text-center lg:text-left">
            <SplitHeading text="Your idea, made to fit you." className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.02]" />
            <Reveal delay={0.45} y={20}>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-md mx-auto lg:mx-0">Send us a photo you love. We’ll design it with you and make it to your measurements.</p>
              <a href="#book" className="btn inline-block mt-8 px-8 py-4 bg-ink text-chalk rounded-full hover:opacity-90">Start my design</a>
              <p className="mt-4 text-sm text-muted">or <WaLink msg="Hello Bend the Trend, I'd like to customise an outfit." className="text-ink underline underline-offset-4 decoration-gold">send a photo on WhatsApp</WaLink></p>
            </Reveal>
          </Parallax>
          <Parallax speed={0.06} className="order-1 lg:order-2 max-w-sm lg:max-w-md mx-auto w-full">
            <Fabric silk="emerald" src="2 bridal.png" alt="A customised party dress with ruffled shoulders" priority depth={60} sizes="(max-width: 640px) 90vw, 448px"
              className="hero-arch arch aspect-[4/5] arch-ring" />
          </Parallax>
        </div>
      </section>

      {/* ===== Three ways to start ===== */}
      <section id="start" className="bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Reveal className="max-w-2xl">
            <h2 className={H2}>Three ways to begin</h2>
            <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">Start with whatever you have.</p>
          </Reveal>
          <Stagger className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              ["i.", "From a photo", "A screenshot from Instagram or Pinterest. We adapt it to you."],
              ["ii.", "From an idea", "No picture? Tell us the occasion and colours. We’ll sketch it for you."],
              ["iii.", "From fabric you own", "Silk you’ve saved, or an old saree made into something new."],
            ].map(([n, h, p]) => (
              <StaggerItem as="article" key={h} className="bg-chalk rounded-3xl p-7 sm:p-8 border border-line transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(42,20,32,.4)]">
                <span className="font-display italic text-gold text-4xl">{n}</span>
                <h3 className="font-display text-2xl mt-3">{h}</h3>
                <p className="mt-3 text-muted leading-relaxed">{p}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10"><a href="#book" className="btn inline-block px-7 py-3.5 bg-ink text-chalk rounded-full hover:opacity-90">Start my design</a></Reveal>
        </div>
      </section>

      {/* ===== What you can customise ===== */}
      <section id="options" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <Reveal>
          <h2 className={H2}>Change anything you like</h2>
          <p className="mt-3 text-muted text-base sm:text-lg">We decide these together at your consultation.</p>
        </Reveal>
        <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-3xl overflow-hidden text-left">
          {[
            ["Fabric & colour", "Any fabric, in the exact shade you want."],
            ["Neckline", "High, round, square, boat or sweetheart."],
            ["Sleeves & coverage", "Sleeveless to full length, with modest options."],
            ["Embroidery", "Beads, pearls and handwork, as much as you like."],
            ["Shape & length", "A-line, ball gown, anarkali or saree drape."],
            ["Extras", "Matching dupatta, veil, hijab or family outfits."],
          ].map(([h, p]) => (
            <StaggerItem key={h} className="bg-chalk p-6 sm:p-7"><h3 className="font-display text-2xl">{h}</h3><p className="mt-1.5 text-muted">{p}</p></StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10"><a href="#book" className="btn inline-block px-7 py-3.5 bg-ink text-chalk rounded-full hover:opacity-90">Tell us your idea</a></Reveal>
      </section>

      {/* ===== Choose what to make ===== */}
      <section id="make" className="bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Reveal className="max-w-2xl mb-10">
            <h2 className={H2}>What would you like made?</h2>
            <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">Choose one and we’ll take you to the form with it already filled in.</p>
          </Reveal>
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 auto-rows-[230px] sm:auto-rows-[300px]">
            {TILES.map((t) => (
              <StaggerItem key={t.outfit}>
                <OutfitTile outfit={t.outfit} silk={t.silk} src={t.src} alt={t.outfit} className={`${tile} ${t.text}`}>
                  <span><span className="block font-display text-2xl sm:text-3xl leading-tight">{t.outfit}</span><span className="block text-sm mt-1 opacity-80">{t.time}</span></span>
                </OutfitTile>
              </StaggerItem>
            ))}
            <StaggerItem>
              <OutfitMore />
            </StaggerItem>
          </Stagger>
          <Reveal><p className="mt-6 text-sm text-muted">Times are a guide, counted from your consultation. Short on time? Ask us — we’ll tell you honestly what’s possible.</p></Reveal>
        </div>
      </section>

      {/* ===== The process, step by step ===== */}
      <section id="process" className="bg-plum text-[#F6EAE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <Reveal className="max-w-2xl">
            <h2 className={H2}>From idea to wearing it</h2>
            <p className="mt-4 text-[#D9C3C9] leading-relaxed">One designer with you the whole way.</p>
          </Reveal>
          <Stagger as="ol" className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#4A2A3A] rounded-3xl overflow-hidden">
            {[
              ["Share your idea", "Send photos through the form or WhatsApp."],
              ["Consultation & sketch", "In the atelier or by video. We sketch your design."],
              ["Quote & advance", "A fixed price. An advance secures your place."],
              ["Measurements", "By hand, or guided over video if you’re away."],
              ["Fittings", "Two or three, until it sits perfectly."],
              ["Ready for you", "Collect it, or we’ll deliver it pressed and boxed."],
            ].map(([h, p], i) => (
              <StaggerItem as="li" key={h} className="bg-plum p-6 sm:p-8">
                <span className="font-display italic text-[#D4AA5E] text-4xl sm:text-5xl">{i + 1}</span>
                <h3 className="font-display text-2xl mt-3">{h}</h3>
                <p className="mt-2 text-[#D9C3C9] leading-relaxed">{p}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10"><a href="#book" className="btn inline-block px-7 py-3.5 rounded-full bg-[#D4AA5E] text-plum font-medium hover:bg-[#E2BC73]">Start step one</a></Reveal>
        </div>
      </section>

      {/* ===== Fittings: in person or from abroad ===== */}
      <section id="fittings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className={H2}>Wherever you are</h2>
          <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">Visit us in Sri Lanka, or have your outfit made from anywhere in the world.</p>
        </Reveal>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <Reveal>
            <Fabric silk="rose" depth={70} className="rounded-3xl p-7 sm:p-10 text-plum h-full">
              <h3 className="font-display text-3xl">In the atelier</h3>
              <ul className="mt-5 grid gap-3">
                {["See and feel fabrics and embroidery samples", "Measured by hand by the person making your outfit", "Try each stage on at your fittings", "By appointment, Tuesday to Sunday, 10am–7pm"].map((t) => (
                  <li key={t} className="flex gap-3"><Star />{t}</li>
                ))}
              </ul>
            </Fabric>
          </Reveal>
          <Reveal delay={0.12}>
            <Fabric silk="plum" depth={70} className="rounded-3xl p-7 sm:p-10 text-[#F6EAE6] h-full">
              <h3 className="font-display text-3xl">From overseas</h3>
              <ul className="mt-5 grid gap-3">
                {["Consultation and design over video call", "We guide a friend or family member through each measurement", "Photos and videos of your outfit at every stage", "Sent to you, or ready to collect when you arrive"].map((t) => (
                  <li key={t} className="flex gap-3"><Star className="text-[#D4AA5E]" />{t}</li>
                ))}
              </ul>
            </Fabric>
          </Reveal>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <h2 className={H2}>How pricing works</h2>
            <p className="mt-4 text-muted text-base sm:text-lg leading-relaxed">Tell us your budget and we’ll design within it. The price is fixed before we begin.</p>
          </Reveal>
          <Stagger className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            <StaggerItem className="bg-chalk rounded-3xl p-6 sm:p-8 border border-line">
              <h3 className="font-display text-2xl">What shapes the price</h3>
              <ul className="mt-4 grid gap-2.5 text-muted">
                {["The fabric and how much is needed", "Amount of embroidery and beadwork", "Hours of handwork to make it", "Extras like a veil, dupatta or hijab"].map((t) => (
                  <li key={t} className="flex gap-3"><Star />{t}</li>
                ))}
              </ul>
            </StaggerItem>
            <StaggerItem className="bg-chalk rounded-3xl p-6 sm:p-8 border border-line">
              <h3 className="font-display text-2xl">How you pay</h3>
              <ol className="mt-4 grid gap-2.5 text-muted">
                {["Your quote is fixed once the design is agreed", "An advance secures your place", "The balance before collection or delivery"].map((t, i) => (
                  <li key={t} className="flex gap-3"><span className="font-display italic text-gold">{i + 1}</span>{t}</li>
                ))}
              </ol>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <div className="pt-16 lg:pt-24" />
      <BookSection title="Start your design" />

      {/* ===== Questions ===== */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 lg:pt-8 lg:pb-24">
        <Reveal>
          <h2 className={H2}>Questions</h2>
          <Faq items={[
            { q: "Can you make it from a photo?", a: "Yes. We use it as the starting point and make it in your fit and colours." },
            { q: "Can you remake an old saree?", a: "Often, yes. Bring it along and we’ll tell you honestly what it can become." },
            { q: "Do you make modest and hijab-friendly outfits?", a: "Yes. High necks, full sleeves, linings and matching hijabs." },
            { q: "I need it quickly. Can you help?", a: "Tell us your date in the form and we’ll let you know what’s possible." },
            { q: "May I bring my own fabric?", a: "Of course. We’re also happy to source it for you." },
          ]} />
          <p className="mt-8 text-muted">Something else? <WaLink msg="Hello Bend the Trend, I have a question about customising an outfit." className="text-ink underline underline-offset-4 decoration-gold">Ask us on WhatsApp</WaLink>.</p>
        </Reveal>
      </section>
    </>
  );
}

