import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { buzz } from '../lib/haptic.js';
import { getCheckinHoje } from '../lib/db.js';
import { isMorning, isEvening } from '../lib/date.js';
import InsightSemanal from '../components/InsightSemanal.jsx';

export default function Home({ config, onStart, onMenu, onSOS, onCheckinManha, onCheckinNoite }) {
  const [checkinManhaFeito, setCheckinManhaFeito] = useState(true);
  const [checkinNoiteFeito, setCheckinNoiteFeito] = useState(true);

  useEffect(() => {
    let cancel = false;
    Promise.all([getCheckinHoje('manha'), getCheckinHoje('noite')]).then(([m, n]) => {
      if (cancel) return;
      setCheckinManhaFeito(!!m);
      setCheckinNoiteFeito(!!n);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const perfil = config.perfil;
  const reflexao = perfil === 'reflexao' || perfil === 'diario';

  // Only show time-critical cards on Home. Everything else goes in /menu.
  const prompts = [];
  if (reflexao && isMorning() && !checkinManhaFeito) {
    prompts.push({ key: 'manha', label: 'Check-in da manhã', hint: '~30s', onClick: onCheckinManha });
  }
  if (reflexao && isEvening() && !checkinNoiteFeito) {
    prompts.push({ key: 'noite', label: 'Check-in da noite', hint: '~1min', onClick: onCheckinNoite });
  }

  return (
    <div className="screen safe-top safe-bottom relative">
      <div className="flex justify-between items-center">
        <button
          aria-label="SOS"
          onClick={() => {
            buzz(40);
            onSOS();
          }}
          className="text-muted hover:text-body p-2 -ml-2 transition-colors flex items-center gap-2"
        >
          <SOSIcon />
          <span className="text-xs uppercase tracking-widest">SOS</span>
        </button>
        <button
          aria-label="Menu"
          onClick={() => {
            buzz(20);
            onMenu();
          }}
          className="text-muted hover:text-body p-2 -mr-2 transition-colors"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-6">
        <motion.button
          onClick={() => {
            buzz(60);
            onStart();
          }}
          whileTap={{ scale: 0.96 }}
          className="relative w-60 h-60 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'var(--primary)',
            color: '#FBFAF7',
            boxShadow: '0 8px 30px rgba(122, 155, 126, 0.25)'
          }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'var(--primary)', opacity: 0.4 }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="relative font-serif text-2xl leading-tight text-center px-6">
            Vou comer
            <br /> agora
          </span>
        </motion.button>

        {config.fraseAncora ? (
          <p className="text-center text-muted text-base px-6 leading-relaxed font-serif italic">
            “{config.fraseAncora}”
          </p>
        ) : (
          <p className="text-center text-muted text-sm px-6">
            Toca no botão quando o impulso chegar.
          </p>
        )}
      </div>

      {prompts.length > 0 && (
        <div className="space-y-2 pt-2">
          {prompts.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                buzz(15);
                c.onClick();
              }}
              className="card w-full text-left active:scale-[0.99] transition-transform flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-sm font-medium text-body">{c.label}</div>
                <div className="text-xs text-muted">{c.hint}</div>
              </div>
              <ChevronIcon />
            </button>
          ))}
        </div>
      )}

      <InsightSemanal />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function SOSIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
