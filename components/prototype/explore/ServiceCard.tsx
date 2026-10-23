"use client";

import { CaretRight } from "@phosphor-icons/react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { IconTile } from "@/components/system/ui/IconTile";
import { loc, type Service } from "@/lib/mockData";

/** Service as a list row (scannable, GOV.UK-clear) or a compact tile. */
export function ServiceCard({ service, onClick, compact = false }: { service: Service; onClick?: () => void; compact?: boolean }) {
  const { locale } = useLocaleSwitch();

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center gap-2 rounded-[18px] bg-white px-2 py-3.5 text-center ring-1 ring-line transition-transform duration-150 active:scale-[0.96]"
      >
        <IconTile icon={service.icon} tone={service.tone} size="md" />
        <span className="text-[12.5px] font-semibold leading-tight text-ink">{loc(service.name, locale)}</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 active:bg-surface">
      <IconTile icon={service.icon} tone={service.tone} size="md" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold text-ink">{loc(service.name, locale)}</span>
        <span className="block truncate text-[13px] text-ink-3">{loc(service.blurb, locale)}</span>
      </span>
      <CaretRight size={16} weight="bold" className="shrink-0 text-ink-4" />
    </button>
  );
}
