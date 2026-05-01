import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';
import type {
  AppLanguage,
  BreathingPattern,
  DifficultyMode,
  ReducedMotionMode,
  SoundOption,
  ThemeMode,
} from '@/lib/types';

export function SettingsPage() {
  const { t } = useTranslation();
  const { settings, update, language, setLanguage } = useSettings();
  const { reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const langValue: AppLanguage = language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-app">{t('settings.title')}</h1>

      <Card>
        <Segmented<AppLanguage>
          label={t('settings.language')}
          options={[
            { value: 'en', label: t('settings.language_en') },
            { value: 'pt-BR', label: t('settings.language_pt') },
          ]}
          value={langValue}
          onChange={(v) => setLanguage(v)}
        />
      </Card>

      <Card>
        <Segmented<ThemeMode>
          label={t('settings.theme')}
          options={[
            { value: 'light', label: t('settings.theme_light') },
            { value: 'dark', label: t('settings.theme_dark') },
            { value: 'system', label: t('settings.theme_system') },
          ]}
          value={settings.theme}
          onChange={(v) => update('theme', v)}
        />
      </Card>

      <Card>
        <Segmented<DifficultyMode>
          label={t('settings.default_difficulty')}
          options={[
            { value: 'easy', label: t('difficulty.easy') },
            { value: 'medium', label: t('difficulty.medium') },
            { value: 'hard', label: t('difficulty.hard') },
            { value: 'adaptive', label: t('difficulty.adaptive') },
          ]}
          value={settings.difficulty}
          onChange={(v) => update('difficulty', v)}
        />
      </Card>

      <Card>
        <Segmented<SoundOption>
          label={t('settings.sound')}
          options={[
            { value: 'off', label: t('settings.sound_off') },
            { value: 'brown', label: t('settings.sound_brown') },
            { value: 'drone', label: t('settings.sound_drone') },
            { value: 'rain', label: t('settings.sound_rain') },
          ]}
          value={settings.sound}
          onChange={(v) => update('sound', v)}
        />
        {settings.sound !== 'off' ? (
          <Slider
            label={t('settings.volume')}
            value={settings.volume}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => update('volume', v)}
          />
        ) : null}
      </Card>

      <Card>
        <Segmented<BreathingPattern>
          label={t('settings.breathing_pattern')}
          options={[
            { value: 'coherence', label: t('breathe.patterns.coherence') },
            { value: '478', label: t('breathe.patterns.478') },
            { value: 'box', label: t('breathe.patterns.box') },
          ]}
          value={settings.breathingPattern}
          onChange={(v) => update('breathingPattern', v)}
        />
        <Toggle
          label={t('settings.haptics')}
          checked={settings.haptics}
          onChange={(v) => update('haptics', v)}
        />
      </Card>

      <Card>
        <Segmented<ReducedMotionMode>
          label={t('settings.reduced_motion')}
          options={[
            { value: 'system', label: t('settings.reduced_motion_system') },
            { value: 'on', label: t('settings.reduced_motion_on') },
            { value: 'off', label: t('settings.reduced_motion_off') },
          ]}
          value={settings.reducedMotion}
          onChange={(v) => update('reducedMotion', v)}
        />
      </Card>

      <Card>
        {!confirmReset ? (
          <Button variant="secondary" className="w-full" onClick={() => setConfirmReset(true)}>
            {t('settings.reset')}
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-app">{t('settings.reset_confirm')}</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                {t('settings.reset_cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
              >
                {t('settings.reset_confirm_yes')}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
