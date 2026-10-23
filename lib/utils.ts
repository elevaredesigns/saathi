import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our custom scale names — otherwise it reads
 * `text-h1` as a text *colour* and drops it next to `text-ink`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-2xl", "display-xl", "h1", "h2", "h3", "title", "body-l", "body", "label", "caption", "mono"] },
      ],
      shadow: [
        { shadow: ["hairline", "soft", "lift", "float", "glow-navy", "glow-saffron", "inset-hi", "card", "device", "sheet", "cta"] },
      ],
      rounded: [{ rounded: ["tile", "panel", "hero", "card", "btn", "sheet"] }],
    },
  },
});

/** Merge conditional class names, de-duping conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
