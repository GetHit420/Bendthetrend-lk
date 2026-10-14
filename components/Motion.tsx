"use client";

import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const EASE = [0.2, 0.7, 0.1, 1] as const;

const tags = {
  div: motion.div, li: motion.li, ol: motion.ol, ul: motion.ul, article: motion.article,
  section: motion.section, p: motion.p, h1: motion.h1, h2: motion.h2, figure: motion.figure,
  span: motion.span, dl: motion.dl,
};
type Tag = keyof typeof tags;

type RevealProps = {
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
  children?: React.ReactNode;
  id?: string;
};

/** Fades and lifts its contents into place the first time they scroll into view. */
export function Reveal({ as = "div", className, style, delay = 0, y = 36, children, id }: RevealProps) {
  const M = tags[as];
  return (
    <M
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

/** A grid or list whose children arrive one after another. Use <StaggerItem> for each child. */
export function Stagger({ as = "div", className, children, id }: Omit<RevealProps, "delay" | "y">) {
  const M = tags[as];
  return (
    <M id={id} className={className} variants={group} initial="hidden" whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {children}
    </M>
  );
}
export function StaggerItem({ as = "div", className, style, children }: Omit<RevealProps, "delay" | "y">) {
  const M = tags[as];
  return <M className={className} style={style} variants={item}>{children}</M>;
};

/** Moves its contents at a different speed to the page. Positive speed lags behind, negative runs ahead. */
export function Parallax({ speed = 0.15, className, style, children }: {
  speed?: number; className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 300, -speed * 300]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}

/** The thin gold line under the header that fills as you read down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 right-0 -bottom-px h-[2px] origin-left bg-gold"
      style={{ scaleX }}
    />
  );
}

/** Large heading words that rise in, one after another. */
export function SplitHeading({ text, as = "h1", className, delay = 0 }: {
  text: string; as?: "h1" | "h2"; className?: string; delay?: number;
}) {
  const M = tags[as];
  const words = text.split(" ");
  return (
    <M className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </M>
  );
}
