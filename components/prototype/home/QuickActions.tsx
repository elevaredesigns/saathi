"use client";

import { CurrencyInr, FilePlus, Lifebuoy, Wallet, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const ACTIONS: { key: "apply" | "pay" | "documents" | "help"; icon: Icon; tone: TileTone; href: string }[] = [
  { key: "apply", icon: FilePlus, tone: "navy", href: "/prototype/explore/?tab=services" },
  { key: "pay", icon: CurrencyInr, tone: "saffron", href: "/prototype/service/?id=taxes" },
  { key: "documents", icon: Wallet, tone: "green", href: "/prototype/me/#wallet" },
  { key: "help", icon: Lifebuoy, tone: "violet", href: "/prototype/saathi/?q=help" },
];

/** Four one-tap starts. Every one lands somewhere real. */
export function QuickActions() {
  const t = useTranslations("home.quick");
  const router = useAppRouter();
  return (
    <div className="grid grid-cols-4 gap-2 px-5">
      {ACTIONS.map((a) => (
        <button
          key={a.key}
          type="button"
          onClick={() => router.push(a.href)}
          className="group flex min-w-0 flex-col items-center gap-2 rounded-[18px] py-2 transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <IconTile icon={a.icon} tone={a.tone} size="lg" />
          <span className="max-w-full text-center text-[12.5px] font-semibold leading-tight text-ink-2">{t(a.key)}</span>
        </button>
      ))}
    </div>
  );
}
