import { CONFIG as C } from './config.js';
import { durationFor, isCorrect } from './rules.js';

const E = id => document.getElementById(id);
const list = E('tiles');
const choose = items => items[Math.floor(Math.random() * items.length)];
const mixed = items => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
let people = [], portraits = new Map(), mode = 'loading', best = 0;
let round = 0, score = 0, tiles = [], rule = {}, duration = 0, deadline = 0, shuffleAt = 0;
try { best = Number(localStorage.getItem(C.bestKey)) || 0; } catch {}
E('best').textContent = best;
const personName = id => people.find(p => p.id === id).nameHe;
const colorName = id => C.palette.find(p => p.id === id).name;

function modal(title, text, button) {
  E('headline').textContent = title;
  E('explain').textContent = text;
  E('start').textContent = button;
  E('overlay').hidden = false;
}
function finish(reason) {
  mode = 'over';
  if (score > best) {
    best = score; E('best').textContent = best;
    try { localStorage.setItem(C.bestKey, String(best)); } catch {}
  }
  E('icon').textContent = '💥';
  modal('נפסלת!', `${reason} הגעת לשלב ${round} עם ${score} נקודות.`, 'נסה שוב');
}
function pick(tile) {
  if (mode !== 'play') return;
  const now = performance.now();
  if (now >= deadline) return finish('נגמר הזמן!');
  if (!isCorrect(tile, rule)) return finish(`לחצת על ${personName(tile.person)} בצבע ${colorName(tile.color)}. ההוראה הייתה: ${E('rule').textContent}`);
  score += C.points.base + Math.floor((deadline - now) / 1000 * C.points.speed);
  E('score').textContent = score;
  round++; setup();
}
function render() {
  list.replaceChildren();
  for (const tile of tiles) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'tile';
    button.style.backgroundColor = C.palette.find(c => c.id === tile.color).color;
    button.setAttribute('aria-label', `${personName(tile.person)}, צבע ${colorName(tile.color)}`);
    const img = document.createElement('img');
    img.src = portraits.get(`${tile.person}/${tile.color}`); img.alt = ''; img.draggable = false;
    button.append(img);
    if (tile.caption) {
      const caption = document.createElement('span');
      caption.textContent = tile.caption; caption.style.color = tile.ink;
      button.append(caption);
    }
    button.onclick = () => pick(tile);
    list.append(button);
  }
}
function setup() {
  E('round').textContent = round;
  const count = C.grids.find(g => round <= g.through).count;
  const pair = mixed(people).slice(0, 2);
  const colors = [C.palette[0], choose(C.palette.slice(1))];
  // Both people appear in both colors, guaranteeing a match and a non-match.
  const combinations = pair.flatMap(p => colors.map(c => ({ person: p.id, color: c.id })));
  tiles = Array.from({ length: count }, (_, i) => ({ ...combinations[i % 4] }));
  const target = choose(combinations);
  const dimension = round < C.rules.combinationsFrom ? 'person' : choose(['person', 'color', 'both']);
  rule = {
    kind: round < C.rules.alternateFrom || Math.random() < C.rules.avoidChance ? 'avoid' : 'target',
    person: dimension !== 'color' ? target.person : null,
    color: dimension !== 'person' ? target.color : null
  };
  const subject = rule.person
    ? personName(rule.person) + (rule.color ? ` בצבע ${colorName(rule.color)}` : '')
    : `הצבע ${colorName(rule.color)}`;
  E('rule').textContent = (rule.kind === 'avoid' ? '🚫 אל תלחץ על ' : '✅ לחץ על ') + subject + '!';
  const d = C.distractions;
  for (const tile of tiles) {
    tile.caption = ''; tile.ink = '#fff';
    if (round < d.colorWordFrom || Math.random() >= d.chance) continue;
    const wrongColor = choose(C.palette.filter(c => c.id !== tile.color)).name;
    const wrongName = choose(pair.filter(p => p.id !== tile.person)).nameHe;
    tile.caption = round >= d.combinedFrom ? `${wrongName} · ${wrongColor}`
      : round >= d.nameFrom ? wrongName : wrongColor;
    if (round >= d.inkFrom) tile.ink = choose(C.palette.filter(c => c.id !== tile.color)).color;
  }
  tiles = mixed(tiles);
  list.style.gridTemplateColumns = `repeat(${count === 4 ? 2 : count <= 9 ? 3 : 4},minmax(0,1fr))`;
  render();
  duration = durationFor(round, C.timer);
  const now = performance.now();
  deadline = now + duration * 1000;
  shuffleAt = now + Math.max(C.shuffle.initialMinimum, C.shuffle.initialBase - round * C.shuffle.initialDrop);
  E('fill').style.width = '100%';
}
function begin() {
  if (mode === 'loading' || mode === 'error') return;
  mode = 'play'; round = 1; score = 0;
  E('score').textContent = 0; E('overlay').hidden = true; setup();
}
function tick(now) {
  if (mode === 'play') {
    const left = deadline - now;
    E('fill').style.width = Math.max(0, Math.min(100, left / (duration * 1000) * 100)) + '%';
    E('fill').style.background = left < 650 ? '#fa6b7d' : '#a9edab';
    if (left <= 0) finish('נגמר הזמן!');
    else if (round >= C.shuffle.from && now > shuffleAt) {
      tiles = mixed(tiles); render();
      shuffleAt = now + Math.max(C.shuffle.minimum, C.shuffle.base - round * C.shuffle.drop);
    }
  }
  requestAnimationFrame(tick);
}
async function load() {
  mode = 'loading'; E('start').disabled = true;
  E('start').textContent = 'טוען תמונות…';
  try {
    const response = await fetch('../../assets/humans/people.json');
    if (!response.ok) throw new Error('catalog');
    people = await response.json();
    if (people.length < 2) throw new Error('people');
    await Promise.all(people.map(async p => {
      const img = new Image(); img.src = `../../assets/humans/${p.id}/happy.webp`;
      await img.decode();
      for (const color of C.palette) {
        const canvas = document.createElement('canvas');
        canvas.width = 160; canvas.height = 160;
        const ctx = canvas.getContext('2d');
        const scale = Math.min(160 / img.width, 160 / img.height);
        ctx.drawImage(img, (160 - img.width * scale) / 2, (160 - img.height * scale) / 2, img.width * scale, img.height * scale);
        const pixels = ctx.getImageData(0, 0, 160, 160);
        const rgb = color.color.slice(1).match(/../g).map(v => parseInt(v, 16));
        for (let i = 0; i < pixels.data.length; i += 4) {
          const light = (pixels.data[i] * .2126 + pixels.data[i + 1] * .7152 + pixels.data[i + 2] * .0722) / 255;
          for (let ch = 0; ch < 3; ch++) pixels.data[i + ch] = pixels.data[i + ch] * (1 - C.tintStrength) + rgb[ch] * (.35 + .65 * light) * C.tintStrength;
        }
        ctx.putImageData(pixels, 0, 0);
        portraits.set(`${p.id}/${color.id}`, canvas.toDataURL());
      }
    }));
    mode = 'menu'; E('start').disabled = false; E('start').textContent = 'התחל משחק';
  } catch {
    mode = 'error'; E('start').disabled = false;
    modal('התמונות לא נטענו', 'בדקו את החיבור ונסו לטעון שוב. המשחק לא יתחיל בלי תמונות.', 'נסה לטעון שוב');
  }
}
E('start').onclick = () => mode === 'error' ? load() : begin();
addEventListener('keydown', e => {
  if (e.code === 'Space' && (mode === 'menu' || mode === 'over')) { e.preventDefault(); begin(); }
});
requestAnimationFrame(tick);
load();
