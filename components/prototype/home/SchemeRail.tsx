"use client";

import { Check, FirstAidKit, GraduationCap, House, Plant, Storefront, Wallet, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { loc, type Scheme } from "@/lib/mockData";
import { formatINRCompact } from "@/lib/utils/currency";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

export const SCHEME_VISUAL: Record<string, { icon: Icon; tone: TileTone }> = {
  money: { icon: Wallet, tone: "teal" },
  health: { icon: FirstAidKit, tone: "green" },
  land: { icon: House, tone: "saffron" },
  education: { icon: GraduationCap, tone: "violet" },
  employment: { icon: Storefront, tone: "navy" },
  farming: { icon: Plant, tone: "green" },
};

/** Horizontal "For you" cards: what you may get, and why it matches you. */
export function SchemeRail({ schemes }: { schemes: Scheme[] }) {
  const t = useTranslations("home");
  const router = useAppRouter();
  const { locale } = useLocaleSwitch();

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scroll-padding-inline:20px]">
      {schemes.map((s) => {
        const v = s.id === "pmkisan" ? SCHEME_VISUAL.farming : SCHEME_VISUAL[s.category] ?? SCHEME_VISUAL.money;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => router.push(`/prototype/scheme/?id=${s.id}`)}
            className="flex w-[228px] shrink-0 snap-start flex-col rounded-[22px] bg-white p-4 text-left ring-1 ring-line transition-transform duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <IconTile icon={v.icon} tone={v.tone} size="sm" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{t("forYouBadge")}</span>
            </div>
            <p className="mt-3 text-[16px] font-semibold leading-snug text-ink">{loc(s.name, locale)}</p>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-3">{loc(s.desc, locale)}</p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-ink">
                {s.benefit != null ? formatINRCompact(s.benefit) : t("savings")}
              </span>
              <span className="text-[12px] text-ink-3">{loc(s.benefitNote, locale)}</span>
            </div>
            <ul className="mt-2.5 space-y-1">
              {s.eligibility.slice(0, 2).map((e, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[12.5px] text-green-800">
                  <Check size={12} weight="bold" className="shrink-0 text-green-600" />
                  <span className="truncate">{loc(e, locale)}</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
