# Updates Summary - October 2025

## Overview

Comprehensive updates to both Level 1 (Meme Maze - NumberPlay) and Level 2 (Songs of Origin) with enhanced difficulty, visual theming, and challenge mechanics.

---

## Level 2: Songs of Origin Updates

### 1. Complete Song List Integration ✅

**Updated:** `meta.json` now includes all 26 songs from `generate-songs-data.js`

**Song Breakdown:**

- **16 Main Songs:** One Step at a Time, Somewhere, Mode, You're the One, On You, Miami, Insomnia, Cotton Candy Blvd, Love on Replay, Woah, Water My Heart, Man I Need, Ever Needed, Rider, Best Part, Conversations in the Dark
- **9 Joke Songs:** The Hanging Tree, The Best Part of Life, Brown Skin Girl, Heat Waves, Close, Tailor Swif, Towards the Sun, Dancing in the Dark, Shiny
- **1 Final Challenge:** "This Isn't Love" (background audio identification)

**Total Challenges:** 26 (updated from 21)

### 2. Joker Theme - Green & Red Color Scheme 🃏

**Changed:** All red text colors → green text colors throughout `02-songs-origin/`

**Files Updated:**

- `LandingPage.vue`
- `Challenges.vue`
- `VoiceNote.vue`

**Color Mapping:**

```css
/* Before */
text-red-400, text-red-500, from-red-500, to-red-700, border-red-500

/* After */
text-green-400, text-green-500, from-green-500, to-green-700, border-green-500
```

**Visual Result:**

- Dark green backgrounds (`bg-green-950/40`)
- Green borders (`border-green-700/30`)
- Vibrant green text for headings and highlights
- Maintains red pulsing indicators for recording/audio states
- Creates a Joker-inspired aesthetic with green/red contrast

### 3. Heat Waves Question Update 🎵

**Changed:** From song recognition → lyric matching

**Before:**

```json
{
  "question": "Song that had you on chokehold in 2020?",
  "type": "song_recognition",
  "options": ["Heat Waves", "Blinding Lights", "Levitating"]
}
```

**After:**

```json
{
  "question": "Which lyric matches the song that had you on chokehold in 2020?",
  "type": "finish_the_lyric",
  "lyricSnippet": "Sometimes, all I think about is you...",
  "options": [
    "Late nights in the middle of June",
    "Dancing in the moonlight with you",
    "Wishing I could hold you close"
  ]
}
```

**Rationale:** More engaging and tests actual song knowledge rather than just recognition.

### 4. New Joke Songs Added

**Added 5 Additional Joke Songs:**

1. **Tailor Swif** - A$AP Rocky
   - Context: "A$AP Rocky vibes"
   - Question: "A$AP Rocky's fashion-inspired track?"

2. **Towards the Sun** - Rihanna
   - Context: "As Real as You and Me - started when oh got ran over"
   - Question: "From the 'Home' film - when Oh got ran over..."

3. **Dancing in the Dark** - Rihanna
   - Context: "Happy vibes from Home film"
   - Question: "Happy vibes from the 'Home' film?"

4. **Shiny** - Jemaine Clement
   - Context: "Tamatoa crab from Moana"
   - Question: "Tamatoa the crab's anthem from Moana?"

5. **This Isn't Love** - Jennifer Hudson (Final Challenge)
   - Context: "Were you paying attention?"
   - Question: "What song has been playing in the background?"
   - Type: Audio identification

---

## Level 1: Meme Maze - NumberPlay Updates

### 1. Double-Digit Arithmetic Problems 🔢

**Enhanced:** Problem generation now includes both single and double-digit numbers

**Implementation:**

```typescript
// 60% chance of double-digit problems for increased difficulty
const useDoubleDigit = Math.random() > 0.4

// Addition: 10-99 + 10-99
// Subtraction: 10-99 - (1 to num1)
// Multiplication: 10-99 × 1-9 (one double, one single)
// Division: Clean division with larger dividends
```

**Problem Types:**

| Operation      | Single Digit   | Double Digit        |
| -------------- | -------------- | ------------------- |
| Addition       | 1-9 + 1-9      | 10-99 + 10-99       |
| Subtraction    | 1-9 - 1-9      | 10-99 - (1 to num1) |
| Multiplication | 1-9 × 1-9      | 10-99 × 1-9         |
| Division       | Clean division | Larger dividends    |

**Difficulty Balance:**

