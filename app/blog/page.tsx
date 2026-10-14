import type { Metadata } from "next";
import Link from "next/link";
import Fabric, { type Silk } from "@/components/Fabric";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, style ideas and behind-the-scenes notes from the Bend the Trend atelier in Sri Lanka.",
};

// ============ YOUR BLOG POSTS — add a post by copying the example below ============
// Put the cover photo in /public/images. "link" is the page for the full post.
// Newest first. Until there are 6 posts, the leftover spaces show "Coming soon".
const POSTS: { title: string; date: string; category: string; excerpt: string; image?: string; silk?: Silk; link: string }[] = [
  // { title: "Post title", date: "12 October 2026", category: "Bridal",
  //   excerpt: "One or two sentences about the post.",
  //   image: "Bridal.png", silk: "rose", link: "/blog/post-name" },
];

const SPACES = 6; // how many spaces to keep on the page
const SILKS: Silk[] = ["rose", "plum", "emerald", "crimson", "pearl", "noir"];

export default function Blog() {
  const empty = Math.max(0, SPACES - POSTS.length);
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 lg:pt-20 lg:pb-14 text-center">
        <SplitHeading text="Blog" className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.02]" />
        <Reveal delay={0.25} y={18}>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">Style ideas, wedding planning tips and stories from the atelier.</p>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <Stagger as="ul" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {POSTS.map((p) => (
            <StaggerItem as="li" key={p.link}>
              <Link href={p.link} className="group block">
                <Fabric silk={p.silk || "rose"} src={p.image} className="rounded-3xl aspect-[4/3] transition-transform duration-700 group-hover:-translate-y-1" />
                <p className="mt-5 text-sm text-muted"><span className="font-display italic text-gold">{p.category}</span> · {p.date}</p>
                <h2 className="font-display text-2xl leading-tight mt-1.5 group-hover:text-gold transition-colors">{p.title}</h2>
                <p className="mt-2 text-muted leading-relaxed">{p.excerpt}</p>
              </Link>
            </StaggerItem>
          ))}
          {Array.from({ length: empty }, (_, i) => (
            <StaggerItem as="li" key={`soon-${i}`}>
              <div aria-hidden>
                <Fabric silk={SILKS[i % SILKS.length]} className="rounded-3xl aspect-[4/3] flex items-center justify-center">
                  <span className="relative px-4 py-1.5 rounded-full bg-chalk text-sm font-display italic text-gold shadow-xs">Coming soon</span>
                </Fabric>
                <div className="mt-5 h-3 w-24 rounded-full bg-line" />
                <div className="mt-3 h-5 w-4/5 rounded-full bg-line" />
                <div className="mt-3 h-3 w-full rounded-full bg-line opacity-60" />
                <div className="mt-2 h-3 w-2/3 rounded-full bg-line opacity-60" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-16 text-center">
          <p className="text-muted">While you wait for our stories, see what we’ve made or start your own piece.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/our-works" className="btn px-7 py-3.5 border border-ink rounded-full hover:bg-ink hover:text-chalk">See our works</Link>
            <Link href="/customise-my-outfit#book" className="btn px-7 py-3.5 bg-ink text-chalk rounded-full hover:opacity-90">Start my design</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
