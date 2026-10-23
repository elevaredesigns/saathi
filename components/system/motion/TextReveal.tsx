"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";
import { duration, ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div } as const;

interface TextRevealProps {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Words (exact match, punctuation-insensitive) to render in the editorial serif accent. */
  accent?: string[];
  accentClassName?: string;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
}

const bare = (w: string) => w.replace(/[.,!?;:"'“”‘’()]/g, "").toLowerCase();

/**
 * Headline that rises word by word from behind a mask.
 * Splits on spaces only, so Devanagari / Bengali / Tamil conjuncts never break.
 * Screen readers get the whole sentence once — as the heading's label, or as visually hidden text.
 */
export function TextReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  accent = [],
  accentClassName = "font-serif italic font-normal tracking-normal",
  immediate = false,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  const words = text.split(" ");
  const isHeading = as.startsWith("h");
  const accentSet = new Set(accent.map(bare));

  const trigger = immediate
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount: 0.5 } };

  return (
    <Tag
      // Headings may carry a label; paragraphs may not, so they get hidden text instead.
      aria-label={isHeading ? text : undefined}
      className={className}
      {...trigger}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } } }}
    >
      {!isHeading && <span className="sr-only">{text}</span>}
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span aria-hidden className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              data-reveal
              className={cn("inline-block will-change-transform", accentSet.has(bare(word)) && accentClassName)}
              style={{ "--d": `${delay + i * stagger}s` } as React.CSSProperties}
              variants={
                reduce
                  ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
                  : {
                      hidden: { transform: "translateY(105%)", opacity: 0 },
                      shown: { transform: "translateY(0%)", opacity: 1 },
                    }
              }
              transition={{ duration: reduce ? duration.fast : duration.cinematic, ease: ease.cinematic }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
