"use client";

import { ArrowsClockwise, CheckCircle, Clock, SealCheck, ShareNetwork, ShieldCheck, Timer, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { useFramePortal } from "@/components/prototype/frame/IPhoneFrame";
import { Button } from "@/components/prototype/ui/Button";
import { SampleQr } from "@/components/prototype/ui/SampleQr";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import type { WalletDoc, WalletTint } from "@/lib/data/wallet";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const TINT: Record<WalletTint, { card: string; back: string; text: string; sub: string; guilloche: "white" | "navy" | "saffron" | "green" }> = {
  aadhaar: { card: "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600", back: "from-[#EEF2FC] to-white", text: "text-white", sub: "text-white/70", guilloche: "white" },
  pan: { card: "bg-gradient-to-br from-saffron-100 via-[#FFF1E0] to-white", back: "from-saffron-50 to-white", text: "text-ink", sub: "text-saffron-700", guilloche: "saffron" },
  dl: { card: "bg-gradient-to-br from-green-100 via-[#E6F6EC] to-white", back: "from-green-50 to-white", text: "text-ink", sub: "text-green-800", guilloche: "green" },
  voter: { card: "bg-gradient-to-br from-violet-100 via-[#F1ECFD] to-white", back: "from-violet-50 to-white", text: "text-ink", sub: "text-violet-600", guilloche: "navy" },
};

/** The printed front of a wallet document. Shared by the stack and the viewer. */
export function CardFront({ doc, large = false }: { doc: WalletDoc; large?: boolean }) {
  const t = useTranslations("me");
  const { locale } = useLocaleSwitch();
  const tint = TINT[doc.tint];
  return (
    <div className={cn("absolute inset-0 overflow-hidden text-left", large ? "p-5" : "p-4", tint.card)}>
      <Guilloche tone={tint.guilloche} opacity={doc.tint === "aadhaar" ? 0.14 : 0.22} className={cn("absolute", large ? "-right-10 -top-14 h-64 w-64" : "-right-14 -top-16 h-52 w-52")} />
      <div className="relative flex items-center justify-between">
        <span className={cn("flex items-center gap-2 font-semibold", large ? "text-[17px]" : "text-[15px]", tint.text)}>
          {doc.tint === "aadhaar" && <SaathiMark size={large ? 20 : 18} tone="white" />}
          {loc(doc.name, locale)}
        </span>
        {doc.verified ? (
          <span className={cn("flex items-center gap-1 text-[11.5px] font-semibold", doc.tint === "aadhaar" ? "text-[#8BE3AE]" : "text-green-800")}>
            <SealCheck size={13} weight="fill" />
            {t("verified")}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-saffron-700">
            <Clock size={13} weight="bold" />
            {t("pending")}
          </span>
        )}
      </div>
      <p className={cn("relative mt-1 text-[12px]", tint.sub)}>{loc(doc.issuer, locale)}</p>
      <div className="absolute inset-x-0 bottom-0 p-[inherit]">
        <p className={cn("font-mono tracking-[0.16em]", large ? "text-[18px]" : "text-[15px]", tint.text)}>{doc.number}</p>
        <p className={cn("mt-1 text-[12px]", tint.sub)}>{loc(doc.validity, locale)}</p>
      </div>
    </div>
  );
}

/** The reverse: key fields, a scannable (sample) code and the issuer's seal. */
function CardBack({ doc }: { doc: WalletDoc }) {
  const t = useTranslations("me");
  const { locale } = useLocaleSwitch();
  const tint = TINT[doc.tint];
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-gradient-to-br p-5 text-left ring-1 ring-inset ring-black/[0.06]", tint.back)}>
      <Guilloche variant="band" tone={tint.guilloche === "white" ? "navy" : tint.guilloche} opacity={0.18} className="absolute inset-x-0 top-0 h-10 w-full" />
      <div className="relative flex h-full gap-4 pt-5">
        <dl className="min-w-0 flex-1 space-y-2">
          {doc.fields.slice(0, 3).map((f) => (
            <div key={f.value + f.label.en}>
              <dt className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{loc(f.label, locale)}</dt>
              <dd className="truncate text-[13.5px] font-semibold leading-tight text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex shrink-0 flex-col items-center">
          <div className="rounded-[10px] bg-white p-1.5 shadow-[0_6px_16px_-8px_rgba(11,13,20,0.3)] ring-1 ring-line">
            <SampleQr size={74} seed={doc.id.length * 131 + 7} />
          </div>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">{t("scanToVerify")}</p>
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-3.5 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[10.5px] text-ink-3">{t("signedBy", { issuer: loc(doc.issuer, locale) })}</p>
        {/* holographic seal — its sheen follows the card's tilt */}
        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/70">
          <span className="absolute inset-[-40%] animate-aurora-spin rounded-full bg-[conic-gradient(from_0deg,#FFD7A8,#C9D6FF,#BDF0D2,#F3D1FF,#FFD7A8)] opacity-90" />
          <SaathiMark size={16} tone="ink" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
        </span>
      </div>
    </div>
  );
}

const CARD_RADIUS = 22;

/**
 * Full-screen viewer for one document. The card lifts out of the wallet on a
 * shared layout animation, tilts toward your finger, and flips in 3D to show
 * its reverse — with an explicit "Flip back" so the gesture is never a trap.
 */
export function WalletCardViewer({ doc, onClose }: { doc: WalletDoc | null; onClose: () => void }) {
  const portal = useFramePortal();
  const t = useTranslations("me");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [shared, setShared] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // pointer tilt
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-1, 1], [7, -7]), { stiffness: 220, damping: 22 });
  const tiltY = useSpring(useTransform(px, [-1, 1], [-9, 9]), { stiffness: 220, damping: 22 });

  useEffect(() => {
    if (!doc) return;
    setFlipped(false);
    setShared(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [doc, onClose]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {doc && (
        <motion.div key="viewer" role="dialog" aria-modal="true" aria-label={loc(doc.name, locale)} className="absolute inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label={t("close")}
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0B0D14]/45 backdrop-blur-[10px]"
          />

          <div className="pointer-events-none relative flex h-full flex-col px-5 pt-[64px]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-auto mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-white/80">{t(flipped ? "backSide" : "frontSide")}</p>
              <button ref={closeRef} type="button" onClick={onClose} aria-label={t("close")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur active:scale-90">
                <X size={17} weight="bold" />
              </button>
            </motion.div>

            {/* card */}
            <div className="pointer-events-auto [perspective:1200px]" onPointerMove={onPointerMove} onPointerLeave={resetTilt}>
              <motion.div
                layoutId={`wallet-${doc.id}`}
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.55, bounce: 0.18 }}
                style={{ borderRadius: CARD_RADIUS, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
                className="relative h-[222px] w-full shadow-[0_40px_70px_-30px_rgba(0,0,0,0.65)]"
              >
                <motion.button
                  type="button"
                  onClick={() => setFlipped((f) => !f)}
                  aria-label={t(flipped ? "flipBack" : "flip")}
                  aria-pressed={flipped}
                  animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }}
                  transition={{ type: "spring", duration: 0.7, bounce: 0.22 }}
                  style={{ transformStyle: "preserve-3d", borderRadius: CARD_RADIUS }}
                  className="absolute inset-0 block"
                >
                  <span
                    className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                    style={{ borderRadius: CARD_RADIUS, ...(reduce ? { opacity: flipped ? 0 : 1, transition: "opacity 200ms" } : null) }}
                  >
                    <CardFront doc={doc} large />
                  </span>
                  <span
                    className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                    style={{ borderRadius: CARD_RADIUS, transform: reduce ? undefined : "rotateY(180deg)", ...(reduce ? { opacity: flipped ? 1 : 0, transition: "opacity 200ms" } : null) }}
                  >
                    <CardBack doc={doc} />
                  </span>
                </motion.button>
              </motion.div>
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35 } }} exit={{ opacity: 0 }} className="mt-3 text-center text-[12px] text-white/75">
              {t("tapToFlip")}
            </motion.p>

            {/* controls + details */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(40px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(40px)" }}
              transition={{ duration: 0.42, ease: ease.cinematic, delay: 0.08 }}
              className="pointer-events-auto mt-auto -mx-5 rounded-t-[30px] bg-white px-5 pb-8 pt-5 shadow-sheet"
            >
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setFlipped((f) => !f)} iconLeft={<ArrowsClockwise size={17} weight="bold" className={cn("transition-transform duration-500", flipped && "rotate-180")} />}>
                  {t(flipped ? "flipBack" : "flip")}
                </Button>
                <Button disabled={!doc.verified || shared} onClick={() => setShared(true)} iconLeft={<ShareNetwork size={17} weight="bold" />}>
                  {t("share")}
                </Button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {shared ? (
                  <motion.div key="shared" initial={{ opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} className="mt-3 flex items-center gap-3.5 rounded-[18px] bg-green-50/70 p-3.5 ring-1 ring-inset ring-green-100">
                    <div className="rounded-[10px] bg-white p-1 ring-1 ring-line">
                      <SampleQr size={64} seed={doc.id.length * 97} />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[14px] font-semibold text-green-800">
                        <CheckCircle size={15} weight="fill" className="text-green-600" />
                        {t("shareReady")}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-2">
                        <Timer size={12} weight="bold" />
                        {t("shareExpiry")}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-ink-3">{t("shareMasked")}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p key="issuer" exit={{ opacity: 0 }} className="mt-3 flex items-center gap-1.5 text-[12.5px] text-ink-3">
                    {doc.verified ? <ShieldCheck size={14} weight="fill" className="text-green-600" /> : <Clock size={14} weight="bold" className="text-saffron-700" />}
                    {doc.verified ? loc(doc.issuer, locale) : t("pendingNote")}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portal,
  );
}
