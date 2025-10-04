import { debugLog, errorLog } from '../config/environment'

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    images: Array<{ url: string; width: number; height: number }>
    name: string
  }
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

interface SpotifyLyrics {
  lyrics: {
    syncType: string
    lines: Array<{
      startTimeMs: string
      words: string
    }>
  }
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
  }
}

class SpotifyService {
  private accessToken: string | null = null
  private tokenExpiry: number = 0
  private clientId: string
  private clientSecret: string

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || ''
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || ''

    this.loadStoredToken()
  }

  async authenticate(): Promise<boolean> {
    try {
      if (this.isTokenValid()) {
        return true
      }

      // Check if we have a stored token
      const storedToken = localStorage.getItem('spotify_access_token')
      const storedExpiry = localStorage.getItem('spotify_token_expiry')

      if (storedToken && storedExpiry && Date.now() < parseInt(storedExpiry)) {
        this.accessToken = storedToken
        this.tokenExpiry = parseInt(storedExpiry)
        return true
      }

      // Get new token using Client Credentials Flow
      await this.getClientCredentialsToken()
      return this.accessToken !== null
    } catch (error) {
      errorLog('Spotify authentication failed', error)
      return false
    }
  }

  async searchTrack(query: string): Promise<SpotifyTrack | null> {
    try {
      if (!(await this.authenticate())) {
        return null
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`)
      }

      const data: SpotifySearchResponse = await response.json()

      if (data.tracks.items.length === 0) {
        debugLog('No tracks found for query', { query })
        return null
      }

      const track = data.tracks.items[0]
      debugLog('Track found', { name: track.name, artist: track.artists[0]?.name })

      return track
    } catch (error) {
      errorLog('Failed to search track', { query, error })
      return null
    }
  }

  async searchTrackByArtistAndTitle(artist: string, title: string): Promise<SpotifyTrack | null> {
    try {
      if (!(await this.authenticate())) {
        return null
      }

      const query = `artist:"${artist}" track:"${title}"`
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`)
      }

      const data: SpotifySearchResponse = await response.json()

      if (data.tracks.items.length === 0) {
        // Try with a broader search
        const broadQuery = `${artist} ${title}`
        return this.searchTrack(broadQuery)
      }

      const track = data.tracks.items[0]
      debugLog('Track found by artist and title', {
        name: track.name,
        artist: track.artists[0]?.name,
        searchedArtist: artist,
        searchedTitle: title,
      })

      return track
    } catch (error) {
      errorLog('Failed to search track by artist and title', { artist, title, error })
      return null
    }
  }

  async getLyrics(trackId: string): Promise<SpotifyLyrics | null> {
    try {
      if (!(await this.authenticate())) {
        return null
      }

      // Note: Spotify doesn't provide lyrics directly. We'll need to use a lyrics service
      // For now, we'll return null and handle this with a separate lyrics API
      debugLog('Lyrics not available through Spotify API', { trackId })
      return null
    } catch (error) {
      errorLog('Failed to get lyrics', { trackId, error })
      return null
    }
  }

  async getAlbumCover(trackId: string): Promise<string | null> {
    try {
      if (!(await this.authenticate())) {
        return null
      }

      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`)
      }

      const track: SpotifyTrack = await response.json()

      if (track.album.images.length === 0) {
        return null
      }

      // Return the medium-sized image (300x300 or closest)
      const mediumImage =
        track.album.images.find((img) => img.width >= 300) || track.album.images[0]
      return mediumImage.url
    } catch (error) {
      errorLog('Failed to get album cover', { trackId, error })
      return null
    }
  }

  async getMultipleAlbumCovers(queries: string[]): Promise<Map<string, string>> {
    const covers = new Map<string, string>()

    try {
      const promises = queries.map(async (query) => {
        const track = await this.searchTrack(query)
        if (track) {
          const coverUrl = await this.getAlbumCover(track.id)
          if (coverUrl) {
            covers.set(query, coverUrl)
          }
        }
      })

      await Promise.all(promises)
      debugLog('Album covers fetched', { count: covers.size, total: queries.length })

      return covers
    } catch (error) {
      errorLog('Failed to get multiple album covers', error)
      return covers
    }
  }

  private async getClientCredentialsToken(): Promise<void> {
    try {
      debugLog('Getting Spotify access token using Client Credentials Flow')

      const authString = btoa(`${this.clientId}:${this.clientSecret}`)

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
        body: 'grant_type=client_credentials',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get access token: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000

      // Store token
      if (this.accessToken) {
        localStorage.setItem('spotify_access_token', this.accessToken)
        localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString())
      }

      debugLog('Spotify access token obtained successfully', {
        expiresIn: data.expires_in,
        tokenType: data.token_type,
      })
    } catch (error) {
      errorLog('Failed to get client credentials token', error)
      throw error
    }
  }

  private isTokenValid(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiry
  }

  private loadStoredToken(): void {
    const storedToken = localStorage.getItem('spotify_access_token')
    const storedExpiry = localStorage.getItem('spotify_token_expiry')

    if (storedToken && storedExpiry) {
      this.accessToken = storedToken
      this.tokenExpiry = parseInt(storedExpiry)
    }
  }

  // Clear stored authentication
  clearAuth(): void {
    this.accessToken = null
    this.tokenExpiry = 0
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_token_expiry')
  }
}

export const spotifyService = new SpotifyService()
export default spotifyService
