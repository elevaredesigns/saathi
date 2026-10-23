"use client";

import { ArrowCounterClockwise, ArrowUp, Baby, CurrencyInr, IdentificationCard, Microphone, Stop, Translate, UsersThree, Wallet, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { AssistantTurn } from "@/components/agent/AgentBlocks";
import { useAgent } from "@/components/agent/useAgent";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import type { Locale } from "@/lib/i18n/config";
import { Waveform } from "@/components/prototype/apply/VoiceModal";
import { useScreenScroll } from "@/components/prototype/frame/IPhoneFrame";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { STARTERS } from "@/lib/agent/missions";
import type { MissionId } from "@/lib/agent/types";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { firstName } from "@/lib/i18n/names";
import { APPLICATIONS, getScheme, loc, type L } from "@/lib/mockData";

const STARTER_VISUAL: { icon: Icon; tone: TileTone }[] = [
  { icon: Baby, tone: "saffron" },
  { icon: Wallet, tone: "green" },
  { icon: CurrencyInr, tone: "teal" },
  { icon: IdentificationCard, tone: "navy" },
  { icon: UsersThree, tone: "violet" },
  { icon: Translate, tone: "neutral" },
];

export default function SaathiPage() {
  const t = useTranslations("agent");
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { user, accessibility } = usePrototype();
  const { containerRef } = useScreenScroll();
  const agent = useAgent({ slow: accessibility.slowMode });
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const booted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const say = (text: L | string, lc: Locale = locale) => (typeof text === "string" ? agent.send(text) : agent.send(loc(text, lc), text.en));

  // Deep links: ?q=, ?voice=1, ?moment=, ?scheme=, ?app=
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const p = new URLSearchParams(window.location.search);
    const q = p.get("q");
    const scheme = p.get("scheme");
    const app = p.get("app");
    const moment = p.get("moment");
    if (p.get("voice") === "1") setListening(true);
    else if (q === "help") agent.start(loc({ en: "I need help", hi: "मुझे मदद चाहिए", bn: "আমার সাহায্য দরকার", ta: "எனக்கு உதவி வேண்டும்" }, locale), "help");
    else if (q) agent.send(q);
    else if (moment === "newBaby") say(STARTERS[0].label);
    else if (scheme && getScheme(scheme)) {
      const name = loc(getScheme(scheme)!.name, locale);
      agent.start(loc({ en: `Tell me about ${name}`, hi: `${name} के बारे में बताइए`, bn: `${name} সম্পর্কে বলুন`, ta: `${name} பற்றிச் சொல்லுங்கள்` }, locale), "scheme", scheme);
    } else if (app) {
      const a = APPLICATIONS.find((x) => x.id === app);
      const mission: MissionId = app === "app_ayushman" ? "ayushman" : "status";
      const name = a ? loc(a.service, locale) : "";
      agent.start(loc({ en: `Where is my ${name}?`, hi: `मेरा ${name} कहाँ है?`, bn: `আমার ${name} কোথায়?`, ta: `என் ${name} எங்கே?` }, locale), mission, app);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Voice: listen briefly, then "hear" a request in the current language.
  useEffect(() => {
    if (!listening) return;
    const id = window.setTimeout(() => {
      setListening(false);
      say(STARTERS[0].label);
    }, 2600);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // Keep the latest message in view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || agent.turns.length === 0) return;
    const id = window.setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" }), 60);
    return () => window.clearTimeout(id);
  }, [agent.turns, containerRef, reduce]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    agent.send(text);
  };

  const empty = agent.turns.length === 0;

  return (
    <div className="flex min-h-[690px] flex-col">
      {/* Header */}
      <div className="sticky -top-[var(--proto-top)] z-20 -mt-[var(--proto-top)] bg-white/85 pt-[var(--proto-top)] backdrop-blur-xl">
        <div className="flex h-[54px] items-center gap-2.5 px-4">
          <SaathiOrb size={30} state={agent.busy ? "thinking" : listening ? "listening" : "idle"} />
          <div className="min-w-0 flex-1">
            <p className="text-[15.5px] font-semibold leading-tight text-ink">{t("title")}</p>
            <p className="truncate text-[11.5px] text-ink-3">{t("subtitle")}</p>
          </div>
          {!empty && (
            <button type="button" onClick={agent.reset} aria-label={t("newChat")} className="flex h-9 items-center gap-1.5 rounded-full bg-surface px-3 text-[13px] font-semibold text-ink-2 ring-1 ring-black/[0.04] active:scale-95">
              <ArrowCounterClockwise size={14} weight="bold" />
              {t("newChat")}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-4">
        {empty ? (
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="relative flex h-[170px] w-full items-center justify-center">
              <KolamField cols={5} rows={5} cell={40} seed={2047} density={0.62} diamond draw drawDuration={2.4} className="absolute h-[220px] w-[220px] text-navy-600/[0.1]" />
              <motion.div initial={reduce ? false : { opacity: 0, transform: "scale(0.9)" }} animate={{ opacity: 1, transform: "scale(1)" }} transition={{ type: "spring", duration: 0.7, bounce: 0.2 }}>
                <SaathiOrb size={104} state={listening ? "listening" : "idle"} />
              </motion.div>
            </div>
            <h1 className="mt-4 text-[25px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("greeting", { name: firstName(user.name, locale) })}</h1>
            <p className="mt-2 max-w-[290px] text-[14.5px] leading-relaxed text-ink-2">{t("intro")}</p>
            <Stagger className="mt-6 grid w-full grid-cols-2 gap-2 text-left" gap={0.05} delay={0.15} amount={0}>
              {STARTERS.map((s, i) => (
                <StaggerItem key={s.label.en}>
                  <button type="button" onClick={() => s.send && say(s.send)} className="flex h-full w-full flex-col items-start gap-2 rounded-[18px] bg-white p-3 text-left ring-1 ring-line transition-transform duration-150 active:scale-[0.97]">
                    <IconTile icon={STARTER_VISUAL[i].icon} tone={STARTER_VISUAL[i].tone} size="sm" />
                    <span className="text-[13.5px] font-semibold leading-snug text-ink">{loc(s.label, locale)}</span>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : (
          <div className="space-y-5 pt-3">
            {agent.turns.map((turn) =>
              turn.role === "user" ? (
                <motion.div key={turn.id} initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.3, ease: ease.out }} className="flex justify-end">
                  <p className="max-w-[82%] rounded-[20px] rounded-br-[6px] bg-navy-600 px-3.5 py-2.5 text-[15px] leading-snug text-white">{turn.text}</p>
                </motion.div>
              ) : (
                <AssistantTurn key={turn.id} items={turn.items} locale={turn.locale} awaitingId={agent.awaiting?.turnId === turn.id ? agent.awaiting.blockId : undefined} onApprove={agent.approve} onCancel={agent.cancel} onSend={say} />
              ),
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 z-20 bg-gradient-to-t from-white via-white to-white/0 px-3 pb-2 pt-4">
        <AnimatePresence mode="wait" initial={false}>
          {listening ? (
            <motion.div key="listen" initial={{ opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-[24px] bg-ink px-4 py-2 text-white">
              <span className="text-[14px] font-semibold">{t("listening")}</span>
              <Waveform bars={18} className="h-9 flex-1" />
              <button type="button" onClick={() => setListening(false)} aria-label={t("stop")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Stop size={16} weight="fill" />
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="type"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-center gap-2 rounded-[24px] bg-white p-1.5 pl-4 shadow-[0_12px_32px_-14px_rgba(31,67,184,0.35)] ring-1 ring-navy-100"
            >
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t("placeholder")} aria-label={t("placeholder")} className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-3" />
              {draft ? (
                <button type="submit" aria-label={t("send")} className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-navy-600 text-white active:scale-90">
                  <ArrowUp size={20} weight="bold" />
                </button>
              ) : (
                <button type="button" aria-label={t("speak")} onClick={() => setListening(true)} className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-ink text-white active:scale-90">
                  <Microphone size={20} weight="fill" />
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>
        <p className="mt-1.5 text-center text-[10.5px] text-ink-3">{t("trustLine")}</p>
      </div>
    </div>
  );
}
