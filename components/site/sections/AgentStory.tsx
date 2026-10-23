"use client";

import { Check, CheckCircle, CircleNotch, Eye, Hand, Lifebuoy, SealCheck, ShieldCheck, Sparkle, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

const GUARD_ICONS: Icon[] = [SealCheck, Hand, Eye, Lifebuoy];

function Step({ index, title, body, onActive }: { index: number; title: string; body: string; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-[64vh] flex-col justify-center py-10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-[15px] font-semibold tabular-nums text-navy-700">{index + 1}</span>
      <h3 className="mt-5 max-w-[20ch] text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[var(--track-tight)] text-ink">{title}</h3>
      <p className="mt-4 max-w-md text-[18px] leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

/** Animated conversation that grows with the active step. */
function Conversation({ step }: { step: number }) {
  const t = useTranslations("site.ai.demo");
  const reduce = useReducedMotion();
  const plan = t.raw("plan") as string[];
  const consentItems = t.raw("consentItems") as string[];
  const [checked, setChecked] = useState(0);

  // Plan items tick one by one once the plan is on screen.
  useEffect(() => {
    if (step < 1) return setChecked(0);
    if (step >= 3) return setChecked(plan.length);
    setChecked(0);
    const timers = plan.map((_, i) => window.setTimeout(() => setChecked((c) => Math.max(c, i + 1)), 500 + i * 450));
    return () => timers.forEach(window.clearTimeout);
  }, [step, plan]);

  const enter = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(14px) scale(0.98)" },
    animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
    exit: { opacity: 0 },
    transition: { duration: 0.45, ease: ease.cinematic },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[36px] border border-[#CBD1DC] bg-white shadow-[0_1px_2px_rgba(11,13,20,0.06),0_2px_0_rgba(255,255,255,1)_inset,0_40px_90px_-36px_rgba(31,67,184,0.38)]">
      <div className="flex items-center gap-3 border-b border-[#DDE1E9] bg-surface px-5 py-4">
        <SaathiOrb size={36} state={step === 1 ? "thinking" : step === 0 ? "listening" : "idle"} />
        <div>
          <p className="text-[15px] font-semibold text-ink">Saathi</p>
          <p className="text-[12.5px] text-ink-3">{step === 1 ? t("thinking") : "Nagar Nigam · e-District · DigiLocker"}</p>
        </div>
      </div>

      <div className="no-scrollbar flex flex-1 flex-col justify-end gap-3 overflow-hidden p-4">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key="ask" layout {...enter} className="ml-auto max-w-[85%] rounded-[22px] rounded-br-[6px] bg-navy-600 px-4 py-3 text-white">
            <p lang="hi" className="font-noto-deva text-[16px] leading-snug">
              {t("ask")}
            </p>
            <p className="mt-1 text-[12.5px] text-white/70">{t("askTranslation")}</p>
          </motion.div>

          {step >= 1 && (
            <motion.div key="plan" layout {...enter} className="max-w-[92%] rounded-[22px] rounded-bl-[6px] bg-surface p-4 ring-1 ring-inset ring-[#E1E5EC]">
              <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                <Sparkle size={15} weight="fill" className="text-navy-600" />
                {t("planTitle")}
              </p>
              <ol className="mt-3 space-y-2">
                {plan.map((p, i) => (
                  <li key={p} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-2">
                    <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300", i < checked ? "bg-green-600 text-white" : "bg-white text-ink-3 ring-1 ring-line")}>
                      {i < checked ? <Check size={11} weight="bold" /> : i === checked && step === 1 ? <CircleNotch size={11} weight="bold" className="animate-spin" /> : i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div key="consent" layout {...enter} className="max-w-[92%] rounded-[22px] rounded-bl-[6px] p-4 ring-2 ring-navy-600">
              <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                <ShieldCheck size={16} weight="fill" className="text-navy-600" />
                {t("consentTitle")}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {consentItems.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[13.5px] text-ink-2">
                    <Check size={13} weight="bold" className="text-green-600" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12.5px] text-ink-3">{t("consentValidity")}</p>
              <div className="mt-3 flex gap-2">
                <span className={cn("flex h-9 flex-1 items-center justify-center rounded-full text-[13.5px] font-semibold transition-colors duration-300", step >= 3 ? "bg-green-600 text-white" : "bg-navy-600 text-white")}>
                  {step >= 3 ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={16} weight="fill" />
                      {t("approved")}
                    </span>
                  ) : (
                    t("approve")
                  )}
                </span>
                <span className="flex h-9 items-center rounded-full px-4 text-[13.5px] font-semibold text-ink-2 ring-1 ring-[#D3D8E2]">{t("edit")}</span>
              </div>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div key="done" layout {...enter} className="relative max-w-[92%] overflow-hidden rounded-[22px] rounded-bl-[6px] bg-gradient-to-br from-navy-900 to-navy-600 p-4 text-white">
              <Guilloche variant="band" tone="white" opacity={0.16} className="absolute inset-0 h-full w-full" />
              <p className="relative flex items-center gap-1.5 text-[15px] font-semibold">
                <CheckCircle size={18} weight="fill" className="text-[#8BE3AE]" />
                {t("doneTitle")}
              </p>
              <p className="relative mt-1 font-mono text-[14px] tracking-[0.04em]">{t("doneRef")}</p>
              <p className="relative mt-2 text-[13px] text-white/80">{t("doneOfficer")}</p>
              <p className="relative text-[13px] text-white/80">{t("doneEta")}</p>
              <p className="relative mt-3 rounded-[14px] bg-white/12 px-3 py-2 text-[13px] font-medium ring-1 ring-inset ring-white/20">{t("bonus")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AgentStory() {
  const t = useTranslations("site.ai");
  const steps = t.raw("steps") as { title: string; body: string }[];
  const guardrails = t.raw("guardrails") as { title: string; body: string }[];
  const [active, setActive] = useState(0);

  return (
    <section id="ai" className="scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <TextReveal as="h2" text={t("title")} className="text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            {steps.map((s, i) => (
              <Step key={s.title} index={i} title={s.title} body={s.body} onActive={setActive} />
            ))}
          </div>
          <div className="relative hidden md:block">
            <div className="sticky top-[calc(50vh-320px)] h-[640px]">
              <Conversation step={active} />
            </div>
          </div>
        </div>

        {/* Mobile: the finished conversation */}
        <div className="h-[640px] md:hidden">
          <Conversation step={3} />
        </div>

        <div className="mt-24">
          <p className="text-[22px] font-semibold tracking-[-0.015em] text-ink">{t("guardrailsTitle")}</p>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {guardrails.map((g, i) => {
              const Glyph = GUARD_ICONS[i];
              return (
                <Reveal key={g.title} delay={i * 0.06}>
                  <Glyph size={28} weight="duotone" className="text-navy-600" />
                  <p className="mt-3 text-[17px] font-semibold text-ink">{g.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{g.body}</p>
                </Reveal>
              );
            })}
          </div>
          <Link href="/prototype/saathi/" className="mt-12 inline-flex h-12 items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]">
            <SaathiOrb size={34} />
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
