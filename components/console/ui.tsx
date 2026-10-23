"use client";

import {
  ArrowsClockwise,
  CheckCircle,
  CircleDashed,
  Clock,
  FileMagnifyingGlass,
  HourglassMedium,
  Package,
  SealCheck,
  WarningCircle,
  X,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { CaseStage } from "@/lib/console/cases";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export type Tone = "navy" | "green" | "saffron" | "red" | "violet" | "teal" | "neutral";

const PILL: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy-700 ring-navy-100",
  green: "bg-green-50 text-green-800 ring-green-100",
  saffron: "bg-saffron-50 text-saffron-700 ring-saffron-100",
  red: "bg-red-50 text-red-600 ring-red-50",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
  neutral: "bg-surface text-ink-2 ring-line",
};

export function Pill({ tone = "neutral", icon: Glyph, children, className }: { tone?: Tone; icon?: Icon; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[12px] font-medium ring-1 ring-inset", PILL[tone], className)}>
      {Glyph && <Glyph size={13} weight="bold" />}
      {children}
    </span>
  );
}

export const STAGE_STYLE: Record<CaseStage, { tone: Tone; icon: Icon }> = {
  new: { tone: "navy", icon: CircleDashed },
  docCheck: { tone: "neutral", icon: FileMagnifyingGlass },
  verification: { tone: "saffron", icon: Clock },
  decision: { tone: "violet", icon: HourglassMedium },
  infoRequested: { tone: "saffron", icon: WarningCircle },
  approved: { tone: "green", icon: CheckCircle },
  issued: { tone: "green", icon: Package },
  rejected: { tone: "red", icon: XCircle },
};

export function StagePill({ stage }: { stage: CaseStage }) {
  const t = useTranslations("console.stage");
  const s = STAGE_STYLE[stage];
  return (
    <Pill tone={s.tone} icon={s.icon}>
      {t(stage)}
    </Pill>
  );
}

export function SlaPill({ days, open }: { days: number; open: boolean }) {
  const t = useTranslations("console.sla");
  if (!open) return <span className="text-[12px] text-ink-3">—</span>;
  if (days < 0) return <Pill tone="red" icon={WarningCircle}>{t("overdue", { days: -days })}</Pill>;
  if (days <= 2) return <Pill tone="saffron" icon={Clock}>{t("left", { days })}</Pill>;
  return <Pill tone="neutral">{t("left", { days })}</Pill>;
}

export function Card({ title, action, children, className, padded = true }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cn("rounded-[16px] border border-line bg-white shadow-[0_1px_2px_rgba(11,13,20,0.04)]", className)}>
      {(title || action) && (
        <header className="flex min-h-[52px] items-center justify-between gap-3 border-b border-line px-5">
          {typeof title === "string" ? <h3 className="text-[14px] font-semibold text-ink">{title}</h3> : title}
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

const AVATAR_TINTS = ["bg-navy-50 text-navy-700", "bg-saffron-50 text-saffron-700", "bg-green-50 text-green-800", "bg-violet-50 text-violet-600", "bg-teal-50 text-teal-600"];

export function Initials({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const parts = name.split(/\s+/).filter(Boolean);
  const text = ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
  const tint = AVATAR_TINTS[Array.from(name).reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_TINTS.length];
  return (
    <span aria-hidden className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", tint, className)} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {text}
    </span>
  );
}

export function Tabs<T extends string>({ value, onChange, items, className }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div role="tablist" className={cn("no-scrollbar flex gap-1 overflow-x-auto border-b border-line", className)}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button key={it.value} role="tab" type="button" aria-selected={active} onClick={() => onChange(it.value)} className={cn("relative flex h-10 shrink-0 items-center gap-1.5 px-3 text-[13.5px] font-medium transition-colors", active ? "text-ink" : "text-ink-3 hover:text-ink-2")}>
            {it.label}
            {it.count !== undefined && <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-ink text-white" : "bg-surface2 text-ink-3")}>{it.count}</span>}
            {/* No layoutId: a shared-layout underline inside the exiting case drawer kept the drawer and its backdrop mounted after close. */}
            {active && <motion.span initial={reduce ? false : { opacity: 0, transform: "scaleX(0.5)" }} animate={{ opacity: 1, transform: "scaleX(1)" }} transition={{ duration: 0.2 }} className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-navy-600" />}
          </button>
        );
      })}
    </div>
  );
}

