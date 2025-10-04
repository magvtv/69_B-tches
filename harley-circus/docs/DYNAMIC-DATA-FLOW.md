# Dynamic Data Flow - Songs of Origin Level

## Overview

The Songs of Origin level now uses **dynamic data generation** with intelligent caching and fallback mechanisms.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER LOADS CHALLENGES                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │  useSongsOriginData.ts      │
         │  (Composable)               │
         └─────────────┬───────────────┘
                       │
                       │ Check Cache
                       ▼
              ┌─────────────────┐
              │  LocalStorage    │ Yes → Return Cached Data
              │  Cache (7 days)  ├────────────────────────┐
              └────────┬─────────┘                        │
                       │ No/Expired                       │
                       ▼                                  │
         ┌──────────────────────────────┐                │
         │  songsDataGenerator.ts       │                │
         └────────┬─────────────────────┘                │
                  │                                       │
        ┌─────────┴────────────┐                        │
        ▼                      ▼                         │
   ┌─────────────┐      ┌──────────────┐               │
   │ spotify.ts  │      │lyricsService │               │
   │ (Album Art) │      │  (Lyrics)    │               │
   └─────────────┘      └──────────────┘               │
        │                      │                        │
        └──────────┬───────────┘                        │
                   │ Generate Dynamic Data              │
                   ▼                                    │
         ┌──────────────────────────┐                  │
         │  Save to Cache           │                  │
         │  Return Fresh Data       │                  │
         └──────────────────────────┘                  │
                   │                                    │
                   └────────────────────────────────────┤
                                                        │
                   ┌────────────────────────────────────┘
                   │
                   ▼
         ┌──────────────────────────┐
         │   Challenges.vue         │
         │   (Displays Challenges)  │
         └──────────────────────────┘
```

## Components

### 1. useSongsOriginData.ts (Composable)

**Location:** `src/composables/useSongsOriginData.ts`

**Responsibilities:**

- Load challenges with intelligent caching
- Generate fresh data from Spotify & Lyrics APIs
- Fallback to meta.json if generation fails
- Cache management (7-day expiry)

**Key Methods:**

- `loadChallenges(forceReload)` - Load or generate challenges
- `clearCache()` - Clear cached data
- `loadFromCache()` - Retrieve cached challenges
- `saveToCache()` - Store challenges in localStorage
- `loadFallbackData()` - Use meta.json as fallback

**Cache Strategy:**

```typescript
CACHE_KEY: 'songs-origin-challenges-v1'
CACHE_EXPIRY: 7 days
STORAGE: localStorage
```

### 2. songsDataGenerator.ts (Generator)

**Location:** `src/lib/songsDataGenerator.ts`

**Responsibilities:**

- Generate challenges from song list
- Fetch tracks from Spotify
- Get lyrics from lyrics APIs
- Parse lyrics and create snippets
- Generate 4 options with correct answer
- Shuffle options randomly

**Process:**

1. Search Spotify for track (artist + title)
2. Get album cover from Spotify
3. Fetch lyrics from lyrics service
4. Parse lyrics into lines
5. Pick random snippet (2-3 lines)
6. Get correct answer (next line after snippet)
7. Generate 3 distractors from other parts of song
8. Shuffle options and track correct answer index

### 3. useBackgroundAudio.ts (Global Audio)

**Location:** `src/composables/useBackgroundAudio.ts`

**Responsibilities:**

- Maintain single global audio element
- Persist audio across page navigation
- Control playback (play/pause/resume)
- Manage volume

**Features:**

- Singleton pattern - one audio instance
- Auto-resume on navigation
- Browser autoplay handling
- Event-driven state updates

## Data Flow

### Static vs Dynamic

#### ❌ Old Approach (Static)

```json
// meta.json
{
  "lyricSnippet": "Hurry up and wait...",
  "options": ["Hard-coded option 1", "Option 2", "Option 3"],
  "correctAnswer": 0
}
```

#### ✅ New Approach (Dynamic)

```typescript
// Generated at runtime from real lyrics
const lyrics = await lyricsService.getLyrics(artist, title)
const snippet = extractRandomSnippet(lyrics)
const options = [correctLine, ...randomDistractors]
const shuffled = shuffle(options)
const correctAnswer = shuffled.indexOf(correctLine)
```

### Caching Strategy

**Why Cache?**

1. **Performance** - Avoid API calls on every load
2. **Reliability** - Work offline after first load
3. **Cost** - Reduce API usage
4. **Speed** - Instant load times

**When to Refresh?**

- Cache expires (7 days)
- User force-reloads
- Cache corrupted
- Version change

**Fallback Chain:**

```
1. localStorage Cache → 2. Generate Fresh → 3. meta.json Fallback
```

## Background Audio Persistence

### Problem

Audio stopped when navigating from `LandingPage.vue` to `Challenges.vue`

### Solution

**Global Audio Instance**

```typescript
// useBackgroundAudio.ts
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

