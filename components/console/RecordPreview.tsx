"use client";

import { SealCheck } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SampleQr } from "@/components/prototype/ui/SampleQr";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import type { Department } from "@/lib/console/departments";
import { loc, type L } from "@/lib/mockData";
import { formatDate } from "@/lib/utils/dateUtils";

/**
 * The record an office issues — a security-printed certificate with the
 * officer's digital signature and a (sample) verification code. It carries the
 * design-concept watermark so it can never pass for a real document.
 */
export function RecordPreview({ dept, service, holder, refNo, issuedAt, signed = true }: { dept: Department; service: L; holder: string; refNo: string; issuedAt: string; signed?: boolean }) {
  const t = useTranslations("console.record");
  const { locale } = useLocaleSwitch();
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-[#FFFDF8] p-5 ring-1 ring-[#E9DFC7]">
      <Guilloche variant="band" tone="saffron" opacity={0.2} className="absolute inset-x-0 top-0 h-12 w-full" />
      <Guilloche tone="navy" opacity={0.07} className="absolute -bottom-24 -right-20 h-72 w-72" />
      <p aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 whitespace-nowrap text-[28px] font-semibold uppercase tracking-[0.2em] text-ink/[0.05]">
        {t("watermark")}
      </p>
      <div className="relative flex items-start justify-between gap-4 pt-6">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
            <SaathiMark size={16} />
            {loc(dept.office, locale)}
          </p>
          <p className="mt-2 text-[20px] font-semibold leading-tight text-ink">{loc(service, locale)}</p>
        </div>
        <div className="rounded-[8px] bg-white p-1 ring-1 ring-[#E9DFC7]">
          <SampleQr size={64} seed={refNo.length * 53 + 9} />
        </div>
      </div>
      <dl className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
        <div>
          <dt className="text-ink-3">{t("holder")}</dt>
          <dd className="font-semibold text-ink">{holder}</dd>
        </div>
        <div>
          <dt className="text-ink-3">{t("number")}</dt>
          <dd className="font-mono font-semibold text-ink">{refNo}</dd>
        </div>
        <div>
          <dt className="text-ink-3">{t("issued")}</dt>
          <dd className="font-semibold text-ink">{formatDate(issuedAt, locale)}</dd>
        </div>
        <div>
          <dt className="text-ink-3">{t("authority")}</dt>
          <dd className="font-semibold text-ink">{dept.officer.name}</dd>
        </div>
      </dl>
      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#E9DFC7] pt-3">
        {signed ? (
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-green-800">
            <SealCheck size={15} weight="fill" className="text-green-600" />
            {t("signed", { officer: dept.officer.name })}
          </p>
        ) : (
          <p className="text-[12px] text-ink-3">{t("unsigned")}</p>
        )}
        <p className="text-[11px] text-ink-3">{t("sample")}</p>
      </div>
    </div>
  );
}
