import { useState } from 'react';
import { loadConfig, saveConfig, resetOnboarded } from '../lib/config.js';
import { exportAll, wipeAll } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';

const PERFIS = [
  { id: 'pausa', label: 'Pausa', tempo: '~30s' },
  { id: 'reflexao', label: 'Reflexão', tempo: '~2-3min' },
  { id: 'diario', label: 'Diário', tempo: '~5min' }
];

export default function Settings({ onBack, onResetOnboarding }) {
  const [config, setConfig] = useState(loadConfig());
  const [confirmandoWipe, setConfirmandoWipe] = useState(false);

  const update = (patch) => {
    const next = { ...config, ...patch };
    setConfig(next);
    saveConfig(next);
    buzz(15);
  };

  const handleExport = async () => {
    buzz(30);
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `pausa-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWipe = async () => {
    await wipeAll();
    resetOnboarded();
    buzz([30, 80, 30]);
    onResetOnboarding();
  };

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button
          aria-label="Voltar"
          onClick={onBack}
          className="text-cinza hover:text-grafite p-2 -ml-2 transition-colors"
        >
          <BackIcon />
        </button>
        <h1 className="h-display">Configurações</h1>
      </div>

      <Section title="Perfil">
        <div className="space-y-2">
          {PERFIS.map((p) => {
            const ativo = config.perfil === p.id;
            return (
              <button
                key={p.id}
                onClick={() => update({ perfil: p.id })}
                className={`w-full rounded-2xl p-4 text-left transition-all border ${
                  ativo
                    ? 'bg-salvia text-white border-salvia shadow-soft'
                    : 'bg-neve text-grafite border-grafite/10'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-medium">{p.label}</span>
                  <span className={`text-sm ${ativo ? 'text-white/80' : 'text-cinza'}`}>
                    {p.tempo}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Frase âncora">
        <textarea
          value={config.fraseAncora}
          onChange={(e) => update({ fraseAncora: e.target.value.slice(0, 140) })}
          placeholder="Uma frase que te lembra por que você começou."
          rows={2}
          className="w-full rounded-2xl bg-neve border border-grafite/10 p-4 text-base resize-none focus:border-salvia"
        />
      </Section>

      <Section title="Ritmo">
        <Toggle
          label="Modo Turbo"
          hint="Fluxo mais curto, respiração de 30s."
          value={config.modoTurbo}
          onChange={(v) => update({ modoTurbo: v, modoClaustro: v ? false : config.modoClaustro })}
        />
        <Toggle
          label="Modo Claustro"
          hint="Animações mais lentas. Pular só depois de 30s."
          value={config.modoClaustro}
          onChange={(v) => update({ modoClaustro: v, modoTurbo: v ? false : config.modoTurbo })}
        />
      </Section>

      <Section title="Sensorial">
        <Toggle
          label="Vibração"
          hint="Pequeno toque háptico nos botões."
          value={config.haptic}
          onChange={(v) => update({ haptic: v })}
        />
      </Section>

      <Section title="Seus dados">
        <p className="text-sm text-cinza leading-relaxed pb-3">
          Tudo fica só no seu celular. Você pode exportar pra mostrar pra sua nutri ou apagar quando quiser.
        </p>
        <button onClick={handleExport} className="btn-secondary w-full mb-2">
          Exportar como JSON
        </button>
        {!confirmandoWipe ? (
          <button
            onClick={() => setConfirmandoWipe(true)}
            className="w-full rounded-2xl px-6 py-4 text-base font-medium border border-terracota/30 text-terracota active:scale-[0.98] transition-all"
          >
            Apagar todos os dados
          </button>
        ) : (
          <div className="rounded-2xl border border-terracota/30 p-4 space-y-3">
            <p className="text-sm text-grafite">
              Isso apaga tudo e te leva pro onboarding. Sem volta.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmandoWipe(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleWipe}
                className="flex-1 rounded-2xl px-6 py-4 text-base font-medium bg-terracota text-white active:scale-[0.98] transition-all"
              >
                Apagar
              </button>
            </div>
          </div>
        )}
      </Section>

      <p className="text-xs text-cinza/60 text-center pt-4 pb-2">
        Pausa · seus dados ficam no seu dispositivo
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="pb-6">
      <h3 className="text-xs uppercase tracking-wider text-cinza pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, hint, value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between gap-4 py-3 text-left"
    >
      <div className="flex-1">
        <div className="text-base font-medium text-grafite">{label}</div>
        {hint && <div className="text-sm text-cinza mt-0.5">{hint}</div>}
      </div>
      <div
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${
          value ? 'bg-salvia' : 'bg-grafite/20'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
