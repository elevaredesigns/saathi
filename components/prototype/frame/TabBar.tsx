"use client";

import { Compass, House, ListChecks, UserCircle, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { spring } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type TabKey = "home" | "explore" | "saathi" | "track" | "me";

const SIDE_TABS: { key: Exclude<TabKey, "saathi">; icon: Icon }[] = [
  { key: "home", icon: House },
  { key: "explore", icon: Compass },
  { key: "track", icon: ListChecks },
  { key: "me", icon: UserCircle },
];

/**
 * Floating glass tab bar. Content scrolls underneath the material; the active
 * tab's pill glides between items with a layout spring. The centre slot is the
 * Saathi AI orb — "tell Saathi what you need" is the universal starting point.
 */
export function TabBar({ active, onChange }: { active: TabKey; onChange: (key: TabKey) => void }) {
  const t = useTranslations("tabs");
  const reduce = useReducedMotion();

  const renderTab = ({ key, icon: Glyph }: (typeof SIDE_TABS)[number]) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        aria-current={isActive ? "page" : undefined}
        className="relative flex h-full flex-1 flex-col items-center justify-center gap-[3px] transition-transform duration-150 ease-out active:scale-[0.94]"
      >
        {isActive && (
          <motion.span
            layoutId="tab-pill"
            transition={reduce ? { duration: 0 } : spring.layout}
            className="absolute inset-x-1 inset-y-[7px] rounded-[18px] bg-navy-50"
          />
        )}
        <Glyph
          size={24}
          weight={isActive ? "fill" : "regular"}
          className={cn("relative transition-colors duration-200", isActive ? "text-navy-600" : "text-ink-3")}
        />
        <span
          className={cn(
            "relative text-[10.5px] leading-none tracking-[0.01em] transition-colors duration-200",
            isActive ? "font-semibold text-navy-700" : "font-medium text-ink-3",
          )}
        >
          {t(key)}
        </span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Saathi"
      className="relative flex h-[70px] items-stretch rounded-[26px] bg-white/75 px-1.5 shadow-[0_18px_40px_-16px_rgba(11,13,20,0.28),0_2px_6px_rgba(11,13,20,0.06)] ring-1 ring-black/[0.06] backdrop-blur-xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-white"
    >
      {SIDE_TABS.slice(0, 2).map(renderTab)}

      <button
        type="button"
        onClick={() => onChange("saathi")}
        aria-current={active === "saathi" ? "page" : undefined}
        aria-label={t("saathi")}
        className="group relative flex w-[76px] shrink-0 flex-col items-center justify-end pb-[16px] transition-transform duration-150 ease-out active:scale-[0.94]"
      >
        <span className="absolute -top-[24px] left-1/2 -translate-x-1/2 rounded-full bg-white p-[4px] shadow-[0_10px_24px_-8px_rgba(31,67,184,0.45)] ring-1 ring-black/[0.05]">
          <SaathiOrb state={active === "saathi" ? "listening" : "idle"} size={52} />
        </span>
        <span className={cn("text-[10.5px] font-semibold leading-none", active === "saathi" ? "text-navy-700" : "text-ink-2")}>
          {t("saathi")}
        </span>
      </button>

      {SIDE_TABS.slice(2).map(renderTab)}
    </nav>
  );
}
