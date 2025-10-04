# Error Handling Guide - Songs of Origin Level

## Overview

Comprehensive error handling and retry mechanism for dynamic data generation with graceful fallbacks.

## Problem Statement

### Issues Identified

1. **Dynamic Data Failures**: API calls to Spotify/Lyrics services can fail
2. **No Retry Logic**: Single failures resulted in immediate fallback to static data
3. **Duplicate Audio**: Background music playing twice when navigating between pages
4. **Poor User Feedback**: No visibility into loading states or errors

## Solution Architecture

### 1. Retry Mechanism with Exponential Backoff

```typescript
// Retry up to 3 times with exponential backoff
retryCount = 0, maxRetries = 3

Attempt 1: Immediate
Attempt 2: Wait 1 second
Attempt 3: Wait 2 seconds
Attempt 4: Use fallback (meta.json)
```

**Implementation:**

```typescript
// src/composables/useSongsOriginData.ts
const retryCount = ref(0)
const maxRetries = 3

try {
  // Generate dynamic data
  const generatedData = await songsDataGenerator.generateSongsData(config)
} catch (err) {
  retryCount.value++

  if (retryCount.value < maxRetries && !forceReload) {
    // Exponential backoff
    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount.value))

    // Recursive retry
    return loadChallenges(false)
  }

  // Max retries reached - use fallback
  return loadFallbackData()
}
```

### 2. Error Categories

#### A. Network Errors

- **Cause**: API endpoints unreachable
- **Handling**: Retry with backoff → Fallback to cache → Fallback to meta.json
- **User Feedback**: "Loading challenges from Spotify..."

#### B. Partial Failures

- **Cause**: Some songs fetch successfully, others fail
- **Handling**: Accept partial data if ≥10 challenges generated
- **User Feedback**: Warning logged, user sees available challenges

#### C. Complete Failures

- **Cause**: All API calls fail
- **Handling**: Immediate fallback to meta.json
- **User Feedback**: Silent fallback, seamless experience

### 3. Fallback Chain

```
┌─────────────────────────────────────────────────────┐
│                  Load Challenges                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────┐
        │  Cache (7 days)  │ ──Yes──> Return Cached Data ✅
        └────────┬─────────┘
                 │ No/Expired
                 ▼
        ┌──────────────────────┐
        │  Attempt 1: Generate │ ──Success──> Save Cache ✅
        └────────┬─────────────┘
                 │ Fail
                 ▼
        ┌──────────────────────┐
        │  Wait 1s → Attempt 2 │ ──Success──> Save Cache ✅
        └────────┬─────────────┘
                 │ Fail
                 ▼
        ┌──────────────────────┐
        │  Wait 2s → Attempt 3 │ ──Success──> Save Cache ✅
        └────────┬─────────────┘
                 │ Fail
                 ▼
        ┌──────────────────────┐
        │  Fallback: meta.json │ ──Always Works ✅
        └──────────────────────┘
```

### 4. Duplicate Audio Prevention

**Problem:**

```javascript
// Old behavior - creates multiple audio instances
LandingPage: initAudio() -> Creates Audio1
Challenges:  initAudio() -> Creates Audio2  ❌
// Result: Both playing simultaneously
```

**Solution:**

```javascript
// New behavior - singleton pattern
const audioElement = ref<HTMLAudioElement | null>(null)

function initAudio(src, volume, autoplay) {
  // Check if already playing same source
  if (audioElement.value && currentSrc.value === src && isPlaying.value) {
    console.log('Already playing, skipping')
    return audioElement.value
  }

  // Clean up existing instance
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener(...)
    audioElement.value.remove()
  }

  // Create new instance
  audioElement.value = new Audio(src)
  // ... setup
}
```

**Key Features:**

- ✅ Single global audio instance
- ✅ Proper cleanup before recreation
- ✅ Named event handlers for removal
- ✅ Skip initialization if already playing
- ✅ Console logging for debugging

### 5. Validation & Monitoring

#### Data Validation

```typescript
// Validate generated data
if (generatedData.length === 0) {
  throw new Error('No challenges generated')
}

// Warn on partial success
if (generatedData.length < 10) {
  debugLog('Warning: Only partial challenges', {
    count: generatedData.length,
    expected: 21,
  })
}
```

#### Logging Strategy

```typescript
// Success logging
debugLog('Successfully generated challenges', {
  count: challenges.length,
  cached: true,
})

// Error logging
errorLog('Failed to load challenges', {
  error: err,
  attempt: retryCount.value,
  maxRetries,
})

// Retry logging
debugLog('Retrying challenge generation', {
  attempt: retryCount.value + 1,
  maxRetries,
})
```

