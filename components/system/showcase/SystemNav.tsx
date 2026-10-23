"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";

import { SaathiMark } from "@/components/system/brand/SaathiMark";

const LINKS = [
  { href: "#brand", label: "Brand" },
  { href: "#colour", label: "Colour" },
  { href: "#type", label: "Type" },
  { href: "#icons", label: "Icons" },
  { href: "#imagery", label: "Imagery" },
  { href: "#motion", label: "Motion" },
  { href: "#components", label: "Components" },
];

export function SystemNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-page items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <SaathiMark size={26} />
          <span className="font-wordmark text-[22px] leading-none text-ink">साथी</span>
          <span className="hidden text-caption font-medium text-ink-3 sm:inline">/ Design system</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-label text-ink-2 transition-colors hover:bg-surface hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          href="/prototype"
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-label font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97] lg:ml-2"
        >
          Prototype <ArrowUpRight size={13} weight="bold" />
        </Link>
      </div>
    </header>
  );
}
