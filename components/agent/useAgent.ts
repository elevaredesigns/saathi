"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { routeRequest, scriptLocale } from "@/lib/agent/intents";
import { buildMission } from "@/lib/agent/missions";
import { delayFor, makeRef, segment } from "@/lib/agent/player";
import type { Block, Effect, MissionId, Suggestion } from "@/lib/agent/types";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { loc } from "@/lib/mockData";

export interface RenderedBlock {
  id: string;
  block: Block;
  status: "running" | "done";
  ref?: string;
  decision?: "approved" | "cancelled";
}

export type Turn = { id: string; role: "user"; text: string } | { id: string; role: "assistant"; items: RenderedBlock[]; locale: Locale };

const CANCELLED: Block = {
  kind: "text",
  text: {
    en: "Cancelled. Nothing was shared, submitted or paid.",
    hi: "रद्द किया। कुछ भी साझा, जमा या भुगतान नहीं हुआ।",
    bn: "বাতিল করা হয়েছে। কিছুই শেয়ার, জমা বা পরিশোধ হয়নি।",
    ta: "ரத்து செய்யப்பட்டது. எதுவும் பகிரப்படவோ, சமர்ப்பிக்கப்படவோ, செலுத்தப்படவோ இல்லை.",
  },
};

const SWITCH_REQUEST: Partial<Record<Locale, string>> = { hi: "Talk to me in Hindi", bn: "Talk to me in Bengali", ta: "Talk to me in Tamil" };

/** When Saathi answers in the language someone typed in, offer to switch the whole app to it. */
function offerSwitch(blocks: Block[], lc: Locale) {
  const send = SWITCH_REQUEST[lc];
  if (!send) return;
  const name = localeMeta[lc].native;
  const chip: Suggestion = {
    label: { en: `Use ${name} everywhere`, hi: `पूरा ऐप ${name} में`, bn: `পুরো অ্যাপ ${name}-এ`, ta: `முழு செயலியும் ${name}-இல்` },
    send: { en: send, hi: send, bn: send, ta: send },
  };
  const last = [...blocks].reverse().find((b) => b.kind === "suggestions");
  if (last && last.kind === "suggestions") last.items = [chip, ...last.items];
  else blocks.push({ kind: "suggestions", items: [chip] });
}

let uid = 0;
const nextId = () => `a${++uid}`;
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/** Runs scripted missions: reveals blocks with timing, pauses at consent, applies effects. */
export function useAgent({ slow = false }: { slow?: boolean } = {}) {
  const { locale, setLocale } = useLocaleSwitch();
  const proto = usePrototype();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [awaiting, setAwaiting] = useState<{ turnId: string; blockId: string; rest: Block[] } | null>(null);
  const generation = useRef(0);

  // Latest context for effects and mission building without stale closures.
  const ctxRef = useRef({ locale, proto, setLocale, slow });
  ctxRef.current = { locale, proto, setLocale, slow };

  useEffect(() => () => void (generation.current += 1), []);

  const patchTurn = (turnId: string, fn: (items: RenderedBlock[]) => RenderedBlock[]) =>
    setTurns((all) => all.map((t) => (t.id === turnId && t.role === "assistant" ? { ...t, items: fn(t.items) } : t)));

  const applyEffects = (effects: Effect[] | undefined, ref: string) => {
    const { proto: p, setLocale: switchTo } = ctxRef.current;
    for (const e of effects ?? []) {
      if (e.type === "addApplication") p.addApplication({ id: `ai_${Date.now()}_${e.refPrefix}`, service: e.service, ref: ref || makeRef(e.refPrefix), date: new Date(2026, 4, 24).toISOString(), status: e.status });
      if (e.type === "markBillPaid") p.markBillPaid(e.id);
      if (e.type === "setProxy") p.setProxy(e.id);
      if (e.type === "setLocale") switchTo(e.locale);
    }
  };

  const play = useCallback(async (turnId: string, blocks: Block[]) => {
    const gen = generation.current;
    const [first, ...later] = segment(blocks);
    setBusy(true);
    for (const block of first ?? []) {
      if (gen !== generation.current) return;
      const id = nextId();
      const ref = block.kind === "outcome" && block.refPrefix ? makeRef(block.refPrefix) : undefined;
      const timed = block.kind === "thinking" || block.kind === "tool";
      patchTurn(turnId, (items) => [...items, { id, block, status: timed ? "running" : "done", ref }]);
      if (block.kind === "outcome") applyEffects(block.effects, ref ?? "");

      const words = block.kind === "text" ? loc(block.text, ctxRef.current.locale).split(/\s+/).length : 0;
      const ms = delayFor(block, words) * (ctxRef.current.slow ? 1.6 : 1);
      await wait(ms);
      if (gen !== generation.current) return;
      if (timed) patchTurn(turnId, (items) => items.map((it) => (it.id === id ? { ...it, status: "done" } : it)));

      if (block.kind === "consent") {
        setAwaiting({ turnId, blockId: id, rest: later.flat() });
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(
    (userText: string, mission: MissionId, param?: string, routedText?: string) => {
      generation.current += 1;
      setAwaiting(null);
      const { locale: current, proto: p } = ctxRef.current;
      // Answer in the language the question was written in.
      const typed = mission === "language" ? null : scriptLocale(userText);
      const replyIn: Locale = typed ?? current;
      const m = buildMission(mission, { paidBills: p.paidBills, lifeContext: p.lifeContext, locale: replyIn }, routedText ?? userText, param);
      if (replyIn !== current) offerSwitch(m.blocks, replyIn);
      const userTurn: Turn = { id: nextId(), role: "user", text: userText };
      const botTurn: Turn = { id: nextId(), role: "assistant", items: [], locale: replyIn };
      setTurns((all) => [...all, userTurn, botTurn]);
      window.setTimeout(() => play(botTurn.id, m.blocks), 350);
    },
    [play],
  );

  /** `intentText` lets a tapped suggestion route by its English source when shown in another language. */
  const send = useCallback(
    (text: string, intentText?: string) => {
      const route = routeRequest(intentText ?? text);
      // Missions read the request itself (focus, parts) — give them the text that was routed.
      start(text, route.mission, route.param, intentText);
    },
    [start],
  );

  const decide = useCallback(
    (decision: "approved" | "cancelled") => {
      if (!awaiting) return;
      const { turnId, blockId, rest } = awaiting;
      setAwaiting(null);
      patchTurn(turnId, (items) => items.map((it) => (it.id === blockId ? { ...it, decision } : it)));
      if (decision === "approved") play(turnId, rest);
      else {
        const suggestions = rest.filter((b) => b.kind === "suggestions");
        play(turnId, [CANCELLED, ...suggestions]);
      }
    },
    [awaiting, play],
  );

  const reset = useCallback(() => {
    generation.current += 1;
    setTurns([]);
    setBusy(false);
    setAwaiting(null);
  }, []);

  return { turns, busy, awaiting, send, start, approve: () => decide("approved"), cancel: () => decide("cancelled"), reset };
}
