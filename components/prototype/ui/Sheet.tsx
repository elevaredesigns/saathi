"use client";

import { AnimatePresence, motion, useDragControls, useReducedMotion, type PanInfo } from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useFramePortal } from "@/components/prototype/frame/IPhoneFrame";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Visible heading (also used as the dialog's accessible name). */
  title?: string;
  /** Accessible name when there is no visible title. */
  label?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Bottom sheet over the device screen. Spring in; drag the handle to dismiss —
 * a flick (velocity) or a pull past a third of its height closes it, anything
 * less springs back. Upward drag rubber-bands. Esc and the scrim close it.
 * Focus moves in on open and is restored on close. Reduced motion → fade.
 */
export function Sheet({ open, onClose, title, label, children, className }: SheetProps) {
  const portal = useFramePortal();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const focusId = window.setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusId);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const height = panelRef.current?.offsetHeight ?? 400;
    if (info.velocity.y > 500 || info.offset.y > height * 0.33) onClose();
  };

  const target = portal ?? (typeof document !== "undefined" ? document.body : null);
  if (!target) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn(portal ? "absolute" : "fixed", "inset-0 z-[70]")}>
          <motion.div
            className="absolute inset-0 bg-[rgba(11,13,20,0.32)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.24 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? label}
            tabIndex={-1}
            drag={reduce ? false : "y"}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.06, bottom: 0.8 }}
            onDragEnd={onDragEnd}
            className={cn(
              "no-scrollbar absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[30px] bg-white px-5 pb-10 shadow-[0_-12px_48px_-12px_rgba(11,13,20,0.28)] outline-none",
              className,
            )}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", duration: 0.42, bounce: 0.1 }}
          >
            <div
              onPointerDown={(e) => drag.start(e)}
              className="sticky top-0 z-10 -mx-5 mb-2 cursor-grab touch-none bg-white px-5 pb-2 pt-3 active:cursor-grabbing"
            >
              <div className="mx-auto h-[5px] w-10 rounded-full bg-[#D9DCE2]" />
              {title && <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>}
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    target,
  );
}
