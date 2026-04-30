// Adaptive backgrounds based on impulse intensity (0-10).
// Light + dark variants. Smooth transitions handled by CSS.

const LIGHT = {
  cool: '#E6EEF2',
  neutral: '#F1ECDF',
  warm: '#F4DDD0',
  hot: '#EDC4B3'
};

const DARK = {
  cool: '#1B262C',
  neutral: '#22221F',
  warm: '#2D2421',
  hot: '#3A2A24'
};

export function bgForIntensity(value, dark = false) {
  const p = dark ? DARK : LIGHT;
  if (value <= 3) return p.cool;
  if (value <= 6) return p.neutral;
  if (value <= 8) return p.warm;
  return p.hot;
}

export function accentForIntensity(value, dark = false) {
  if (value <= 3) return dark ? '#A8BCC8' : '#8FA7B5';
  if (value <= 6) return dark ? '#A0BFA4' : '#7A9B7E';
  return dark ? '#D89A7E' : '#C97B5C';
}
