import type { Metadata } from "next";

import { SmoothScroll } from "@/components/system/motion/SmoothScroll";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SitePreferences } from "@/components/site/SitePreferences";
import { AgentStory } from "@/components/site/sections/AgentStory";
import { Closing } from "@/components/site/sections/Closing";
import { Departments } from "@/components/site/sections/Departments";
import { DoorScene } from "@/components/site/sections/DoorScene";
import { Hero } from "@/components/site/sections/Hero";
import { Journey } from "@/components/site/sections/Journey";
import { Languages } from "@/components/site/sections/Languages";
import { Pillars } from "@/components/site/sections/Pillars";
import { Rails } from "@/components/site/sections/Rails";
import { Scale } from "@/components/site/sections/Scale";
import { ServiceSplit } from "@/components/site/sections/ServiceSplit";
import { Trust } from "@/components/site/sections/Trust";
import { WhySaathi } from "@/components/site/sections/WhySaathi";

export const metadata: Metadata = {
  title: "Saathi — One door to every government service",
  description:
    "A design concept for Viksit Bharat @2047: one multilingual, voice-first door to every government service, with an assistant that asks before it acts. Live prototype and case study by Krishom.",
};

export default function HomePage() {
  return (
    <SitePreferences>
      <SmoothScroll>
        <SiteHeader />
        <main id="main">
          <Hero />
          <DoorScene />
          <Rails />
          <WhySaathi />
          <AgentStory />
          <Pillars />
          <Languages />
          <Trust />
          <Departments />
          <Scale />
          <ServiceSplit />
          <Journey />
          <Closing />
        </main>
        <SiteFooter />
      </SmoothScroll>
    </SitePreferences>
  );
}
