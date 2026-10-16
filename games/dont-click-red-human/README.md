# אל תלחץ — פרצופים

Face version of Don't Click Red. Original color game is unchanged.

- `config.js`: all timing, grid sizes, rule transitions, distractions, shuffle cadence, score and tint strength.
- `rules.js`: pure answer matching and timer curve.
- `game.js`: image preload, canvas tinting, rounds and UI.
- `../../assets/humans/people.json`: shared Hebrew names and image folder identifiers. Add people only with a complete portrait set. Sharon currently has no named image folder and is not invented or substituted.

Uses happy portraits for stable identity recognition. Each is tinted in memory with Canvas RGB processing; alpha is preserved and original files are unchanged. All portraits load before play; failed loading offers retry.

## Progression

Original grid: 4 cells through round 5, 6 through 12, 9 through 24, then 12. Avoid rules through 7, then 35% avoid and 65% target. Position shuffling starts at 18 with the original cadence. First mistake or timeout ends the game. Score remains 10 plus floor(remaining seconds × 5).

Face additions: person rules initially; color and combined rules from 6. Distracting color words from 10, wrong names from 14, combined captions from 20, mismatched text ink from 25. Captions never determine correctness. Both matching and nonmatching tiles always exist. Background color and actual face determine the answer.

Timer starts at 2.65 seconds, drops 0.035 per round through round 12, then 0.075 per round to a 0.62 minimum. Personal best uses a new key because difficulty changed.
