<template>
  <GameLayout>
    <ThreeBackdrop />
    <div class="max-w-4xl mx-auto p-6 text-white">
      <div class="flex items-center justify-between mb-6">
        <router-link to="/levels/01" class="text-gray-300 hover:text-white">Level Hub</router-link>
        <CandlesProgress :lit="candlesLit" :total="23" />
      </div>

      <div class="bg-black/40 border border-red-600/20 rounded-2xl p-6 text-center">
        <div class="mb-4 text-sm text-gray-400">Meme {{ state.currentIndex + 1 }} / {{ state.totalMemes }}</div>
        <div class="aspect-[4/3] bg-black/40 rounded-lg border border-gray-700/50 overflow-hidden flex items-center justify-center mb-6">
          <img ref="memeImg" :src="currentMemeSrc" alt="meme" class="max-h-full max-w-full object-contain opacity-0" />
        </div>

        <div class="flex gap-4 justify-center">
          <button @click="onReact('laugh')" class="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-bold dm-sans flex items-center gap-2">
            <HandThumbUpIcon class="h-5 w-5" />
            This got me
          </button>
          <button @click="onReact('meh')" class="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 font-bold dm-sans flex items-center gap-2">
            <HandThumbDownIcon class="h-5 w-5" />
            Meh
          </button>
        </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GameLayout from '@/layouts/GameLayout.vue'
import ThreeBackdrop from '@/shared/ThreeBackdrop.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import { useMemeMazeStore } from '@/stores/memeMaze'
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const { state, react, candlesLit, isComplete } = useMemeMazeStore()

const memeImg = ref<HTMLImageElement | null>(null)
const currentMemeSrc = computed(() => `/images/memes/${state.currentIndex + 1}.jpg`)

watch(currentMemeSrc, async () => {
  // fade in each new meme
  await nextTick()
  if (memeImg.value) {
    gsap.fromTo(memeImg.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
  }
})

function onReact(type: 'laugh' | 'meh') {
  if (memeImg.value) {
    const x = type === 'laugh' ? 40 : -40
    gsap.to(memeImg.value, { x, rotation: x > 0 ? 2 : -2, opacity: 0, duration: 0.25, ease: 'power2.in' })
  }
  react(type)
  if (isComplete) {
    router.push('/levels/meme-maze/finale')
  }
}
</script>

<style scoped>
</style>


