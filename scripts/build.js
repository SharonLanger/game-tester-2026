#!/usr/bin/env node
// Automatically publish all games and create waiter profile launchers from four images.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(dist, 'human');
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
// Games tagged with <meta name="game-hidden" content="true"> are published
// for direct URL access but omitted from the tester homepage and game menu.
const visiblePaths = paths.filter(file => {
  const src = fs.readFileSync(path.join(gamesDir,file), 'utf8');
  return meta(src, 'game-hidden').trim().toLowerCase() !== 'true';
});
const used = new Set();
const games = visiblePaths.map(file => {
  const src = fs.readFileSync(path.join(gamesDir,file), 'utf8');
  const id = file.replace(/\/index\.html$/i,'').replace(/\.html?$/i,'').replace(/[^\w\-\/]/g,'-').replace(/\//g,'--');
  if (used.has(id)) throw new Error('Duplicate game ID: ' + id);
  used.add(id);
  const title = meta(src,'game-title') || decodeHTML((src.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1] || '') || id;
  return { id, title: title.trim(), description: meta(src,'description').trim(), icon: meta(src,'game-icon').trim() || '🎮', path: file };
});
fs.rmSync(dist, { recursive:true, force:true });
fs.mkdirSync(out, { recursive:true });
for (const file of ['index.html','play.html','style.css','site.js'])
  fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(gamesDir,path.join(out,'games'),{recursive:true});
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
fs.writeFileSync(path.join(out,'games-list.js'),'/* Automatically generated; do not edit. */\nwindow.GAME_LIST = ' + JSON.stringify(games,null,2) + ';\n');

// A profile is exactly a folder containing images/happy.webp, worried.webp,
// surprised.webp and scared.webp. Do not add profile index.html to GitHub.
// The build creates a lightweight launcher that reuses the shared game.js.
const waiterFolder = path.join(gamesDir, 'human-drunk-waiter');
const defaultHtml = fs.readFileSync(path.join(waiterFolder,'index.html'),'utf8');
const required = ['happy','worried','surprised','scared'];
let profiles = [];
for (const entry of fs.readdirSync(waiterFolder,{withFileTypes:true})) {
  if (!entry.isDirectory() || entry.name==='images' || entry.name==='assets' || entry.name.startsWith('.')) continue;
  // Keep paths predictable; the profile name is part of the public URL.
  if (!/^[a-z0-9-]+$/.test(entry.name)) continue;
  const imgFolder = path.join(waiterFolder,entry.name,'images');
  if (!required.every(name => fs.existsSync(path.join(imgFolder,name+'.webp')))) {
    console.warn('Skipping incomplete profile: ' + entry.name);
    continue;
  }
  // Pages are generated after copying assets: shared CSS and JS are one level up.
  const profilePage = defaultHtml
    .replace('href="style.css"','href="../style.css"')
    .replace('src="game.js"','src="../game.js"');
  const destination = path.join(out,'games','human-drunk-waiter',entry.name,'index.html');
  fs.writeFileSync(destination,profilePage);
  profiles.push(entry.name);
}
console.log('Built ' + games.length + ' games and waiter profiles: ' + profiles.join(', '));