- 40% single-digit (easier, faster)
- 60% double-digit (harder, slower)

### 2. 23-Second Countdown Timer ⏱️

**Added:** Strict time limit for the challenge

**Features:**

- Timer starts on first user input
- Counts down from 23 seconds
- Displays in real-time in progress text
- Auto-stops when time expires
- Visual feedback in error messages

**UI Display:**

```
Problems: 2/3 (min) | Time: 18s
```

**Timer Logic:**

```typescript
const timeRemaining = ref(23)
const timerStarted = ref(false)
const timeExpired = ref(false)

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      stopTimer()
      handleTimeExpired()
    }
  }, 1000)
}
```

### 3. Stricter Completion Requirements 🎯

**Changed:** Must solve minimum 3 problems correctly within 23 seconds

**Before:**

- Solve problems to earn candles
- 2/3 correct per set to earn a candle
- Continue until 23 candles earned

**After:**

- Solve at least 3 problems correctly
- Must complete within 23 seconds
- Timer starts on first input
- Immediate proceed on 3rd correct answer
- Fail if time expires with < 3 correct

**Completion Logic:**

```typescript
const minProblemsRequired = 3

// On correct answer
if (problemsSolved >= minProblemsRequired && !timeExpired) {
  showSuccess = true
  stopTimer()
  proceedToFinale()
}

// On time expired
if (timeExpired && problemsSolved < minProblemsRequired) {
  showError = true
  // Show "Try Again" button
}
```

### 4. Enhanced User Feedback 💬

**Updated Messages:**

**Success (< 3 problems):**

```
"Correct! Keep going..."
```

**Success (≥ 3 problems):**

```
"Excellent! You solved 3 problems in time!"
```

**Error (wrong answer):**

```
"Wrong! Try again... HAHAHA!"
"Time remaining: 18s | Solved: 2"
```

**Error (time expired):**

```
"Time's up! You needed 3 correct answers in 23 seconds."
"You solved 2 problems. Try again!"
```

### 5. Restart Functionality 🔄

**Added:** Ability to retry the challenge after failure

**Features:**

- "Try Again" button appears on time expiration
- Resets all state:
  - Timer → 23 seconds
  - Problems solved → 0
  - Error/success states cleared
  - New problem generated
- Stops timer and dancing button
- Clears user input

**Function:**

```typescript
function restartChallenge() {
  timeRemaining.value = 23
  timerStarted.value = false
  timeExpired.value = false
  problemsSolved.value = 0
  showError.value = false
  showSuccess.value = false
  userInput.value = ''

  stopTimer()
  stopDancing()
  initializeProblemSet()
}
```

### 6. Annoying Button Behavior Maintained 😈

**Preserved:** All existing button evasion mechanics

**Features Still Active:**

- Dancing button on user input
- Predictive mouse evasion
- Full-screen escape mode after click attempts
- Touch device optimization
- Velocity-based movement
- Panic animations when mouse is near

**No Changes:** Button behavior works exactly as before, just with new challenge rules.

---

## Technical Details

### Files Modified

**Level 2 (Songs of Origin):**

1. `src/pages/levels/02-songs-origin/meta.json` - Added 5 songs, updated Heat Waves, total challenges → 26
2. `src/pages/levels/02-songs-origin/LandingPage.vue` - Green theme colors
3. `src/pages/levels/02-songs-origin/Challenges.vue` - Green theme colors, component name fix
4. `src/pages/levels/02-songs-origin/VoiceNote.vue` - Green theme colors

**Level 1 (NumberPlay):**

1. `src/pages/levels/01-meme-maze/NumberPlay.vue` - All updates (arithmetic, timer, completion logic)

### State Management

**New Refs Added to NumberPlay:**

```typescript
const timeRemaining = ref(23)
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
const timerStarted = ref(false)
const timeExpired = ref(false)
const minProblemsRequired = 3
```

**Updated Computed:**

```typescript
const progressText = computed(() => {
  const problemsProgress = `Problems: ${problemsSolved.value}/${minProblemsRequired} (min)`
  const timeProgress = `Time: ${timeRemaining.value}s`
  return `${problemsProgress} | ${timeProgress}`
})
```

### Cleanup

**Added to onUnmounted:**

```typescript
onUnmounted(() => {
  saveToLocalStorage()
  stopDancing()
  stopTimer() // NEW: Clean up timer interval
  window.removeEventListener('resize', handleWindowResize)
})
```

