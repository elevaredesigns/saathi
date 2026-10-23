"use client";

import { CaretDown, CaretRight, CheckCircle, Question, SlidersHorizontal, XCircle, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { SCHEME_VISUAL } from "@/components/prototype/home/SchemeRail";
import { Toggle } from "@/components/prototype/ui/Toggle";
import { IconTile } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { answersFromContext, rankSchemes, type AgeBand, type Answers, type Income, type Verdict, type Work } from "@/lib/eligibility";
import { loc, SCHEMES } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import { cn } from "@/lib/utils";
import { formatINRCompact } from "@/lib/utils/currency";

type Filter = "all" | Verdict;
const FILTERS: Filter[] = ["all", "yes", "maybe", "no"];

const VERDICT: Record<Verdict, { icon: Icon; badge: string; text: string; dot: string }> = {
  yes: { icon: CheckCircle, badge: "bg-green-50 text-green-800 ring-green-100", text: "text-green-800", dot: "bg-green-600" },
  maybe: { icon: Question, badge: "bg-saffron-50 text-saffron-700 ring-saffron-100", text: "text-saffron-700", dot: "bg-saffron-500" },
  no: { icon: XCircle, badge: "bg-surface2 text-ink-3 ring-line", text: "text-ink-3", dot: "bg-ink-4" },
};

const AGES: AgeBand[] = ["18-40", "41-59", "60+"];
const INCOMES: Income[] = ["low", "mid", "high"];
const WORKS: Work[] = ["business", "farmer", "student", "artisan", "salaried", "other"];
const FLAGS: (keyof Answers)[] = ["ownsLand", "puccaHouse", "pregnant", "daughterUnder10", "taxpayer"];

function Chips<T extends string>({ value, options, label, onChange, render }: { value: T; options: T[]; label: string; onChange: (v: T) => void; render: (v: T) => string }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-ink-2">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[13.5px] font-semibold ring-1 ring-inset transition-colors duration-150",
              value === o ? "bg-navy-600 text-white ring-navy-600" : "bg-white text-ink-2 ring-line active:bg-surface",
            )}
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EligibilityPage() {
  const t = useTranslations("eligibility");
  const router = useAppRouter();
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { lifeContext, hydrated } = usePrototype();
  const [answers, setAnswers] = useState<Answers>(() => answersFromContext(lifeContext));
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  // Once saved preferences load, start from what the person told Saathi.
  useEffect(() => {
    if (hydrated) setAnswers(answersFromContext(lifeContext));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const ranked = useMemo(() => rankSchemes(SCHEMES, answers), [answers]);
  const count = (v: Verdict) => ranked.filter((r) => r.verdict === v).length;
  const shown = filter === "all" ? ranked : ranked.filter((r) => r.verdict === filter);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  return (
    <div className="pb-6">
      <ScreenHeader back title={t("title")} eyebrow={t("eyebrow")}>
        <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{t("intro", { count: SCHEMES.length })}</p>
      </ScreenHeader>

      <div className="px-5">
        {/* summary */}
        <div className="grid grid-cols-3 gap-2">
          {(["yes", "maybe", "no"] as Verdict[]).map((v) => {
            const V = VERDICT[v];
            return (
              <button
                key={v}
                type="button"
                onClick={() => setFilter(filter === v ? "all" : v)}
                aria-pressed={filter === v}
                className={cn("rounded-[18px] p-3 text-left ring-1 transition-[box-shadow,transform] duration-150 active:scale-[0.98]", V.badge, filter === v && "shadow-[0_0_0_2px_currentColor]")}
              >
                <V.icon size={20} weight="fill" />
                <motion.p key={`${v}-${count(v)}`} initial={reduce ? false : { opacity: 0.3, transform: "translateY(4px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} className="mt-1.5 text-[26px] font-semibold leading-none tabular-nums text-ink">
                  {count(v)}
                </motion.p>
                <p className="mt-1 text-[12.5px] font-semibold leading-tight">{t(`summary.${v}`)}</p>
              </button>
            );
          })}
        </div>

        {/* your answers — change any, everything re-checks instantly */}
        <div className="mt-4 overflow-hidden rounded-[20px] bg-white ring-1 ring-line">
          <button type="button" onClick={() => setEditing(!editing)} aria-expanded={editing} className="flex w-full items-center gap-3 p-4 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
              <SlidersHorizontal size={18} weight="bold" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">{t("answers.title")}</span>
              <span className="block truncate text-[12.5px] text-ink-3">
                {t(`age.${answers.age}`)} · {t(`income.${answers.income}`)} · {t(`work.${answers.work}`)}
              </span>
            </span>
            <CaretDown size={16} weight="bold" className={cn("shrink-0 text-ink-3 transition-transform duration-200", editing && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {editing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.25, ease: ease.out }}
                className="overflow-hidden"
              >
                <div className="space-y-4 border-t border-line p-4">
                  <p className="text-[12.5px] leading-relaxed text-ink-3">{t("answers.note")}</p>
                  <Chips label={t("answers.age")} value={answers.age} options={AGES} onChange={(v) => set("age", v)} render={(v) => t(`age.${v}`)} />
                  <Chips label={t("answers.income")} value={answers.income} options={INCOMES} onChange={(v) => set("income", v)} render={(v) => t(`income.${v}`)} />
                  <Chips label={t("answers.work")} value={answers.work} options={WORKS} onChange={(v) => set("work", v)} render={(v) => t(`work.${v}`)} />
                  <ul className="divide-y divide-line rounded-[14px] ring-1 ring-line">
                    {FLAGS.map((f) => (
                      <li key={f} className="flex items-center gap-3 px-3 py-2.5">
                        <span className="flex-1 text-[14px] text-ink">{t(`flags.${f}`)}</span>
                        <Toggle checked={answers[f] as boolean} onChange={(v) => set(f, v as never)} label={t(`flags.${f}`)} />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* filter */}
        <div className="no-scrollbar -mx-5 mt-5 flex gap-1.5 overflow-x-auto px-5" role="tablist" aria-label={t("filterLabel")}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold ring-1 ring-inset transition-colors",
                filter === f ? "bg-ink text-white ring-ink" : "bg-white text-ink-2 ring-line",
              )}
            >
              {t(`filter.${f}`)} · {f === "all" ? ranked.length : count(f)}
            </button>
          ))}
        </div>

        {/* every scheme, with a verdict and the reason */}
        <motion.ul layout={!reduce} className="mt-3 space-y-2.5">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((r) => {
              const s = r.scheme;
              const V = VERDICT[r.verdict];
              const vis = s.id === "pmkisan" ? SCHEME_VISUAL.farming : SCHEME_VISUAL[s.category] ?? SCHEME_VISUAL.money;
              return (
                <motion.li
                  key={s.id}
                  layout={!reduce}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, layout: { duration: reduce ? 0 : 0.3, ease: ease.out } }}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/prototype/scheme/?id=${s.id}`)}
                    className={cn("w-full rounded-[20px] bg-white p-4 text-left ring-1 ring-line transition-transform duration-150 active:scale-[0.99]", r.verdict === "no" && "bg-white/70")}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn(r.verdict === "no" && "opacity-60 grayscale")}>
                        <IconTile icon={vis.icon} tone={vis.tone} size="md" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11.5px] font-bold ring-1 ring-inset", V.badge)}>
                          <V.icon size={12} weight="fill" />
                          {t(`verdict.${r.verdict}`)}
                        </span>
                        <p className={cn("mt-1.5 text-[16px] font-semibold leading-snug", r.verdict === "no" ? "text-ink-2" : "text-ink")}>{loc(s.name, locale)}</p>
                        <p className="text-[13px] leading-snug text-ink-3">{loc(s.desc, locale)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={cn("text-[16px] font-semibold tabular-nums tracking-[-0.01em]", r.verdict === "no" ? "text-ink-3" : "text-ink")}>
                          {s.benefit != null ? formatINRCompact(s.benefit) : "—"}
                        </p>
                        <p className="text-[11px] text-ink-3">{loc(s.benefitNote, locale)}</p>
                      </div>
                    </div>
                    <p className={cn("mt-3 flex items-start gap-2 rounded-[12px] bg-surface/70 px-3 py-2 text-[13px] leading-snug", V.text)}>
                      <span className={cn("mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full", V.dot)} />
                      <span className="flex-1">{t(`reasons.${s.id}.${r.reason}`)}</span>
                      <CaretRight size={14} weight="bold" className="mt-0.5 shrink-0 text-ink-4" />
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-5 text-center text-[12px] leading-relaxed text-ink-3">{t("footnote")}</p>
      </div>
    </div>
  );
}
