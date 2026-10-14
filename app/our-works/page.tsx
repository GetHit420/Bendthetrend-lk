import type { Metadata } from "next";
import Link from "next/link";
import Fabric from "@/components/Fabric";
import WorksGallery from "@/components/WorksGallery";
import { Reveal, SplitHeading } from "@/components/Motion";
import { ReviewCards } from "@/components/Reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { WaLink } from "@/components/Chrome";
import { WaIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Our Works",
  description: "See bridal gowns, sarees and occasion wear designed and made to measure by Bend the Trend in Sri Lanka.",
};

export default async function OurWorks() {
  const google = await getGoogleReviews();
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pt-12 lg:pt-20 text-center">
          <SplitHeading text="Our works" className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.02]" />
          <Reveal delay={0.3} y={18}>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">Each piece here was designed and made for one person. Tap any piece to see the details, or to ask for something like it.</p>
          </Reveal>
        </section>
        <WorksGallery />
      </div>

      {/* ===== In their words ===== */}
      <section className="bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Reveal><h2 className="font-display text-[2rem] sm:text-5xl leading-tight text-center">In their words</h2></Reveal>
          <ReviewCards google={google} />
        </div>
      </section>

      {/* ===== Call to action ===== */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal y={60} className="max-w-5xl mx-auto">
          <Fabric silk="plum" depth={90} className="rounded-[2rem] sm:rounded-[2.5rem] px-6 py-14 sm:p-16 text-center text-[#F6EAE6]">
            <h2 className="font-display text-[2.2rem] sm:text-5xl leading-[1.05]">Yours could be next</h2>
            <p className="mt-4 text-[#E3CFD5] max-w-md mx-auto leading-relaxed">Send us a photo of what you love. We’ll design it with you and make it to your measurements.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/customise-my-outfit#book" className="btn px-8 py-4 rounded-full bg-[#D4AA5E] text-plum font-medium hover:bg-[#E2BC73]">Start my design</Link>
              <WaLink className="btn inline-flex items-center gap-2 px-8 py-4 rounded-full bg-wa text-white hover:opacity-90"><WaIcon />WhatsApp</WaLink>
            </div>
          </Fabric>
        </Reveal>
      </section>
    </>
  );
}
