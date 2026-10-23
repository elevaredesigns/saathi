"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** /about now lives in the case study's Reflection chapter (static-export-safe redirect). */
export default function AboutRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/case-study/#reflection");
  }, [router]);
  return (
    <p className="p-8 text-[15px] text-ink-2">
      <a href="/case-study/#reflection" className="text-navy-600 underline">
        Saathi case study
      </a>
    </p>
  );
}
