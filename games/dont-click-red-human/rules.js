export function durationFor(round, timer) {
  const early = Math.min(round - 1, timer.earlyThrough - 1);
  const later = Math.max(0, round - timer.earlyThrough);
  return Math.max(timer.minimum, timer.start - early * timer.earlyDrop - later * timer.laterDrop);
}
export function matches(tile, rule) {
  return (!rule.person || tile.person === rule.person) && (!rule.color || tile.color === rule.color);
}
export function isCorrect(tile, rule) {
  return rule.kind === 'avoid' ? !matches(tile, rule) : matches(tile, rule);
}