// Singleton - shared across all pages
export function useBackgroundAudio() {
  // Returns same instance everywhere
}
```

### Implementation

**LandingPage.vue:**

```vue
<script setup>
const backgroundAudio = useBackgroundAudio()

onMounted(() => {
  backgroundAudio.initAudio(src, volume, autoplay)
})
</script>
```

**Challenges.vue:**

```vue
<script setup>
const backgroundAudio = useBackgroundAudio()

onMounted(() => {
  // Resume if playing
  if (!backgroundAudio.isPlaying.value) {
    backgroundAudio.resume()
  }
})
</script>
```

## API Integration

### Spotify API

- **Purpose:** Album covers, track verification
- **Flow:** Client Credentials Flow
- **Caching:** Album URLs cached with challenges

### Lyrics APIs

- **Primary:** lyrics.ovh
- **Fallback:** lyricsapi.com
- **Caching:** Lyrics cached with challenges

## Benefits

### 1. Dynamic Content

- ✅ Real lyrics from actual songs
- ✅ Varied challenges each generation
- ✅ Fresh distractors from song context

### 2. Performance

- ✅ 7-day cache reduces API calls
- ✅ Instant load after first generation
- ✅ Offline capable with cache

### 3. Reliability

- ✅ Fallback to meta.json if APIs fail
- ✅ Graceful error handling
- ✅ User never sees errors

### 4. Maintainability

- ✅ Single song list to update
- ✅ No manual lyric entry
- ✅ Automatic option generation

## Usage

### Force Refresh Data

```typescript
const { clearCache, loadChallenges } = useSongsOriginData()

// Clear cache and reload
clearCache()
await loadChallenges(true)
```

### Check Loading State

```vue
<template>
  <div v-if="isLoading">Loading challenges...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <!-- Challenges -->
  </div>
</template>

<script setup>
const { challenges, isLoading, error } = useSongsOriginData()
</script>
```

### Background Audio Control

```typescript
const audio = useBackgroundAudio()

audio.play() // Start playback
audio.pause() // Pause playback
audio.resume() // Resume if was playing
audio.setVolume(0.5) // Set volume
```

## Testing

### Test Dynamic Generation

1. Clear localStorage
2. Navigate to Challenges page
3. Watch console for "Generating fresh challenges data"
4. Verify challenges load with real lyrics

### Test Cache

1. Load challenges once
2. Refresh page
3. Watch console for "Loaded challenges from cache"
4. Verify instant load

### Test Fallback

1. Disable network
2. Clear cache
3. Navigate to Challenges
4. Verify meta.json fallback loads

### Test Audio Persistence

1. Start at LandingPage
2. Verify audio plays
3. Navigate to Challenges
4. Verify audio continues playing

## Future Improvements

1. **Progressive Enhancement**
   - Pre-generate during build
   - Serve static for first load
   - Update with dynamic after

2. **Background Refresh**
   - Check for updates in background
   - Update cache silently
   - Notify user of new content

3. **Analytics**
   - Track cache hit rate
   - Monitor API success rate
   - Measure load times

4. **Advanced Caching**
   - Service Worker integration
   - IndexedDB for larger data
   - Versioned cache keys
