// Insight computations from local data only.
import { hourOf, isoDate, weekdayShort, daysBetween } from './date.js';

const EMOCAO_LABEL = {
  fome: 'Fome real',
  ansiedade: 'Ansiedade',
  tedio: 'Tédio',
  raiva: 'Raiva',
  tristeza: 'Tristeza',
  cansaco: 'Cansaço'
};

const WEEKDAY_BUCKETS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function diasDeUso(episodios) {
  if (!episodios?.length) return 0;
  const dias = new Set(episodios.map((e) => isoDate(e.timestamp)));
  return dias.size;
}

export function diasDesdePrimeiroEpisodio(episodios) {
  if (!episodios?.length) return 0;
  const sorted = [...episodios].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return Math.max(1, daysBetween(sorted[0].timestamp, new Date()) + 1);
}

// Heatmap of episodes per hour bucket (4-hour buckets, 6 buckets).
export function heatmapHorario(episodios) {
  const buckets = [
    { label: '0-4h', count: 0 },
    { label: '4-8h', count: 0 },
    { label: '8-12h', count: 0 },
    { label: '12-16h', count: 0 },
    { label: '16-20h', count: 0 },
    { label: '20-24h', count: 0 }
  ];
  episodios.forEach((e) => {
    const h = hourOf(e.timestamp);
    const idx = Math.min(5, Math.floor(h / 4));
    buckets[idx].count += 1;
  });
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return buckets.map((b) => ({ ...b, ratio: b.count / max }));
}

// Top 3 emotions before "off-plan" (decisao=comer or substituir, intensidade ≥ 6).
export function topEmocoes(episodios) {
  const filtrados = episodios.filter((e) => e.intensidadeAntes >= 6);
  const counts = {};
  filtrados.forEach((e) => {
    if (!e.emocao) return;
    counts[e.emocao] = (counts[e.emocao] || 0) + 1;
  });
  const total = filtrados.length || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => ({
      id,
      label: EMOCAO_LABEL[id] || id,
      count,
      pct: Math.round((count / total) * 100)
    }));
}

// Sleep ↔ impulse correlation: average impulse intensity by sleep bucket.
export function sonoVsImpulso(checkins, episodios) {
  const manhas = checkins.filter((c) => c.tipo === 'manha' && typeof c.sono === 'number');
  if (!manhas.length) return null;
  const byDate = new Map(manhas.map((c) => [c.data, c.sono]));

  const buckets = {
    baixo: { range: '0-4h', sonoMin: 0, sonoMax: 4, soma: 0, n: 0 },
    medio: { range: '5-6h', sonoMin: 5, sonoMax: 6, soma: 0, n: 0 },
    bom: { range: '7-8h', sonoMin: 7, sonoMax: 8, soma: 0, n: 0 },
    otimo: { range: '9-10h', sonoMin: 9, sonoMax: 10, soma: 0, n: 0 }
  };

  episodios.forEach((e) => {
    const data = isoDate(e.timestamp);
    const sono = byDate.get(data);
    if (typeof sono !== 'number') return;
    let key;
    if (sono <= 4) key = 'baixo';
    else if (sono <= 6) key = 'medio';
    else if (sono <= 8) key = 'bom';
    else key = 'otimo';
    buckets[key].soma += e.intensidadeAntes || 0;
    buckets[key].n += 1;
  });

  const arr = Object.values(buckets).map((b) => ({
    range: b.range,
    media: b.n ? b.soma / b.n : null,
    n: b.n
  }));
  if (arr.every((b) => b.n === 0)) return null;
  return arr;
}

// Most vulnerable weekdays.
export function diasVulneraveis(episodios) {
  const buckets = WEEKDAY_BUCKETS.map((label) => ({ label, count: 0 }));
  episodios.forEach((e) => {
    const d = new Date(e.timestamp).getDay();
    buckets[d].count += 1;
  });
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return buckets.map((b) => ({ ...b, ratio: b.count / max }));
}

// Trigger map: emotion × hour-of-day bucket counts.
export function mapaGatilhos(episodios) {
  const emocoes = Object.keys(EMOCAO_LABEL);
  const horas = ['0-8h', '8-12h', '12-16h', '16-20h', '20-24h'];
  const grid = emocoes.map((id) =>
    horas.map(() => 0)
  );
  episodios.forEach((e) => {
    if (!e.emocao) return;
    const ei = emocoes.indexOf(e.emocao);
    if (ei === -1) return;
    const h = hourOf(e.timestamp);
    let hi;
    if (h < 8) hi = 0;
    else if (h < 12) hi = 1;
    else if (h < 16) hi = 2;
    else if (h < 20) hi = 3;
    else hi = 4;
    grid[ei][hi] += 1;
  });
  const max = Math.max(1, ...grid.flat());
  return {
    emocoes: emocoes.map((id) => EMOCAO_LABEL[id]),
    horas,
    grid,
    max
  };
}

// Decision distribution.
export function distDecisoes(episodios) {
  const counts = { comer: 0, esperar: 0, substituir: 0 };
  episodios.forEach((e) => {
    if (e.decisao && counts[e.decisao] !== undefined) counts[e.decisao] += 1;
  });
  return counts;
}

// Average intensity drop after breathing.
export function quedaIntensidade(episodios) {
  const validos = episodios.filter(
    (e) => typeof e.intensidadeAntes === 'number' && typeof e.intensidadeDepois === 'number'
  );
  if (!validos.length) return null;
  const total = validos.reduce((acc, e) => acc + (e.intensidadeAntes - e.intensidadeDepois), 0);
  return total / validos.length;
}

// Weekly insight — choose the most striking finding.
export function insightDaSemana(episodios, checkins) {
  if (!episodios.length) return null;

  const semana = new Date();
  semana.setDate(semana.getDate() - 7);
  const ultimos = episodios.filter((e) => new Date(e.timestamp) >= semana);
  if (!ultimos.length) return null;

  // Sleep effect
  const sono = sonoVsImpulso(checkins, ultimos);
  if (sono) {
    const baixo = sono.find((s) => s.range === '0-4h');
    const bom = sono.find((s) => s.range === '7-8h');
    if (baixo?.n && bom?.n && baixo.media && bom.media) {
      const diff = Math.round(((baixo.media - bom.media) / Math.max(0.1, baixo.media)) * 100);
      if (Math.abs(diff) >= 20) {
        return {
          titulo: 'Seu sono importa',
          texto: `Seus impulsos foram ${Math.abs(diff)}% ${diff > 0 ? 'menores' : 'maiores'} nos dias com 7-8h de sono.`
        };
      }
    }
  }

  // Top emotion
  const top = topEmocoes(ultimos);
  if (top[0] && top[0].pct >= 40) {
    return {
      titulo: 'Padrão emocional',
      texto: `${top[0].label} apareceu em ${top[0].pct}% dos seus impulsos essa semana.`
    };
  }

  // Decision balance
  const dec = distDecisoes(ultimos);
  const total = dec.comer + dec.esperar + dec.substituir;
  if (total >= 3) {
    const conscientes = dec.esperar + dec.substituir;
    return {
      titulo: 'Sua semana',
      texto: `Você usou a Pausa ${total} ${total === 1 ? 'vez' : 'vezes'} — em ${conscientes} ${
        conscientes === 1 ? 'decidiu não comer ou substituiu' : 'decidiu não comer ou substituiu'
      }, em ${dec.comer} comeu com consciência. Ambas são vitória.`
    };
  }

  return null;
}

export const EMOCAO_LABELS = EMOCAO_LABEL;
