"use client";

import { CaretLeft, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { ProgressBar } from "@/components/prototype/ui/ProgressBar";
import type { ApplyFlow as Flow, ApplyKind } from "@/lib/applyFlows";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import { ApplyDocuments, type DocState } from "./ApplyDocuments";
import { ApplyForm } from "./ApplyForm";
import { ApplyIntro } from "./ApplyIntro";
import { ApplyReview } from "./ApplyReview";
import { Receipt } from "./Receipt";
import { UpiSheet } from "./UpiSheet";
import { VoiceModal } from "./VoiceModal";

type Phase = "intro" | "form" | "documents" | "review" | "receipt";

const SUBMIT_KEY: Record<ApplyKind, string> = {
  apply: "submitApply",
  pay: "submitPay",
  renew: "submitRenew",
  register: "submitRegister",
  download: "submitDownload",
  grievance: "submitGrievance",
};

function genRef(kind: ApplyKind) {
  const n = Math.floor(100000 + Math.random() * 900000);
  if (kind === "pay") return `TXN-2026-${n}`;
  if (kind === "grievance") return `CPG-2026-${n}`;
  if (kind === "download") return `ACK-2026-${n}`;
  return `SAA-2026-${n}`;
}

/**
 * The apply engine UI for all 42 flows: intro → form steps (voice fill) →
 * documents (DigiLocker) → review (declaration) → [UPI] → receipt.
 */
export function ApplyFlow({ flow }: { flow: Flow }) {
  const router = useAppRouter();
  const t = useTranslations("apply");
  const tc = useTranslations("common");
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { addApplication, markBillPaid } = usePrototype();
  const topRef = useRef<HTMLDivElement>(null);

  const hasDocs = flow.documents.length > 0;
  const [phase, setPhase] = useState<Phase>("intro");
  const [dir, setDir] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [highlight, setHighlight] = useState<string[]>([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [docStates, setDocStates] = useState<DocState[]>(() => flow.documents.map(() => "idle"));
  const [declared, setDeclared] = useState(false);
  const [paying, setPaying] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [returnToReview, setReturnToReview] = useState(false);

  const step = flow.steps[stepIndex];
  const totalSteps = flow.steps.length + (hasDocs ? 1 : 0) + 1;
  const progressIndex =
    phase === "form" ? stepIndex + 1 : phase === "documents" ? flow.steps.length + 1 : phase === "review" ? totalSteps : phase === "receipt" ? totalSteps : 0;

  // Scroll the screen back to the top whenever the phase or step changes.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start" });
  }, [phase, stepIndex]);

  const go = (next: Phase, direction = 1) => {
    setDir(direction);
    setPhase(next);
  };

  const fillFromVoice = () => {
    if (!step?.voice) return;
    const ex = step.voice.extract;
    const next = { ...values };
    Object.keys(ex).forEach((fid) => (next[fid] = loc(ex[fid], locale)));
    setValues(next);
    setHighlight(Object.keys(ex));
    window.setTimeout(() => setHighlight([]), 1800);
  };

  const back = () => {
    if (phase === "form") {
      if (stepIndex > 0) {
        setDir(-1);
        setStepIndex((i) => i - 1);
      } else go("intro", -1);
    } else if (phase === "documents") {
      setStepIndex(flow.steps.length - 1);
      go("form", -1);
    } else if (phase === "review") {
      if (hasDocs) go("documents", -1);
      else {
        setStepIndex(flow.steps.length - 1);
        go("form", -1);
      }
    } else router.back();
  };

  const advanceForm = () => {
    if (returnToReview) {
      setReturnToReview(false);
      go("review");
    } else if (stepIndex < flow.steps.length - 1) {
      setDir(1);
      setStepIndex((i) => i + 1);
    } else go(hasDocs ? "documents" : "review");
  };

  const fetchAll = () => {
    flow.documents.forEach((_, i) => {
      if (docStates[i] !== "idle") return;
      window.setTimeout(() => setDocStates((s) => s.map((v, j) => (j === i ? "fetching" : v))), i * 520);
      window.setTimeout(() => setDocStates((s) => s.map((v, j) => (j === i ? "verified" : v))), i * 520 + 900);
    });
  };
  const uploadOne = (i: number) => {
    setDocStates((s) => s.map((v, j) => (j === i ? "fetching" : v)));
    window.setTimeout(() => setDocStates((s) => s.map((v, j) => (j === i ? "uploaded" : v))), 800);
  };

  const completed = useRef(false);
  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    const ref = genRef(flow.kind);
    setRefNumber(ref);
    addApplication({ id: `sub_${Date.now()}`, service: flow.service, ref, date: new Date(2026, 4, 24).toISOString(), status: flow.kind === "pay" || flow.kind === "download" ? "ready" : "submitted", flowId: flow.id });
    if (flow.kind === "pay") markBillPaid(flow.id);
    setPaying(false);
    go("receipt");
  }, [flow, addApplication, markBillPaid]);

  const submit = () => {
    if (flow.kind === "pay") setPaying(true);
    else complete();
  };

  const docsDone = docStates.every((s) => s === "verified" || s === "uploaded");
  const submitLabel = flow.kind === "pay" ? t("submitPay", { amount: flow.amount ?? "" }) : t(SUBMIT_KEY[flow.kind]);

  return (
    <div className="flex min-h-[774px] flex-col">
      <div ref={topRef} className="scroll-mt-[60px]" />

      {/* Nav */}
      {phase !== "receipt" && (
        <div className="sticky -top-[var(--proto-top)] z-20 -mt-[var(--proto-top)] bg-white/85 pt-[var(--proto-top)] backdrop-blur-xl">
          <div className="flex h-[50px] items-center gap-3 px-3">
            <button
              type="button"
              onClick={phase === "intro" ? () => router.back() : back}
              aria-label={tc("back")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-90"
            >
              {phase === "intro" ? <X size={20} weight="bold" /> : <CaretLeft size={20} weight="bold" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-center text-[14px] font-semibold text-ink">{loc(flow.service, locale)}</p>
              {phase !== "intro" && <ProgressBar value={progressIndex / totalSteps} className="mx-auto mt-1.5 w-[70%]" />}
            </div>
            <span className="w-9 text-right text-[12px] font-semibold tabular-nums text-ink-3">{phase !== "intro" ? `${progressIndex}/${totalSteps}` : ""}</span>
          </div>
        </div>
      )}

      <div className="relative flex-1 pt-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase === "form" ? `form-${stepIndex}` : phase}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * 32}px)` }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * -20}px)` }}
            transition={{ duration: 0.26, ease: ease.drawer }}
          >
            {phase === "intro" && <ApplyIntro flow={flow} />}
            {phase === "form" && step && (
              <ApplyForm
                step={step}
                index={stepIndex}
                total={flow.steps.length}
                values={values}
                highlight={highlight}
                onChange={(id, v) => setValues((p) => ({ ...p, [id]: v }))}
                onVoice={() => setVoiceOpen(true)}
              />
            )}
            {phase === "documents" && <ApplyDocuments documents={flow.documents} states={docStates} onFetchAll={fetchAll} onUpload={uploadOne} />}
            {phase === "review" && (
              <ApplyReview
                flow={flow}
                values={values}
                docsCount={flow.documents.length}
                declared={declared}
                onDeclare={setDeclared}
                onEdit={(si) => {
                  setStepIndex(si);
                  setReturnToReview(true);
                  go("form", -1);
                }}
              />
            )}
            {phase === "receipt" && (
              <Receipt flow={flow} refNumber={refNumber} onTrack={() => router.push("/prototype/track/")} onHome={() => router.push("/prototype/home/")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      {phase !== "receipt" && (
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-white via-white to-white/0 px-5 pb-3 pt-6">
          {phase === "intro" && (
            <Button fullWidth onClick={() => go("form")}>
              {flow.kind === "pay" ? t("startPay") : t("start")}
            </Button>
          )}
          {phase === "form" && (
            <Button fullWidth onClick={advanceForm}>
              {returnToReview ? t("backToReview") : tc("continue")}
            </Button>
          )}
          {phase === "documents" && (
            <Button fullWidth disabled={!docsDone} onClick={() => go("review")}>
              {tc("continue")}
            </Button>
          )}
          {phase === "review" && (
            <Button fullWidth variant={flow.kind === "pay" ? "saffron" : "primary"} disabled={!declared} onClick={submit}>
              {submitLabel}
            </Button>
          )}
        </div>
      )}

      {phase === "form" && step?.voice && (
        <VoiceModal
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          transcript={loc(step.voice.transcript, locale)}
          items={step.fields
            .filter((f) => step.voice!.extract[f.id])
            .map((f) => ({ label: loc(f.label, locale), value: loc(step.voice!.extract[f.id], locale) }))}
          onConfirm={fillFromVoice}
        />
      )}

      {flow.kind === "pay" && flow.amount && (
        <UpiSheet open={paying} amount={flow.amount} payee={flow.department} onClose={() => setPaying(false)} onPaid={complete} />
      )}
    </div>
  );
}
