"use client";

import { ArrowRight, Buildings, CaretRight, Check, CheckCircle, CircleNotch, Files, Info as InfoIcon, ListNumbers, MapPin, PencilSimple, Phone, SealCheck, ShieldCheck, Sparkle, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { StatusBadge } from "@/components/prototype/ui/StatusBadge";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import type { AgentCard, Block, Suggestion } from "@/lib/agent/types";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { getScheme, loc, type L } from "@/lib/mockData";
import { formatINRCompact } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import type { Locale } from "@/lib/i18n/config";
import type { RenderedBlock } from "./useAgent";

/** A turn answers in its own language — the one the question was typed in. */
const TurnLocale = createContext<Locale | null>(null);
function useTurnLocale(): Locale {
  const { locale } = useLocaleSwitch();
  return useContext(TurnLocale) ?? locale;
}

const enter = {
  initial: { opacity: 0, transform: "translateY(8px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
  transition: { duration: 0.32, ease: ease.out },
};

/** Words appear at reading pace (instant for reduced motion). */
function StreamingText({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const [n, setN] = useState(reduce ? words.length : 0);
  useEffect(() => {
    if (reduce) return setN(words.length);
    setN(0);
    const id = window.setInterval(() => setN((c) => (c >= words.length ? c : c + 1)), 34);
    return () => window.clearInterval(id);
  }, [text, reduce, words.length]);
  return (
    <p className="text-[15.5px] leading-[1.55] text-ink">
      {words.slice(0, n).join(" ")}
      {n < words.length && <span className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] animate-pulse bg-navy-600" />}
    </p>
  );
}

function Thinking({ label }: { label: string }) {
  return (
    <motion.div {...enter} className="flex items-center gap-2.5 py-1">
      <SaathiOrb size={24} state="thinking" />
      <span className="relative overflow-hidden text-[14px] font-medium text-ink-3">
        {label}
        <span className="absolute inset-0 -translate-x-full animate-shimmer-x bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </span>
    </motion.div>
  );
}

function Plan({ title, steps, done }: { title: string; steps: string[]; done: number }) {
  return (
    <motion.div {...enter} className="rounded-[20px] bg-surface p-4">
      <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
        <Sparkle size={14} weight="fill" className="text-navy-600" />
        {title}
      </p>
      <ol className="mt-3 space-y-2.5">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-2.5 text-[14px] leading-snug">
            <span
              className={cn(
                "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300",
                i < done ? "bg-green-600 text-white" : i === done ? "bg-navy-50 text-navy-700 ring-1 ring-navy-200" : "bg-white text-ink-3 ring-1 ring-line",
              )}
            >
              {i < done ? <Check size={11} weight="bold" /> : i + 1}
            </span>
            <span className={cn(i < done ? "text-ink-3 line-through decoration-ink-4/60" : "text-ink-2")}>{s}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

/** Reference information in an answer: facts as label–value rows, a checklist, or numbered steps. */
function Info({ block, locale }: { block: Extract<Block, { kind: "info" }>; locale: Parameters<typeof loc>[1] }) {
  const Glyph = block.variant === "facts" ? InfoIcon : block.variant === "steps" ? ListNumbers : Files;
  return (
    <motion.div {...enter} className="rounded-[20px] bg-surface p-4">
      <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
        <Glyph size={15} weight="fill" className="text-navy-600" />
        {loc(block.title, locale)}
      </p>
      {block.variant === "facts" && (
        <dl className="mt-2.5 divide-y divide-line">
          {block.rows?.map((r) => (
            <div key={r.label.en} className="flex items-baseline justify-between gap-3 py-2 text-[13.5px] leading-snug">
              <dt className="shrink-0 text-ink-3">{loc(r.label, locale)}</dt>
              <dd className="text-right font-semibold text-ink">{loc(r.value, locale)}</dd>
            </div>
          ))}
        </dl>
      )}
      {block.variant === "list" && (
        <ul className="mt-3 space-y-2">
          {block.items?.map((it) => (
            <li key={it.en} className="flex items-start gap-2 text-[14px] leading-snug text-ink-2">
              <CheckCircle size={17} weight="fill" className="mt-px shrink-0 text-green-600" />
              <span>{loc(it, locale)}</span>
            </li>
          ))}
        </ul>
      )}
      {block.variant === "steps" && (
        <ol className="mt-3 space-y-2.5">
          {block.items?.map((it, i) => (
            <li key={it.en} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-2">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-navy-700 ring-1 ring-navy-100">{i + 1}</span>
              <span>{loc(it, locale)}</span>
            </li>
          ))}
        </ol>
      )}
    </motion.div>
  );
}

function Tool({ source, action, result, running }: { source: string; action: string; result: string; running: boolean }) {
  return (
    <motion.div {...enter} className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 ring-1 ring-line">
      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", running ? "text-navy-600" : "bg-green-50 text-green-600")}>
        {running ? <CircleNotch size={15} weight="bold" className="animate-spin" /> : <Check size={13} weight="bold" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-ink">{action}</span>
        <span className="block text-[11.5px] text-ink-3">
          <span className="font-semibold text-ink-2">{source}</span>
          {!running && <> · {result}</>}
        </span>
      </span>
    </motion.div>
  );
}

function CardView({ card }: { card: AgentCard }) {
  const router = useAppRouter();
  const t = useTranslations("agent");
  const locale = useTurnLocale();
  const { applications } = usePrototype();

  if (card.kind === "scheme") {
    const s = getScheme(card.schemeId);
    if (!s) return null;
    return (
      <button type="button" onClick={() => router.push(`/prototype/scheme/?id=${s.id}`)} className="w-full rounded-[18px] bg-white p-3.5 text-left ring-1 ring-line active:scale-[0.99]">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[15px] font-semibold text-ink">{loc(s.name, locale)}</p>
          <p className="shrink-0 text-[15px] font-semibold tabular-nums text-ink">
            {s.benefit != null ? formatINRCompact(s.benefit) : ""}
            <span className="ml-1 text-[11.5px] font-medium text-ink-3">{loc(s.benefitNote, locale)}</span>
          </p>
        </div>
        <p className="mt-1.5 flex items-start gap-1.5 text-[13px] text-green-800">
          <Check size={13} weight="bold" className="mt-0.5 shrink-0 text-green-600" />
          {loc(card.reason, locale)}
        </p>
      </button>
    );
  }
  if (card.kind === "bill") {
    return (
      <div className="rounded-[18px] bg-saffron-50/70 p-4 ring-1 ring-inset ring-saffron-100">
        <p className="text-[13px] font-medium text-saffron-700">{loc(card.due, locale)}</p>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-[15px] font-semibold text-ink">{loc(card.title, locale)}</p>
          <p className="text-[24px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{card.amount}</p>
        </div>
        <p className="mt-1 flex items-center gap-1 text-[12.5px] text-ink-3">
          <Buildings size={13} weight="bold" />
          {loc(card.payee, locale)}
        </p>
      </div>
    );
  }
  if (card.kind === "place") {
    const Glyph = card.distance ? MapPin : Phone;
    return (
      <div className="flex items-center gap-3 rounded-[18px] bg-white p-3.5 ring-1 ring-line">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
          <Glyph size={18} weight="duotone" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold text-ink">{card.title}</span>
          <span className="block text-[12.5px] text-ink-3">{loc(card.sub, locale)}</span>
        </span>
        {card.distance && <span className="text-[12.5px] font-semibold tabular-nums text-navy-600">{card.distance}</span>}
      </div>
    );
  }
  const app = applications.find((a) => a.id === card.appId);
  if (!app) return null;
  return (
    <button type="button" onClick={() => router.push(`/prototype/status/?id=${app.id}`)} className="flex w-full items-center gap-3 rounded-[18px] bg-white p-3.5 text-left ring-1 ring-line active:scale-[0.99]">
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold text-ink">{loc(app.service, locale)}</span>
        <span className="mt-0.5 block text-[12.5px] text-ink-3">{loc(card.note, locale)}</span>
      </span>
      <StatusBadge status={app.status} />
      <CaretRight size={14} weight="bold" className="text-ink-4" aria-label={t("open")} />
    </button>
  );
}

function Consent({ block, item, onApprove, onCancel, active }: { block: Extract<Block, { kind: "consent" }>; item: RenderedBlock; onApprove: () => void; onCancel: () => void; active: boolean }) {
  const t = useTranslations("agent");
  const router = useAppRouter();
  const locale = useTurnLocale();
  const decided = item.decision;

  return (
    <motion.div {...enter} className={cn("rounded-[22px] p-4 transition-[box-shadow,background-color] duration-300", decided ? "bg-surface ring-1 ring-line" : "bg-white ring-2 ring-navy-600 shadow-[0_16px_36px_-20px_rgba(31,67,184,0.55)]")}>
      <p className="flex items-start gap-2 text-[15px] font-semibold leading-snug text-ink">
        <ShieldCheck size={19} weight="fill" className="mt-px shrink-0 text-navy-600" />
        {loc(block.title, locale)}
      </p>
      <p className="mt-1.5 pl-[27px] text-[12.5px] text-ink-3">{loc(block.recipient, locale)}</p>
      <ul className="mt-3 space-y-1.5 pl-[27px]">
        {block.items.map((it) => (
          <li key={it.en} className="flex items-start gap-2 text-[13.5px] text-ink-2">
            <Check size={13} weight="bold" className="mt-0.5 shrink-0 text-green-600" />
            {loc(it, locale)}
          </li>
        ))}
      </ul>
      <p className="mt-2.5 pl-[27px] text-[12.5px] text-ink-3">
        {t("validity")}: {loc(block.validity, locale)}
      </p>

      {decided ? (
        <p className={cn("mt-3.5 flex items-center gap-1.5 pl-[27px] text-[13.5px] font-semibold", decided === "approved" ? "text-green-800" : "text-ink-3")}>
          {decided === "approved" ? <CheckCircle size={16} weight="fill" className="text-green-600" /> : <X size={14} weight="bold" />}
          {decided === "approved" ? t("approved") : t("cancelled")}
        </p>
      ) : (
        <>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={!active}
              onClick={onApprove}
              className="flex h-11 flex-1 items-center justify-center rounded-[14px] bg-navy-600 px-3 text-[14.5px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-50"
            >
              {loc(block.approve, locale)}
            </button>
            {block.editHref && (
              <button type="button" onClick={() => router.push(block.editHref!)} aria-label={t("edit")} className="flex h-11 w-11 items-center justify-center rounded-[14px] text-ink-2 ring-1 ring-line active:scale-95">
                <PencilSimple size={17} weight="bold" />
              </button>
            )}
          </div>
          <button type="button" disabled={!active} onClick={onCancel} className="mt-1.5 h-9 w-full text-[13.5px] font-semibold text-ink-3">
            {t("cancel")}
          </button>
          <p className="text-center text-[11.5px] text-ink-3">{t("consentNote")}</p>
        </>
      )}
    </motion.div>
  );
}

function Outcome({ block, refNumber }: { block: Extract<Block, { kind: "outcome" }>; refNumber?: string }) {
  const router = useAppRouter();
  const t = useTranslations("agent");
  const locale = useTurnLocale();
  const reduce = useReducedMotion();

  if (!block.refPrefix) {
    return (
      <motion.p {...enter} className="flex items-start gap-2 text-[15.5px] font-medium leading-snug text-ink">
        <CheckCircle size={19} weight="fill" className="mt-0.5 shrink-0 text-green-600" />
        {loc(block.title, locale)}
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.96)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-navy-900 to-navy-600 p-4 text-white shadow-[0_18px_36px_-18px_rgba(10,28,84,0.7)]"
    >
      <Guilloche variant="band" tone="white" opacity={0.16} className="absolute inset-0 h-full w-full" />
      <div className="relative flex items-start gap-2">
        <SealCheck size={22} weight="fill" className="shrink-0 text-[#8BE3AE]" />
        <p className="text-[15.5px] font-semibold leading-snug">{loc(block.title, locale)}</p>
      </div>
      {refNumber && (
        <p className="relative mt-2 font-mono text-[13.5px] tracking-[0.04em] text-white/90">
          {t("ref")} {refNumber}
        </p>
      )}
      <ul className="relative mt-2 space-y-1">
        {block.lines.map((line) => (
          <li key={line.en} className="text-[13px] leading-snug text-white/80">
            {loc(line, locale)}
          </li>
        ))}
      </ul>
      {block.href && block.hrefLabel && (
        <button type="button" onClick={() => router.push(block.href!)} className="relative mt-3.5 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-navy-700 active:scale-95">
          {loc(block.hrefLabel, locale)}
          <ArrowRight size={13} weight="bold" />
        </button>
      )}
    </motion.div>
  );
}

function Suggestions({ items, onSend }: { items: Suggestion[]; onSend: (text: L, locale?: Locale) => void }) {
  const router = useAppRouter();
  const locale = useTurnLocale();
  return (
    <motion.div {...enter} className="flex flex-wrap gap-1.5 pt-1">
      {items.map((s) => (
        <button
          key={s.label.en}
          type="button"
          // A follow-up continues in the language of the turn it belongs to.
          onClick={() => (s.href ? router.push(s.href) : s.send && onSend(s.send, locale))}
          className="rounded-full bg-white px-3 py-2 text-left text-[13px] font-semibold text-navy-700 ring-1 ring-navy-100 transition-transform active:scale-95"
        >
          {loc(s.label, locale)}
        </button>
      ))}
    </motion.div>
  );
}

/** Renders one assistant turn's blocks in order. */
export function AssistantTurn({
  items,
  onApprove,
  onCancel,
  onSend,
  awaitingId,
  locale: turnLocale,
}: {
  items: RenderedBlock[];
  onApprove: () => void;
  onCancel: () => void;
  onSend: (text: L, locale?: Locale) => void;
  awaitingId?: string;
  /** The language this turn answers in (defaults to the app's). */
  locale?: Locale;
}) {
  const { locale: appLocale } = useLocaleSwitch();
  const locale = turnLocale ?? appLocale;
  const hasOutcome = items.some((i) => i.block.kind === "outcome");
  const toolsDone = new Set(items.filter((i) => i.block.kind === "tool" && i.status === "done").map((i) => (i.block as Extract<Block, { kind: "tool" }>).planStep).filter((n) => n !== undefined));

  return (
    <TurnLocale.Provider value={locale}>
      <div className="flex gap-2.5" lang={locale}>
        <div className="pt-0.5">
          <SaathiOrb size={28} state={items.some((i) => i.status === "running") ? "thinking" : "idle"} />
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {items.map((item) => {
            const b = item.block;
            switch (b.kind) {
              case "thinking":
                return item.status === "running" ? <Thinking key={item.id} label={loc(b.label, locale)} /> : null;
              case "text":
                return <StreamingText key={item.id} text={loc(b.text, locale)} />;
              case "plan": {
                const done = hasOutcome ? b.steps.length : toolsDone.size;
                return <Plan key={item.id} title={loc(b.title, locale)} steps={b.steps.map((s) => loc(s, locale))} done={done} />;
              }
              case "tool":
                return <Tool key={item.id} source={b.source} action={loc(b.action, locale)} result={loc(b.result, locale)} running={item.status === "running"} />;
              case "cards":
                return (
                  <motion.div key={item.id} {...enter} className="space-y-2">
                    {b.cards.map((c, i) => (
                      <CardView key={i} card={c} />
                    ))}
                  </motion.div>
                );
              case "info":
                return <Info key={item.id} block={b} locale={locale} />;
              case "consent":
                return <Consent key={item.id} block={b} item={item} active={awaitingId === item.id} onApprove={onApprove} onCancel={onCancel} />;
              case "outcome":
                return <Outcome key={item.id} block={b} refNumber={item.ref} />;
              case "suggestions":
                return <Suggestions key={item.id} items={b.items} onSend={onSend} />;
            }
          })}
        </div>
      </div>
    </TurnLocale.Provider>
  );
}
