"use client";

import { Check, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SCHEME_VISUAL } from "@/components/prototype/home/SchemeRail";
import { IconTile } from "@/components/system/ui/IconTile";
import { loc, type Scheme } from "@/lib/mockData";
import { formatINRCompact } from "@/lib/utils/currency";

export function SchemeCard({ scheme, onClick, matched = false }: { scheme: Scheme; onClick?: () => void; matched?: boolean }) {
  const { locale } = useLocaleSwitch();
  const t = useTranslations("explore");
  const v = scheme.id === "pmkisan" ? SCHEME_VISUAL.farming : SCHEME_VISUAL[scheme.category] ?? SCHEME_VISUAL.money;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[22px] bg-white p-4 text-left ring-1 ring-line transition-transform duration-150 ease-out active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <IconTile icon={v.icon} tone={v.tone} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[16px] font-semibold text-ink">{loc(scheme.name, locale)}</p>
            {matched && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10.5px] font-bold text-violet-600">
                <Sparkle size={10} weight="fill" />
                {t("forYouShort")}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13.5px] leading-snug text-ink-3">{loc(scheme.desc, locale)}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[17px] font-semibold tabular-nums tracking-[-0.01em] text-ink">
            {scheme.benefit != null ? formatINRCompact(scheme.benefit) : "—"}
          </p>
          <p className="text-[11.5px] text-ink-3">{loc(scheme.benefitNote, locale)}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 pl-[56px]">
        {scheme.eligibility.map((e, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-[3px] text-[11.5px] font-medium text-green-800">
            <Check size={10} weight="bold" />
            {loc(e, locale)}
          </span>
        ))}
      </div>
    </button>
  );
}
