"use client";

import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { GovStrip } from "@/components/system/brand/GovStrip";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { TricolourRule } from "@/components/system/brand/TricolourRule";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { AccessibilityMenu } from "./AccessibilityMenu";
import { LanguageMenu } from "./LanguageMenu";

const LINKS = [
  { key: "vision", href: "/#vision" },
  { key: "ai", href: "/#ai" },
  { key: "pillars", href: "/#pillars" },
  { key: "languages", href: "/#languages" },
  { key: "trust", href: "/#trust" },
  { key: "departments", href: "/#departments" },
  { key: "scale", href: "/#scale" },
  { key: "caseStudy", href: "/case-study/" },
] as const;

export function SiteHeader() {
  const t = useTranslations("site.nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t("skip")}
      </a>
      <GovStrip />
      <header className={cn("sticky top-0 z-40 transition-[background-color,box-shadow] duration-300", scrolled ? "bg-white/80 shadow-[0_1px_0_rgba(11,13,20,0.06)] backdrop-blur-xl backdrop-saturate-150" : "bg-white")}>
        <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <SaathiMark size={30} />
            <span className="font-wordmark text-[26px] leading-none text-ink">साथी</span>
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <Link key={l.key} href={l.href} className="rounded-full px-3 py-2 text-[14.5px] font-medium text-ink-2 transition-colors duration-150 hover:bg-surface hover:text-ink">
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageMenu />
            <AccessibilityMenu />
            <Link
              href="/prototype/"
              className="hidden h-9 items-center rounded-full bg-navy-600 px-4 text-[14px] font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-navy-700 active:scale-[0.97] sm:inline-flex"
            >
              {t("prototype")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("menu")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-line lg:hidden"
            >
              <List size={19} weight="bold" />
            </button>
          </div>
        </div>
        <TricolourRule dot={false} className={cn("transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")} />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="flex items-center gap-2.5">
                <SaathiMark size={30} />
                <span className="font-wordmark text-[26px] leading-none text-ink">साथी</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("closeMenu")} className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ring-line">
                <X size={18} weight="bold" />
              </button>
            </div>
            <nav aria-label="Mobile" className="px-5 pt-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ opacity: 0, transform: "translateY(12px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ duration: 0.4, ease: ease.cinematic, delay: 0.04 * i }}
                >
                  <Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-line py-4 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
              <Link href="/prototype/" onClick={() => setOpen(false)} className="mt-8 flex h-14 items-center justify-center rounded-full bg-navy-600 text-[17px] font-semibold text-white">
                {t("prototype")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
