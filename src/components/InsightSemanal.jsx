import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listEpisodios, listCheckins } from '../lib/db.js';
import { insightDaSemana } from '../lib/insights.js';
import { isoWeek } from '../lib/date.js';
import { buzz } from '../lib/haptic.js';

const KEY = 'pausa.insightSeen';

export default function InsightSemanal() {
  const [insight, setInsight] = useState(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    let cancel = false;
    const semana = isoWeek();
    const ja = localStorage.getItem(KEY);
    if (ja === semana) return;
    Promise.all([listEpisodios(), listCheckins()]).then(([eps, cks]) => {
      if (cancel) return;
      const i = insightDaSemana(eps, cks);
      if (i) {
        setInsight(i);
        setAberto(true);
      }
    });
    return () => {
      cancel = true;
    };
  }, []);

  const fechar = () => {
    buzz(20);
    localStorage.setItem(KEY, isoWeek());
    setAberto(false);
  };

  return (
    <AnimatePresence>
      {aberto && insight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={fechar}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl p-7"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs uppercase tracking-wider text-muted pb-2">Insight da semana</p>
            <h2 className="font-serif text-2xl text-body leading-tight pb-3">{insight.titulo}</h2>
            <p className="text-body text-base leading-relaxed pb-6">{insight.texto}</p>
            <button onClick={fechar} className="btn-primary w-full">Entendi</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
