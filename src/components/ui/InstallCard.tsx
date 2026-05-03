import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { dismissInstall, isInstallDismissed } from '@/lib/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'ios-safari' | 'ios-other' | 'android' | 'desktop';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') && typeof document !== 'undefined' && 'ontouchend' in document);
  if (isIOS) {
    const isOtheriOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser|GSA/.test(ua);
    return isOtheriOSBrowser ? 'ios-other' : 'ios-safari';
  }
  const isAndroid = /Android/.test(ua);
  if (isAndroid) return 'android';
  const isMobile = /Mobile|Tablet/.test(ua);
  return isMobile ? 'android' : 'desktop';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as unknown as { standalone?: boolean };
  return nav.standalone === true;
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v13" />
      <polyline points="7 8 12 3 17 8" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

export function InstallCard() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<boolean>(() => isInstallDismissed());
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState<boolean>(() => isStandalone());
  const [platform] = useState<Platform>(() => detectPlatform());

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true);
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setHidden(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (hidden || dismissed) return null;

  const handleInstall = async () => {
    if (!installEvent) return;
    try {
      await installEvent.prompt();
      await installEvent.userChoice;
    } catch {
      // user dismissed or browser refused
    }
    setInstallEvent(null);
    setHidden(true);
  };

  const handleDismiss = () => {
    dismissInstall();
    setDismissed(true);
  };

  const canInstallNative = Boolean(installEvent);
  const instructionKey =
    platform === 'ios-safari'
      ? 'install.ios_safari'
      : platform === 'ios-other'
      ? 'install.ios_other'
      : platform === 'android'
      ? 'install.android'
      : 'install.desktop';

  return (
    <div className="rounded-3xl p-6 shadow-sm relative overflow-hidden bg-gradient-to-br from-[#E8C99B] to-[#D4A574] border border-[#C2935E]/30">
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/15 pointer-events-none" />
      <div className="absolute -right-4 -bottom-12 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2 text-[#5A3F1B]/80 text-xs uppercase tracking-wider font-medium">
          <PhoneIcon />
          <span>App</span>
        </div>
        <h2 className="font-serif text-xl text-[#3D2A0F] leading-snug">
          {t('install.title')}
        </h2>
        <p className="text-[#5A3F1B] text-sm">{t('install.subtitle')}</p>

        <div className="bg-white/35 rounded-xl px-3 py-3 flex items-start gap-2">
          {platform === 'ios-safari' ? (
            <span
              className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-white text-[#3D2A0F] flex items-center justify-center"
              aria-label={t('install.share_label')}
              title={t('install.share_label')}
            >
              <ShareIcon />
            </span>
          ) : null}
          <p className="text-[#3D2A0F] text-sm leading-relaxed">{t(instructionKey)}</p>
        </div>

        {platform === 'ios-safari' ? (
          <p className="text-center text-[#5A3F1B] text-xs italic mt-1">
            {t('install.ios_safari_hint')}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          {canInstallNative ? (
            <Button onClick={handleInstall} size="md" className="bg-[#3D2A0F] text-[#FAF7F2] hover:bg-[#2D1F0A]">
              {t('install.button')}
            </Button>
          ) : null}
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-[48px] px-5 rounded-2xl text-sm text-[#5A3F1B] hover:bg-white/20 transition-colors"
          >
            {t('install.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}
