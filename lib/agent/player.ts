/** Pure sequencing rules for the agent player (timing + consent pauses). */
import type { Block, Effect } from "./types";

/** How long each block takes to appear, so the agent reads as working, not instant. */
export function delayFor(block: Block, textWords = 0): number {
  switch (block.kind) {
    case "thinking":
      return block.ms ?? 900;
    case "tool":
      return block.ms;
    case "text":
      return Math.min(1600, 280 + textWords * 45);
    case "plan":
      return 700;
    case "cards":
      return 500;
    case "info":
      return 450;
    case "consent":
      return 450;
    case "outcome":
      return 700;
    case "suggestions":
      return 250;
  }
}

/**
 * Split a mission into segments. Every segment except the last ends with a
 * consent block; the player stops there until the person approves.
 */
export function segment(blocks: Block[]): Block[][] {
  const out: Block[][] = [];
  let cur: Block[] = [];
  for (const b of blocks) {
    cur.push(b);
    if (b.kind === "consent") {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
}

/** Effects that change a citizen's records, money or who is acting. */
export function isConsequential(effect: Effect): boolean {
  return effect.type !== "setLocale";
}

/**
 * Safety invariant: any consequential effect must be preceded by a consent
 * block. Returns the offending block index, or -1 when the mission is safe.
 */
export function firstUnconsentedEffect(blocks: Block[]): number {
  let consented = false;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === "consent") consented = true;
    if (b.kind === "outcome" && b.effects?.some(isConsequential) && !consented) return i;
  }
  return -1;
}

/** Deterministic-looking reference numbers for outcomes. */
export function makeRef(prefix: string, seed = Date.now()): string {
  const n = 100000 + (Math.abs(Math.floor(seed * 9301 + 49297)) % 900000);
  return `${prefix}-2026-${n}`;
}
