import { loadConfig } from './config';

export function buzz(pattern = 50) {
  try {
    if (!loadConfig().haptic) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore
  }
}
