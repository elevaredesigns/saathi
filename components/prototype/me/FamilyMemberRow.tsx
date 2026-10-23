"use client";

import { PaperPlaneTilt, UserSwitch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Avatar } from "@/components/prototype/ui/Avatar";
import { loc, type FamilyMember } from "@/lib/mockData";

export function FamilyMemberRow({ member, onManage, onRequest }: { member: FamilyMember; onManage: () => void; onRequest: () => void }) {
  const { locale } = useLocaleSwitch();
  const t = useTranslations("me");

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={member.name.en} size={42} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15.5px] font-semibold text-ink">{loc(member.name, locale)}</p>
        <p className="text-[12.5px] text-ink-3">{loc(member.relation, locale)}</p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        aria-label={t("sendRequest")}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-2 ring-1 ring-line transition-transform duration-150 active:scale-90"
      >
        <PaperPlaneTilt size={17} weight="duotone" />
      </button>
      <button
        type="button"
        onClick={onManage}
        className="flex h-9 items-center gap-1.5 rounded-full bg-navy-50 px-3 text-[13px] font-semibold text-navy-700 transition-transform duration-150 active:scale-95"
      >
        <UserSwitch size={16} weight="bold" />
        {t("manage")}
      </button>
    </div>
  );
}
