<template>
  <div class="flex items-center gap-1">
    <div 
      v-for="i in total" 
      :key="i" 
      class="candle w-2 h-4 rounded-sm transition-all duration-500 ease-out"
      :class="[
        i <= animatedLit ? 'candle-lit' : 'candle-unlit',
        { 'candle-lighting': i === currentlyLighting }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ lit: number; total: number }>()

const animatedLit = ref(0)
const currentlyLighting = ref(0)

// Progressive lighting animation
async function lightCandlesProgressively(targetLit: number) {
  const currentLit = animatedLit.value
  
  if (targetLit <= currentLit) return
  
  // Light candles one by one with a small delay
  for (let i = currentLit + 1; i <= targetLit; i++) {
    currentlyLighting.value = i
    
    // Add a small delay between each candle lighting
    await new Promise(resolve => setTimeout(resolve, 150))
    
    animatedLit.value = i
    currentlyLighting.value = 0
  }
}

// Watch for changes in lit count and animate
watch(() => props.lit, (newLit) => {
  lightCandlesProgressively(newLit)
}, { immediate: true })

// Initialize on mount
onMounted(() => {
  animatedLit.value = props.lit
})
</script>

<style scoped>
.candle {
  position: relative;
  transform-origin: bottom center;
}

.candle-unlit {
  background-color: #4b5563; /* gray-600 */
  opacity: 0.6;
}

.candle-lit {
  background-color: #fbbf24; /* yellow-400 */
  box-shadow: 0 0 8px rgba(250, 204, 21, 0.8);
  opacity: 1;
}

.candle-lighting {
  background-color: #fbbf24;
  box-shadow: 0 0 12px rgba(250, 204, 21, 1);
  transform: scale(1.1);
  animation: candle-flicker 0.3s ease-in-out;
}

@keyframes candle-flicker {
  0% { 
    transform: scale(1);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);
  }
  50% { 
    transform: scale(1.15);
    box-shadow: 0 0 16px rgba(250, 204, 21, 1);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.8);
  }
}
</style>


