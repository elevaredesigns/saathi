"use client";

import { ArrowRight, CheckCircle, CloudArrowDown, Megaphone, SealCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Avatar } from "@/components/prototype/ui/Avatar";
import { Button } from "@/components/prototype/ui/Button";
import { usePrototype, type OfficerEvent } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { loc, type TrackableApplication } from "@/lib/mockData";
import { formatShortDay, prototypeNow } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const DECISIONS: OfficerEvent["action"][] = ["approved", "infoRequested", "rejected", "issued", "citizenResponded"];

/**
 * The officer's latest word on this application, straight from the
 * department console: what they decided, why, and what the citizen can do —
 * answer a request from DigiLocker, appeal a rejection, or open the record.
 */
export function OfficerMessage({ app }: { app: TrackableApplication }) {
  const t = useTranslations("track.officer");
  const router = useAppRouter();
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { officerEvents, recordOfficerEvent, user } = usePrototype();
  const [sending, setSending] = useState(false);

  const latest = officerEvents.find((e) => e.appId === app.id && DECISIONS.includes(e.action));
  if (!latest) return null;
  const decision = officerEvents.find((e) => e.appId === app.id && e.action !== "citizenResponded" && DECISIONS.includes(e.action));

  const respond = () => {
    if (!decision) return;
    setSending(true);
    window.setTimeout(() => {
      recordOfficerEvent(
        {
          id: `resp-${Date.now()}`,
          appId: app.id,
          ref: app.ref,
          service: app.service,
          action: "citizenResponded",
          officer: user.name,
          office: decision.office,
          note: t("responseNote"),
          at: prototypeNow().toISOString(),
        },
        "inProgress",
      );
      setSending(false);
    }, 1300);
  };

  const tone =
    latest.action === "citizenResponded" || latest.action === "approved" || latest.action === "issued"
      ? "green"
      : latest.action === "infoRequested"
        ? "saffron"
        : "neutral";
  const Glyph = latest.action === "infoRequested" ? WarningCircle : latest.action === "rejected" ? XCircle : latest.action === "issued" ? SealCheck : CheckCircle;
  const office = loc(latest.office, locale);

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={latest.id}
        data-reveal
        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 0.4, ease: ease.out }}
        aria-live="polite"
        className={cn(
          "mx-5 mt-3 overflow-hidden rounded-[22px] ring-1 ring-inset",
          tone === "green" && "bg-green-50/70 ring-green-100",
          tone === "saffron" && "bg-saffron-50/80 ring-saffron-100",
          tone === "neutral" && "bg-surface ring-line",
        )}
      >
        <div className="p-4">
          <p className={cn("flex items-center gap-1.5 text-[13px] font-semibold", tone === "green" ? "text-green-800" : tone === "saffron" ? "text-saffron-700" : "text-ink-2")}>
            <Glyph size={16} weight="fill" />
            {t(`title.${latest.action}`)}
          </p>

          {latest.action === "citizenResponded" ? (
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{t("respondedBody", { officer: decision?.officer ?? "", office })}</p>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-2.5">
                <Avatar name={latest.officer} size={34} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink">{latest.officer}</p>
                  <p className="truncate text-[12px] text-ink-3">
                    {office} · {formatShortDay(latest.at, locale)}
                  </p>
                </div>
              </div>
              {latest.reason && <p className="mt-3 text-[14.5px] font-semibold leading-snug text-ink">{loc(latest.reason, locale)}</p>}
              {latest.note && <p className="mt-1.5 rounded-[14px] bg-white/80 px-3 py-2.5 text-[14px] leading-relaxed text-ink-2 ring-1 ring-inset ring-black/[0.04]">“{latest.note}”</p>}
              {!latest.reason && !latest.note && <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{t(`body.${latest.action}`)}</p>}
            </>
          )}
        </div>

        {latest.action === "infoRequested" && app.status === "actionNeeded" && (
          <div className="border-t border-saffron-100 bg-white/60 p-3">
            <Button fullWidth loading={sending} onClick={respond} iconLeft={<CloudArrowDown size={18} weight="bold" />}>
              {t("respond")}
            </Button>
            <p className="mt-2 text-center text-[12px] text-ink-3">{t("respondHint")}</p>
          </div>
        )}
        {latest.action === "rejected" && (
          <div className="grid grid-cols-2 gap-2 border-t border-line bg-white/60 p-3">
            <Button size="md" variant="secondary" onClick={() => router.push(`/prototype/saathi/?app=${app.id}`)}>
              {t("askWhy")}
            </Button>
            <Button size="md" onClick={() => router.push("/prototype/apply/?id=griev_file")} iconLeft={<Megaphone size={16} weight="bold" />}>
              {t("appeal")}
            </Button>
          </div>
        )}
        {latest.action === "issued" && (
          <button type="button" onClick={() => router.push("/prototype/me/#wallet")} className="flex w-full items-center justify-between border-t border-green-100 bg-white/60 px-4 py-3 text-[14px] font-semibold text-green-800 active:bg-white">
            {t("openRecord")}
            <ArrowRight size={16} weight="bold" />
          </button>
        )}
      </motion.section>
    </AnimatePresence>
  );
}
