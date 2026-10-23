import {
  ArrowsClockwise,
  ClipboardText,
  CurrencyInr,
  DownloadSimple,
  FilePlus,
  Megaphone,
  type Icon,
} from "@phosphor-icons/react";

import type { TileTone } from "@/components/system/ui/IconTile";
import type { ApplyKind } from "@/lib/applyFlows";

/** One visual per kind of government action, used across lists and flows. */
export const KIND_VISUAL: Record<ApplyKind, { icon: Icon; tone: TileTone }> = {
  apply: { icon: FilePlus, tone: "navy" },
  pay: { icon: CurrencyInr, tone: "saffron" },
  renew: { icon: ArrowsClockwise, tone: "teal" },
  register: { icon: ClipboardText, tone: "violet" },
  download: { icon: DownloadSimple, tone: "green" },
  grievance: { icon: Megaphone, tone: "neutral" },
};
