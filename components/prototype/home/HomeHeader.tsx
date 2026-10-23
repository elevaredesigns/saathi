"use client";

import { Bell } from "@phosphor-icons/react";
import { motion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { useScreenScroll } from "@/components/prototype/frame/IPhoneFrame";
import { LanguageButton } from "@/components/prototype/frame/LanguageButton";
import { ReadAloudButton } from "@/components/prototype/frame/ReadAloudButton";
import { HeaderIconButton } from "@/components/prototype/frame/ScreenHeader";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { buildInbox } from "@/lib/data/inbox";
import { firstName } from "@/lib/i18n/names";
import { formatLongDay, PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { NotificationsSheet } from "./NotificationsSheet";

/** Home's own header: brand + actions in a glass bar, then the greeting. */
export function HomeHeader() {
  const t = useTranslations("home");
  const { locale } = useLocaleSwitch();
  const { user, readNotifications, officerEvents } = usePrototype();
  const { scrollY } = useScreenScroll();
  const [inbox, setInbox] = useState(false);

  const barOpacity = useTransform(scrollY, [20, 56], [0, 1]);
  const unread = buildInbox(officerEvents).filter((n) => !readNotifications.includes(n.id)).length;

  const hour = PROTOTYPE_TODAY.getHours();
  const greetingKey = hour < 12 ? "greetingMorning" : hour < 17 ? "greetingAfternoon" : "greetingEvening";
  const greeting = t(greetingKey, { name: firstName(user.name, locale) });

  return (
    <>
      <div className="sticky -top-[var(--proto-top)] z-20 -mt-[var(--proto-top)] pt-[var(--proto-top)]">
        <motion.div
          aria-hidden
          style={{ opacity: barOpacity }}
          className="absolute inset-0 border-b border-black/[0.05] bg-white/80 backdrop-blur-xl backdrop-saturate-150"
        />
        <div className="relative flex h-[52px] items-center gap-2 px-4">
          <SaathiMark size={28} />
          <span className="font-wordmark text-[23px] leading-none text-ink">साथी</span>
          <div className="ml-auto flex items-center gap-2">
            <LanguageButton />
            <HeaderIconButton label={t("notifications.title")} onClick={() => setInbox(true)} badge={unread}>
              <Bell size={19} weight={unread ? "fill" : "regular"} />
            </HeaderIconButton>
          </div>
        </div>
      </div>

      <div className="px-5 pb-1 pt-2">
        <p className="text-[13.5px] font-medium text-ink-3">{formatLongDay(PROTOTYPE_TODAY, locale)}</p>
        <div className="mt-0.5 flex items-start gap-2">
          <h1 className="flex-1 text-[30px] font-semibold leading-[1.15] tracking-[var(--track-tight)] text-ink">{greeting}</h1>
          <ReadAloudButton text={greeting} className="mt-1" />
        </div>
      </div>

      <NotificationsSheet open={inbox} onClose={() => setInbox(false)} />
    </>
  );
}
