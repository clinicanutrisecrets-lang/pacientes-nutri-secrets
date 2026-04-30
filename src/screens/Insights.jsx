import { useEffect, useMemo, useState } from 'react';
import { listEpisodios, listCheckins } from '../lib/db.js';
import {
  diasDeUso,
  diasDesdePrimeiroEpisodio,
  heatmapHorario,
  topEmocoes,
  sonoVsImpulso,
  diasVulneraveis,
  mapaGatilhos,
  distDecisoes,
  quedaIntensidade
} from '../lib/insights.js';

const MIN_DIAS = 14;

export default function Insights({ onBack }) {
  const [episodios, setEpisodios] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let cancel = false;
    Promise.all([listEpisodios(), listCheckins()]).then(([e, c]) => {
      if (cancel) return;
      setEpisodios(e);
      setCheckins(c);
      setCarregado(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const dias = useMemo(() => diasDesdePrimeiroEpisodio(episodios), [episodios]);
  const usoEm = useMemo(() => diasDeUso(episodios), [episodios]);
  const heatmap = useMemo(() => heatmapHorario(episodios), [episodios]);
  const top = useMemo(() => topEmocoes(episodios), [episodios]);
  const sono = useMemo(() => sonoVsImpulso(checkins, episodios), [checkins, episodios]);
  const semana = useMemo(() => diasVulneraveis(episodios), [episodios]);
  const mapa = useMemo(() => mapaGatilhos(episodios), [episodios]);
  const decisoes = useMemo(() => distDecisoes(episodios), [episodios]);
  const queda = useMemo(() => quedaIntensidade(episodios), [episodios]);

  if (!carregado) return <div className="screen safe-top safe-bottom" />;

  if (dias < MIN_DIAS) {
    const faltam = MIN_DIAS - dias;
    return (
      <div className="screen safe-top safe-bottom">
        <Header onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="font-serif text-5xl text-body">{faltam}</div>
          <p className="text-body text-base px-6 leading-relaxed">
            {faltam === 1 ? 'Falta 1 dia' : `Faltam ${faltam} dias`} pra montar seus primeiros padrões.
          </p>
          <p className="text-muted text-sm px-6 leading-relaxed">
            Nada sai daqui. Quando os dados forem suficientes, eles aparecem.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <Header onBack={onBack} />

      <p className="text-muted text-sm pb-6">
        {usoEm} {usoEm === 1 ? 'dia' : 'dias'} de uso · {episodios.length} {episodios.length === 1 ? 'pausa' : 'pausas'} registradas
      </p>

      <Card titulo="Quando os impulsos chegam">
        <Bars data={heatmap} />
      </Card>

      <Card titulo="O que está embaixo dos impulsos fortes">
        {top.length === 0 ? (
          <p className="text-muted text-sm">Sem dados suficientes ainda.</p>
        ) : (
          <ul className="space-y-2">
            {top.map((t) => (
              <li key={t.id} className="flex justify-between items-baseline">
                <span className="text-body text-base">{t.label}</span>
                <span className="text-muted text-sm tabular-nums">{t.pct}%</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {sono && (
        <Card titulo="Sono x intensidade do impulso">
          <ul className="space-y-2">
            {sono.map((s) => (
              <li key={s.range} className="flex justify-between items-baseline">
                <span className="text-body text-base">{s.range}</span>
                <span className="text-muted text-sm tabular-nums">
                  {s.n === 0 ? '—' : `média ${s.media.toFixed(1)} · n=${s.n}`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card titulo="Dias da semana mais sensíveis">
        <Bars data={semana} />
      </Card>

      <Card titulo="Mapa de gatilhos">
        <HeatGrid mapa={mapa} />
      </Card>

      <Card titulo="Suas decisões">
        <DecisionStack d={decisoes} total={episodios.length} />
        {queda !== null && (
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Em média, sua intensidade {queda > 0 ? 'caiu' : queda < 0 ? 'subiu' : 'ficou igual'}{' '}
            <strong className="text-body">{Math.abs(queda).toFixed(1)} pontos</strong> depois da pausa.
          </p>
        )}
      </Card>

      <p className="text-xs text-muted text-center pt-4 pb-2">
        Tudo isso fica só no seu celular.
      </p>
    </div>
  );
}

function Header({ onBack }) {
  return (
    <div className="flex items-center gap-3 pb-3">
      <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
        <BackIcon />
      </button>
      <h1 className="h-display">Insights</h1>
    </div>
  );
}

function Card({ titulo, children }) {
  return (
    <div className="card mb-4">
      <p className="text-xs uppercase tracking-wider text-muted pb-3">{titulo}</p>
      {children}
    </div>
  );
}

function Bars({ data }) {
  return (
    <div className="space-y-2">
      {data.map((b) => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="w-12 text-xs text-muted">{b.label}</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${b.ratio * 100}%`, backgroundColor: 'var(--primary)' }}
            />
          </div>
          <span className="w-6 text-right text-xs text-muted tabular-nums">{b.count}</span>
        </div>
      ))}
    </div>
  );
}

function HeatGrid({ mapa }) {
  const { emocoes, horas, grid, max } = mapa;
  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: `90px repeat(${horas.length}, 1fr)`, gap: '4px' }}>
        <div />
        {horas.map((h) => (
          <div key={h} className="text-[10px] text-muted text-center">
            {h}
          </div>
        ))}
        {emocoes.map((label, ei) => (
          <Row key={label} label={label} cells={grid[ei]} max={max} />
        ))}
      </div>
    </div>
  );
}

function Row({ label, cells, max }) {
  return (
    <>
      <div className="text-xs text-body py-2 pr-2 truncate">{label}</div>
      {cells.map((c, i) => {
        const ratio = c / max;
        const bg = c === 0
          ? 'var(--border)'
          : `color-mix(in srgb, var(--primary) ${Math.round(ratio * 100)}%, transparent)`;
        return (
          <div
            key={i}
            className="rounded h-9 flex items-center justify-center text-[10px] tabular-nums"
            style={{ backgroundColor: bg, color: ratio > 0.5 ? '#fff' : 'var(--muted)' }}
          >
            {c > 0 ? c : ''}
          </div>
        );
      })}
    </>
  );
}

function DecisionStack({ d, total }) {
  if (!total) return <p className="text-muted text-sm">Sem dados ainda.</p>;
  const pct = (n) => Math.round((n / total) * 100);
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
        <div style={{ width: `${pct(d.comer)}%`, backgroundColor: 'var(--warm)' }} />
        <div style={{ width: `${pct(d.esperar)}%`, backgroundColor: 'var(--primary)' }} />
        <div style={{ width: `${pct(d.substituir)}%`, backgroundColor: 'var(--cool)' }} />
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        <li className="flex justify-between"><span className="text-body">Comer com consciência</span><span className="text-muted tabular-nums">{d.comer} · {pct(d.comer)}%</span></li>
        <li className="flex justify-between"><span className="text-body">Esperar 10 min</span><span className="text-muted tabular-nums">{d.esperar} · {pct(d.esperar)}%</span></li>
        <li className="flex justify-between"><span className="text-body">Substituir</span><span className="text-muted tabular-nums">{d.substituir} · {pct(d.substituir)}%</span></li>
      </ul>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
