<template>
  <GameLayout>
    <div class="max-w-6xl mx-auto p-6 text-white">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          The Circus Levels
        </h1>
        <p class="text-lg text-gray-300 dm-sans">
          Choose a dimension into our twisted world
        </p>
      </div>
      
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <router-link
          v-for="level in levels"
          :key="level.number"
          :to="`/levels/0${level.number}`"
          class="group block bg-black/40 backdrop-blur-sm border border-red-600/30 rounded-2xl p-6 hover:bg-black/50 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <component :is="level.icon" class="w-8 h-8 text-white" />
            </div>
            <p class="font-bold text-lg dm-sans mb-2">
              {{ level.title }}
            </p>
            <p class="text-sm text-gray-300 dm-sans">
              Level {{ level.number }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
import { 
  PuzzlePieceIcon, 
  MusicalNoteIcon, 
  FaceSmileIcon, 
  HeartIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/solid'

// Level data with titles and corresponding icons
const levels = [
  {
    number: 1,
    title: 'The Meme Maze',
    icon: PuzzlePieceIcon
  },
  {
    number: 2,
    title: 'Songs of Origins',
    icon: MusicalNoteIcon
  },
  {
    number: 3,
    title: 'Jokes & Chaos',
    icon: FaceSmileIcon
  },
  {
    number: 4,
    title: 'Kama Sutra Enigma',
    icon: HeartIcon
  },
  {
    number: 5,
    title: 'The Final Heist',
    icon: ShieldCheckIcon
  }
]

// Acts as the hub page for levels
</script>

<style scoped>
</style>


