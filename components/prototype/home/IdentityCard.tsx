"use client";

import { ArrowsClockwise, MapPin, QrCode, SealCheck } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SampleQr } from "@/components/prototype/ui/SampleQr";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { spring } from "@/lib/design/motion";
import { displayName } from "@/lib/i18n/names";

const VALIDITY = 300; // seconds

/**
 * Saathi ID — a security-printed card (guilloche) that flips in 3D to a
 * time-limited sample QR, the way a digital ID is shown at a counter.
 */
export function IdentityCard() {
  const t = useTranslations("home");
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { user } = usePrototype();
  const [flipped, setFlipped] = useState(false);
  const [left, setLeft] = useState(VALIDITY);

  useEffect(() => {
    if (!flipped) return;
    setLeft(VALIDITY);
    const id = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : VALIDITY)), 1000);
    return () => window.clearInterval(id);
  }, [flipped]);

  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const name = displayName(user.name, locale);
  const last4 = user.aadhaarLast4 || "6721";

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={flipped ? t("idHideQr") : t("idShowQr")}
      className="relative block aspect-[1.6] w-full text-left [perspective:1200px] active:scale-[0.99]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={spring.layout}
      >
        {/* Front */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 p-5 text-white shadow-[0_24px_48px_-22px_rgba(10,28,84,0.7)] [backface-visibility:hidden]"
          style={reduce ? { opacity: flipped ? 0 : 1, transition: "opacity 200ms" } : undefined}
        >
          <Guilloche tone="white" opacity={0.14} className="absolute -right-20 -top-24 h-72 w-72" />
          <Guilloche variant="band" tone="white" opacity={0.1} className="absolute inset-x-0 bottom-0 h-16 w-full" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                <SaathiMark size={20} tone="white" />
                {t("idLabel")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-[3px] text-[11px] font-semibold ring-1 ring-inset ring-white/20">
                <SealCheck size={13} weight="fill" className="text-[#8BE3AE]" />
                {t("verified")}
              </span>
            </div>
            <div className="mt-auto">
              <p className="text-[21px] font-semibold leading-tight tracking-[-0.01em]">{name}</p>
              <p className="mt-1 font-mono text-[13px] tracking-[0.22em] text-white/75">XXXX XXXX {last4}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-white/70">
              <span className="flex items-center gap-1">
                <MapPin size={13} weight="fill" />
                {user.district}, {user.state}
              </span>
              <span className="flex items-center gap-1 font-medium text-white/85">
                <QrCode size={14} weight="bold" />
                {t("idShowQr")}
              </span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center gap-4 overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_24px_48px_-22px_rgba(10,28,84,0.45)] ring-1 ring-line [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={reduce ? { transform: "none", opacity: flipped ? 1 : 0, transition: "opacity 200ms" } : undefined}
        >
          <div className="relative rounded-[14px] p-1.5 ring-1 ring-line">
            <SampleQr size={120} seed={Number(last4)} />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-saffron-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-saffron-700 ring-1 ring-saffron-100">
              {t("sample")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-snug text-ink">{t("qrTitle")}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-ink-3">{t("qrBody")}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[12px] font-semibold tabular-nums text-navy-700">
              <ArrowsClockwise size={13} weight="bold" />
              {t("qrRefresh", { time: mmss })}
            </p>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
