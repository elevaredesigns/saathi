import { describe, expect, it } from "vitest";

import { APPLY_FLOW_IDS } from "@/lib/applyFlows";

import { detectLanguageRequest, matchIntent, routeRequest, scriptLocale } from "./intents";
import { ALL_MISSIONS, buildMission, STARTERS } from "./missions";
import { delayFor, firstUnconsentedEffect, makeRef, segment } from "./player";
import type { Block, MissionContext } from "./types";

const ctx: MissionContext = { paidBills: [], lifeContext: [], locale: "en" };

describe("matchIntent", () => {
  it.each([
    ["Get my daughter's birth certificate", "newBaby"],
    ["मेरी बेटी का जन्म प्रमाणपत्र बनवाना है", "newBaby"],
    ["Which schemes am I eligible for?", "owed"],
    ["मुझे कौन सी योजनाएँ मिल सकती हैं?", "owed"],
    ["Pay my property tax", "tax"],
    ["আমার সম্পত্তি কর দিতে চাই", "tax"],
    ["Where is my Ayushman card?", "ayushman"],
    ["मेरा आयुष्मान कार्ड कहाँ है?", "ayushman"],
    ["Submit my father's life certificate", "father"],
    ["அப்பாவின் ஓய்வூதியம்", "father"],
    ["हिंदी में बात करो", "language"],
    ["Talk to me in Tamil", "language"],
    ["I want to talk to a person", "help"],
    ["Show my applications", "track"],
    ["asdfgh", "fallback"],
    ["", "fallback"],
  ])("%s → %s", (text, id) => {
    expect(matchIntent(text)).toBe(id);
  });
});

describe("detectLanguageRequest", () => {
  it("finds the requested language in any script", () => {
    expect(detectLanguageRequest("हिंदी में बात करो")).toBe("hi");
    expect(detectLanguageRequest("Talk to me in Bangla")).toBe("bn");
    expect(detectLanguageRequest("தமிழில் பேசு")).toBe("ta");
    expect(detectLanguageRequest("nothing here")).toBeNull();
  });
});

describe("missions", () => {
  const missions = ALL_MISSIONS.map((id) => buildMission(id, ctx, "hindi"));

  it("never changes records, money or proxy without consent first", () => {
    for (const m of missions) expect(firstUnconsentedEffect(m.blocks), m.id).toBe(-1);
    expect(firstUnconsentedEffect(buildMission("tax", { ...ctx, paidBills: ["taxes_property"] }).blocks)).toBe(-1);
  });

  it("is fully localized — every string exists in all four languages", () => {
    const check = (value: unknown, path: string) => {
      if (value && typeof value === "object" && "en" in value && "hi" in value) {
        for (const loc of ["en", "hi", "bn", "ta"]) expect((value as Record<string, string>)[loc], `${path}.${loc}`).toBeTruthy();
        return;
      }
      if (Array.isArray(value)) value.forEach((v, i) => check(v, `${path}[${i}]`));
      else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => check(v, `${path}.${k}`));
    };
    missions.forEach((m) => check(m.blocks, m.id));
    check(STARTERS, "starters");
  });

  it("ends every mission with a way forward", () => {
    for (const m of missions) expect(m.blocks.some((b) => b.kind === "suggestions"), m.id).toBe(true);
  });

  it("knows when the tax is already paid", () => {
    const paid = buildMission("tax", { ...ctx, paidBills: ["taxes_property"] });
    expect(paid.blocks.some((b) => b.kind === "consent")).toBe(false);
  });

  it("switches to the requested language", () => {
    const m = buildMission("language", ctx, "talk to me in tamil");
    const outcome = m.blocks.find((b) => b.kind === "outcome") as Extract<Block, { kind: "outcome" }>;
    expect(outcome.effects).toEqual([{ type: "setLocale", locale: "ta" }]);
  });

  it("confirms a machine-assisted switch in the new language", () => {
    const m = buildMission("language", ctx, "talk to me in telugu");
    const outcome = m.blocks.find((b) => b.kind === "outcome") as Extract<Block, { kind: "outcome" }>;
    expect(outcome.effects).toEqual([{ type: "setLocale", locale: "te" }]);
    expect(outcome.title.te).toContain("తెలుగు");
  });

  it("switches to every Eighth Schedule language, including the last six added", () => {
    for (const [ask, loc] of [["sanskrit", "sa"], ["bodo", "brx"], ["dogri", "dgo"], ["kashmiri", "ks"], ["manipuri", "mni"], ["santali", "sat"]] as const) {
      const m = buildMission("language", ctx, `talk to me in ${ask}`);
      const outcome = m.blocks.find((b) => b.kind === "outcome") as Extract<Block, { kind: "outcome" }>;
      expect(outcome?.effects, ask).toEqual([{ type: "setLocale", locale: loc }]);
    }
  });
});

