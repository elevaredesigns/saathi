/**
 * Saathi AI — scripted agent model.
 *
 * A mission is an ordered list of blocks. The player reveals them with
 * realistic timing, pauses at every consent block, and only applies effects
 * (submitting, paying, acting for someone) from outcome blocks that come after
 * a consent. No language model is involved: every word is reviewable.
 */
import type { Locale } from "@/lib/i18n/config";
import type { AppStatus, L } from "@/lib/mockData";

export type MissionId =
  | "newBaby" | "owed" | "tax" | "ayushman" | "father" | "language" | "help" | "track" | "fallback" | "scheme" | "status"
  /** A detailed answer about one service or scheme (param: flow id). */
  | "answer"
  /** A question about Saathi itself (param: FAQ id). */
  | "faq"
  /** Several questions in one message, answered in turn. */
  | "compound";

export type Effect =
  | { type: "addApplication"; service: L; refPrefix: string; status: AppStatus }
  | { type: "markBillPaid"; id: string }
  | { type: "setProxy"; id: string }
  | { type: "setLocale"; locale: Locale };

export type AgentCard =
  | { kind: "scheme"; schemeId: string; reason: L }
  | { kind: "bill"; title: L; amount: string; due: L; payee: L }
  | { kind: "place"; title: string; sub: L; distance: string }
  | { kind: "app"; appId: string; note: L };

export interface Suggestion {
  label: L;
  /** Text sent to Saathi when tapped. */
  send?: L;
  /** Or navigate somewhere in the prototype. */
  href?: string;
}

export type Block =
  | { kind: "text"; text: L }
  | { kind: "thinking"; label: L; ms?: number }
  | { kind: "plan"; title: L; steps: L[] }
  | { kind: "tool"; source: string; action: L; result: L; ms: number; planStep?: number }
  | { kind: "cards"; cards: AgentCard[] }
  /** Reference information: numbered steps, a checklist, or label–value facts. */
  | { kind: "info"; variant: "steps" | "list" | "facts"; title: L; items?: L[]; rows?: { label: L; value: L }[] }
  | { kind: "consent"; title: L; recipient: L; items: L[]; validity: L; approve: L; editHref?: string }
  | { kind: "outcome"; title: L; refPrefix: string; lines: L[]; href?: string; hrefLabel?: L; effects?: Effect[] }
  | { kind: "suggestions"; items: Suggestion[] };

export interface Mission {
  id: MissionId;
  blocks: Block[];
}

export interface MissionContext {
  paidBills: string[];
  lifeContext: string[];
  locale: Locale;
}
