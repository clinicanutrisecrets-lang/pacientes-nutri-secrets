import { HashRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from '@/hooks/useSettings';
import { ProgressProvider } from '@/hooks/useProgress';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { Header } from '@/components/ui/Header';
import { BreathingButton } from '@/components/breathing/BreathingButton';
import { HomePage } from '@/pages/Home';
import { DailySetPage } from '@/pages/DailySet';
import { FreePlayPage } from '@/pages/FreePlay';
import { StatsPage } from '@/pages/Stats';
import { SettingsPage } from '@/pages/Settings';
import { UpdatePrompt } from '@/components/ui/UpdatePrompt';

function Shell() {
  useAmbientSound();
  return (
    <div className="min-h-svh bg-app text-app">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-6 pb-28">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/daily" element={<DailySetPage />} />
          <Route path="/play" element={<FreePlayPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <BreathingButton />
      <UpdatePrompt />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <SettingsProvider>
        <ProgressProvider>
          <Shell />
        </ProgressProvider>
      </SettingsProvider>
    </HashRouter>
  );
}
