import { useEffect } from 'react';
import { setVolume, startAmbient, stopAmbient } from '@/lib/audio';
import { useSettings } from './useSettings';

export function useAmbientSound(): void {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.sound === 'off') {
      void stopAmbient();
      return;
    }
    void startAmbient(settings.sound, settings.volume);
  }, [settings.sound, settings.volume]);

  useEffect(() => {
    if (settings.sound !== 'off') setVolume(settings.volume);
  }, [settings.volume, settings.sound]);

  useEffect(() => {
    return () => {
      void stopAmbient();
    };
  }, []);
}
