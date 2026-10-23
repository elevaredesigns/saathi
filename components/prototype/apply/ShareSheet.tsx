"use client";

import { ChatText, Check, EnvelopeSimple, FilePdf, LinkSimple, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Sheet } from "@/components/prototype/ui/Sheet";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";

const OPTIONS: { key: "copyLink" | "message" | "email" | "pdf"; icon: Icon; tone: TileTone }[] = [
  { key: "copyLink", icon: LinkSimple, tone: "navy" },
  { key: "message", icon: ChatText, tone: "green" },
  { key: "email", icon: EnvelopeSimple, tone: "violet" },
  { key: "pdf", icon: FilePdf, tone: "saffron" },
];

export function ShareSheet({ open, onClose, refNumber }: { open: boolean; onClose: () => void; refNumber: string }) {
  const t = useTranslations("apply.shareSheet");
  const [done, setDone] = useState<string | null>(null);

  const pick = (key: string) => {
    if (key === "copyLink") {
      navigator.clipboard?.writeText(`https://saathi.example/verify/${refNumber}`).catch(() => {});
    }
    setDone(key);
    window.setTimeout(() => {
      setDone(null);
      onClose();
    }, 1000);
  };

  return (
    <Sheet open={open} onClose={onClose} title={t("title")}>
      <p className="-mt-1 mb-4 font-mono text-[13px] text-ink-3">{refNumber}</p>
      <div className="grid grid-cols-4 gap-2">
        {OPTIONS.map((o) => (
          <button key={o.key} type="button" onClick={() => pick(o.key)} className="flex flex-col items-center gap-2 rounded-[18px] py-2 active:scale-95">
            {done === o.key ? (
              <span className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-green-600 text-white">
                <Check size={26} weight="bold" />
              </span>
            ) : (
              <IconTile icon={o.icon} tone={o.tone} size="lg" />
            )}
            <span className="text-center text-[12px] font-semibold leading-tight text-ink-2">{done === o.key ? t("done") : t(o.key)}</span>
          </button>
        ))}
      </div>
      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">{t("note")}</p>
    </Sheet>
  );
}
