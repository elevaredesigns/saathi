/**
 * Read aloud via the browser's built-in speech synthesis — no network, no AI.
 * Picks a voice for the active language when the device has one (Windows and
 * Android ship Hindi voices; Bengali/Tamil vary) and falls back gracefully.
 */
import { localeMeta, type Locale } from "@/lib/i18n/config";

const BCP47 = (l: Locale) => localeMeta[l].bcp47;

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, locale: Locale, rate = 1): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = BCP47(locale);
  u.rate = rate;
  const voice =
    synth.getVoices().find((v) => v.lang === BCP47(locale)) ??
    synth.getVoices().find((v) => v.lang.startsWith(locale));
  if (voice) u.voice = voice;
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
