// Adaptive backgrounds based on impulse intensity (0-10).
// Returns inline style values so we can transition smoothly.

export function bgForIntensity(value) {
  if (value <= 3) return '#E6EEF2'; // azul névoa muito claro
  if (value <= 6) return '#F1ECDF'; // areia neutra
  if (value <= 8) return '#F4DDD0'; // terracota leve
  return '#EDC4B3'; // terracota mais quente
}

export function accentForIntensity(value) {
  if (value <= 3) return '#8FA7B5'; // calma
  if (value <= 6) return '#7A9B7E'; // sálvia
  return '#C97B5C'; // calor
}