describe("player", () => {
  it("splits a mission into segments that end at consent", () => {
    const blocks = buildMission("newBaby", ctx).blocks;
    const segs = segment(blocks);
    expect(segs.length).toBe(2);
    expect(segs[0][segs[0].length - 1].kind).toBe("consent");
    expect(segs.flat()).toHaveLength(blocks.length);
  });

  it("flags an outcome that acts before consent", () => {
    const unsafe: Block[] = [{ kind: "outcome", title: { en: "x", hi: "x", bn: "x", ta: "x" }, refPrefix: "X", lines: [], effects: [{ type: "markBillPaid", id: "t" }] }];
    expect(firstUnconsentedEffect(unsafe)).toBe(0);
  });

  it("gives every block a sensible delay", () => {
    for (const b of buildMission("tax", ctx).blocks) {
      const d = delayFor(b, 12);
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThanOrEqual(2000);
    }
  });

  it("makes reference numbers in the house format", () => {
    expect(makeRef("SAA", 42)).toMatch(/^SAA-2026-\d{6}$/);
  });
});

describe("routeRequest — more questions, answered in detail", () => {
  it.each([
    // tasks the agent carries out stay tasks
    ["Get my daughter's birth certificate", "newBaby", undefined],
    ["Pay my property tax", "tax", undefined],
    ["Where is my Ayushman card?", "ayushman", undefined],
    ["हिंदी में बात करो", "language", undefined],
    ["Show my applications", "track", undefined],
    // questions about a service get a detailed answer
    ["What documents do I need for a driving licence?", "answer", "transport_dl"],
    ["How do I pay a traffic challan?", "answer", "transport_challan"],
    ["What documents are needed for a birth certificate?", "answer", "cert_birth"],
    ["How long does an income certificate take?", "answer", "cert_income"],
    ["Am I eligible for PM-KISAN?", "answer", "pmkisan"],
    ["What is Ayushman Bharat?", "answer", "pmjay"],
    ["Tell me about Sukanya Samriddhi", "answer", "sukanya"],
    ["how to apply for caste certificate", "answer", "cert_caste"],
    ["learner licence fees", "answer", "transport_ll"],
    ["I want to file an income tax return", "answer", "taxes_income"],
    ["ड्राइविंग लाइसेंस के लिए कौन से दस्तावेज़ चाहिए?", "answer", "transport_dl"],
    ["आय प्रमाणपत्र कैसे बनवाएं", "answer", "cert_income"],
    ["মনরেগা জব কার্ড", "answer", "emp_jobcard"],
    ["ஓட்டுநர் உரிமம் புதுப்பிக்க என்ன ஆவணங்கள் தேவை", "answer", "transport_dl"],
    // questions about Saathi itself
    ["What can you do?", "faq", "about"],
    ["Who can see my data?", "faq", "privacy"],
    ["Is this an official government app?", "faq", "official"],
    ["An agent is asking me for a bribe", "faq", "scam"],
    // several questions in one message
    ["What is PM-KISAN and how do I pay a traffic challan?", "compound", undefined],
    ["Pay my property tax and tell me about Sukanya Samriddhi", "compound", undefined],
    // still honest when it can't place a request
    ["asdfgh", "fallback", undefined],
  ])("%s → %s %s", (text, mission, param) => {
    const r = routeRequest(text);
    expect(r.mission).toBe(mission);
    if (param) expect(r.param).toBe(param);
  });
});

