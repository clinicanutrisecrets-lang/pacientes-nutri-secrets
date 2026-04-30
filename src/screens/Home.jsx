import { motion } from 'framer-motion';
import { buzz } from '../lib/haptic.js';

export default function Home({ config, onStart, onSettings }) {
  return (
    <div className="screen safe-top safe-bottom relative">
      <div className="flex justify-end">
        <button
          aria-label="Configurações"
          onClick={() => {
            buzz(20);
            onSettings();
          }}
          className="text-cinza hover:text-grafite p-2 -mr-2 transition-colors"
        >
          <SettingsIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.button
          onClick={() => {
            buzz(60);
            onStart();
          }}
          whileTap={{ scale: 0.96 }}
          className="relative w-64 h-64 rounded-full bg-salvia text-white shadow-soft flex items-center justify-center"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-salvia/40"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="relative font-serif text-2xl leading-tight text-center px-6">
            Vou comer
            <br /> agora
          </span>
        </motion.button>

        {config.fraseAncora ? (
          <p className="text-center text-grafite/70 text-base px-6 leading-relaxed font-serif italic">
            “{config.fraseAncora}”
          </p>
        ) : (
          <p className="text-center text-cinza text-sm px-6">
            Toca no botão quando o impulso chegar.
          </p>
        )}
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
