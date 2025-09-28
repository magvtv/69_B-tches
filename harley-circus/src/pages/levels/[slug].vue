<template>
  <div class="level-container">
    <MemeMazeIntro v-if="slug === 'vibe-check'" />
    <MemeMazeMemes v-else-if="slug === 'memes'" />
    <MemeMazeNumberPlay v-else-if="slug === 'number-play'" />
    <MemeMazeFinale v-else-if="slug === 'finale'" />
    <div v-else class="error-container">
      <h1>Level not found: {{ slug }}</h1>
      <p>Available levels: intro, memes, number-play, finale</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MemeMazeIntro from './01-meme-maze/VibeCheck.vue'
import MemeMazeMemes from './01-meme-maze/Memes.vue'
import MemeMazeNumberPlay from './01-meme-maze/NumberPlay.vue'
import MemeMazeFinale from './01-meme-maze/Finale.vue'

// Define component name for linting
defineOptions({
  name: 'LevelSlugPage'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
</script>

<style scoped>
.level-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0D0D0D 0%, #1a0a2e 50%, #6A0DAD 100%);
}

.error-container {
  padding: 2rem;
  text-align: center;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-container h1 {
  color: #39FF14;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.error-container p {
  color: #ccc;
  font-size: 1.1rem;
}
</style>


