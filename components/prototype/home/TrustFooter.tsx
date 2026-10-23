"use client";

import { ArrowRight, Eye, LockKey, SealCheck, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const POINTS: { key: "encrypted" | "official" | "control"; icon: Icon }[] = [
  { key: "encrypted", icon: LockKey },
  { key: "official", icon: SealCheck },
  { key: "control", icon: Eye },
];

/** Quiet trust signals at the end of Home, with a way to act on them. */
export function TrustFooter() {
  const t = useTranslations("home.trust");
  const router = useAppRouter();
  return (
    <div className="mx-5 rounded-[22px] bg-surface p-4">
      <ul className="grid grid-cols-3 gap-2">
        {POINTS.map(({ key, icon: Glyph }) => (
          <li key={key} className="flex flex-col items-center gap-1.5 text-center">
            <Glyph size={20} weight="duotone" className="text-navy-600" />
            <span className="text-[11.5px] font-medium leading-tight text-ink-2">{t(key)}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => router.push("/prototype/privacy/")}
        className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-[14px] bg-white py-2.5 text-[14px] font-semibold text-navy-600 ring-1 ring-line transition-transform duration-150 active:scale-[0.98]"
      >
        {t("privacy")}
        <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  );
}
