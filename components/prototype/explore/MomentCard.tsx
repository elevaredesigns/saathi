"use client";

import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { KolamField } from "@/components/system/imagery/KolamField";
import { IconTile } from "@/components/system/ui/IconTile";
import { loc, type LifeMoment } from "@/lib/mockData";

export function MomentCard({ moment, onClick }: { moment: LifeMoment; onClick?: () => void }) {
  const { locale } = useLocaleSwitch();
  const t = useTranslations("explore");
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-[148px] flex-col justify-between overflow-hidden rounded-[22px] bg-white p-4 text-left ring-1 ring-line transition-transform duration-150 ease-out active:scale-[0.97]"
    >
      <KolamField
        cols={3}
        rows={3}
        cell={26}
        seed={moment.id.length * 7}
        density={0.6}
        className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-ink/[0.06]"
      />
      <IconTile icon={moment.icon} tone={moment.tone} size="md" className="relative" />
      <span className="relative">
        <span className="block text-[15.5px] font-semibold leading-snug text-ink">{loc(moment.name, locale)}</span>
        <span className="mt-0.5 block text-[12px] text-ink-3">
          {t("momentCount", { services: moment.services.length, schemes: moment.schemes.length })}
        </span>
      </span>
    </button>
  );
}
