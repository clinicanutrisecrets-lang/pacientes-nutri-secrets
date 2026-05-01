export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  if (typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // some browsers throw when called outside a user gesture; fail quietly
  }
}

export function softPulse(): void {
  vibrate(15);
}

export function softDoublePulse(): void {
  vibrate([10, 60, 10]);
}
