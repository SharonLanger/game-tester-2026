# Game Tester 2026

אתר לבדיקת משחקים חדשים לפני שהם עולים לאתר הרשמי.

## Adding or updating a game

Add one HTML file in `games/`. Set `<title>` and optionally these meta tags: `game-title`, `game-icon`, `description`. Commit the file; the build script discovers it automatically.

Games are shown on the Hebrew landing page with a persistent return-to-home link.

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages. Build command: `npm run build`. Output directory: `dist`.

Future commits will automatically deploy the updated site, with the same public URL.
