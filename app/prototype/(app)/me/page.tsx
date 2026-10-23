"use client";

import {
  ArrowCounterClockwise,
  Bell,
  CircleHalf,
  Headset,
  Info,
  MapPin,
  Microphone,
  SealCheck,
  ShieldCheck,
  SpeakerHigh,
  Storefront,
  TextAa,
  Timer,
  Translate,
  type Icon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { LayoutGroup } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { LanguageButton, LanguageSheet } from "@/components/prototype/frame/LanguageButton";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { FamilyMemberRow } from "@/components/prototype/me/FamilyMemberRow";
import { SendRequestSheet } from "@/components/prototype/me/SendRequestSheet";
import { WalletCardViewer } from "@/components/prototype/me/WalletCard";
import { WalletStack } from "@/components/prototype/me/WalletStack";
import { Avatar } from "@/components/prototype/ui/Avatar";
import { Button } from "@/components/prototype/ui/Button";
import { ListGroup, ListRow } from "@/components/prototype/ui/ListRow";
import { SectionHeader } from "@/components/prototype/ui/SectionHeader";
import { Sheet } from "@/components/prototype/ui/Sheet";
import { Toggle } from "@/components/prototype/ui/Toggle";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Reveal } from "@/components/system/motion/Reveal";
import { Badge } from "@/components/system/ui/Badge";
import { usePrototype, type AccessibilityPrefs } from "@/lib/context/PrototypeContext";
import { CONSENTS } from "@/lib/data/privacy";
import { WALLET, type WalletDoc } from "@/lib/data/wallet";
import { localeMeta } from "@/lib/i18n/config";
import { displayName } from "@/lib/i18n/names";
import { FAMILY, type FamilyMember } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const A11Y: { key: keyof AccessibilityPrefs; icon: Icon }[] = [
  { key: "voiceHelp", icon: Microphone },
  { key: "largeText", icon: TextAa },
  { key: "slowMode", icon: Timer },
  { key: "audioLabels", icon: SpeakerHigh },
  { key: "highContrast", icon: CircleHalf },
];

function RowIcon({ icon: Glyph }: { icon: Icon }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-navy-50 text-navy-600">
      <Glyph size={19} weight="duotone" />
    </span>
  );
}

