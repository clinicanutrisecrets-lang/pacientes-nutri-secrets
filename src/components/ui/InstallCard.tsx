import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Card } from './Card';
import { dismissInstall, isInstallDismissed } from '@/lib/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as unknown as { standalone?: boolean };
  return nav.standalone === true;
}

export function InstallCard() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<boolean>(() => isInstallDismissed());
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState<boolean>(() => isStandalone());

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

  const onIOS = isIOS();
  const canInstallNative = Boolean(installEvent);

  return (
    <Card className="border-[var(--color-secondary)]/40 bg-[color:var(--color-secondary)]/5">
      <div className="space-y-3">
        <p className="text-soft text-xs uppercase tracking-wider">📱</p>
        <h2 className="font-serif text-xl text-app leading-snug">{t('install.title')}</h2>
        <p className="text-soft text-sm">{t('install.subtitle')}</p>
        <p className="text-app text-sm">
          {onIOS ? t('install.ios') : t('install.android')}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {canInstallNative ? (
            <Button onClick={handleInstall} size="md">
              {t('install.button')}
            </Button>
          ) : null}
          <Button variant="ghost" size="md" onClick={handleDismiss}>
            {t('install.dismiss')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
