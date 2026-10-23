"use client";

import { CaretRight, ListChecks, MagnifyingGlass } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SchemeCard } from "@/components/prototype/explore/SchemeCard";
import { SearchOverlay } from "@/components/prototype/explore/SearchOverlay";
import { MomentCard } from "@/components/prototype/explore/MomentCard";
import { ServiceCard } from "@/components/prototype/explore/ServiceCard";
import { LanguageButton } from "@/components/prototype/frame/LanguageButton";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { SegmentedControl } from "@/components/prototype/ui/SegmentedControl";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { LIFE_MOMENTS, SCHEMES, SERVICES } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

type Tab = "moments" | "services" | "forYou";
const TABS: Tab[] = ["moments", "services", "forYou"];

export default function ExplorePage() {
  const router = useAppRouter();
  const t = useTranslations("explore");
  const tt = useTranslations("tabs");
  const reduce = useReducedMotion();
  const { lifeContext } = usePrototype();
  const [tab, setTab] = useState<Tab>("moments");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tab");
    if (q && (TABS as string[]).includes(q)) setTab(q as Tab);
  }, []);

  const matched = SCHEMES.filter((s) => s.forContext.some((c) => lifeContext.includes(c)));
  const forYou = [...matched, ...SCHEMES.filter((s) => !matched.includes(s))];

  const subtitle = tab === "moments" ? t("momentsSubtitle") : tab === "services" ? t("servicesSubtitle") : t("forYouSubtitle");

  return (
    <div className="pb-6">
      <ScreenHeader title={tt("explore")} actions={<LanguageButton />}>
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="mt-4 flex h-11 w-full items-center gap-2 rounded-[14px] bg-surface2 px-3 text-left text-[15.5px] text-ink-3 transition-transform duration-150 active:scale-[0.99]"
        >
          <MagnifyingGlass size={18} weight="bold" />
          {t("searchPlaceholder")}
        </button>
      </ScreenHeader>

      <div className="px-5">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "moments", label: t("tabMoments") },
            { value: "services", label: t("tabServices") },
            { value: "forYou", label: t("tabForYou"), count: matched.length || undefined },
          ]}
        />
        <p className="mt-4 text-[14px] text-ink-3">{subtitle}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: ease.out }}
          className="mt-3 px-5"
        >
          {tab === "moments" && (
            <Stagger className="grid grid-cols-2 gap-2.5" gap={0.03} amount={0}>
              {LIFE_MOMENTS.map((m) => (
                <StaggerItem key={m.id} variant="scale">
                  <MomentCard moment={m} onClick={() => router.push(`/prototype/moment/?id=${m.id}`)} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {tab === "services" && (
            <div className="divide-y divide-line overflow-hidden rounded-[22px] bg-white ring-1 ring-line">
              {SERVICES.map((s) => (
                <ServiceCard key={s.id} service={s} onClick={() => router.push(`/prototype/service/?id=${s.id}`)} />
              ))}
            </div>
          )}

          {tab === "forYou" && (
            <Stagger className="space-y-2.5" gap={0.04} amount={0}>
              <StaggerItem>
                <button
                  type="button"
                  onClick={() => router.push("/prototype/eligibility/")}
                  className="flex w-full items-center gap-3 rounded-[22px] bg-navy-600 p-4 text-left text-white shadow-[0_16px_32px_-18px_rgba(31,67,184,0.8)] transition-transform duration-150 active:scale-[0.99]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/15">
                    <ListChecks size={22} weight="bold" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold">{t("checkAll", { count: SCHEMES.length })}</span>
                    <span className="block text-[13px] text-white/80">{t("checkAllSub")}</span>
                  </span>
                  <CaretRight size={18} weight="bold" className="shrink-0" />
                </button>
              </StaggerItem>
              {forYou.map((s) => (
                <StaggerItem key={s.id}>
                  <SchemeCard scheme={s} matched={matched.includes(s)} onClick={() => router.push(`/prototype/scheme/?id=${s.id}`)} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </motion.div>
      </AnimatePresence>

      <SearchOverlay open={searching} onClose={() => setSearching(false)} />
    </div>
  );
}
