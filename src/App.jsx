import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Settings from './screens/Settings.jsx';
import ImpulseFlow from './screens/ImpulseFlow.jsx';
import { isOnboarded, loadConfig } from './lib/config.js';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
};

export default function App() {
  const [route, setRoute] = useState(() => (isOnboarded() ? 'home' : 'onboarding'));
  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', config.temaEscuro);
  }, [config.temaEscuro]);

  const refreshConfig = () => setConfig(loadConfig());

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {route === 'onboarding' && (
          <motion.div key="onboarding" {...fade} className="h-full">
            <Onboarding
              onDone={() => {
                refreshConfig();
                setRoute('home');
              }}
            />
          </motion.div>
        )}
        {route === 'home' && (
          <motion.div key="home" {...fade} className="h-full">
            <Home
              config={config}
              onStart={() => setRoute('flow')}
              onSettings={() => setRoute('settings')}
            />
          </motion.div>
        )}
        {route === 'flow' && (
          <motion.div key="flow" {...fade} className="h-full">
            <ImpulseFlow config={config} onDone={() => setRoute('home')} />
          </motion.div>
        )}
        {route === 'settings' && (
          <motion.div key="settings" {...fade} className="h-full">
            <Settings
              onBack={() => {
                refreshConfig();
                setRoute('home');
              }}
              onResetOnboarding={() => setRoute('onboarding')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
