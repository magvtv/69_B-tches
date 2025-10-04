import { debugLog, errorLog } from '../config/environment'

interface CachedAudio {
  url: string
  data: Blob
  cachedAt: number
  size: number
}

interface AudioCacheConfig {
  maxSize: number
  maxAge: number
  version: string
}

class AudioCacheService {
  private cache: Map<string, CachedAudio> = new Map()
  private config: AudioCacheConfig = {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    version: '1.0.0',
  }

  constructor() {
    this.loadFromStorage()
    this.cleanup()
  }

  async cacheAudio(url: string, forceRefresh: boolean = false): Promise<string> {
    const cacheKey = this.getCacheKey(url)

    if (!forceRefresh && this.isCached(url)) {
      const cached = this.cache.get(cacheKey)!
      if (!this.isExpired(cached)) {
        debugLog('Audio cache hit', { url, cacheKey })
        return URL.createObjectURL(cached.data)
      }
    }

    try {
      debugLog('Caching audio', { url, cacheKey })

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }

      const blob = await response.blob()
      const size = blob.size

      if (this.getTotalSize() + size > this.config.maxSize) {
        await this.makeSpace(size)
      }

      const cachedAudio: CachedAudio = {
        url,
        data: blob,
        cachedAt: Date.now(),
        size,
      }

      this.cache.set(cacheKey, cachedAudio)
      await this.saveToStorage()

      debugLog('Audio cached successfully', { url, size, totalSize: this.getTotalSize() })

      return URL.createObjectURL(blob)
    } catch (error) {
      errorLog('Failed to cache audio', { url, error })
      throw error
    }
  }

  getCachedAudio(url: string): string | null {
    const cacheKey = this.getCacheKey(url)
    const cached = this.cache.get(cacheKey)

    if (cached && !this.isExpired(cached)) {
      debugLog('Audio cache hit', { url, cacheKey })
      return URL.createObjectURL(cached.data)
    }

    return null
  }

  isCached(url: string): boolean {
    const cacheKey = this.getCacheKey(url)
    const cached = this.cache.get(cacheKey)
    return cached !== undefined && !this.isExpired(cached)
  }

  async preloadAudios(urls: string[]): Promise<void> {
    debugLog('Preloading audio files', { count: urls.length })

    const promises = urls.map((url) =>
      this.cacheAudio(url).catch((error) => {
        errorLog('Failed to preload audio', { url, error })
        return null
      }),
    )

    await Promise.all(promises)
    debugLog('Audio preloading completed')
  }

  getStats() {
    const totalSize = this.getTotalSize()
    const totalFiles = this.cache.size
    const expiredFiles = Array.from(this.cache.values()).filter(this.isExpired).length

    return {
      totalSize,
      totalFiles,
      expiredFiles,
      maxSize: this.config.maxSize,
      utilization: (totalSize / this.config.maxSize) * 100,
    }
  }

  async cleanup(): Promise<void> {
    let cleaned = 0

    for (const [key, cached] of this.cache.entries()) {
      if (this.isExpired(cached)) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      await this.saveToStorage()
      debugLog('Audio cache cleaned', { cleaned, remaining: this.cache.size })
    }
  }

  async clearAll(): Promise<void> {
    for (const cached of this.cache.values()) {
      URL.revokeObjectURL(URL.createObjectURL(cached.data))
    }

    this.cache.clear()
    await this.saveToStorage()
    debugLog('Audio cache cleared')
  }

  private getCacheKey(url: string): string {
    return `audio_${btoa(url)}`
  }

  private isExpired(cached: CachedAudio): boolean {
    return Date.now() - cached.cachedAt > this.config.maxAge
  }

  private getTotalSize(): number {
    return Array.from(this.cache.values()).reduce((total, cached) => total + cached.size, 0)
  }

  private async makeSpace(requiredSize: number): Promise<void> {
    const sortedEntries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.cachedAt - b.cachedAt,
    )

    let freedSize = 0
    const toDelete: string[] = []

    for (const [key, cached] of sortedEntries) {
      toDelete.push(key)
      freedSize += cached.size

      if (freedSize >= requiredSize) {
        break
      }
    }

    for (const key of toDelete) {
      this.cache.delete(key)
    }

    debugLog('Made space in audio cache', { freedSize, requiredSize, deleted: toDelete.length })
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = await Promise.all(
        Array.from(this.cache.entries()).map(async ([key, cached]) => [
          key,
          {
            url: cached.url,
            data: Array.from(new Uint8Array(await cached.data.arrayBuffer())),
            cachedAt: cached.cachedAt,
            size: cached.size,
          },
        ])
      )

      localStorage.setItem(
        'audio_cache',
        JSON.stringify({
          version: this.config.version,
          data,
        }),
      )
    } catch (error) {
      errorLog('Failed to save audio cache to storage', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('audio_cache')
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (parsed.version !== this.config.version) {
        debugLog('Audio cache version mismatch, clearing cache')
        return
      }

      for (const [key, cachedData] of parsed.data) {
        const blob = new Blob([new Uint8Array(cachedData.data)], { type: 'audio/mpeg' })
        this.cache.set(key, {
          url: cachedData.url,
          data: blob,
          cachedAt: cachedData.cachedAt,
          size: cachedData.size,
        })
      }

      debugLog('Audio cache loaded from storage', { entries: this.cache.size })
    } catch (error) {
      errorLog('Failed to load audio cache from storage', error)
    }
  }
}

export const audioCache = new AudioCacheService()
export default audioCache
