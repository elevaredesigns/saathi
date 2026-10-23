"use client";

import { CaretLeft } from "@phosphor-icons/react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import { useScreenScroll } from "./IPhoneFrame";
import { ReadAloudButton } from "./ReadAloudButton";

interface ScreenHeaderProps {
  title: string;
  /** Small line above the large title (e.g. a date or category). */
  eyebrow?: string;
  /** true → router.back(); function → custom handler. */
  back?: boolean | (() => void);
  actions?: React.ReactNode;
  /** Large title in the flow (default). false = compact bar only. */
  large?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * iOS-style navigation: a large title that scrolls away, handing off to a
 * compact glass bar whose centred title fades in. The bar is a translucent
 * material over the content, not an opaque strip.
 */
export function ScreenHeader({ title, eyebrow, back, actions, large = true, className, children }: ScreenHeaderProps) {
  const router = useAppRouter();
  const tc = useTranslations("common");
  const reduce = useReducedMotion();
  const { scrollY } = useScreenScroll();

  const barOpacity = useTransform(scrollY, large ? [28, 64] : [0, 16], [0, 1]);
  const compactTitle = useTransform(scrollY, large ? [48, 76] : [0, 1], [0, 1]);
  const largeOpacity = useTransform(scrollY, [0, 48], [1, 0]);
  const largeY = useTransform(scrollY, [0, 80], [0, reduce ? 0 : -8]);

  const onBack = typeof back === "function" ? back : () => router.back();

  return (
    <>
      <div className={cn("sticky -top-[var(--proto-top)] z-20 -mt-[var(--proto-top)] pt-[var(--proto-top)]", className)}>
        <motion.div
          aria-hidden
          style={{ opacity: barOpacity }}
          className="absolute inset-0 border-b border-black/[0.05] bg-white/80 backdrop-blur-xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-white"
        />
        <div className="relative flex h-[48px] items-center gap-2 px-3">
          <div className="flex min-w-[76px] items-center">
            {back && (
              <button
                type="button"
                onClick={onBack}
                className="-ml-1 flex items-center gap-0.5 rounded-full py-1.5 pl-1 pr-2.5 text-[16px] font-medium text-navy-600 transition-opacity active:opacity-50"
              >
                <CaretLeft size={20} weight="bold" />
                {tc("back")}
              </button>
            )}
          </div>
          <motion.p
            style={{ opacity: large ? compactTitle : 1 }}
            className="flex-1 truncate text-center text-[16px] font-semibold tracking-[-0.01em] text-ink"
          >
            {title}
          </motion.p>
          <div className="flex min-w-[76px] items-center justify-end gap-1.5">{actions}</div>
        </div>
      </div>

      {large && (
        <motion.header style={{ opacity: largeOpacity, y: largeY }} className="px-5 pb-4 pt-1">
          {eyebrow && <p className="mb-1 text-[13px] font-medium text-ink-3">{eyebrow}</p>}
          <div className="flex items-start gap-2">
            <h1 className="flex-1 text-[30px] font-semibold leading-[1.12] tracking-[var(--track-tight)] text-ink">{title}</h1>
            <ReadAloudButton text={title} className="mt-1" />
          </div>
          {children}
        </motion.header>
      )}
    </>
  );
}

/** Round glass icon button for header actions. */
export function HeaderIconButton({
  label,
  onClick,
  children,
  badge,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      type="button"
      aria-label={badge ? `${label} (${badge})` : label}
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-2 ring-1 ring-black/[0.04] transition-transform duration-150 ease-out active:scale-[0.92]"
    >
      {children}
      {!!badge && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-white">
          {badge}
        </span>
      )}
    </button>
  );
}
