"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { TricolourRule } from "@/components/system/brand/TricolourRule";

export function SiteFooter() {
  const t = useTranslations("site.footer");
  const sources = t.raw("sources") as { label: string; url: string }[];

  return (
    <footer className="mt-10">
      <TricolourRule dot={false} />
      <div className="mx-auto grid max-w-page gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <SaathiMark size={40} />
            <span className="font-wordmark text-[36px] leading-none text-ink">साथी</span>
          </div>
          <p className="mt-4 max-w-xs text-[17px] font-medium leading-snug text-ink">{t("tagline")}</p>
          <p className="mt-2 text-[14px] text-ink-3">{t("credit")}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2.5 text-[15px]">
          <Link href="/prototype/" className="text-ink-2 hover:text-ink">
            {t("links.prototype")}
          </Link>
          <Link href="/case-study/" className="text-ink-2 hover:text-ink">
            {t("links.caseStudy")}
          </Link>
          <Link href="/system/" className="text-ink-2 hover:text-ink">
            {t("links.system")}
          </Link>
          <a href="https://krishom.me/" target="_blank" rel="noreferrer" className="text-ink-2 hover:text-ink">
            {t("links.portfolio")}
          </a>
        </nav>

        <div id="sources" className="scroll-mt-28">
          <p className="text-[15px] font-semibold text-ink">{t("sourcesTitle")}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13.5px] leading-snug text-ink-3 marker:text-ink-3">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-2 hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-page px-5 py-6 text-[13px] leading-relaxed text-ink-3 sm:px-8">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}
