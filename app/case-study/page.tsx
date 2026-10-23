import type { Metadata } from "next";

import { AiChapter } from "@/components/cs/ChapterAi";
import { ChapterNav } from "@/components/cs/ChapterNav";
import { CaseStudyHero } from "@/components/cs/CaseStudyHero";
import { AccessibilityChapter, LanguagesChapter } from "@/components/cs/ChaptersInclusion";
import { FlowsChapter, ReflectionChapter, SuccessChapter, SystemChapter } from "@/components/cs/ChaptersEnd";
import { OverviewChapter, ProblemChapter, UmangChapter } from "@/components/cs/ChaptersIntro";
import { PersonasChapter, ResearchChapter } from "@/components/cs/ChaptersPeople";
import { FrameChapter, PrinciplesChapter, StructureChapter } from "@/components/cs/ChaptersThinking";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SitePreferences } from "@/components/site/SitePreferences";
import { SmoothScroll } from "@/components/system/motion/SmoothScroll";

export const metadata: Metadata = {
  title: "Case study — Saathi",
  description: "How Saathi was designed: research, personas, principles, an assistant that asks before it acts, four languages, accessibility and the Bharat Precision design system.",
};

export default function CaseStudyPage() {
  return (
    <SitePreferences>
      <SmoothScroll>
        <SiteHeader />
        <main id="main">
          <CaseStudyHero />
          <div className="mx-auto grid max-w-page gap-10 px-5 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            <aside className="hidden lg:block">
              <ChapterNav />
            </aside>
            <article className="min-w-0 max-w-[880px]">
              <OverviewChapter />
              <ProblemChapter />
              <UmangChapter />
              <ResearchChapter />
              <PersonasChapter />
              <FrameChapter />
              <PrinciplesChapter />
              <StructureChapter />
              <AiChapter />
              <LanguagesChapter />
              <AccessibilityChapter />
              <SystemChapter />
              <FlowsChapter />
              <SuccessChapter />
              <ReflectionChapter />
            </article>
          </div>
        </main>
        <SiteFooter />
      </SmoothScroll>
    </SitePreferences>
  );
}
