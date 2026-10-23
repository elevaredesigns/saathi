"use client";

import { PrototypeProvider } from "@/lib/context/PrototypeContext";
import { EmbedDetector } from "@/components/prototype/frame/EmbedDetector";
import { PrototypeStage } from "@/components/prototype/frame/PrototypeStage";

/**
 * Shared shell for the whole prototype: app state + the white stage that holds
 * the phone (with the reviewer's guide on wide screens). The iPhone frame is
 * supplied per section so chrome can differ (splash, onboarding, the app).
 * When embedded in the case study, EmbedDetector strips the stage.
 */
export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrototypeProvider>
      <EmbedDetector />
      <PrototypeStage>{children}</PrototypeStage>
    </PrototypeProvider>
  );
}
