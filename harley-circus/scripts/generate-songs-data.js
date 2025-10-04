#!/usr/bin/env node

/**
 * Script to generate songs data with real Spotify API data
 * Run with: node scripts/generate-songs-data.js
 */

import { songsDataGenerator } from '../src/lib/songsDataGenerator.js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
      context: 'More Rexx Life Raj vibes',
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
      context: 'Timi Dre featuring Tonton Bicha',
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
    {
      title: 'Heat Waves',
      artist: 'Glass Animals',
      context: '2020 throwback',
      reward: 'throwback_token',
    },
    // Joke songs
    {
      title: 'The Hanging Tree',
      artist: 'Jennifer Lawrence',
      context: 'Are you coming to the tree? Hunger Games vibes',
      reward: 'throwback_token',
    },
    {
      title: 'The Best Part of Life',
      artist: 'Saint Jhn',
      context: 'Foreverness of something beautiful and unforgettable',
      reward: 'throwback_token',
    },
    {
      title: 'Brown Skin Girl',
      artist: 'Beyoncé',
      context: 'Relate it to Cadbury chocolate',
      reward: 'throwback_token',
    },
    {
      title: 'Heat Waves',
      artist: 'Glass Animals',
      context: 'Song that had you on chokehold in 2020',
      reward: 'throwback_token',
    },
    {
      title: 'Close',
      artist: 'Nick Jonas',
      context: 'Space is a word made up by someone who was afraid to get close',
      reward: 'throwback_token',
    },
    {
      title: 'Tailor Swif',
      artist: 'A$AP Rocky',
      context: 'A$AP Rocky vibes',
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
      title: "This Isn't Love",
      artist: 'Jennifer Hudson',
      context: 'Were you paying attention?',
      reward: 'attention_token',
      final: true,
    },
  ],
}

async function generateSongsData() {
  try {
    console.log('🎵 Starting songs data generation...')

    const songsData = await songsDataGenerator.generateSongsData(songsConfig)

    if (songsData.length === 0) {
      console.error('❌ No songs data generated')
      process.exit(1)
    }

    console.log(`✅ Generated data for ${songsData.length} songs`)

    // Generate meta.json content
    const metaJsonContent = await songsDataGenerator.generateMetaJson(songsData)

    // Write to file
    const outputPath = join(__dirname, '../src/pages/levels/02-songs-origin/meta.json')
    writeFileSync(outputPath, metaJsonContent, 'utf8')

    console.log(`📝 Updated meta.json at ${outputPath}`)

    // Log summary
    console.log('\n📊 Summary:')
    songsData.forEach((song, index) => {
      console.log(`${index + 1}. ${song.songTitle} by ${song.artist}`)
      console.log(`   Spotify ID: ${song.spotifyId}`)
      console.log(`   Album Cover: ${song.albumCover ? '✅' : '❌'}`)
      console.log(`   Options: ${song.options.length}`)
      console.log('')
    })

    console.log('🎉 Songs data generation completed!')
  } catch (error) {
    console.error('❌ Error generating songs data:', error)
    process.exit(1)
  }
}

// Run the script
generateSongsData()
