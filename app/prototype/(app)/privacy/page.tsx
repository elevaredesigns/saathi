"use client";

import { Buildings, CheckCircle, DownloadSimple, Megaphone, Plant, ShieldCheck, Vault, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { Avatar } from "@/components/prototype/ui/Avatar";
import { Button } from "@/components/prototype/ui/Button";
import { Toggle } from "@/components/prototype/ui/Toggle";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { Badge } from "@/components/system/ui/Badge";
import { IconTile } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { buildAccessLog } from "@/lib/data/inbox";
import { CONSENTS, type ConsentIcon } from "@/lib/data/privacy";
import { loc } from "@/lib/mockData";
import { formatShortDay } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const CONSENT_ICON: Record<ConsentIcon, Icon> = { vault: Vault, building: Buildings, plant: Plant };

/**
 * Privacy dashboard — every consent (who, what, why, until when) with a real
 * revoke switch, and an access log of who actually looked at your data.
 */
export default function PrivacyPage() {
  const router = useAppRouter();
  const t = useTranslations("privacy");
  const { locale } = useLocaleSwitch();
  const { revokedConsents, toggleConsent, officerEvents } = usePrototype();
  const ACCESS_LOG = buildAccessLog(officerEvents);
  const [download, setDownload] = useState<"idle" | "busy" | "done">("idle");

  const active = CONSENTS.filter((c) => !revokedConsents.includes(c.id)).length;

  const requestData = () => {
    setDownload("busy");
    window.setTimeout(() => setDownload("done"), 1600);
  };

  return (
    <div className="pb-8">
      <ScreenHeader back title={t("title")} eyebrow={t("eyebrow")}>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{t("intro")}</p>
      </ScreenHeader>

      <div className="mx-5 grid grid-cols-2 gap-2">
        <div className="rounded-[20px] bg-green-50/70 p-4 ring-1 ring-inset ring-green-100">
          <ShieldCheck size={22} weight="duotone" className="text-green-600" />
          <p className="mt-2 text-[28px] font-semibold tabular-nums leading-none text-ink">{active}</p>
          <p className="mt-1 text-[12.5px] text-ink-2">{t("activeConsents")}</p>
        </div>
        <div className="rounded-[20px] bg-navy-50/70 p-4 ring-1 ring-inset ring-navy-100">
          <Vault size={22} weight="duotone" className="text-navy-600" />
          <p className="mt-2 text-[28px] font-semibold tabular-nums leading-none text-ink">{ACCESS_LOG.length}</p>
          <p className="mt-1 text-[12.5px] text-ink-2">{t("accessesMonth")}</p>
        </div>
      </div>

      <section className="mt-8 px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("consentsTitle")}</h2>
        <p className="mt-0.5 text-[13.5px] text-ink-3">{t("consentsSub")}</p>
        <Stagger className="mt-3 space-y-2.5" gap={0.06} amount={0}>
          {CONSENTS.map((c) => {
            const revoked = revokedConsents.includes(c.id);
            return (
              <StaggerItem key={c.id}>
                <div className={cn("rounded-[22px] p-4 ring-1 transition-colors duration-300", revoked ? "bg-surface ring-line" : "bg-white ring-line")}>
                  <div className="flex items-start gap-3">
                    <IconTile icon={CONSENT_ICON[c.icon]} tone={revoked ? "neutral" : "navy"} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[15.5px] font-semibold leading-snug", revoked ? "text-ink-3" : "text-ink")}>{loc(c.party, locale)}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink-2">{loc(c.data, locale)}</p>
                    </div>
                    <Toggle checked={!revoked} onChange={() => toggleConsent(c.id)} label={loc(c.party, locale)} />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-[12.5px]">
                    <div>
                      <dt className="text-ink-3">{t("purpose")}</dt>
                      <dd className="font-medium text-ink-2">{loc(c.purpose, locale)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-3">{t("validity")}</dt>
                      <dd className="font-medium text-ink-2">{loc(c.validity, locale)}</dd>
                    </div>
                  </dl>
                  <AnimatePresence>
                    {revoked && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Badge tone="red" className="mt-3">
                          {t("revoked")}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <Reveal as="section" className="mt-8 px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("logTitle")}</h2>
        <p className="mt-0.5 text-[13.5px] text-ink-3">{t("logSub")}</p>
        <ol className="mt-4">
          {ACCESS_LOG.map((e, i) => {
            const who = loc(e.who, locale);
            return (
              <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
                {i < ACCESS_LOG.length - 1 && <span className="absolute bottom-0 left-[15px] top-9 w-[2px] rounded-full bg-surface2" />}
                <Avatar name={who} size={32} />
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[14.5px] font-semibold text-ink">{who}</p>
                    <span className="shrink-0 text-[12px] tabular-nums text-ink-3">{formatShortDay(e.when, locale)}</span>
                  </div>
                  <p className="text-[13.5px] text-ink-2">{loc(e.what, locale)}</p>
                  <p className="text-[12.5px] text-ink-3">{loc(e.purpose, locale)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>

      <Reveal className="mt-8 space-y-2 px-5">
        <Button
          fullWidth
          variant="secondary"
          size="md"
          loading={download === "busy"}
          onClick={requestData}
          disabled={download === "done"}
          iconLeft={download === "done" ? <CheckCircle size={18} weight="fill" className="text-green-600" /> : <DownloadSimple size={18} weight="bold" />}
        >
          {download === "done" ? t("downloadReady") : t("download")}
        </Button>
        <Button fullWidth variant="ghost" size="md" onClick={() => router.push("/prototype/apply/?id=griev_file")} iconLeft={<Megaphone size={18} weight="bold" />}>
          {t("reportMisuse")}
        </Button>
        <p className="pt-2 text-center text-[12px] leading-relaxed text-ink-3">{t("legal")}</p>
      </Reveal>
    </div>
  );
}
