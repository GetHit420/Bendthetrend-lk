import Fabric from "@/components/Fabric";
import { Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/Motion";
import { BookSection, OutfitTile } from "@/components/RequestForm";
import { Faq } from "@/components/Shared";
import { Testimonials } from "@/components/Reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { WaLink } from "@/components/Chrome";
import { PhoneIcon, Star, WaIcon } from "@/components/Icons";
import { TEL_HREF } from "@/lib/site";

const tileBase = "rounded-2xl flex items-end p-4 sm:p-6 h-full w-full";

export default async function Home() {
  const google = await getGoogleReviews();
  return (
    <>
      {/* ===== Hero (mobile first: arch, then words, then the two ways to book) ===== */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-20 lg:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Arched window composition: three arches drifting at different depths */}
          <div className="lg:col-span-6 lg:order-2 relative mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[520px] pt-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[112%] max-w-none z-10 pointer-events-none">
            <Parallax speed={0.06}>
              <svg className="hero-curve w-full" viewBox="0 0 560 300" aria-hidden>
                <path id="curve" d="M 40 290 A 240 240 0 0 1 520 290" fill="none" />
                <text fontFamily="var(--ff-display), serif" fontSize="20" fill="var(--gold)" letterSpacing=".3em">
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">bend ✦ the ✦ trend ✦ bend ✦ the ✦ trend</textPath>
                </text>
              </svg>
            </Parallax>
            </div>
            <Parallax speed={0.04}>
              <Fabric silk="crimson" src="Bridal 3.png" alt="Bride in a Bend the Trend gown" priority depth={50} sizes="(max-width: 640px) 75vw, 420px"
                className="hero-arch arch aspect-[4/5.4] w-[80%] mx-auto arch-ring flex items-end justify-center">
                <span className="ph mb-6 px-3 py-1 rounded-full bg-black/30 text-white/90 text-[11px] backdrop-blur-sm">Hero photo · your best bride</span>
              </Fabric>
            </Parallax>
            <Parallax speed={0.22} className="absolute left-0 bottom-6 w-[32%] z-[1]">
              <Fabric silk="pearl" src="hero image 2.png" alt="Saree detail" depth={24} sizes="(max-width: 640px) 32vw, 170px" className="hero-small arch aspect-[3/4] arch-ring" />
            </Parallax>
            <Parallax speed={0.34} className="absolute right-0 bottom-20 w-[28%] z-[1]">
              <Fabric silk="emerald" src="Bridal.png" alt="Occasion dress detail" depth={24} sizes="(max-width: 640px) 28vw, 150px" className="hero-small arch aspect-[3/4] arch-ring" />
            </Parallax>
          </div>

          <Parallax speed={-0.05} className="lg:col-span-6 lg:order-1 lg:pb-10 text-center lg:text-left">
            <Reveal y={16}><p className="font-display italic text-gold text-base sm:text-lg mb-4">Made to measure in Sri Lanka</p></Reveal>
            <SplitHeading delay={0.15} text="Made for you, and no one else."
              className="font-display text-[2.35rem] leading-[1.06] sm:text-6xl lg:text-[4.4rem] tracking-tight" />
            <Reveal delay={0.55} y={20}>
              <p className="mt-5 sm:mt-7 text-base sm:text-lg text-muted max-w-md mx-auto lg:mx-0 leading-relaxed">
                Bridal gowns, sarees and occasion wear, cut to your measure and finished by hand in our atelier.
              </p>
            </Reveal>
            <Reveal delay={0.7} y={20}>
              <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0 lg:flex lg:max-w-none">
                <a href={TEL_HREF} className="btn flex items-center justify-center gap-2 px-5 py-3.5 bg-ink text-chalk rounded-full hover:opacity-90">
                  <PhoneIcon size={17} /> Call us
                </a>
                <WaLink className="btn flex items-center justify-center gap-2 px-5 py-3.5 bg-wa text-white rounded-full hover:opacity-90">
                  <WaIcon size={17} detailed /> WhatsApp
                </WaLink>
              </div>
              <p className="mt-3 text-sm text-muted">to arrange your fitting</p>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* ===== What we make ===== */}
      <section id="make" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24" aria-labelledby="makeH">
        <Reveal className="max-w-2xl mb-10">
          <h2 id="makeH" className="font-display text-[2rem] sm:text-5xl leading-tight">What we make</h2>
          <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">Every piece begins with a conversation. Choose one to begin.</p>
        </Reveal>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 auto-rows-[210px] sm:auto-rows-[280px]">
          <StaggerItem className="col-span-2 row-span-2">
            <Fabric href="#bridal" silk="pearl" src="Bridal.png" alt="Bridal gown" tile depth={60} sizes="(max-width: 768px) 95vw, 620px"
              className="rounded-t-[10rem] sm:rounded-t-[16rem] flex items-end p-5 sm:p-8 text-plum h-full w-full">
              <span><span className="block font-display text-3xl sm:text-5xl">Bridal gowns</span><span className="block mt-1 text-sm opacity-80">For the walk down the aisle</span></span>
            </Fabric>
          </StaggerItem>
          <StaggerItem><OutfitTile outfit="Saree" silk="crimson" src="saress.png" alt="Saree" className={`${tileBase} text-white`}><span className="font-display text-2xl sm:text-3xl">Sarees</span></OutfitTile></StaggerItem>
          <StaggerItem><OutfitTile outfit="Statement dress" silk="noir" src="statment dress.png" alt="Statement dress" className={`${tileBase} text-white`}><span className="font-display text-2xl sm:text-3xl leading-tight">Statement dresses</span></OutfitTile></StaggerItem>
          <StaggerItem><OutfitTile outfit="Engagement dress" silk="rose" src="engagement dress.png" alt="Engagement dress" className={`${tileBase} text-plum`}><span className="font-display text-2xl sm:text-3xl leading-tight">Engagement dresses</span></OutfitTile></StaggerItem>
          <StaggerItem><OutfitTile outfit="Party dress" silk="plum" src="party dress.png" alt="Party dress" className={`${tileBase} text-white`}><span className="font-display text-2xl sm:text-3xl leading-tight">Party dresses</span></OutfitTile></StaggerItem>
          <StaggerItem className="col-span-2"><OutfitTile outfit="Kids wear" silk="lilac" src="kids wear.png" alt="Kids wear" sizes="(max-width: 768px) 95vw, 620px" className={`${tileBase} text-plum`}><span className="font-display text-2xl sm:text-3xl">Kids wear</span></OutfitTile></StaggerItem>
          <StaggerItem className="col-span-2"><OutfitTile outfit="Occasion wear" silk="emerald" src="occation dress.png" alt="Occasion wear" sizes="(max-width: 768px) 95vw, 620px" className={`${tileBase} text-white`}><span><span className="block font-display text-2xl sm:text-3xl">Occasion wear</span><span className="block text-sm text-white/80 mt-1">Homecomings, receptions and family celebrations</span></span></OutfitTile></StaggerItem>
        </Stagger>
      </section>

      {/* ===== Custom-made (everything besides bridal) ===== */}
      <section id="custom" className="bg-blush overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div className="relative max-w-md mx-auto w-full lg:max-w-none lg:order-2">
            <Reveal y={60}>
              <Fabric silk="crimson" src="statment dress.png" alt="Made-to-measure occasion dress" depth={80}
                className="arch aspect-[4/5] arch-ring flex items-center justify-center" style={{ "--chalk": "var(--blush)" } as React.CSSProperties}>
                <span className="ph px-3 py-1 rounded-full bg-black/25 text-white text-[11px] backdrop-blur-sm">Saree or dress photo</span>
              </Fabric>
            </Reveal>
            <Parallax speed={0.18} className="absolute -bottom-6 left-2 sm:left-6">
              <div className="bg-chalk border border-line rounded-2xl p-4 sm:p-5 w-52 sm:w-56 shadow-[0_20px_50px_-20px_rgba(42,20,32,.35)]">
                <p className="font-display italic text-gold">Found something you love?</p>
                <p className="text-sm mt-1 leading-relaxed">Send us the picture. We’ll make it yours.</p>
              </div>
            </Parallax>
          </div>
          <div className="lg:order-1">
            <Reveal><h2 className="font-display text-[2.2rem] sm:text-6xl leading-[1.05]">Made to your measure</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-lg">A saree for your sister’s wedding. A dress for an evening you’ll remember. We design each piece around you — your figure, your colours, your occasion — and make it only once.</p></Reveal>
            <Stagger as="ul" className="mt-8 grid gap-3">
              {["Begin with a photograph, a sketch or simply a feeling", "Measured by hand, in the atelier or by video call", "Our fabrics, or your own", "Fitted until it sits perfectly"].map((t) => (
                <StaggerItem as="li" key={t} className="flex gap-3"><span className="mt-1"><Star /></span><span>{t}</span></StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
              <a href="#book" className="btn px-6 py-3.5 bg-ink text-chalk rounded-full hover:opacity-90">Begin your piece</a>
              <a href={TEL_HREF} className="btn px-6 py-3.5 border border-ink rounded-full hover:bg-ink hover:text-chalk">Call the atelier</a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Bridal gowns ===== */}
      <section id="bridal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
        <div className="relative max-w-md mx-auto w-full lg:max-w-none">
          <Reveal y={60}>
            <Fabric silk="pearl" src="bridal 4.png" alt="Bridal gown fitting" depth={80} className="arch aspect-[4/5] arch-ring flex items-end justify-center">
              <span className="ph mb-6 px-3 py-1 rounded-full bg-black/25 text-white text-[11px] backdrop-blur-sm">Bridal gown photo</span>
            </Fabric>
          </Reveal>
          <Parallax speed={0.18} className="absolute -bottom-6 right-2 sm:right-6">
            <div className="bg-chalk border border-line rounded-2xl p-4 sm:p-5 w-52 sm:w-56 shadow-[0_20px_50px_-20px_rgba(42,20,32,.35)]">
              <p className="font-display italic text-gold">Begin early</p>
              <p className="text-sm mt-1 leading-relaxed">Allow ten to twelve weeks for your gown.</p>
            </div>
          </Parallax>
        </div>
        <div>
          <Reveal><h2 className="font-display text-[2.2rem] sm:text-6xl leading-[1.05]">Your bridal gown, from the first sketch</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-lg">One designer, from the first drawing to the morning of your wedding. We can dress your bridesmaids, flower girls and family too, so the whole day feels as one.</p></Reveal>
          <Stagger as="ul" className="mt-8 grid gap-3">
            {["A private consultation and hand-drawn sketches", "Lace, silk and beadwork, chosen together", "Three fittings and a final dressing", "Engagement, going-away and little ones’ outfits, if you wish"].map((t) => (
              <StaggerItem as="li" key={t} className="flex gap-3"><span className="mt-1"><Star /></span><span>{t}</span></StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
            <WaLink msg="Hello Bend the Trend, I'd like to enquire about a bridal gown." className="btn px-6 py-3.5 bg-sindoor text-white rounded-full hover:opacity-90">Enquire about a bridal gown</WaLink>
            <a href={TEL_HREF} className="btn px-6 py-3.5 border border-ink rounded-full hover:bg-ink hover:text-chalk">Call the atelier</a>
          </Reveal>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="process" className="bg-plum text-[#F6EAE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-12">
          <Reveal className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <h2 className="font-display text-[2rem] sm:text-5xl leading-tight">How it works</h2>
            <p className="mt-4 text-[#D9C3C9] leading-relaxed">Four quiet steps, from idea to wearing it. You’ll know the price before a single cut is made.</p>
            <a href="#book" className="btn inline-block mt-7 px-6 py-3 rounded-full bg-[#F6EAE6] text-plum hover:bg-white">Begin your piece</a>
          </Reveal>
          <Stagger as="ol" className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-[#4A2A3A] rounded-3xl overflow-hidden">
            {[
              ["Share your idea", "Send us pictures through the form below, or simply call. Tell us the occasion and the date."],
              ["Consultation", "We meet in the atelier or by video, take your measurements and settle the design and fabric. You receive your quote, and an advance secures your place."],
              ["Fittings", "Two or three, each one bringing the piece closer to you."],
              ["Ready for you", "Settle the balance and collect it from the atelier, or we’ll deliver it to you, pressed and boxed."],
            ].map(([h, p], i) => (
              <StaggerItem as="li" key={h} className="bg-plum p-6 sm:p-8">
                <span className="font-display italic text-[#D4AA5E] text-4xl sm:text-5xl">{i + 1}</span>
                <h3 className="font-display text-2xl mt-3">{h}</h3>
                <p className="mt-2 text-[#D9C3C9] leading-relaxed">{p}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <Reveal as="section" id="stories" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
        <Testimonials google={google} />
      </Reveal>

      <BookSection title="Begin your piece" />

      {/* ===== Good to know ===== */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 lg:pt-8 lg:pb-24 grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-[2rem] sm:text-5xl leading-tight">Allow enough time</h2>
          <p className="mt-3 text-muted leading-relaxed">Count back from your date. If time is short, ask us — we’ll tell you honestly what’s possible.</p>
          <Stagger as="dl" className="mt-7 divide-y divide-line border-y border-line">
            {[["Bridal gowns", "10–12 weeks"], ["Sarees", "4–8 weeks"], ["Engagement & statement dresses", "4–6 weeks"], ["Party & occasion wear", "3–4 weeks"], ["Kids wear", "2–3 weeks"]].map(([k, v]) => (
              <StaggerItem key={k} className="py-4 flex justify-between gap-4"><dt>{k}</dt><dd className="font-display text-lg">{v}</dd></StaggerItem>
            ))}
          </Stagger>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <h2 className="font-display text-[2rem] sm:text-5xl leading-tight">Before you begin</h2>
          <Faq items={[
            { q: "Do you have ready-made pieces?", a: "No. Everything is made to order, for one person." },
            { q: "How is each piece priced?", a: "On its fabric, embroidery and the hours it takes to make. Share your budget and we’ll design within it. Your quote is fixed before we begin." },
            { q: "May I bring my own fabric?", a: "Of course. Bring it to your consultation. We’re also happy to source it for you." },
            { q: "Can you make something from a photograph?", a: "Yes. We take it as a starting point and adapt it to your figure, colours and budget." },
            { q: "I live abroad. Is that possible?", a: "Yes. We measure you over a video call and send the finished piece to you." },
            { q: "What do I pay upfront?", a: "An advance once the design and quote are agreed. The balance before collection or delivery." },
          ]} />
        </Reveal>
      </section>
    </>
  );
}

