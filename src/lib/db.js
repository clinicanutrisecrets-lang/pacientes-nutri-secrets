import Dexie from 'dexie';

export const db = new Dexie('pausa');

db.version(1).stores({
  episodios: '++id, timestamp',
  checkins: '++id, data, tipo',
  refeicoes: '++id, timestamp',
  compromissos: '++id, semanaInicio',
  exercicios: '++id, semanaInicio'
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

export async function exportAll() {
  const [episodios, checkins, refeicoes, compromissos, exercicios] = await Promise.all([
    db.episodios.toArray(),
    db.checkins.toArray(),
    db.refeicoes.toArray(),
    db.compromissos.toArray(),
    db.exercicios.toArray()
  ]);
  return {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    config: JSON.parse(localStorage.getItem('pausa.config') || '{}'),
    episodios,
    checkins,
    refeicoes,
    compromissos,
    exercicios
  };
}

export async function wipeAll() {
  await Promise.all([
    db.episodios.clear(),
    db.checkins.clear(),
    db.refeicoes.clear(),
    db.compromissos.clear(),
    db.exercicios.clear()
  ]);
  localStorage.removeItem('pausa.config');
  localStorage.removeItem('pausa.onboarded');
}
