import Dexie from 'dexie';
import { isoDate, isoWeek } from './date.js';

export const db = new Dexie('pausa');

db.version(1).stores({
  episodios: '++id, timestamp',
  checkins: '++id, data, tipo',
  refeicoes: '++id, timestamp',
  compromissos: '++id, semanaInicio',
  exercicios: '++id, semanaInicio'
});

db.version(2).stores({
  episodios: '++id, timestamp',
  checkins: '++id, data, tipo',
  refeicoes: '++id, timestamp',
  compromissos: '++id, semanaInicio',
  exercicios: '++id, semanaInicio',
  diario: '++id, data'
});

export async function addEpisodio(data) {
  return db.episodios.add({
    timestamp: new Date().toISOString(),
    ...data
  });
}

export async function listEpisodios() {
  return db.episodios.orderBy('timestamp').reverse().toArray();
}

export async function countEpisodios() {
  return db.episodios.count();
}

// Check-ins (one per type per day).
export async function getCheckinHoje(tipo) {
  const data = isoDate();
  return db.checkins.where({ data, tipo }).first();
}

export async function saveCheckin(tipo, payload) {
  const data = isoDate();
  const existing = await db.checkins.where({ data, tipo }).first();
  if (existing) {
    return db.checkins.update(existing.id, { ...payload, atualizadoEm: new Date().toISOString() });
  }
  return db.checkins.add({
    data,
    tipo,
    criadoEm: new Date().toISOString(),
    ...payload
  });
}

export async function listCheckins() {
  return db.checkins.toArray();
}

// Refeições (Modo Diário).
export async function addRefeicao(payload) {
  return db.refeicoes.add({
    timestamp: new Date().toISOString(),
    ...payload
  });
}

export async function listRefeicoes() {
  return db.refeicoes.orderBy('timestamp').reverse().toArray();
}

// Compromisso semanal.
export async function getCompromissoAtual() {
  const semanaInicio = isoWeek();
  return db.compromissos.where({ semanaInicio }).first();
}

export async function saveCompromisso(texto) {
  const semanaInicio = isoWeek();
  const existing = await db.compromissos.where({ semanaInicio }).first();
  if (existing) {
    return db.compromissos.update(existing.id, { texto });
  }
  return db.compromissos.add({
    semanaInicio,
    texto,
    diasFeitos: [],
    criadoEm: new Date().toISOString()
  });
}

export async function toggleCompromissoDia(date = new Date()) {
  const semanaInicio = isoWeek();
  const data = isoDate(date);
  const c = await db.compromissos.where({ semanaInicio }).first();
  if (!c) return null;
  const has = c.diasFeitos?.includes(data);
  const diasFeitos = has ? c.diasFeitos.filter((d) => d !== data) : [...(c.diasFeitos || []), data];
  await db.compromissos.update(c.id, { diasFeitos });
  return { ...c, diasFeitos };
}

// Exercícios semanais.
export async function getExercicioAtual() {
  const semanaInicio = isoWeek();
  return db.exercicios.where({ semanaInicio }).first();
}

export async function saveExercicio(idExercicio, resposta) {
  const semanaInicio = isoWeek();
  const existing = await db.exercicios.where({ semanaInicio }).first();
  if (existing) {
    return db.exercicios.update(existing.id, {
      idExercicio,
      resposta,
      atualizadoEm: new Date().toISOString()
    });
  }
  return db.exercicios.add({
    semanaInicio,
    idExercicio,
    resposta,
    completadoEm: new Date().toISOString()
  });
}

// Diário livre.
export async function addDiario(texto) {
  return db.diario.add({
    data: isoDate(),
    timestamp: new Date().toISOString(),
    texto
  });
}

export async function listDiario(limit = 30) {
  return db.diario.orderBy('data').reverse().limit(limit).toArray();
}

// First-day reference for week-based rotations.
export async function firstEpisodeDate() {
  const first = await db.episodios.orderBy('timestamp').first();
  return first ? new Date(first.timestamp) : null;
}

export async function exportAll() {
  const [episodios, checkins, refeicoes, compromissos, exercicios, diario] = await Promise.all([
    db.episodios.toArray(),
    db.checkins.toArray(),
    db.refeicoes.toArray(),
    db.compromissos.toArray(),
    db.exercicios.toArray(),
    db.diario.toArray()
  ]);
  return {
    versao: 2,
    exportadoEm: new Date().toISOString(),
    config: JSON.parse(localStorage.getItem('pausa.config') || '{}'),
    episodios,
    checkins,
    refeicoes,
    compromissos,
    exercicios,
    diario
  };
}

export async function wipeAll() {
  await Promise.all([
    db.episodios.clear(),
    db.checkins.clear(),
    db.refeicoes.clear(),
    db.compromissos.clear(),
    db.exercicios.clear(),
    db.diario.clear()
  ]);
  localStorage.removeItem('pausa.config');
  localStorage.removeItem('pausa.onboarded');
}
