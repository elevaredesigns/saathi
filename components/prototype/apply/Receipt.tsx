"use client";

import { Check, CopySimple, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { SampleQr } from "@/components/prototype/ui/SampleQr";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import type { ApplyFlow, ApplyKind } from "@/lib/applyFlows";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { ShareSheet } from "./ShareSheet";

const TITLE_KEY: Record<ApplyKind, string> = {
  apply: "receiptApply",
  pay: "receiptPay",
  renew: "receiptRenew",
  register: "receiptRegister",
  download: "receiptDownload",
  grievance: "receiptGrievance",
};
const REF_KEY: Record<ApplyKind, string> = {
  apply: "refApply",
  pay: "refPay",
  renew: "refApply",
  register: "refApply",
  download: "refDownload",
  grievance: "refGrievance",
};
const NEXT_KEY: Record<ApplyKind, string> = {
  apply: "nextApply",
  pay: "nextPay",
  renew: "nextApply",
  register: "nextApply",
  download: "nextDownload",
  grievance: "nextGrievance",
};

/** The moment of proof: a seal, a security-printed receipt, and what happens next. */
export function Receipt({ flow, refNumber, onTrack, onHome }: { flow: ApplyFlow; refNumber: string; onTrack: () => void; onHome: () => void }) {
  const t = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const when = new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    numberingSystem: "latn",
  }).format(PROTOTYPE_TODAY);

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: t("receipt.dateTime"), value: when },
    { label: t("department"), value: loc(flow.department, locale) },
    { label: t("portal"), value: flow.portal },
    ...(flow.kind === "pay" && flow.amount ? [{ label: t("receipt.amountPaid"), value: flow.amount }] : []),
  ];

  const copy = () => {
    navigator.clipboard?.writeText(refNumber).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="px-5 pb-6 pt-4">
      {/* Seal */}
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {!reduce &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-green-500"
                initial={{ opacity: 0.5, transform: "scale(0.8)" }}
                animate={{ opacity: 0, transform: "scale(1.7)" }}
                transition={{ duration: 1.4, ease: ease.out, delay: 0.35 + i * 0.3 }}
              />
            ))}
          <motion.span
            initial={reduce ? false : { transform: "scale(0.5)", opacity: 0 }}
            animate={{ transform: "scale(1)", opacity: 1 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0.35 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-[0_14px_30px_-12px_rgba(18,128,60,0.6)]"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
              <motion.path
                d="M10 21 L17 28 L30 13"
                fill="none"
                stroke="#fff"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: ease.out, delay: 0.25 }}
              />
            </svg>
          </motion.span>
        </div>
        <motion.h1
          data-reveal
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.5, ease: ease.cinematic, delay: 0.35 }}
          className="mt-5 text-[26px] font-semibold tracking-[var(--track-tight)] text-ink"
        >
          {t(TITLE_KEY[flow.kind])}
        </motion.h1>
        <p className="mt-1 text-[15px] text-ink-2">{loc(flow.service, locale)}</p>
      </div>

      {/* Receipt card */}
      <motion.div
        data-reveal
        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(16px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 0.6, ease: ease.cinematic, delay: 0.5 }}
        className="mt-6 overflow-hidden rounded-[24px] bg-white ring-1 ring-line shadow-[0_18px_40px_-24px_rgba(11,13,20,0.3)]"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-600 px-4 py-4 text-white">
          <Guilloche variant="band" tone="white" opacity={0.18} className="absolute inset-0 h-full w-full" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{t(REF_KEY[flow.kind])}</p>
          <div className="relative mt-1 flex items-center justify-between gap-2">
            <p className="font-mono text-[19px] font-semibold tracking-[0.04em]">{refNumber}</p>
            <button type="button" onClick={copy} className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ring-white/25">
              {copied ? <Check size={13} weight="bold" /> : <CopySimple size={13} weight="bold" />}
              {copied ? t("receipt.copied") : t("receipt.copy")}
            </button>
          </div>
        </div>
        <dl className="divide-y divide-dashed divide-line px-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-4 py-2.5">
              <dt className="text-[13px] text-ink-3">{r.label}</dt>
              <dd className="text-right text-[14px] font-semibold text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center gap-3 border-t border-dashed border-line p-4">
          <div className="relative rounded-[10px] p-1 ring-1 ring-line">
            <SampleQr size={64} seed={refNumber.length * 131} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-ink">{t("receipt.verifyAt", { portal: flow.portal })}</p>
            <p className="text-[12px] text-ink-3">{t("receipt.sample")}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="md" onClick={() => setSaved(true)} iconLeft={saved ? <Check size={16} weight="bold" className="text-green-600" /> : <DownloadSimple size={16} weight="bold" />}>
          {saved ? t("saved") : t("downloadPdf")}
        </Button>
        <Button variant="secondary" size="md" onClick={() => setSharing(true)} iconLeft={<ShareNetwork size={16} weight="bold" />}>
          {t("share")}
        </Button>
      </div>

      <p className="mt-5 rounded-[18px] bg-surface p-3.5 text-[13.5px] leading-relaxed text-ink-2">{t(`receipt.${NEXT_KEY[flow.kind]}`)}</p>

      <div className="mt-5 space-y-2">
        <Button fullWidth onClick={onTrack}>
          {t("trackApplication")}
        </Button>
        <Button fullWidth variant="ghost" onClick={onHome}>
          {t("backHome")}
        </Button>
      </div>

      <ShareSheet open={sharing} onClose={() => setSharing(false)} refNumber={refNumber} />
    </div>
  );
}