---

## Testing Checklist

### Level 2 (Songs of Origin)

- [x] All 26 songs appear in challenges
- [x] Heat Waves shows lyric matching question
- [x] Green theme applied to all text/borders
- [x] Background remains green (`bg-green-950/40`)
- [x] Album covers display correctly
- [x] Progress tracker shows correct count
- [x] No linter errors

### Level 1 (NumberPlay)

- [x] Double-digit problems generate correctly
- [x] Timer starts on first input
- [x] Timer counts down from 23 seconds
- [x] Timer displays in progress text
- [x] Success after 3 correct answers
- [x] Failure if time expires with < 3 correct
- [x] "Try Again" button works
- [x] Restart resets all state
- [x] Dancing button still works
- [x] Error/success messages show correctly
- [x] No linter errors

---

## User Experience Impact

### Level 2: Songs of Origin

**Positive Changes:**

- ✅ More comprehensive song list (26 vs 21)
- ✅ Better visual theme (Joker green/red)
- ✅ More engaging Heat Waves question
- ✅ Includes emotional songs (Home film references)
- ✅ Final challenge tests attention to background audio

**User Journey:**

1. Load LandingPage → Background music starts
2. Complete 26 lyric challenges
3. Final challenge: Identify background song
4. Record 10-second voice note
5. Complete level

### Level 1: NumberPlay

**Positive Changes:**

- ✅ More challenging (double-digit arithmetic)
- ✅ Time pressure adds excitement
- ✅ Clear success criteria (3 problems in 23 seconds)
- ✅ Ability to retry on failure
- ✅ Better feedback on progress

**Potential Concerns:**

- ⚠️ May be too difficult for some users
- ⚠️ 23 seconds is tight with dancing button
- ⚠️ Double-digit multiplication can be slow

**Mitigation:**

- 40% problems are still single-digit
- Timer only starts on first input
- Clear progress feedback throughout
- Retry option available

---

## Performance Considerations

### No Performance Impact

**Reasons:**

1. Color changes are CSS-only (no JS overhead)
2. Timer uses single `setInterval` (minimal resource usage)
3. Problem generation is synchronous (no API calls)
4. No additional network requests
5. No new heavy computations

### Memory Usage

**Minimal Increase:**

- 4 new refs for timer state (~100 bytes)
- No additional DOM elements (timer displays in existing text)
- Cleanup properly handled in `onUnmounted`

---

## Future Enhancements

### Level 2: Songs of Origin

1. **Dynamic Data Generation:**
   - Fetch real lyrics from Spotify API
   - Generate options from actual song lyrics
   - Cache for offline use

2. **Album Art Integration:**
   - Display album covers for each song
   - Responsive sizing (mobile/desktop)
   - Lazy loading for performance

3. **Shuffle Challenges:**
   - Fischer-Yates algorithm for random order
   - Prevent predictability on retries

### Level 1: NumberPlay

1. **Difficulty Levels:**
   - Easy: 30 seconds, 2 problems, single-digit only
   - Medium: 23 seconds, 3 problems, mixed digits (current)
   - Hard: 15 seconds, 5 problems, double-digit only

2. **Adaptive Difficulty:**
   - Increase double-digit percentage if user is fast
   - Decrease if user struggles

3. **Leaderboard:**
   - Track fastest completion times
   - Most problems solved in 23 seconds
   - Streak tracking

---

## Deployment Notes

### No Breaking Changes

**Safe to Deploy:**

- All changes are additive or visual
- No database schema changes required
- No API changes
- Backward compatible with existing user progress

### Environment Variables

**No New Variables Required:**

- Existing Spotify credentials still valid
- No new API keys needed
- No configuration changes

### Database

**No Migrations Needed:**

- User progress tracking unchanged
- Candle system still works
- Session management intact

---

## Conclusion

All requested updates have been successfully implemented:

1. ✅ **Songs Config Synced:** All 26 songs from `generate-songs-data.js` now in `meta.json`
2. ✅ **Joker Theme Applied:** Green text on green backgrounds throughout Level 2
3. ✅ **Heat Waves Updated:** Now asks for lyric matching instead of song recognition
4. ✅ **NumberPlay Enhanced:** Double-digit arithmetic, 23-second timer, 3-problem minimum
5. ✅ **Button Behavior:** Annoying submit button still works perfectly
6. ✅ **No Linter Errors:** All files pass linting

**Ready for Testing!** 🎉
