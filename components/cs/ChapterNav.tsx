"use client";

import { motion, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { CHAPTERS, type ChapterId } from "./Chapter";

/** Sticky contents list that follows the reader and shows reading progress. */
export function ChapterNav() {
  const t = useTranslations("caseStudy.cs");
  const [active, setActive] = useState<ChapterId>("overview");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const sections = CHAPTERS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as ChapterId);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label={t("contents")} className="sticky top-28">
      <p className="text-[14px] font-semibold text-ink">{t("contents")}</p>
      <div className="relative mt-4 pl-4">
        <div className="absolute bottom-0 left-0 top-0 w-[2px] rounded-full bg-surface2">
          <motion.div style={{ scaleY: scrollYProgress }} className="h-full w-full origin-top rounded-full bg-navy-600" />
        </div>
        <ol className="space-y-0.5">
          {CHAPTERS.map((id, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "flex items-baseline gap-2.5 rounded-[8px] py-1.5 text-[14px] transition-colors duration-150",
                  active === id ? "font-semibold text-ink" : "text-ink-3 hover:text-ink",
                )}
              >
                <span className="w-5 text-right text-[12px] tabular-nums text-ink-4">{i + 1}</span>
                {t(`chapters.${id}`)}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
