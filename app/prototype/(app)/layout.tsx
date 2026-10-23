"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { IPhoneFrame } from "@/components/prototype/frame/IPhoneFrame";
import { PageTransition } from "@/components/prototype/frame/PageTransition";
import { TabBar, type TabKey } from "@/components/prototype/frame/TabBar";
import { ProxyBanner } from "@/components/prototype/me/ProxyBanner";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

function activeTab(pathname: string): TabKey {
  if (/\/(explore|scheme|eligibility|moment|service)/.test(pathname)) return "explore";
  if (/\/(track|status)/.test(pathname)) return "track";
  if (/\/(me|privacy)/.test(pathname)) return "me";
  if (/\/saathi/.test(pathname)) return "saathi";
  if (/\/apply/.test(pathname)) return "explore";
  return "home";
}

/** The signed-in app: frame chrome (glass tab bar, proxy banner) + accessibility prefs. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useAppRouter();
  const { proxyFor, accessibility } = usePrototype();
  const isApply = pathname.includes("/apply");

  return (
    <IPhoneFrame
      banner={proxyFor ? <ProxyBanner /> : undefined}
      tabBar={isApply ? undefined : <TabBar active={activeTab(pathname)} onChange={(k) => router.push(`/prototype/${k}/`)} />}
    >
      <PageTransition
        className={cn(
          "flow-root min-h-full",
          accessibility.largeText && "proto-large-text",
          accessibility.highContrast && "proto-contrast",
          accessibility.slowMode && "proto-slow",
        )}
      >
        {children}
      </PageTransition>
    </IPhoneFrame>
  );
}