describe("detailed answers", () => {
  const answerIds = APPLY_FLOW_IDS;

  it("answers every one of the 53 services, fully localized, with a way forward", () => {
    expect(answerIds.length).toBeGreaterThanOrEqual(53);
    for (const id of answerIds) {
      const m = buildMission("answer", ctx, `tell me about ${id}`, id);
      const kinds = m.blocks.map((b) => b.kind);
      expect(kinds, id).toContain("info");
      expect(kinds[kinds.length - 1], id).toBe("suggestions");
      expect(firstUnconsentedEffect(m.blocks), id).toBe(-1);
      const texts = JSON.stringify(m.blocks);
      expect(texts, id).not.toContain("undefined");
      for (const b of m.blocks) {
        if (b.kind === "info") for (const it of [...(b.items ?? []), ...(b.rows ?? []).flatMap((r) => [r.label, r.value]), b.title]) for (const lc of ["en", "hi", "bn", "ta"] as const) expect(it[lc], `${id} ${b.variant} ${lc}`).toBeTruthy();
      }
    }
  });

  it("leads with what was asked", () => {
    const docsFirst = buildMission("answer", ctx, "what documents for driving licence", "transport_dl").blocks.filter((b) => b.kind === "info");
    expect((docsFirst[0] as Extract<Block, { kind: "info" }>).title.en).toMatch(/Documents/);
    const stepsFirst = buildMission("answer", ctx, "how do I renew driving licence", "transport_dl").blocks.filter((b) => b.kind === "info");
    expect((stepsFirst[0] as Extract<Block, { kind: "info" }>).title.en).toMatch(/How it works/);
    const whoFirst = buildMission("answer", ctx, "am I eligible for pm kisan", "pmkisan").blocks.filter((b) => b.kind === "info");
    expect((whoFirst[0] as Extract<Block, { kind: "info" }>).title.en).toMatch(/Who can apply/);
  });

  it("states fee, time, office and portal from the same data the form uses", () => {
    const facts = buildMission("answer", ctx, "", "cert_birth").blocks.find((b) => b.kind === "info" && b.variant === "facts") as Extract<Block, { kind: "info" }>;
    const flat = facts.rows!.map((r) => `${r.label.en}: ${r.value.en}`).join(" | ");
    expect(flat).toContain("Fee: ₹30");
    expect(flat).toContain("Official portal: e-District");
  });

  it("answers each part of a multi-question message, task last", () => {
    const m = buildMission("compound", ctx, "Pay my property tax and tell me about Sukanya Samriddhi");
    const kinds = m.blocks.map((b) => b.kind);
    expect(kinds.indexOf("info")).toBeLessThan(kinds.indexOf("consent"));
    expect(firstUnconsentedEffect(m.blocks)).toBe(-1);
    expect(kinds.filter((k) => k === "suggestions").length).toBe(1);
  });

  it("answers every FAQ in all four languages", () => {
    for (const id of ["about", "privacy", "official", "offline", "free", "scam", "digilocker"]) {
      const m = buildMission("faq", ctx, "", id);
      expect(m.blocks.some((b) => b.kind === "suggestions"), id).toBe(true);
      for (const b of m.blocks) if (b.kind === "text") for (const lc of ["en", "hi", "bn", "ta"] as const) expect(b.text[lc], `${id} ${lc}`).toBeTruthy();
    }
  });

  it("offers the closest services instead of a dead end", () => {
    const m = buildMission("fallback", ctx, "licence");
    const sug = m.blocks.find((b) => b.kind === "suggestions") as Extract<Block, { kind: "suggestions" }>;
    expect(sug.items.some((s) => /licence/i.test(s.label.en))).toBe(true);
  });
});

describe("scriptLocale — answer in the language it was asked in", () => {
  it.each([
    ["ड्राइविंग लाइसेंस के लिए कौन से दस्तावेज़ चाहिए?", "hi"],
    ["আমার সম্পত্তি কর দিতে চাই", "bn"],
    ["ஓட்டுநர் உரிமம் புதுப்பிக்க என்ன ஆவணங்கள் தேவை", "ta"],
    ["What documents do I need?", null],
    ["mujhe birth certificate chahiye", null],
  ])("%s → %s", (text, lc) => {
    expect(scriptLocale(text)).toBe(lc);
  });
});
