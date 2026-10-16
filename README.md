# בודקים משחקים — Game Tester 2026

This repository is ONLY for testing games before they move elsewhere. The site and all player-facing text are in Hebrew.

## Public tester URL

https://sharonlanger.github.io/game-tester-2026/human/

All published pages and shared assets live under `/human/`. Old root-level game URLs are intentionally not published or redirected.

## Initial GitHub Pages setup (one time)

1. Set the repository visibility to **Public** in Settings → General → Danger Zone → Change repository visibility. This is required for GitHub Pages on GitHub Free.
2. Go to Settings → Pages.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow at `.github/workflows/pages.yml` publishes the site automatically on every push to `main`.

## Add a game

Add a self-contained HTML file or a folder to `games/`. Two supported examples:

```text
games/
  dinosaur.html
  catch-the-beer/
    index.html
    game.js
    style.css
    images/
      player.png
    sounds/
      jump.mp3
```

Each HTML game must have a `<title>`. Optional metadata improves the game card on the homepage:

```html
<meta name="game-title" content="דינוזאור">
<meta name="game-icon" content="🦖">
<meta name="description" content="קופצים מעל מכשולים">
```

Commit the new file(s) to `main`. GitHub Actions runs `npm run build`, detects each game folder or HTML file, and publishes the updated homepage automatically.

### Update a game

Change files only inside that game's folder or replace its HTML file. Commit to `main` and the public site updates using the same link. No manual homepage editing.

### Back button

The website loads each game under `play.html` and displays a fixed **חזרה למשחקים** button above it. Game content runs in its own iframe. Relative asset paths from the game's folder work as expected.

## Local testing

```bash
npm run build
```

Open `dist/human/index.html` in a browser. No external packages are needed.

The included first and second games are placeholders only. There are no accounts, databases, or scoreboards.
