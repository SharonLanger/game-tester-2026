# המלצר בפאניקה — Game Tester

Each profile uses the **same** `game.js` and `style.css`. The game chooses
`images/happy.webp`, `images/worried.webp`, `images/surprised.webp`, and
`images/scared.webp` from the current page directory.

## Add a person

Create `games/human-drunk-waiter/<slug>/images/` in the repository and upload:

- `happy.webp`
- `worried.webp`
- `surprised.webp`
- `scared.webp`

**Do not add any HTML or JavaScript.** GitHub Actions runs
`scripts/build.js`, generating the person's `index.html` automatically.
The shareable URL is `/games/human-drunk-waiter/<slug>/`.

The default game at `/games/human-drunk-waiter/` stays visible in the landing-page list.
Profiles are not listed there. User IDs in URLs should be lowercase ASCII with
numbers and hyphens only.
