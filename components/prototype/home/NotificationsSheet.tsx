"use client";

import { Checks, CheckCircle, Clock, Megaphone, Receipt, WarningCircle, XCircle, type Icon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Sheet } from "@/components/prototype/ui/Sheet";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { buildInbox } from "@/lib/data/inbox";
import type { NotificationIcon } from "@/lib/data/notifications";
import { loc } from "@/lib/mockData";
import { formatShortDay } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const ICON: Record<NotificationIcon, { icon: Icon; tone: TileTone }> = {
  check: { icon: CheckCircle, tone: "green" },
  clock: { icon: Clock, tone: "navy" },
  receipt: { icon: Receipt, tone: "saffron" },
  megaphone: { icon: Megaphone, tone: "violet" },
  alert: { icon: WarningCircle, tone: "saffron" },
  x: { icon: XCircle, tone: "neutral" },
};

export function NotificationsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("home.notifications");
  const router = useAppRouter();
  const { locale } = useLocaleSwitch();
  const { readNotifications, markNotificationsRead, officerEvents } = usePrototype();
  const NOTIFICATIONS = useMemo(() => buildInbox(officerEvents), [officerEvents]);
  const unread = NOTIFICATIONS.filter((n) => !readNotifications.includes(n.id));

  return (
    <Sheet open={open} onClose={onClose} title={t("title")}>
      {unread.length > 0 && (
        <button
          type="button"
          onClick={() => markNotificationsRead(NOTIFICATIONS.map((n) => n.id))}
          className="-mt-1 mb-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy-600"
        >
          <Checks size={16} weight="bold" />
          {t("markAll")}
        </button>
      )}
      <ul className="-mx-2 space-y-1">
        {NOTIFICATIONS.map((n) => {
          const isUnread = !readNotifications.includes(n.id);
          const meta = ICON[n.icon];
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  markNotificationsRead([n.id]);
                  onClose();
                  router.push(n.href);
                }}
                className="flex w-full items-start gap-3 rounded-[18px] p-2.5 text-left transition-colors duration-150 active:bg-surface"
              >
                <IconTile icon={meta.icon} tone={meta.tone} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={cn("flex-1 text-[15px] leading-snug text-ink", isUnread ? "font-semibold" : "font-medium")}>{loc(n.title, locale)}</span>
                    <span className="shrink-0 text-[12px] tabular-nums text-ink-3">{formatShortDay(n.when, locale)}</span>
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-3">{loc(n.body, locale)}</span>
                </span>
                {isUnread && <span aria-label="unread" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />}
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
