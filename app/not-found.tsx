import Link from "next/link";

import { SaathiMark } from "@/components/system/brand/SaathiMark";

/** A wrong address still lands somewhere calm, with every way back in view. */
export default function NotFound() {
  const links = [
    { href: "/", label: "Home", hint: "One door to every government service" },
    { href: "/prototype/", label: "Try the prototype", hint: "The citizen app, live" },
    { href: "/console/", label: "Department console", hint: "The other side of the counter" },
    { href: "/case-study/", label: "Case study", hint: "How Saathi was designed" },
  ];
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5 py-16 sm:px-8">
      <Link href="/" className="flex items-center gap-2">
        <SaathiMark size={26} />
        <span className="font-wordmark text-[24px] leading-none text-ink">साथी</span>
      </Link>
      <p className="mt-12 font-mono text-[13px] text-ink-3">404</p>
      <h1 className="mt-2 text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">This page isn&apos;t here.</h1>
      <p lang="hi" className="mt-3 font-wordmark text-[22px] text-ink-3">यह पेज यहाँ नहीं है।</p>
      <p className="mt-5 text-[17px] leading-relaxed text-ink-2">The address may be mistyped, or the page has moved. Everything in Saathi is one step from here:</p>
      <ul className="mt-8 divide-y divide-line rounded-[20px] ring-1 ring-line">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface">
              <span>
                <span className="block text-[16px] font-semibold text-ink">{l.label}</span>
                <span className="block text-[14px] text-ink-3">{l.hint}</span>
              </span>
              <span aria-hidden className="text-navy-600">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-[13px] text-ink-3">A design concept. Not affiliated with the Government of India.</p>
    </main>
  );
}
