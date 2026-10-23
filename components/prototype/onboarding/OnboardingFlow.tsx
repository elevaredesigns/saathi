"use client";

import { CaretLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/prototype/ui/ProgressBar";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import { AadhaarStep } from "./steps/AadhaarStep";
import { AccessibilityStep } from "./steps/AccessibilityStep";
import { ConsentStep } from "./steps/ConsentStep";
import { DoneStep } from "./steps/DoneStep";
import { LanguageStep } from "./steps/LanguageStep";
import { LifeContextStep } from "./steps/LifeContextStep";
import { OtpStep } from "./steps/OtpStep";
import { ProfileStep } from "./steps/ProfileStep";
import { WelcomeStep } from "./steps/WelcomeStep";

const STEPS = ["language", "welcome", "aadhaar", "otp", "consent", "profile", "context", "accessibility", "done"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingFlow() {
  const router = useAppRouter();
  const t = useTranslations("common");
  const to = useTranslations("onboarding");
  const reduce = useReducedMotion();
  const { completeOnboarding } = usePrototype();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [consented, setConsented] = useState(true);

  // Deep link straight to a step for demos: /prototype/onboarding/?step=aadhaar
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("step");
    const i = STEPS.indexOf(wanted as Step);
    if (i > 0) setIndex(i);
  }, []);

  const goTo = (step: Step) => {
    const i = STEPS.indexOf(step);
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };
  const next = () => {
    setDir(1);
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => {
    setDir(-1);
    setIndex((i) => Math.max(i - 1, 0));
  };
  const finish = () => {
    completeOnboarding();
    router.replace("/prototype/home/");
  };

  const step = STEPS[index];
  const showChrome = step !== "done";

  return (
    <div className="flex h-[774px] flex-col">
      <div className="flex h-[48px] shrink-0 items-center gap-3 px-4">
        <div className="w-9">
          {index > 0 && showChrome && (
            <button
              type="button"
              onClick={back}
              aria-label={t("back")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-90"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
          )}
        </div>
        {showChrome && (
          <>
            <ProgressBar value={(index + 1) / (STEPS.length - 1)} className="flex-1" label={to("stepOf", { n: index + 1, total: STEPS.length - 1 })} />
            <span className="w-12 text-right text-[12px] font-semibold tabular-nums text-ink-3">
              {index + 1}/{STEPS.length - 1}
            </span>
          </>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * 36}px)` }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * -24}px)` }}
            transition={{ duration: 0.28, ease: ease.drawer }}
            className="absolute inset-0"
          >
            {step === "language" && <LanguageStep onNext={next} />}
            {step === "welcome" && <WelcomeStep onNext={next} />}
            {step === "aadhaar" && <AadhaarStep onNext={next} onDigiLocker={() => goTo("consent")} />}
            {step === "otp" && <OtpStep onNext={next} />}
            {step === "consent" && (
              <ConsentStep
                onAllow={() => {
                  setConsented(true);
                  next();
                }}
                onSkip={() => {
                  setConsented(false);
                  next();
                }}
              />
            )}
            {step === "profile" && <ProfileStep onNext={next} fetched={consented} />}
            {step === "context" && <LifeContextStep onNext={next} />}
            {step === "accessibility" && <AccessibilityStep onNext={next} />}
            {step === "done" && <DoneStep onDone={finish} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
