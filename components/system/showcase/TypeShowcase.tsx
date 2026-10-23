"use client";

import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

const PAIRINGS = [
  {
    script: "Latin",
    display: "Geist",
    body: "Geist",
    displayFont: "var(--font-geist)",
    bodyFont: "var(--font-geist)",
    headline: "One door to every service.",
    text: "Tell Saathi what you need. It finds the right scheme, fills the form and keeps your receipt.",
    track: "-0.04em",
    lh: 1.6,
  },
  {
    script: "Devanagari · Hindi",
    display: "Anek Devanagari",
    body: "Noto Sans Devanagari",
    displayFont: "var(--font-anek-deva)",
    bodyFont: "var(--font-noto-deva)",
    headline: "हर सरकारी सेवा का एक द्वार।",
    text: "साथी को बताइए आपको क्या चाहिए। वह सही योजना खोजता है, फ़ॉर्म भरता है और रसीद संभाल कर रखता है।",
    track: "0",
    lh: 1.8,
  },
  {
    script: "Bengali · Bangla",
    display: "Anek Bangla",
    body: "Noto Sans Bengali",
    displayFont: "var(--font-anek-bangla)",
    bodyFont: "var(--font-noto-beng)",
    headline: "প্রতিটি সরকারি পরিষেবার একটি দরজা।",
    text: "সাথীকে বলুন আপনার কী দরকার। সে সঠিক প্রকল্প খুঁজে দেয়, ফর্ম পূরণ করে এবং রসিদ রেখে দেয়।",
    track: "0",
    lh: 1.8,
  },
  {
    script: "Tamil",
    display: "Anek Tamil",
    body: "Noto Sans Tamil",
    displayFont: "var(--font-anek-tamil)",
    bodyFont: "var(--font-noto-taml)",
    headline: "ஒவ்வொரு அரசு சேவைக்கும் ஒரே கதவு.",
    text: "உங்களுக்கு என்ன வேண்டும் என்று சாத்தியிடம் சொல்லுங்கள். சரியான திட்டத்தைக் கண்டு, படிவத்தை நிரப்பி, ரசீதைப் பாதுகாக்கும்.",
    track: "0",
    lh: 1.8,
  },
];

const SCALE = [
  { token: "display-2xl", cls: "text-display-2xl", sample: "2047" },
  { token: "display-xl", cls: "text-display-xl", sample: "Viksit Bharat" },
  { token: "h1", cls: "text-h1", sample: "Designed for every Indian" },
  { token: "h2", cls: "text-h2", sample: "Trust in five seconds" },
  { token: "h3", cls: "text-h3", sample: "Your applications" },
  { token: "title", cls: "text-title", sample: "Birth certificate" },
  { token: "body-l", cls: "text-body-l", sample: "Status is sacred — always show where a thing is." },
  { token: "body", cls: "text-body", sample: "Submitted to the Registrar, Kanpur Nagar." },
  { token: "label", cls: "text-label", sample: "Aadhaar verified" },
  { token: "caption", cls: "text-caption", sample: "Updated 2 min ago" },
];

export function TypeShowcase() {
  return (
    <ShowcaseSection
      id="type"
      index="03 — Typography"
      title="Four scripts. One voice."
      lede="Geist sets Latin with tight, confident tracking. Anek — by Ek Type, an Indian foundry — sets Indic headlines; Noto Sans, recommended by UX4G, carries Indic body text at a 1.8 line height."
    >
      <Stagger className="grid gap-4 md:grid-cols-2" gap={0.06}>
        {PAIRINGS.map((p) => (
          <StaggerItem key={p.script} className="flex flex-col rounded-panel border border-line p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <SpecLabel className="whitespace-nowrap">{p.script}</SpecLabel>
              <span className="font-mono text-caption text-ink-3">
                {p.display} / {p.body}
              </span>
            </div>
            <p
              className="mt-8 text-[clamp(28px,3.4vw,40px)] font-semibold text-ink"
              style={{ fontFamily: `${p.displayFont}, var(--font-geist)`, letterSpacing: p.track, lineHeight: p.lh === 1.6 ? 1.05 : 1.3 }}
            >
              {p.headline}
            </p>
            <p className="mt-4 text-body text-ink-2" style={{ fontFamily: `${p.bodyFont}, var(--font-geist)`, lineHeight: p.lh }}>
              {p.text}
            </p>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-panel border border-line p-7">
          <SpecLabel>Editorial accent — Instrument Serif</SpecLabel>
          <p className="mt-8 text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            One <span className="font-serif font-normal italic tracking-normal text-navy-600">door</span> to every service.
          </p>
          <p className="mt-4 text-label text-ink-3">Used for a single emotive word per headline, Latin only.</p>
        </div>
        <div className="rounded-panel border border-line bg-surface p-7">
          <SpecLabel>Data — Geist Mono</SpecLabel>
          <div className="mt-8 space-y-2 font-mono text-mono text-ink-2">
            <p>
              <span className="text-green-600">✓</span> DigiLocker.fetch(&quot;birth_record&quot;) <span className="text-ink-3">· 1.2s</span>
            </p>
            <p>
              <span className="text-navy-600">→</span> Ref SAA-2026-457029
            </p>
            <p>
              <span className="text-saffron-700">●</span> SLA 7 working days
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 divide-y divide-line border-y border-line">
        {SCALE.map((s) => (
          <div key={s.token} className="grid items-baseline gap-4 py-4 md:grid-cols-[140px_1fr]">
            <span className="font-mono text-caption text-ink-3">{s.token}</span>
            <span className={`${s.cls} truncate text-ink`}>{s.sample}</span>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  );
}
