"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { KolamField } from "@/components/system/imagery/KolamField";
import { ScrollScene } from "@/components/system/motion/ScrollScene";
import { mulberry32 } from "@/lib/design/random";
import { cn } from "@/lib/utils";

/** Real government apps and portals a citizen may be sent to (names only, no logos). */
const APPS = [
  "UMANG", "DigiLocker", "mAadhaar", "mParivahan", "e-Shram", "Ayushman Bharat", "EPFO", "NSP",
  "Bhulekh", "e-District", "CPGRAMS", "Sarathi", "Vahan", "PM-KISAN", "UDID", "Jeevan Pramaan",
  "NCS", "Udyam", "e-Courts", "Passport Seva", "ABHA", "PMAY-G", "NREGASoft", "SWAYAM",
  "Poshan Tracker", "e-Challan", "GST Portal", "Income Tax", "PFMS", "BHIM", "mKisan", "e-Hospital",
  "Skill India", "Bhuvan", "DigiYatra", "RailMadad",
];

interface Tile {
  name: string;
  dx: number; // vw from centre
  dy: number; // vh from centre
  rot: number;
  size: "sm" | "md" | "lg";
  delay: number;
}

function useTiles(): Tile[] {
  return useMemo(() => {
    const rand = mulberry32(2047);
    return APPS.map((name, i) => {
      // Spread on a loose ellipse, keeping the centre clear for the text.
      const angle = (i / APPS.length) * Math.PI * 2 + rand() * 0.5;
      const radius = 0.62 + rand() * 0.38;
      return {
        name,
        dx: Math.cos(angle) * 44 * radius,
        dy: Math.sin(angle) * 34 * radius + 10,
        rot: (rand() - 0.5) * 14,
        size: rand() > 0.8 ? "lg" : rand() > 0.45 ? "md" : "sm",
        delay: rand() * 0.12,
      };
    });
  }, []);
}

function TileView({ tile, progress }: { tile: Tile; progress: MotionValue<number> }) {
  const start = 0.3 + tile.delay;
  const end = 0.58 + tile.delay;
  const x = useTransform(progress, [start, end], [`${tile.dx}vw`, "0vw"]);
  const y = useTransform(progress, [start, end], [`${tile.dy}vh`, "0vh"]);
  const scale = useTransform(progress, [start, end], [1, 0.25]);
  const opacity = useTransform(progress, [0, 0.08, end - 0.06, end], [0, 1, 1, 0]);
  const rotate = useTransform(progress, [start, end], [tile.rot, 0]);
  const drift = useTransform(progress, [0, start], [0, tile.dy > 0 ? -18 : 18]);

  return (
    <motion.div className="absolute left-1/2 top-[38%]" style={{ x, y, scale, opacity, rotate }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
      <motion.span
        style={{ y: drift }}
        className={cn(
          "block whitespace-nowrap rounded-full bg-white font-medium text-ink-2 ring-1 ring-line shadow-[0_6px_18px_-10px_rgba(11,13,20,0.25)]",
          tile.size === "lg" && "px-5 py-2.5 text-[17px]",
          tile.size === "md" && "px-4 py-2 text-[15px]",
          tile.size === "sm" && "px-3 py-1.5 text-[13px] text-ink-3",
        )}
      >
        {tile.name}
      </motion.span>
      </div>
    </motion.div>
  );
}

function Stage({ progress }: { progress: MotionValue<number> }) {
  const t = useTranslations("site.door");
  const tiles = useTiles();

  const beforeOpacity = useTransform(progress, [0.04, 0.12, 0.3, 0.4], [0, 1, 1, 0]);
  const beforeY = useTransform(progress, [0.3, 0.4], [0, -24]);
  const doorScale = useTransform(progress, [0.46, 0.7], [0.3, 1]);
  const doorOpacity = useTransform(progress, [0.46, 0.58], [0, 1]);
  const ringScale = useTransform(progress, [0.6, 0.9], [0.6, 1.25]);
  const ringOpacity = useTransform(progress, [0.6, 0.72, 0.95], [0, 0.9, 0.5]);
  const afterOpacity = useTransform(progress, [0.72, 0.82], [0, 1]);
  const afterY = useTransform(progress, [0.72, 0.82], [24, 0]);
  const cueOpacity = useTransform(progress, [0, 0.06, 0.2], [0, 1, 0]);

  return (
    <div className="relative h-full w-full">
      {tiles.map((tile) => (
        <TileView key={tile.name} tile={tile} progress={progress} />
      ))}

      {/* Before */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <motion.div style={{ opacity: beforeOpacity, y: beforeY }} className="mx-auto max-w-3xl px-6 text-center">
        <p className="rounded-[28px] bg-white/85 px-4 py-6 text-[clamp(30px,4vw,56px)] font-semibold leading-[1.08] tracking-[var(--track-tight)] text-ink backdrop-blur-sm">
          {t("before")}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-[17px] leading-relaxed text-ink-2">{t("beforeSub")}</p>
      </motion.div>
      </div>

      {/* The door */}
      <div className="absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scale: ringScale, opacity: ringOpacity }} className="h-full w-full">
          <KolamField cols={6} rows={6} cell={60} seed={26} density={0.62} diamond className="h-full w-full text-navy-600/[0.14]" />
        </motion.div>
      </div>
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        <motion.span style={{ scale: doorScale, opacity: doorOpacity }} className="flex h-44 w-44 items-center justify-center rounded-full bg-white shadow-[0_40px_80px_-30px_rgba(31,67,184,0.45)] ring-1 ring-line">
          <SaathiMark size={104} />
        </motion.span>
      </div>

      {/* After */}
      <motion.div style={{ opacity: afterOpacity, y: afterY }} className="absolute inset-x-0 top-[62%] mx-auto max-w-3xl px-6 text-center">
        <p className="text-[clamp(40px,6vw,88px)] font-semibold leading-[1] tracking-[var(--track-display)] text-ink">{t("after")}</p>
        <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-ink-2">{t("afterSub")}</p>
      </motion.div>

      <motion.p style={{ opacity: cueOpacity }} className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-1.5 text-[13.5px] font-medium text-ink-3">
        <ArrowDown size={14} weight="bold" />
        {t("scroll")}
      </motion.p>
    </div>
  );
}

/** Signature scene: hundreds of portals collapse into one door as you scroll. */
export function DoorScene() {
  const t = useTranslations("site.door");
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id="vision" className="scroll-mt-20 px-5 py-24 text-center sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
          {APPS.slice(0, 18).map((a) => (
            <span key={a} className="rounded-full px-3 py-1.5 text-[13px] text-ink-3 ring-1 ring-line">
              {a}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-[clamp(28px,3.6vw,48px)] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("before")}</p>
        <span className="mx-auto mt-12 flex h-36 w-36 items-center justify-center rounded-full ring-1 ring-line">
          <SaathiMark size={84} />
        </span>
        <p className="mt-8 text-[clamp(36px,5vw,72px)] font-semibold tracking-[var(--track-display)] text-ink">{t("after")}</p>
        <p className="mx-auto mt-4 max-w-xl text-[18px] text-ink-2">{t("afterSub")}</p>
      </section>
    );
  }

  return (
    <section id="vision" className="relative scroll-mt-0">
      <ScrollScene height="360vh">{(progress) => <Stage progress={progress} />}</ScrollScene>
    </section>
  );
}
