# Songs of Origin Level - Complete Workflow

## Data Flow Architecture

```
meta.json → Challenges.vue → AlbumCoverChallenge.vue → User
```

### 1. **meta.json** (Data Source)

- **Location:** `src/pages/levels/02-songs-origin/meta.json`
- **Purpose:** Single source of truth for all challenge data
- **Contains:**
  - 21 challenges (16 main songs + 5 joke songs)
  - Background audio configuration
  - Voice note challenge settings
  - Reward definitions

### 2. **Challenges.vue** (Controller)

- **Location:** `src/pages/levels/02-songs-origin/Challenges.vue`
- **Purpose:** Manages challenge flow and state
- **Responsibilities:**
  - Loads challenges from `meta.json`
  - Tracks current challenge index
  - Manages score and progress
  - Handles challenge navigation
  - Displays results screen
  - Uses `CandlesProgress` component for visual progress (23 candles)

### 3. **AlbumCoverChallenge.vue** (Presentation)

- **Location:** `src/components/AlbumCoverChallenge.vue`
- **Purpose:** Renders individual challenges with album art
- **Responsibilities:**
  - Displays challenge question
  - Fetches album cover from Spotify API (using artist + songTitle)
  - Shows lyric snippet
  - Renders answer options
  - Handles user selection
  - Provides feedback (correct/incorrect)
  - Responsive layout (mobile vs desktop)

## Song List (21 Total)

### Main Playlist (16 songs)

1. One Step at a Time - Jordin Sparks
2. Somewhere - Rexx Life Raj
3. Mode - Rexx Life Raj
4. You're the One - Elaine
5. On You - Timi Dre feat. Tonton Bicha
6. Miami - Odeal feat. Leon Thomas
7. Insomnia - Normani
8. Cotton Candy Blvd - Indian Shawn feat. Lucky Daye
9. Love on Replay - Kenyon Dixon & Tiffany Gouche
10. Woah - Snoh Aalegra
11. Water My Heart - rum.gold feat. Mereba (Special)
12. Man I Need - Olivia Dean
13. Ever Needed - Mereba (Special)
14. Rider - Mereba (Special)
15. Best Part - H.E.R. feat. Daniel Caesar
16. Conversations in the Dark - John Legend

### Joke Songs (5 songs)

17. The Hanging Tree - Jennifer Lawrence (Hunger Games)
18. Roses - SAINt JHN (Foreverness of something beautiful)
19. Brown Skin Girl - Beyoncé (Cadbury chocolate)
20. Heat Waves - Glass Animals (2020 chokehold)
21. Close - Nick Jonas (Favorite line about space)

### Final Challenge

22. If This Isn't Love - Jennifer Hudson (Background audio guess)

## Progress System

### Candle System (23 Total)

- **21 candles** = 21 challenges from meta.json
- **2 candles** = Voice note completion
- **Total: 23 candles**

### State Management

- Store: `songsOriginStore.ts`
- Tracks: completedChallenges, score, responses
- Progress: `completedChallenges / 23 * 100`

## Responsive Design

### Mobile Viewport

- Album cover: 80px × 80px (centered above lyric snippet)
- Text: smaller font sizes
- Padding: reduced spacing
- Layout: vertical stack (question → album → lyric → options)

### Desktop Viewport

- Album cover: 64px × 64px (right side of lyric snippet)
- Layout: horizontal (question with album beside lyric snippet)
- More padding and spacing

## Integration Points

### Spotify API

- Fetches album covers dynamically
- Uses: `artist + songTitle` as search query
- Service: `src/lib/spotify.ts`
- Authentication: Client Credentials Flow

### Store Integration

- `useSongsOriginStore()`
- Methods: `answerChallenge()`, `completeVoiceNote()`, `getStats()`
- Tracks: score, progress, responses

### Reward System

- `rewardEngine.ts`
- Awards tokens: music_token, mereba_token, throwback_token, attention_token
- Generates coupons and dare prompts

## Key Features

1. **No Hard-coded Data:** All challenges loaded from meta.json
2. **Dynamic Album Art:** Fetched from Spotify API at runtime
3. **Offline First:** Uses localStorage for caching
4. **Real-time Tracking:** Every answer tracked in Supabase
5. **Special Challenges:** Mereba songs marked as special
6. **Mobile Optimized:** Responsive layout for all screen sizes

## Testing the Workflow

1. Load `LandingPage.vue` → Shows 23 candles (all unlit)
2. Click "Lyric Challenges" → Navigate to `Challenges.vue`
3. `Challenges.vue` loads `meta.json` → 21 challenges available
4. Each challenge rendered by `AlbumCoverChallenge.vue`
5. Album covers fetched from Spotify API
6. User answers → Store updated → Candles light up
7. After 21 challenges → Voice note unlocked
8. Complete voice note → +2 candles → All 23 lit

## No Issues Confirmed ✓

- ✅ Data source: Single `meta.json` file
- ✅ All 21 songs properly added (16 main + 5 joke)
- ✅ Controller: `Challenges.vue` manages flow
- ✅ Presenter: `AlbumCoverChallenge.vue` renders UI
- ✅ Mobile responsive: Album art above lyrics
- ✅ Desktop layout: Album art beside lyrics
- ✅ No hard-coded Spotify IDs
- ✅ Dynamic album fetching works correctly
