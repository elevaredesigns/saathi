"use client";

import {
  ArrowCounterClockwise,
  Baby,
  CreditCard,
  FirstAidKit,
  Buildings,
  ShieldCheck,
  Sparkle,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Wordmark } from "@/components/system/brand/Wordmark";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Badge } from "@/components/system/ui/Badge";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

type FlowKey = "fresh" | "saathi" | "birth" | "tax" | "ayushman" | "proxy" | "privacy" | "console";

const FLOWS: { key: FlowKey; icon: Icon; tone: TileTone; href: string }[] = [
  { key: "saathi", icon: Sparkle, tone: "navy", href: "/prototype/saathi/" },
  { key: "birth", icon: Baby, tone: "saffron", href: "/prototype/apply/?id=cert_birth" },
  { key: "tax", icon: CreditCard, tone: "teal", href: "/prototype/apply/?id=taxes_property" },
  { key: "ayushman", icon: FirstAidKit, tone: "green", href: "/prototype/status/?id=app_ayushman" },
  { key: "proxy", icon: UsersThree, tone: "violet", href: "/prototype/home/" },
  { key: "privacy", icon: ShieldCheck, tone: "neutral", href: "/prototype/privacy/" },
  { key: "console", icon: Buildings, tone: "navy", href: "/console/?d=municipal&m=applications" },
];

/**
 * The white stage the phone sits on. On wide screens a prototype guide sits
 * beside the device so reviewers can jump straight into the key flows.
 * Hidden when the prototype is embedded in the case study.
 */
export function PrototypeStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="proto-stage relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-page px-4 py-8">
      <div className="proto-stage-art pointer-events-none absolute inset-0">
        <KolamField
          cols={26}
          rows={16}
          cell={64}
          seed={2047}
          density={0.6}
          fade
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-navy-600/[0.05]"
        />
      </div>
      <div className="relative flex w-full max-w-[1180px] items-center justify-center gap-16">
        <DemoGuide />
        <div className="relative">{children}</div>
        <div aria-hidden className="proto-guide hidden w-[300px] shrink-0 xl:block" />
      </div>
    </div>
  );
}

function DemoGuide() {
  const t = useTranslations("stage");
  const router = useAppRouter();
  const { reset, setProxy } = usePrototype();
  const { locale, setLocale, locales } = useLocaleSwitch();
  const [resetDone, setResetDone] = useState(false);

  const go = (flow: (typeof FLOWS)[number]) => {
    if (flow.key === "proxy") setProxy("m_sunita");
    // The department console is a desktop app — open it beside the phone.
    if (flow.key === "console") window.open(flow.href, "_blank", "noopener");
    else router.push(flow.href);
  };

  return (
    <aside className="proto-guide hidden w-[300px] shrink-0 flex-col xl:flex">
      <div className="flex items-center gap-3">
        <Wordmark size="sm" lockup="inline" withMark />
      </div>
      <Badge tone="navy" className="mt-5 self-start">
        {t("badge")}
      </Badge>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t("pitch")}</p>

      <p className="mt-8 text-caption font-medium uppercase tracking-[0.14em] text-ink-3">{t("tryThis")}</p>
      <ul className="mt-3 space-y-1.5">
        {FLOWS.map((f) => (
          <li key={f.key}>
            <button
              type="button"
              onClick={() => go(f)}
              className="group flex w-full items-center gap-3 rounded-[16px] p-2 text-left transition-colors duration-150 hover:bg-white/80 active:scale-[0.99]"
            >
              <IconTile icon={f.icon} tone={f.tone} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-ink">{t(`flows.${f.key}.title`)}</span>
                <span className="block truncate text-[12.5px] text-ink-3">{t(`flows.${f.key}.sub`)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-caption font-medium uppercase tracking-[0.14em] text-ink-3">{t("language")}</p>
      <label className="mt-3 flex h-11 items-center gap-2 rounded-[14px] bg-white px-3 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-navy-600">
        <span className="sr-only">{t("language")}</span>
        <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)} className="h-full min-w-0 flex-1 cursor-pointer bg-transparent text-[14px] font-semibold text-ink outline-none">
          {locales.map((l) => (
            <option key={l} value={l}>
              {localeMeta[l].native} · {localeMeta[l].label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-8 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setResetDone(true);
            window.setTimeout(() => setResetDone(false), 1800);
            router.push("/prototype/");
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-ink ring-1 ring-line transition-transform duration-150 active:scale-[0.97]"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          {resetDone ? t("resetDone") : t("reset")}
        </button>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-ink-3">{t("note")}</p>
    </aside>
  );
}