/** Centred modal over the console, with focus moved in and Esc to close. */
export function Dialog({ open, onClose, title, description, children, footer, wide }: { open: boolean; onClose: () => void; title: string; description?: string; children?: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("console");
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => panel.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-[#0B0D14]/40 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px) scale(0.98)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
            className={cn("relative w-full overflow-hidden rounded-[20px] bg-white shadow-[0_40px_90px_-30px_rgba(11,13,20,0.55)] outline-none", wide ? "max-w-[720px]" : "max-w-[480px]")}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5">
              <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
                {description && <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label={t("close")} className="-mr-2 flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface hover:text-ink">
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-line bg-surface/60 px-6 py-3.5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Btn({ variant = "secondary", size = "md", icon: Glyph, loading, children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; size?: "sm" | "md"; icon?: Icon; loading?: boolean }) {
  const styles = {
    primary: "bg-navy-600 text-white hover:bg-navy-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
    secondary: "bg-white text-ink ring-1 ring-inset ring-line-strong hover:bg-surface",
    ghost: "text-ink-2 hover:bg-surface hover:text-ink",
    danger: "bg-white text-red-600 ring-1 ring-inset ring-red-50 hover:bg-red-50",
    success: "bg-green-600 text-white hover:bg-green-800",
  }[variant];
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
        size === "sm" ? "h-8 px-2.5 text-[12.5px]" : "h-9 px-3.5 text-[13.5px]",
        styles,
        className,
      )}
    >
      {loading ? <ArrowsClockwise size={14} weight="bold" className="animate-spin" /> : Glyph && <Glyph size={size === "sm" ? 14 : 15} weight="bold" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- toasts --- */

interface Toast {
  id: number;
  text: string;
  tone: "green" | "navy" | "red";
}
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "green") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }].slice(-3));
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[130] flex w-[340px] flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, transform: "translateY(12px) scale(0.98)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              exit={{ opacity: 0, transform: "translateY(6px) scale(0.98)" }}
              transition={{ duration: 0.28, ease: ease.out }}
              className="pointer-events-auto flex items-start gap-2.5 rounded-[14px] bg-ink px-4 py-3 text-[13.5px] text-white shadow-[0_18px_40px_-16px_rgba(11,13,20,0.6)]"
            >
              {t.tone === "red" ? <XCircle size={18} weight="fill" className="mt-px shrink-0 text-[#FF8A80]" /> : t.tone === "navy" ? <SealCheck size={18} weight="fill" className="mt-px shrink-0 text-[#9DB4FF]" /> : <CheckCircle size={18} weight="fill" className="mt-px shrink-0 text-[#8BE3AE]" />}
              <span className="leading-snug">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* -------------------------------------------------------------- charts --- */

export function BarChart({ data, labels, className, highlightLast = true }: { data: number[]; labels: string[]; className?: string; highlightLast?: boolean }) {
  const reduce = useReducedMotion();
  const max = Math.max(...data, 1);
  return (
    <div className={cn("flex h-[160px] items-end gap-[6px]", className)} role="img" aria-label={data.join(", ")}>
      {data.map((v, i) => (
        <div key={i} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[10.5px] tabular-nums text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
          <motion.span
            initial={reduce ? false : { transform: "scaleY(0)" }}
            animate={{ transform: "scaleY(1)" }}
            transition={{ duration: 0.7, ease: ease.cinematic, delay: i * 0.03 }}
            style={{ height: `${(v / max) * 100}%`, transformOrigin: "bottom" }}
            className={cn("w-full rounded-[5px]", highlightLast && i === data.length - 1 ? "bg-navy-600" : "bg-navy-100 group-hover:bg-navy-200")}
          />
          <span className="text-[10.5px] tabular-nums text-ink-3">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Meter({ value, tone = "navy", className }: { value: number; tone?: "navy" | "green" | "saffron" | "red"; className?: string }) {
  const reduce = useReducedMotion();
  const fill = { navy: "bg-navy-600", green: "bg-green-600", saffron: "bg-saffron-500", red: "bg-red-600" }[tone];
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface2", className)}>
      <motion.div initial={reduce ? false : { transform: "scaleX(0)" }} animate={{ transform: `scaleX(${Math.max(0, Math.min(1, value))})` }} transition={{ duration: 0.8, ease: ease.cinematic }} style={{ transformOrigin: "left" }} className={cn("h-full w-full rounded-full", fill)} />
    </div>
  );
}

export function Empty({ icon: Glyph, title, body }: { icon: Icon; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink-3">
        <Glyph size={22} weight="duotone" />
      </span>
      <p className="mt-3 text-[14.5px] font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-3">{body}</p>}
    </div>
  );
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const compactInr = (n: number) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : inr(n));
