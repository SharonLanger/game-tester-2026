export const CONFIG = {
  timer: { start: 5.30, earlyThrough: 12, earlyDrop: 0.035, laterDrop: 0.075, minimum: 0.62 },
  grids: [{ through: 13, count: 4 }, { through: Infinity, count: 6 }],
  rules: { alternateFrom: 8, avoidChance: 0.35, combinationsFrom: 6 },
  distractions: { colorWordFrom: 10, nameFrom: 14, combinedFrom: 20, inkFrom: 25, chance: 0.45 },
  shuffle: { from: 18, initialMinimum: 480, initialBase: 1100, initialDrop: 15, minimum: 360, base: 1100, drop: 17 },
  points: { base: 10, speed: 5 },
  tintStrength: 0.42,
  bestKey: 'tester-red-human-best-v2',
  palette: [
    { id: 'red', name: 'אדום', color: '#ed485b' },
    { id: 'blue', name: 'כחול', color: '#398eef' },
    { id: 'green', name: 'ירוק', color: '#43c78d' },
    { id: 'yellow', name: 'צהוב', color: '#f8d66d' }
  ]
};
