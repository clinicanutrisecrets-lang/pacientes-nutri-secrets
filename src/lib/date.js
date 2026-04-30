// Date helpers — week starts Monday (ISO).

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isoDate(date = new Date()) {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function startOfWeek(date = new Date()) {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 (Sun) … 6 (Sat)
  const diff = (day + 6) % 7; // distance to Monday
  d.setDate(d.getDate() - diff);
  return d;
}

export function isoWeek(date = new Date()) {
  return startOfWeek(date).toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  const ms = startOfDay(b) - startOfDay(a);
  return Math.round(ms / 86_400_000);
}

export function sameDay(a, b) {
  return isoDate(a) === isoDate(b);
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function weekdayName(date = new Date()) {
  return WEEKDAYS[new Date(date).getDay()];
}

export function weekdayShort(date = new Date()) {
  return WEEKDAYS_SHORT[new Date(date).getDay()];
}

export function isMorning(date = new Date()) {
  const h = date.getHours();
  return h >= 4 && h < 12;
}

export function isEvening(date = new Date()) {
  const h = date.getHours();
  return h >= 18 || h < 4;
}

export function hourOf(dateLike) {
  return new Date(dateLike).getHours();
}
