## Meme Maze - Lean MVP (Level 1)

### Directory / Routing
- Base route: `/levels/01` → `MemeMaze.vue`
- Slug routes for sub-steps using `pages/levels/[slug].vue` if needed:
  - `/levels/meme-maze/intro`
  - `/levels/meme-maze/memes`
  - `/levels/meme-maze/reaction`
  - `/levels/meme-maze/numberplay`
  - `/levels/meme-maze/finale`

### Core Loop
- Show meme carousel (swipe/arrow).
- For each meme, choice: `😂 This got me` or `😐 Meh`.
- Laugh adds a Chaos Token; Meh subtracts a Sass Point.
- Progress visualized as 23 candles lighting up.

### Scoring
- No timer.
- Score = number of laughs (Chaos Tokens).
- Carry forward to next levels.

### Easter Eggs
- Meme #19: subtle overlay `🎂 19 Oct`.
- Meme #10: 2002/Y2K reference.
- Meme #23: punchline unlocks finale.
- Hidden hotspot (top-right): fake Joker popup `Error 404: Humor not found… jk.`

### Visual Design
- Fullscreen; black/purple background.
- Centered meme card with two reaction buttons.
- Candles progress bar at top.

### Finale
- After 23 memes: darken screen; message: `Happy Birthday Harley — You lit all 23 candles 🔥.`
- Unlock coupon reward (e.g., 23 kisses / hugs / dares).

### Tech Notes
- Use GSAP for transitions between memes and candle lighting.
- Use Three.js for a subtle reactive background (particles/nebula), low-poly and performant.
- Pinia store to track: currentIndex, laughsCount, reactions[], candlesLit.
- Persist minimal progress in localStorage.
