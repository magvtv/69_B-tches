import { spotifyService } from './spotify'
import { lyricsService } from './lyricsService'
import { debugLog, errorLog } from '../config/environment'

interface SongData {
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
  albumCover?: string
}

interface SongsDataGeneratorConfig {
  songs: Array<{
    title: string
    artist: string
    context: string
    reward: string
    special?: boolean
    final?: boolean
  }>
}

class SongsDataGenerator {
  async generateSongsData(config: SongsDataGeneratorConfig): Promise<SongData[]> {
    const songsData: SongData[] = []

    debugLog('Starting songs data generation', { count: config.songs.length })

    for (let i = 0; i < config.songs.length; i++) {
      const song = config.songs[i]

      try {
        debugLog('Processing song', { title: song.title, artist: song.artist })

        // Search for track on Spotify
        const track = await spotifyService.searchTrackByArtistAndTitle(song.artist, song.title)

        if (!track) {
          errorLog('Track not found on Spotify', { title: song.title, artist: song.artist })
          continue
        }

        // Get album cover
        const albumCover = await spotifyService.getAlbumCover(track.id)

        // Get lyrics
        const lyricsResponse = await lyricsService.getLyrics(song.artist, song.title)

        if (!lyricsResponse) {
          errorLog('Lyrics not found', { title: song.title, artist: song.artist })
          continue
        }

        // Generate lyric snippet and options dynamically
        const lyrics = lyricsResponse.lyrics
        const parsedLyrics = lyricsService.parseLyrics(lyrics)

        if (parsedLyrics.length < 4) {
          errorLog('Not enough lyrics to generate challenge', {
            title: song.title,
            artist: song.artist,
          })
          continue
        }

        // Pick a random starting point for the snippet (but not the last few lines)
        const maxStartIndex = Math.max(0, parsedLyrics.length - 4)
        const snippetStartIndex = Math.floor(Math.random() * maxStartIndex)

        // Generate snippet (2-3 lines)
        const snippetLength = Math.min(
          2 + Math.floor(Math.random() * 2),
          parsedLyrics.length - snippetStartIndex - 2,
        )
        const lyricSnippet = parsedLyrics
          .slice(snippetStartIndex, snippetStartIndex + snippetLength)
          .map((line) => line.text)
          .join(' ')

        // The correct answer is the next line after the snippet
        const correctAnswerIndex = snippetStartIndex + snippetLength
        const correctAnswer = parsedLyrics[correctAnswerIndex].text

        // Generate options: correct answer + 2-3 distractors from other parts of the song
        const options = [correctAnswer]

        // Add distractors from other parts of the song
        const distractorIndices = new Set([correctAnswerIndex])
        while (options.length < 4 && distractorIndices.size < parsedLyrics.length) {
          const randomIndex = Math.floor(Math.random() * parsedLyrics.length)
          if (!distractorIndices.has(randomIndex)) {
            distractorIndices.add(randomIndex)
            options.push(parsedLyrics[randomIndex].text)
          }
        }

        // Shuffle options and find correct answer index
        const shuffledOptions = this.shuffleArray([...options])
        const correctAnswerIndexInOptions = shuffledOptions.findIndex(
          (option) => option === correctAnswer,
        )

        if (correctAnswerIndexInOptions === -1) {
          errorLog('Failed to find correct answer in options', {
            title: song.title,
            artist: song.artist,
          })
          continue
        }

        // Determine question type
        let question: string
        let type: string

        if (song.final) {
          question = 'What song has been playing in the background?'
          type = 'audio_identification'
        } else if (song.special) {
          question = `${song.artist} cameo! Which lyric is correct?`
          type = 'finish_the_lyric'
        } else {
          question = 'Which lyric comes next?'
          type = 'finish_the_lyric'
        }

        const songData: SongData = {
          id: `lyric-${String(i + 1).padStart(3, '0')}`,
          type,
          songTitle: track.name,
          artist: track.artists[0]?.name || song.artist,
          spotifyId: track.id,
          question,
          lyricSnippet,
          options: shuffledOptions,
          correctAnswer: correctAnswerIndexInOptions,
          context: song.context,
          reward: song.reward,
          special: song.special,
          final: song.final,
          albumCover: albumCover || undefined,
        }

        songsData.push(songData)

        debugLog('Song data generated successfully', {
          title: song.title,
          artist: song.artist,
          spotifyId: track.id,
          albumCover: !!albumCover,
          optionsCount: options.length,
        })

        // Add delay between requests to avoid rate limiting
        if (i < config.songs.length - 1) {
          await this.delay(1000)
        }
      } catch (error) {
        errorLog('Failed to generate song data', { title: song.title, artist: song.artist, error })
      }
    }

    debugLog('Songs data generation completed', {
      total: config.songs.length,
      generated: songsData.length,
    })

    return songsData
  }

  async generateMetaJson(songsData: SongData[]): Promise<string> {
    const metaJson = {
      title: 'Songs of Origins',
      order: 2,
      slug: '02-songs-origin',
      totalChallenges: songsData.length,
      description: 'The melodies that shaped our connection',
      backgroundAudio: {
        file: '/audio/this-isnt-love-hudson.mp3',
        artist: 'Jennifer Hudson',
        title: "This Isn't Love",
        volume: 0.3,
        autoplay: true,
      },
      challenges: songsData,
      voiceNoteChallenge: {
        enabled: true,
        title: 'Your Turn to Shine',
        description:
          'Record yourself singing 10 seconds of ANY song from this level. This is the truth or dare throwback!',
        duration: 10,
        reward: 'voice_note_token',
      },
      rewards: {
        music_token: {
          name: 'Music Token',
          description: 'Earned for correct lyric recognition',
          icon: '[MUSIC]',
        },
        mereba_token: {
          name: 'Mereba Token',
          description: 'Special token for Mereba recognition',
          icon: '[SPARKLE]',
        },
        throwback_token: {
          name: 'Throwback Token',
          description: 'Earned for remembering the past',
          icon: '[TIME]',
        },
        attention_token: {
          name: 'Attention Token',
          description: 'For paying attention to background audio',
          icon: '[EAR]',
        },
        voice_note_token: {
          name: 'Voice Note Token',
          description: 'For completing the voice challenge',
          icon: '[MIC]',
        },
      },
    }

    return JSON.stringify(metaJson, null, 2)
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const songsDataGenerator = new SongsDataGenerator()
export default songsDataGenerator