export default function MePage() {
  const router = useAppRouter();
  const t = useTranslations("me");
  const tt = useTranslations("tabs");
  const tAcc = useTranslations("onboarding.accessibility");
  const { locale } = useLocaleSwitch();
  const { user, accessibility, setAccessibility, setProxy, reset, revokedConsents } = usePrototype();

  const [doc, setDoc] = useState<WalletDoc | null>(null);
  const closeDoc = useCallback(() => setDoc(null), []);
  const [requestMember, setRequestMember] = useState<FamilyMember | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [help, setHelp] = useState<"csc" | "helpline" | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Deep link from Home's "Documents" quick action.
  useEffect(() => {
    if (window.location.hash === "#wallet") {
      window.setTimeout(() => document.getElementById("wallet")?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }
  }, []);

  const activeConsents = CONSENTS.length - revokedConsents.length;

  return (
    <div className="pb-8">
      <ScreenHeader title={tt("me")} actions={<LanguageButton />} />

      {/* Profile */}
      <div className="mx-5 flex items-center gap-3.5 rounded-[24px] bg-surface p-4">
        <Avatar name={user.name} size={58} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[19px] font-semibold tracking-[-0.01em] text-ink">{displayName(user.name, locale)}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-3">
            <MapPin size={13} weight="fill" />
            {user.district}, {user.state}
          </p>
          <Badge tone="green" icon={SealCheck} className="mt-2">
            {t("aadhaarVerified")}
          </Badge>
        </div>
      </div>

      {/* Wallet */}
      <section id="wallet" className="mt-8 scroll-mt-24 px-5">
        <SectionHeader title={t("documents")} />
        <p className="-mt-2 mb-4 text-[13.5px] text-ink-3">{t("walletSub")}</p>
        <LayoutGroup id="wallet">
          <WalletStack docs={WALLET} openId={doc?.id} onOpen={setDoc} />
          <WalletCardViewer doc={doc} onClose={closeDoc} />
        </LayoutGroup>
      </section>

      {/* Family */}
      <Reveal as="section" className="mt-8 px-5">
        <SectionHeader title={t("family")} />
        <p className="-mt-2 mb-3 text-[13.5px] text-ink-3">{t("familySub")}</p>
        <ListGroup>
          {FAMILY.map((m) => (
            <FamilyMemberRow
              key={m.id}
              member={m}
              onManage={() => {
                setProxy(m.id);
                router.push("/prototype/home/");
              }}
              onRequest={() => setRequestMember(m)}
            />
          ))}
        </ListGroup>
      </Reveal>

      {/* Privacy */}
      <Reveal className="mt-8 px-5">
        <button
          type="button"
          onClick={() => router.push("/prototype/privacy/")}
          className="flex w-full items-center gap-3 rounded-[22px] bg-gradient-to-br from-navy-900 to-navy-600 p-4 text-left text-white shadow-[0_18px_36px_-18px_rgba(10,28,84,0.7)] transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/12 ring-1 ring-inset ring-white/20">
            <ShieldCheck size={24} weight="duotone" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold">{t("privacyTitle")}</span>
            <span className="block text-[12.5px] text-white/75">{t("privacySub", { count: activeConsents })}</span>
          </span>
        </button>
      </Reveal>

      {/* Preferences */}
      <Reveal as="section" className="mt-8 px-5">
        <SectionHeader title={t("preferences")} />
        <ListGroup>
          <ListRow
            leading={<RowIcon icon={Translate} />}
            title={t("language")}
            trailing={
              <span className="text-[14px] font-medium text-ink-3" style={{ fontFamily: `var(${localeMeta[locale].fontVar}), var(--font-geist)` }}>
                {localeMeta[locale].native}
              </span>
            }
            onClick={() => setLangOpen(true)}
          />
          {A11Y.map(({ key, icon }) => (
            <ListRow
              key={key}
              leading={<RowIcon icon={icon} />}
              title={tAcc(`options.${key}.label`)}
              subtitle={tAcc(`options.${key}.desc`)}
              trailing={<Toggle checked={accessibility[key]} onChange={(v) => setAccessibility({ [key]: v } as Partial<AccessibilityPrefs>)} label={tAcc(`options.${key}.label`)} />}
            />
          ))}
          <ListRow
            leading={<RowIcon icon={Bell} />}
            title={t("notifications")}
            subtitle={t("notificationsDesc")}
            trailing={<Toggle checked={notifications} onChange={setNotifications} label={t("notifications")} />}
          />
        </ListGroup>
      </Reveal>

      {/* Help */}
      <Reveal as="section" className="mt-8 px-5">
        <SectionHeader title={t("help")} />
        <ListGroup>
          <ListRow leading={<RowIcon icon={Storefront} />} title={t("csc")} subtitle={t("cscSub")} onClick={() => setHelp("csc")} />
          <ListRow leading={<RowIcon icon={Headset} />} title={t("helpline")} subtitle={t("helplineSub")} onClick={() => setHelp("helpline")} />
        </ListGroup>
      </Reveal>

      {/* About + reset */}
      <Reveal className="mt-8 px-5">
        <div className="rounded-[22px] bg-surface p-4">
          <div className="flex items-center gap-2.5">
            <SaathiMark size={26} />
            <span className="font-wordmark text-[22px] leading-none text-ink">साथी</span>
            <Info size={16} weight="bold" className="ml-auto text-ink-3" />
          </div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{t("aboutBody")}</p>
        </div>
        <Button fullWidth variant="danger" size="md" className="mt-3" onClick={() => setConfirmReset(true)} iconLeft={<ArrowCounterClockwise size={17} weight="bold" />}>
          {t("reset")}
        </Button>
      </Reveal>

      <SendRequestSheet member={requestMember} open={!!requestMember} onClose={() => setRequestMember(null)} />
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />

      <Sheet open={!!help} onClose={() => setHelp(null)} title={help === "csc" ? t("csc") : t("helpline")}>
        {help === "csc" ? (
          <div className="space-y-2">
            {(t.raw("cscList") as { name: string; address: string; distance: string }[]).map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-[18px] p-3 ring-1 ring-line">
                <RowIcon icon={Storefront} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-ink">{c.name}</p>
                  <p className="text-[12.5px] text-ink-3">{c.address}</p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums text-navy-600">{c.distance}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] bg-surface p-5 text-center">
            <p className="font-mono text-[28px] font-semibold tracking-[0.04em] text-ink">1800 · 000 · 0000</p>
            <p className="mt-2 text-[13.5px] text-ink-2">{t("helplineHours")}</p>
            <p className="mt-3 text-[12px] text-ink-3">{t("helplineSample")}</p>
          </div>
        )}
      </Sheet>

      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} title={t("resetConfirmTitle")}>
        <p className="text-[14.5px] leading-relaxed text-ink-2">{t("resetDesc")}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmReset(false)}>
            {t("cancel")}
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              reset();
              router.push("/prototype/");
            }}
          >
            {t("resetConfirm")}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
