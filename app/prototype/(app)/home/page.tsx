"use client";

import { useTranslations } from "next-intl";

import { ApplicationCard } from "@/components/prototype/home/ApplicationCard";
import { AskSaathiBar } from "@/components/prototype/home/AskSaathiBar";
import { HomeHeader } from "@/components/prototype/home/HomeHeader";
import { IdentityCard } from "@/components/prototype/home/IdentityCard";
import { NudgeRail } from "@/components/prototype/home/NudgeRail";
import { QuickActions } from "@/components/prototype/home/QuickActions";
import { SchemeRail } from "@/components/prototype/home/SchemeRail";
import { TrustFooter } from "@/components/prototype/home/TrustFooter";
import { SectionHeader } from "@/components/prototype/ui/SectionHeader";
import { Reveal } from "@/components/system/motion/Reveal";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { schemesForContext } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

export default function HomePage() {
  const router = useAppRouter();
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const { lifeContext, applications } = usePrototype();

  const apps = applications.slice(0, 2);
  const suggested = schemesForContext(lifeContext, 5).slice(0, 5);

  return (
    <div className="pb-6">
      <HomeHeader />

      <div className="space-y-4 px-5 pt-4">
        <AskSaathiBar />
        <IdentityCard />
      </div>

      <div className="mt-7">
        <QuickActions />
      </div>

      <div className="mt-8">
        <NudgeRail />
      </div>

      <Reveal as="section" className="mt-8 px-5">
        <SectionHeader title={t("yourApplications")} action={tc("seeAll")} onAction={() => router.push("/prototype/track/")} />
        <div className="space-y-2.5">
          {apps.map((a) => (
            <ApplicationCard key={a.id} app={a} onClick={() => router.push(`/prototype/status/?id=${a.id}`)} />
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="mt-8">
        <div className="px-5">
          <SectionHeader title={t("forYou")} action={tc("seeAll")} onAction={() => router.push("/prototype/eligibility/")} />
          <p className="-mt-2 mb-3 text-[13.5px] text-ink-3">{t("forYouSub")}</p>
        </div>
        <SchemeRail schemes={suggested} />
      </Reveal>

      <Reveal className="mt-9">
        <TrustFooter />
      </Reveal>
    </div>
  );
}
