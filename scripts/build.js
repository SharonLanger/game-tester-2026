#!/usr/bin/env node
// A zero-dependency static build: discover every HTML game and create its homepage button.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const gamesDir = path.join(root, 'games');

function findGameFiles(folder, prefix = '') {
  let result = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const child = path.join(folder, entry.name);
    const rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(child, 'index.html'))) result.push(rel + '/index.html');
      else result = result.concat(findGameFiles(child, rel));
    } else if (entry.isFile() && /\.html?$/i.test(entry.name) && entry.name !== 'index.html') {
      result.push(rel);
    }
  }
  return result;
}
function decodeHTML(value) {
  return value.replace(/&(?:amp|lt|gt|quot|apos|#39|#x27);/g, m => ({
    '&amp;':'&', '&lt;':'<', '&gt;':'>', '&quot;':'"', '&apos;':"'", '&#39;':"'", '&#x27;':"'"
  }[m] || m));
}
function meta(source, key) {
  const tags = source.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const pairs = {};
    for (const match of tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)) pairs[match[1].toLowerCase()] = match[3];
    if (pairs.name === key) return decodeHTML(pairs.content || '');
  }
  return '';
}
const paths = findGameFiles(gamesDir).sort((a,b) => a.localeCompare(b));
const used = new Set();
const games = paths.map(file => {
  const src = fs.readFileSync(path.join(gamesDir,file), 'utf8');
  const id = file.replace(/\/index\.html$/i,'').replace(/\.html?$/i,'').replace(/[^\w\-\/]/g,'-').replace(/\//g,'--');
  if (used.has(id)) throw new Error('Duplicate game ID: ' + id);
  used.add(id);
  const title = meta(src,'game-title') || decodeHTML((src.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1] || '') || id;
  return { id, title: title.trim(), description: meta(src,'description').trim(), icon: meta(src,'game-icon').trim() || '🎮', path: file };
});
fs.rmSync(out, { recursive:true, force:true });
fs.mkdirSync(out, { recursive:true });
for (const file of ['index.html','play.html','style.css','site.js'])
  fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(gamesDir,path.join(out,'games'),{recursive:true});
fs.writeFileSync(path.join(out,'games-list.js'),'/* Automatically generated; do not edit. */\nwindow.GAME_LIST = ' + JSON.stringify(games,null,2) + ';\n');
console.log('Built ' + games.length + ' games: ' + games.map(g => g.title).join(', '));
