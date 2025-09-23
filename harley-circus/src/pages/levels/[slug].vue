<template>
  <GameLayout>
    <component :is="levelComponent" v-if="levelComponent" :meta="levelMeta" />
    <div v-else class="text-white p-8 text-center">
      <p class="text-xl">Level not found: {{ slug }}</p>
    </div>
  </GameLayout>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import GameLayout from '@/layouts/GameLayout.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const levelMeta = ref<Record<string, any> | null>(null)
const levelComponent = ref<ReturnType<typeof defineAsyncComponent> | null>(null)

async function loadLevel() {
  try {
    // Load meta.json
    const metaModule = await import(
      /* @vite-ignore */ `@/pages/@game/levels/${slug.value}/meta.json`
    )
    levelMeta.value = metaModule.default || metaModule

    // Load the level component
    levelComponent.value = defineAsyncComponent(() =>
      import(
        /* @vite-ignore */ `@/pages/@game/levels/${slug.value}/index.vue`
      )
    )
  } catch (_err) {
    levelMeta.value = null
    levelComponent.value = null
  }
}

// Initial load and watch for slug changes
loadLevel()

</script>

<style scoped>
</style>


