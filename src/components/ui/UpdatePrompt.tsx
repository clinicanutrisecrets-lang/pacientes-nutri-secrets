import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './Button';

export function UpdatePrompt() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          void registration.update();
        }, 60 * 60 * 1000);
      }
    },
  });

  useEffect(() => {
    if (needRefresh) setVisible(true);
  }, [needRefresh]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed left-4 right-4 bottom-24 z-30 mx-auto max-w-md rounded-2xl bg-surface border border-app p-4 shadow-lg animate-fadeIn"
    >
      <p className="text-app font-medium">{t('update.title')}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setVisible(false);
            setNeedRefresh(false);
          }}
        >
          {t('update.later')}
        </Button>
        <Button onClick={() => updateServiceWorker(true)}>{t('update.reload')}</Button>
      </div>
    </div>
  );
}
