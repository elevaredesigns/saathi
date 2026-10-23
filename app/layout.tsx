import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import I18nProvider from "@/components/providers/I18nProvider";
import { ServiceWorker } from "@/components/providers/ServiceWorker";
import { availableLocales, LANG_CLASSES, localeMeta } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Saathi — One door to every government service",
  description:
    "Saathi is a design concept for Viksit Bharat @2047: one multilingual, voice-first, AI-assisted door to every government service. A case study and working prototype by Krishom.",
  applicationName: "Saathi",
  manifest: "/manifest.webmanifest",
  icons: { apple: "/apple-touch-icon.png" },
  authors: [{ name: "Krishom", url: "https://krishom.me/" }],
  keywords: ["Saathi", "Viksit Bharat 2047", "government services", "UX case study", "multilingual", "AI assistant", "design concept"],
  openGraph: {
    type: "website",
    siteName: "Saathi",
    title: "Saathi — One door to every government service",
    description: "A multilingual, voice-first design concept for Viksit Bharat @2047, with an assistant that asks before it acts. Not a Government of India website.",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "bn_IN", "ta_IN"],
  },
  twitter: {
    card: "summary",
    title: "Saathi — One door to every government service",
    description: "A multilingual, voice-first design concept for Viksit Bharat @2047. Not a Government of India website.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  // Lets the full-screen prototype on phones use env(safe-area-inset-*) around the notch.
  viewportFit: "cover",
};

// Before paint: mark an embedded prototype (so the phone-size full-screen mode
// never flashes inside the website's live phone), apply the saved locale class (no font/lang flash) and the
// ?capture=1 screenshot mode (all reveal animations shown in their final state).
// Direction is left to I18nProvider: until a right-to-left language's messages
// load, the page is still English, and flipping it early would flash.
const scriptClasses = JSON.stringify(Object.fromEntries(availableLocales.map((l) => [l, localeMeta[l].langClass])));
const allClasses = JSON.stringify(LANG_CLASSES);
const noFlashScript = `(function(){try{var d=document.documentElement;if(/[?&]capture=1/.test(location.search))d.setAttribute('data-capture','1');var e=false;try{e=window.self!==window.top}catch(x){e=true}if(e||/[?&]embed=1/.test(location.search))d.classList.add('is-embedded');var l=localStorage.getItem('saathi.locale');var m=${scriptClasses};if(l&&m[l]){${allClasses}.forEach(function(c){d.classList.remove(c)});d.classList.add(m[l]);}}catch(e){}})();`;

// Without JavaScript, reveal animations never run — mark the page so CSS shows everything.
const noJsStyle = `[data-reveal]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} lang-en`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noJsStyle }} />
        </noscript>
      </head>
      <body className="min-h-screen bg-page text-ink antialiased">
        <I18nProvider>{children}</I18nProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
