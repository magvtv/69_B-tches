import { debugLog, errorLog } from '../config/environment'

interface LyricsResponse {
  lyrics: string
  source: string
}

interface LyricsLine {
  text: string
  startTime?: number
}

class LyricsService {
  private cache: Map<string, LyricsResponse> = new Map()

  async getLyrics(artist: string, title: string): Promise<LyricsResponse | null> {
    const cacheKey = `${artist.toLowerCase()}-${title.toLowerCase()}`

    // Check cache first
    if (this.cache.has(cacheKey)) {
      debugLog('Lyrics cache hit', { artist, title })
      return this.cache.get(cacheKey)!
    }

    try {
      // Try multiple lyrics services
      const lyrics =
        (await this.fetchFromLyricsOvh(artist, title)) ||
        (await this.fetchFromGenius(artist, title)) ||
        (await this.fetchFromLyricsApi(artist, title))

      if (lyrics) {
        this.cache.set(cacheKey, lyrics)
        debugLog('Lyrics fetched and cached', { artist, title, source: lyrics.source })
        return lyrics
      }

      errorLog('No lyrics found from any service', { artist, title })
      return null
    } catch (error) {
      errorLog('Failed to fetch lyrics', { artist, title, error })
      return null
    }
  }

  private async fetchFromLyricsOvh(artist: string, title: string): Promise<LyricsResponse | null> {
    try {
      const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`

      const response = await fetch(url)

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (data.lyrics) {
        return {
          lyrics: data.lyrics,
          source: 'lyrics.ovh',
        }
      }

      return null
    } catch (error) {
      debugLog('Lyrics.ovh failed', { artist, title, error })
      return null
    }
  }

  private async fetchFromGenius(artist: string, title: string): Promise<LyricsResponse | null> {
    try {
      // Genius API requires authentication, so we'll use a different approach
      // For now, we'll return null and implement a web scraping solution if needed
      debugLog('Genius API not implemented yet', { artist, title })
      return null
    } catch (error) {
      debugLog('Genius API failed', { artist, title, error })
      return null
    }
  }

  private async fetchFromLyricsApi(artist: string, title: string): Promise<LyricsResponse | null> {
    try {
      // Alternative lyrics API
      const query = `${artist} ${title}`
      const url = `https://api.lyricsapi.com/search?q=${encodeURIComponent(query)}`

      const response = await fetch(url)

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          lyrics: result.lyrics,
          source: 'lyricsapi.com',
        }
      }

      return null
    } catch (error) {
      debugLog('Lyrics API failed', { artist, title, error })
      return null
    }
  }

  parseLyrics(lyrics: string): LyricsLine[] {
    const lines = lyrics.split('\n').filter((line) => line.trim())

    return lines.map((line) => ({
      text: line.trim(),
    }))
  }

  generateLyricSnippet(lyrics: string, startLine: number = 0, length: number = 3): string {
    const lines = this.parseLyrics(lyrics)

    if (startLine >= lines.length) {
      return lines[0]?.text || ''
    }

    const snippet = lines.slice(startLine, startLine + length)
    return snippet.map((line) => line.text).join(' ')
  }

  generateLyricOptions(lyrics: string, correctLine: number, context: number = 2): string[] {
    const lines = this.parseLyrics(lyrics)

    if (correctLine >= lines.length) {
      return []
    }

    const options: string[] = []

    // Add the correct answer
    options.push(lines[correctLine].text)

    // Add context lines as incorrect options
    const start = Math.max(0, correctLine - context)
    const end = Math.min(lines.length, correctLine + context + 1)

    for (let i = start; i < end; i++) {
      if (i !== correctLine && options.length < 3) {
        options.push(lines[i].text)
      }
    }

    // Shuffle options
    return this.shuffleArray(options)
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  clearCache(): void {
    this.cache.clear()
    debugLog('Lyrics cache cleared')
  }
}

export const lyricsService = new LyricsService()
export default lyricsService
