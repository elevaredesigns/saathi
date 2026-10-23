"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { LivePhone } from "../LivePhone";

export function Closing() {
  const t = useTranslations("site.closing");

  return (
    <section className="px-5 py-24 sm:px-8 md:py-32">
      <div className="relative mx-auto grid max-w-page items-center gap-12 overflow-hidden rounded-[40px] bg-surface p-8 md:grid-cols-[1.1fr_0.9fr] md:p-16">
        <KolamField cols={10} rows={6} cell={64} seed={2047} density={0.6} className="pointer-events-none absolute -bottom-24 -left-24 h-[420px] w-[700px] text-navy-600/[0.07]" />
        <div className="relative">
          <SaathiMark size={56} draw />
          <TextReveal as="h2" text={t("title")} className="mt-6 text-display-xl text-ink" />
          <Reveal>
            <p className="mt-6 max-w-lg text-[19px] leading-relaxed text-ink-2">{t("body")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/prototype/"
                className="inline-flex h-14 items-center rounded-full bg-navy-600 px-7 text-[17px] font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-navy-700 active:scale-[0.97]"
              >
                {t("primary")}
              </Link>
              <Link
                href="/case-study/"
                className="inline-flex h-14 items-center rounded-full bg-white px-6 text-[17px] font-semibold text-ink ring-1 ring-inset ring-line-strong transition-[transform,background-color] duration-150 hover:bg-surface2 active:scale-[0.97]"
              >
                {t("secondary")}
              </Link>
            </div>
            <Link href="/system/" className="mt-6 inline-block text-[15px] font-medium text-navy-600 underline-offset-4 hover:underline">
              {t("system")}
            </Link>
          </Reveal>
        </div>
        <div className="relative hidden md:block">
          <LivePhone src="/prototype/saathi/" scale={0.6} title="Saathi AI in the prototype" />
        </div>
      </div>
    </section>
  );
}
