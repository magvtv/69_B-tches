import { ref } from 'vue'
import { songsDataGenerator } from '@/lib/songsDataGenerator'
import { debugLog, errorLog } from '@/config/environment'

interface Challenge {
  id: string
  type: string
  songTitle: string
  artist: string
  spotifyId: string
  question: string
  lyricSnippet: string
  options: string[]
  correctAnswer: number
  context: string
  reward: string
  special?: boolean
  final?: boolean
}

const challenges = ref<Challenge[]>([])
const isLoading = ref(false)
const isLoaded = ref(false)
const error = ref<string | null>(null)
const retryCount = ref(0)
const maxRetries = 3

// Cache key for localStorage
const CACHE_KEY = 'songs-origin-challenges-v2' // Updated to force cache refresh
const CACHE_EXPIRY_KEY = 'songs-origin-challenges-expiry-v2'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function useSongsOriginData() {
  const loadChallenges = async (forceReload = false) => {
    // Return if already loaded and not forcing reload
    if (isLoaded.value && !forceReload) {
      return challenges.value
    }

    // Check cache first
    if (!forceReload) {
      const cached = loadFromCache()
      if (cached) {
        challenges.value = cached
        isLoaded.value = true
        debugLog('Loaded challenges from cache', { count: cached.length })
        return cached
      }
    }

    // Generate fresh data
    isLoading.value = true
    error.value = null

    try {
      debugLog('Generating fresh challenges data from Spotify and lyrics APIs', {
        attempt: retryCount.value + 1,
        maxRetries,
      })

      const songsConfig = {
        songs: [
          // Main playlist songs
          {
            title: 'One Step at a Time',
            artist: 'Jordin Sparks',
            context: 'First song from our playlist',
            reward: 'music_token',
          },
          {
            title: 'Somewhere',
            artist: 'Rexx Life Raj',
            context: 'Rexx Life Raj vibes',
            reward: 'music_token',
          },
          {
            title: 'Mode',
            artist: 'Rexx Life Raj',
            context: 'More Rexx Life Raj',
            reward: 'music_token',
          },
          {
            title: "You're the One",
            artist: 'Elaine',
            context: 'Elaine bringing the feels',
            reward: 'music_token',
          },
          {
            title: 'On You',
            artist: 'Timi Dre',
            context: 'Timi Dre vibes',
            reward: 'music_token',
          },
          {
            title: 'Miami',
            artist: 'Odeal',
            context: 'Odeal featuring Leon Thomas',
            reward: 'music_token',
          },
          {
            title: 'Insomnia',
            artist: 'Normani',
            context: 'Normani keeping us up',
            reward: 'music_token',
          },
          {
            title: 'Cotton Candy Blvd',
            artist: 'Indian Shawn',
            context: 'Indian Shawn featuring Lucky Daye',
            reward: 'music_token',
          },
          {
            title: 'Love on Replay',
            artist: 'Kenyon Dixon',
            context: 'Kenyon Dixon & Tiffany Gouche',
            reward: 'music_token',
          },
          {
            title: 'Woah',
            artist: 'Snoh Aalegra',
            context: 'Snoh Aalegra vibes',
            reward: 'music_token',
          },
          {
            title: 'Water My Heart',
            artist: 'rum.gold',
            context: 'The Mereba feature!',
            reward: 'mereba_token',
            special: true,
          },
          {
            title: 'Man I Need',
            artist: 'Olivia Dean',
            context: 'Olivia Dean bringing it',
            reward: 'music_token',
          },
          {
            title: 'Ever Needed',
            artist: 'Mereba',
            context: 'Pure Mereba magic',
            reward: 'mereba_token',
            special: true,
          },
          {
            title: 'Rider',
            artist: 'Mereba',
            context: 'More Mereba greatness',
            reward: 'mereba_token',
            special: true,
          },
          {
            title: 'Best Part',
            artist: 'H.E.R.',
            context: 'H.E.R. featuring Daniel Caesar',
            reward: 'music_token',
          },
          {
            title: 'Conversations in the Dark',
            artist: 'John Legend',
            context: 'John Legend serenading us',
            reward: 'music_token',
          },
          // Joke songs
          {
            title: 'The Hanging Tree',
            artist: 'Jennifer Lawrence',
            context: 'Hunger Games throwback',
            reward: 'throwback_token',
          },
          {
            title: 'Roses',
            artist: 'SAINt JHN',
            context: 'Beautiful and unforgettable',
            reward: 'throwback_token',
          },
          {
            title: 'Brown Skin Girl',
            artist: 'Beyoncé',
            context: 'Cadbury chocolate vibes',
            reward: 'throwback_token',
          },
          {
            title: 'Heat Waves',
            artist: 'Glass Animals',
            context: '2020 throwback',
            reward: 'throwback_token',
          },
          {
            title: 'Close',
            artist: 'Nick Jonas',
            context: 'Nick Jonas wisdom',
            reward: 'throwback_token',
          },
          {
            title: 'Tailor Swif',
            artist: 'A$AP Rocky',
            context: 'A$AP trippy vibes',
            reward: 'throwback_token',
          },
          {
            title: 'Towards the Sun',
            artist: 'Rihanna',
            context: 'As Real as You and Me - started when oh got ran over',
            reward: 'throwback_token',
          },
          {
            title: 'Dancing in the Dark',
            artist: 'Rihanna',
            context: 'Happy vibes from Home film',
            reward: 'throwback_token',
          },
          {
            title: 'Shiny',
            artist: 'Jemaine Clement',
            context: 'Tamatoa crab from Moana',
            reward: 'throwback_token',
          },
          {
            title: "If This Isn't Love",
            artist: 'Jennifer Hudson',
            context: 'Were you paying attention to the background?',
            reward: 'attention_token',
            final: true,
          },
        ],
      }

      const generatedData = await songsDataGenerator.generateSongsData(songsConfig)

      if (generatedData.length === 0) {
        throw new Error('No challenges were generated - all songs failed to fetch')
      }

      // Validate generated data
      if (generatedData.length < 10) {
        debugLog('Warning: Only generated partial challenges', {
          count: generatedData.length,
          expected: 26,
        })
      }

      challenges.value = generatedData as Challenge[]
      isLoaded.value = true
      retryCount.value = 0 // Reset retry count on success

      // Cache the results
      saveToCache(challenges.value)

      debugLog('Successfully generated challenges', {
        count: challenges.value.length,
        cached: true,
      })

      return challenges.value
    } catch (err) {
      retryCount.value++
      errorLog('Failed to load challenges', {
        error: err,
        attempt: retryCount.value,
        maxRetries,
      })

      error.value = err instanceof Error ? err.message : 'Failed to load challenges'

      // Retry if under max retries
      if (retryCount.value < maxRetries && !forceReload) {
        debugLog('Retrying challenge generation...', {
          attempt: retryCount.value + 1,
          maxRetries,
        })

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount.value))

        // Recursive retry
        return loadChallenges(false)
      }

      // Max retries reached or force reload - use fallback
      debugLog('Max retries reached or forced, using fallback data')
      retryCount.value = 0

      // Fallback to meta.json if dynamic generation fails
      return loadFallbackData()
    } finally {
      isLoading.value = false
    }
  }

  const loadFromCache = (): Challenge[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)

      if (!cached || !expiry) {
        return null
      }

      const expiryTime = parseInt(expiry)
      if (Date.now() > expiryTime) {
        // Cache expired
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_EXPIRY_KEY)
        return null
      }

      return JSON.parse(cached)
    } catch {
      return null
    }
  }

  const saveToCache = (data: Challenge[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
    } catch {
      // Ignore storage errors
    }
  }

  const loadFallbackData = async (): Promise<Challenge[]> => {
    try {
      // Import meta.json as fallback
      const { default: levelData } = await import('@/pages/levels/02-songs-origin/meta.json')
      challenges.value = levelData.challenges as Challenge[]
      isLoaded.value = true
      return challenges.value
    } catch (err) {
      errorLog('Failed to load fallback data', err)
      return []
    }
  }

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_EXPIRY_KEY)
    isLoaded.value = false
    challenges.value = []
  }

  return {
    challenges,
    isLoading,
    isLoaded,
    error,
    retryCount,
    loadChallenges,
    clearCache,
  }
}