### 6. User Experience Enhancements

#### Loading States

```vue
<!-- Loading indicator -->
<div v-if="loadingChallenges">
  <div class="animate-spin..."></div>
  <p>Loading challenges from Spotify...</p>
</div>

<!-- Content -->
<div v-else>
  <!-- Challenges -->
</div>
```

#### Error States

```vue
<!-- Error display (if needed) -->
<div v-if="error">
  <p>{{ error }}</p>
  <button @click="retry">Try Again</button>
</div>
```

#### Background Audio Indicator

```vue
<div v-if="backgroundAudio.isPlaying">
  <div class="w-2 h-2 bg-red-500 animate-pulse"></div>
  <span>🎵 Playing in the background...</span>
  <button @click="toggle">Pause</button>
</div>
```

## Testing Scenarios

### Test 1: Normal Operation

```bash
# Expected: Generate from APIs, cache, instant reload
1. Clear cache: localStorage.clear()
2. Load challenges
3. Check console: "Generating fresh challenges"
4. Reload page
5. Check console: "Loaded from cache"
```

### Test 2: Network Failure

```bash
# Expected: Retry 3 times, then fallback
1. Disable network
2. Clear cache
3. Load challenges
4. Watch console for retries
5. See fallback to meta.json
```

### Test 3: Partial Failure

```bash
# Expected: Accept partial data
1. Mock API to return only 12 songs
2. Load challenges
3. Check console: "Warning: Only partial"
4. Verify 12 challenges loaded
```

### Test 4: Duplicate Audio

```bash
# Expected: Single audio instance
1. Load LandingPage
2. Verify audio plays
3. Navigate to Challenges
4. Check console: "Already playing, skipping"
5. Verify only one audio playing
```

### Test 5: Retry Success

```bash
# Expected: Second attempt succeeds
1. Mock API to fail once, then succeed
2. Load challenges
3. Check console: "Attempt 1 failed"
4. Check console: "Retrying... Attempt 2"
5. Check console: "Successfully generated"
```

## Configuration

### Retry Settings

```typescript
const maxRetries = 3 // Max retry attempts
const backoffMultiplier = 1000 // 1 second per attempt
const minChallengesAccepted = 10 // Minimum to accept partial
```

### Cache Settings

```typescript
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
const CACHE_KEY = 'songs-origin-challenges-v1'
const CACHE_EXPIRY_KEY = 'songs-origin-challenges-expiry-v1'
```

### Audio Settings

```typescript
const defaultVolume = 0.3 // 30% volume
const defaultLoop = true // Loop continuously
const defaultAutoplay = true // Start automatically
```

## Best Practices

### 1. Always Log Context

```typescript
// Good
errorLog('Failed to load', {
  error: err,
  attempt: retryCount,
  songTitle: song.title,
})

// Bad
console.error('Failed')
```

### 2. Validate Early

```typescript
// Validate before processing
if (!data || data.length === 0) {
  throw new Error('Invalid data')
}
```

### 3. Provide Fallbacks

```typescript
// Always have a fallback
try {
  return await fetchDynamic()
} catch {
  return loadStatic()
}
```

### 4. Clean Up Resources

```typescript
// Clean up event listeners
element.removeEventListener('play', handlePlay)
element.remove()
element = null
```

### 5. User-Friendly Messages

```typescript
// Good
error.value = 'Unable to load songs. Using offline version.'

// Bad
error.value = 'ERR_NETWORK_FAILED'
```

## Monitoring & Debugging

### Console Logs to Watch

**Success Path:**

```
[BackgroundAudio] Creating new audio instance: /audio/song.mp3
Generating fresh challenges data from Spotify...
Successfully generated challenges { count: 21, cached: true }
```

**Retry Path:**

```
Failed to load challenges { error: ..., attempt: 1 }
Retrying challenge generation... { attempt: 2 }
Successfully generated challenges { count: 21, cached: true }
```

**Fallback Path:**

```
Failed to load challenges { error: ..., attempt: 3 }
Max retries reached, using fallback data
Loaded challenges from meta.json
```

**Audio Prevention:**

```
[BackgroundAudio] Already playing, skipping initialization
```

## Future Improvements

1. **Offline-First Service Worker**
   - Pre-cache API responses
   - Background sync for updates

2. **Progressive Loading**
   - Load first 5 challenges immediately
   - Continue loading rest in background

3. **Error Analytics**
   - Track failure rates
   - Monitor API performance
   - Alert on high failure rates

4. **User Notifications**
   - Toast on fallback usage
   - Optional retry button
   - Network status indicator

5. **Advanced Caching**
   - IndexedDB for larger datasets
   - Versioned cache keys
   - Partial cache updates
