import { Locale } from "./config";

/**
 * Localized renderings of the demo personas' names. A civic app should show a
 * person's name in their own script ("Rakesh" → राकेश / রাকেশ / ரகேஷ்), so we map
 * the known personas here. Custom names typed by the user are shown as entered.
 */
const NAME_FORMS: Record<string, Partial<Record<Locale, string>>> = {
  "Rakesh Verma": { hi: "राकेश वर्मा", bn: "রাকেশ ভার্মা", ta: "ரகேஷ் வர்மா" },
  "Sunita Devi": { hi: "सुनीता देवी", bn: "সুনীতা দেবী", ta: "சுனிதா தேவி" },
  "Vikram Singh": { hi: "विक्रम सिंह", bn: "বিক্রম সিং", ta: "விக்ரம் சிங்" },
  "Ananya Sharma": { hi: "अनन्या शर्मा", bn: "অনন্যা শর্মা", ta: "அனன்யா சர்மா" },
};

/** First word only, localized where known. */
export function firstName(name: string, locale: Locale): string {
  const full = displayName(name, locale);
  return full.split(/\s+/)[0] ?? full;
}

export function displayName(name: string, locale: Locale): string {
  if (locale === "en") return name;
  return NAME_FORMS[name]?.[locale] ?? name;
}
