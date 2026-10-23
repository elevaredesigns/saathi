"use client";

import { SignOut, UserSwitch } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { getFamilyMember, loc } from "@/lib/mockData";

/** Persistent "Helping {name}" strip shown app-wide during proxy mode. */
export function ProxyBanner() {
  const { proxyFor, setProxy } = usePrototype();
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const t = useTranslations("me");
  const member = getFamilyMember(proxyFor);
  if (!member) return null;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { transform: "translateY(-100%)" }}
      animate={{ opacity: 1, transform: "translateY(0%)" }}
      transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
      className="flex h-12 items-center gap-2.5 bg-gradient-to-r from-violet-600 to-navy-600 px-4 text-white"
    >
      <UserSwitch size={18} weight="bold" className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{t("managing", { name: loc(member.name, locale) })}</span>
      <button
        type="button"
        onClick={() => setProxy(null)}
        className="flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ring-white/30 active:scale-95"
      >
        <SignOut size={13} weight="bold" />
        {t("exitProxy")}
      </button>
    </motion.div>
  );
}
