"use client";

import { useEffect } from "react";

import { usePrototype } from "@/lib/context/PrototypeContext";
import { IPhoneFrame } from "@/components/prototype/frame/IPhoneFrame";
import { SplashScreen } from "@/components/prototype/onboarding/SplashScreen";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

/** Boot screen: the splash plays, then routes to onboarding or the app. */
export default function PrototypeEntry() {
  const { hydrated, onboarded } = usePrototype();
  const router = useAppRouter();

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      router.replace(onboarded ? "/prototype/home/" : "/prototype/onboarding/");
    }, 2300);
    return () => window.clearTimeout(id);
  }, [hydrated, onboarded, router]);

  return (
    <IPhoneFrame>
      <h1 className="sr-only">Saathi — one door to every government service</h1>
      <SplashScreen />
    </IPhoneFrame>
  );
}
