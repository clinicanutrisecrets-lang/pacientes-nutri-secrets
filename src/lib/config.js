const KEY = 'pausa.config';
const ONBOARDED_KEY = 'pausa.onboarded';

export const defaultConfig = {
  perfil: 'pausa',
  modoTurbo: false,
  modoClaustro: false,
  haptic: true,
  som: false,
  notificacoes: false,
  fraseAncora: '',
  listaSOS: [],
  temaEscuro: false
};

export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultConfig };
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed };
  } catch {
    return { ...defaultConfig };
  }
}

export function saveConfig(config) {
  localStorage.setItem(KEY, JSON.stringify(config));
}

export function isOnboarded() {
  return localStorage.getItem(ONBOARDED_KEY) === '1';
}

export function markOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, '1');
}

export function resetOnboarded() {
  localStorage.removeItem(ONBOARDED_KEY);
}
