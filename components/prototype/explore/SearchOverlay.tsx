"use client";

import { ArrowUpRight, Compass, FilePlus, MagnifyingGlass, SquaresFour, Wallet, X, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { useFramePortal } from "@/components/prototype/frame/IPhoneFrame";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { ease } from "@/lib/design/motion";
import { search, type SearchKind } from "@/lib/search";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const KIND_VISUAL: Record<SearchKind, { icon: Icon; tone: TileTone }> = {
  task: { icon: FilePlus, tone: "navy" },
  scheme: { icon: Wallet, tone: "saffron" },
  service: { icon: SquaresFour, tone: "teal" },
  moment: { icon: Compass, tone: "violet" },
};

const ORDER: SearchKind[] = ["task", "scheme", "service", "moment"];

/** Full-screen, on-device search in the active language (and English). */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const portal = useFramePortal();
  const router = useAppRouter();
  const reduce = useReducedMotion();
  const t = useTranslations("explore");
  const { locale } = useLocaleSwitch();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const hits = useMemo(() => search(q, locale, 14), [q, locale]);
  const grouped = ORDER.map((k) => ({ kind: k, items: hits.filter((h) => h.kind === k) })).filter((g) => g.items.length);
  const popular = t.raw("popular") as string[];

  const go = (href: string) => {
    onClose();
    router.push(href);
  };
  const askSaathi = (text: string) => go(`/prototype/saathi/?q=${encodeURIComponent(text)}`);

  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("searchPlaceholder")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="absolute inset-0 z-[65] flex flex-col bg-white pt-[52px]"
        >
          <motion.div
            initial={reduce ? false : { transform: "translateY(-8px)" }}
            animate={{ transform: "translateY(0px)" }}
            transition={{ duration: 0.24, ease: ease.out }}
            className="flex items-center gap-2 px-4 pb-3"
          >
            <label className="flex h-11 flex-1 items-center gap-2 rounded-[14px] bg-surface2 px-3 focus-within:ring-2 focus-within:ring-navy-600">
              <MagnifyingGlass size={18} weight="bold" className="text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (hits[0] ? go(hits[0].href) : q.trim() && askSaathi(q))}
                placeholder={t("searchPlaceholder")}
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-3"
                enterKeyHint="search"
              />
              {q && (
                <button type="button" aria-label={t("clear")} onClick={() => setQ("")} className="text-ink-3">
                  <X size={16} weight="bold" />
                </button>
              )}
            </label>
            <button type="button" onClick={onClose} className="px-1 text-[16px] font-medium text-navy-600">
              {t("cancel")}
            </button>
          </motion.div>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10">
            {!q.trim() ? (
              <>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t("popularTitle")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQ(p)}
                      className="rounded-full bg-surface px-3.5 py-2 text-[14px] font-medium text-ink ring-1 ring-line transition-transform duration-150 active:scale-95"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go("/prototype/saathi/")}
                  className="mt-6 flex w-full items-center gap-3 rounded-[20px] bg-navy-50/70 p-3.5 text-left ring-1 ring-navy-100"
                >
                  <SaathiOrb size={40} />
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold text-ink">{t("askIdle")}</span>
                    <span className="block text-[13px] text-ink-3">{t("askIdleSub")}</span>
                  </span>
                  <ArrowUpRight size={16} weight="bold" className="text-navy-600" />
                </button>
              </>
            ) : grouped.length === 0 ? (
              <div className="mt-10 text-center">
                <p className="text-[16px] font-semibold text-ink">{t("noResults", { q })}</p>
                <button
                  type="button"
                  onClick={() => askSaathi(q)}
                  className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-semibold text-white"
                >
                  <SaathiOrb size={22} />
                  {t("askAbout", { q })}
                </button>
              </div>
            ) : (
              grouped.map((g) => (
                <section key={g.kind} className="mt-3">
                  <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t(`kinds.${g.kind}`)}</p>
                  <ul className="divide-y divide-line overflow-hidden rounded-[18px] ring-1 ring-line">
                    {g.items.map((h, i) => {
                      const v = KIND_VISUAL[h.kind];
                      return (
                        <motion.li
                          key={`${h.kind}-${h.id}`}
                          initial={reduce ? false : { opacity: 0, transform: "translateY(6px)" }}
                          animate={{ opacity: 1, transform: "translateY(0px)" }}
                          transition={{ duration: 0.22, ease: ease.out, delay: i * 0.025 }}
                        >
                          <button type="button" onClick={() => go(h.href)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-surface">
                            <IconTile icon={v.icon} tone={v.tone} size="sm" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[15px] font-semibold text-ink">{h.title}</span>
                              <span className="block truncate text-[12.5px] text-ink-3">{h.subtitle}</span>
                            </span>
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </section>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portal,
  );
}
