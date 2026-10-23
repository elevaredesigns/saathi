"use client";

import { CheckCircle, CircleNotch, FileText, UploadSimple, Vault } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import type { L } from "@/lib/mockData";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export type DocState = "idle" | "fetching" | "verified" | "uploaded";

/** Documents fetched straight from DigiLocker (already verified) — or uploaded. */
export function ApplyDocuments({
  documents,
  states,
  onFetchAll,
  onUpload,
}: {
  documents: L[];
  states: DocState[];
  onFetchAll: () => void;
  onUpload: (index: number) => void;
}) {
  const t = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const busy = states.some((s) => s === "fetching");
  const done = states.every((s) => s === "verified" || s === "uploaded");

  return (
    <div className="px-5 pb-6">
      <h1 className="text-[26px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("documentsTitle")}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t("documentsHint")}</p>

      {!done && (
        <Button
          fullWidth
          size="md"
          variant="secondary"
          className="mt-5"
          loading={busy}
          iconLeft={<Vault size={19} weight="duotone" className="text-navy-600" />}
          onClick={onFetchAll}
        >
          {busy ? t("fetching") : t("fetchAll")}
        </Button>
      )}

      <ul className="mt-4 space-y-2">
        {documents.map((d, i) => {
          const s = states[i];
          const ok = s === "verified" || s === "uploaded";
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-3 rounded-[18px] p-3.5 ring-1 ring-inset transition-colors duration-300",
                ok ? "bg-green-50/60 ring-green-100" : "bg-white ring-line",
              )}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] transition-colors duration-300", ok ? "bg-white text-green-600" : "bg-surface text-ink-3")}>
                <AnimatePresence mode="wait" initial={false}>
                  {s === "fetching" ? (
                    <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CircleNotch size={20} weight="bold" className="animate-spin text-navy-600" />
                    </motion.span>
                  ) : ok ? (
                    <motion.span key="ok" initial={{ opacity: 0, transform: "scale(0.6)" }} animate={{ opacity: 1, transform: "scale(1)" }} transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}>
                      <CheckCircle size={22} weight="fill" />
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <FileText size={20} weight="duotone" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">{loc(d, locale)}</span>
                <span className={cn("block text-[12.5px]", ok ? "text-green-800" : "text-ink-3")}>
                  {s === "verified" ? t("fromDigiLocker") : s === "uploaded" ? t("uploadedManual") : s === "fetching" ? t("fetching") : t("notAdded")}
                </span>
              </span>
              {s === "idle" && (
                <button type="button" onClick={() => onUpload(i)} className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-semibold text-navy-600 active:bg-navy-50">
                  <UploadSimple size={15} weight="bold" />
                  {t("upload")}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center justify-center gap-1.5 text-[14px] font-semibold text-green-800">
            <CheckCircle size={17} weight="fill" className="text-green-600" />
            {t("allAdded")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
