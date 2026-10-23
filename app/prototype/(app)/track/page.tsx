"use client";

import { Tray } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageButton } from "@/components/prototype/frame/LanguageButton";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { ApplicationCard } from "@/components/prototype/home/ApplicationCard";
import { Button } from "@/components/prototype/ui/Button";
import { EmptyState } from "@/components/prototype/ui/EmptyState";
import { SegmentedControl } from "@/components/prototype/ui/SegmentedControl";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { spring } from "@/lib/design/motion";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

type Filter = "all" | "active" | "done";

export default function TrackPage() {
  const router = useAppRouter();
  const t = useTranslations("track");
  const tt = useTranslations("tabs");
  const reduce = useReducedMotion();
  const { applications } = usePrototype();
  const [filter, setFilter] = useState<Filter>("all");

  const all = applications;
  const isDone = (s: string) => s === "approved" || s === "ready";
  const active = all.filter((a) => !isDone(a.status));
  const done = all.filter((a) => isDone(a.status));
  const list = filter === "all" ? all : filter === "active" ? active : done;

  return (
    <div className="pb-6">
      <ScreenHeader title={tt("track")} actions={<LanguageButton />}>
        <p className="mt-1 text-[14.5px] text-ink-3">{t("summary", { active: active.length, done: done.length })}</p>
      </ScreenHeader>

      <div className="px-5">
        <SegmentedControl<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: t("filterAll"), count: all.length },
            { value: "active", label: t("filterActive"), count: active.length },
            { value: "done", label: t("filterDone"), count: done.length },
          ]}
        />
      </div>

      <div className="mt-4 px-5">
        {list.length === 0 ? (
          <EmptyState
            icon={Tray}
            title={t("empty")}
            subtitle={t("emptySub")}
            action={
              <Button size="md" onClick={() => router.push("/prototype/explore/?tab=services")}>
                {t("emptyCta")}
              </Button>
            }
          />
        ) : (
          <motion.ul layout className="space-y-2.5">
            <AnimatePresence initial={false}>
              {list.map((a) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.98)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0 }}
                  transition={spring.ui}
                >
                  <ApplicationCard app={a} onClick={() => router.push(`/prototype/status/?id=${a.id}`)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}
