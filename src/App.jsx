import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Menu from './screens/Menu.jsx';
import Settings from './screens/Settings.jsx';
import ImpulseFlow from './screens/ImpulseFlow.jsx';
import SOS from './screens/SOS.jsx';
import CheckinManha from './screens/CheckinManha.jsx';
import CheckinNoite from './screens/CheckinNoite.jsx';
import Insights from './screens/Insights.jsx';
import Compromisso from './screens/Compromisso.jsx';
import Refeicao from './screens/Refeicao.jsx';
import DiarioLivre from './screens/DiarioLivre.jsx';
import Exercicio from './screens/Exercicio.jsx';
import { isOnboarded, loadConfig } from './lib/config.js';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export default function App() {
  const [route, setRoute] = useState(() => (isOnboarded() ? 'home' : 'onboarding'));
  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!config.temaEscuro);
  }, [config.temaEscuro]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', config.temaEscuro ? '#1F1F1E' : '#7A9B7E');
  }, [config.temaEscuro]);

  const refreshConfig = useCallback(() => setConfig(loadConfig()), []);

  const go = (r) => () => setRoute(r);
  const home = useCallback(() => {
    refreshConfig();
    setRoute('home');
  }, [refreshConfig]);
  const menuRoute = useCallback(() => setRoute('menu'), []);

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {route === 'onboarding' && (
          <motion.div key="onboarding" {...fade} className="h-full">
            <Onboarding onDone={home} />
          </motion.div>
        )}
        {route === 'home' && (
          <motion.div key="home" {...fade} className="h-full">
            <Home
              config={config}
              onStart={go('flow')}
              onMenu={menuRoute}
              onSOS={go('sos')}
              onCheckinManha={go('checkin-manha')}
              onCheckinNoite={go('checkin-noite')}
            />
          </motion.div>
        )}
        {route === 'menu' && (
          <motion.div key="menu" {...fade} className="h-full">
            <Menu
              perfil={config.perfil}
              onBack={home}
              onCompromisso={go('compromisso')}
              onRefeicao={go('refeicao')}
              onDiarioLivre={go('diario')}
              onExercicio={go('exercicio')}
              onInsights={go('insights')}
              onSettings={go('settings')}
            />
          </motion.div>
        )}
        {route === 'flow' && (
          <motion.div key="flow" {...fade} className="h-full">
            <ImpulseFlow config={config} onDone={home} />
          </motion.div>
        )}
        {route === 'settings' && (
          <motion.div key="settings" {...fade} className="h-full">
            <Settings onBack={menuRoute} onResetOnboarding={() => { refreshConfig(); setRoute('onboarding'); }} />
          </motion.div>
        )}
        {route === 'sos' && (
          <motion.div key="sos" {...fade} className="h-full">
            <SOS onBack={home} />
          </motion.div>
        )}
        {route === 'checkin-manha' && (
          <motion.div key="cm" {...fade} className="h-full">
            <CheckinManha onDone={home} onBack={home} />
          </motion.div>
        )}
        {route === 'checkin-noite' && (
          <motion.div key="cn" {...fade} className="h-full">
            <CheckinNoite onDone={home} onBack={home} />
          </motion.div>
        )}
        {route === 'insights' && (
          <motion.div key="insights" {...fade} className="h-full">
            <Insights onBack={menuRoute} />
          </motion.div>
        )}
        {route === 'compromisso' && (
          <motion.div key="comp" {...fade} className="h-full">
            <Compromisso onBack={menuRoute} />
          </motion.div>
        )}
        {route === 'refeicao' && (
          <motion.div key="ref" {...fade} className="h-full">
            <Refeicao onDone={menuRoute} onBack={menuRoute} />
          </motion.div>
        )}
        {route === 'diario' && (
          <motion.div key="diario" {...fade} className="h-full">
            <DiarioLivre onBack={menuRoute} />
          </motion.div>
        )}
        {route === 'exercicio' && (
          <motion.div key="ex" {...fade} className="h-full">
            <Exercicio onBack={menuRoute} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
