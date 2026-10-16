# בודקים משחקים — Game Tester 2026

A lightweight Hebrew arcade testing site. Every game is a standalone HTML page in `games/`.

## Adding a game
1. Add `games/dinosaur.html` with a `<title>דינוזאור</title>`.
2. Optionally add:
   - `<meta name="game-title" content="הדינוזאור">`
   - `<meta name="game-icon" content="🦖">`
   - `<meta name="description" content="קופצים מעל מכשולים">`
3. Commit to GitHub. The next Cloudflare Pages deployment automatically displays its button.

For an asset-heavy game use `games/dinosaur/index.html` plus other files in that folder.

## Updating
Replace the same file. Links stay stable; the homepage rebuilds automatically. Delete a file to remove its game.

## Cloudflare Pages deployment
Connect this repository via Git to **Cloudflare Pages**, set:
- Framework: None
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare will publish to a permanent `*.pages.dev` URL and redeploy on commits.

## Local testing
Run `npm run build` and open `dist/index.html`.

The two included games are placeholders, not playable games. No database or login is used.
