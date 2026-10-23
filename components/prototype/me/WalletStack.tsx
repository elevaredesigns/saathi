"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import type { WalletDoc } from "@/lib/data/wallet";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { CardFront } from "./WalletCard";

const PEEK = 68;
const CARD_H = 186;

/**
 * Wallet of stacked document cards. Each card shares a layoutId with the
 * full-screen viewer, so tapping one lifts it out of the stack into focus and
 * closing drops it back into its slot. The selected card leaves a gap behind.
 */
export function WalletStack({ docs, openId, onOpen }: { docs: WalletDoc[]; openId?: string | null; onOpen: (doc: WalletDoc) => void }) {
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();

  return (
    <div className="relative" style={{ height: PEEK * (docs.length - 1) + CARD_H }}>
      {docs.map((d, i) => (
        <motion.div
          key={d.id}
          data-reveal
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: ease.cinematic, delay: i * 0.07 }}
          className="absolute inset-x-0"
          style={{ top: i * PEEK, height: CARD_H, zIndex: openId === d.id ? 0 : i + 1 }}
        >
          {openId !== d.id && (
            <motion.button
              type="button"
              layoutId={`wallet-${d.id}`}
              onClick={() => onOpen(d)}
              aria-label={loc(d.name, locale)}
              whileTap={reduce ? undefined : { y: -6 }}
              transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.55, bounce: 0.18 }}
              style={{ borderRadius: 22 }}
              className="relative block h-full w-full overflow-hidden shadow-[0_-6px_18px_-10px_rgba(11,13,20,0.25),0_1px_0_rgba(255,255,255,0.4)_inset] ring-1 ring-black/[0.05]"
            >
              <CardFront doc={d} />
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
