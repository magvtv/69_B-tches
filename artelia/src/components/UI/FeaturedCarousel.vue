<template>
  <div class="relative w-full max-w-6xl mx-auto">
    <div class="overflow-hidden rounded-2xl">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(artwork, index) in artworks" 
          :key="artwork.id"
          class="w-full flex-shrink-0 relative cursor-pointer group"
          @click="$emit('select-artwork', artwork)"
        >
          <div class="relative aspect-[16/9] overflow-hidden">
            <img 
              :src="artwork.assets.original" 
              :alt="artwork.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            
            <!-- Overlay content -->
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 class="font-serif text-3xl md:text-4xl mb-2">{{ artwork.title }}</h3>
              <p class="font-serif text-lg italic text-primary mb-2">{{ artwork.artist }}</p>
              <p class="text-text-muted mb-4 max-w-2xl">{{ artwork.description }}</p>
              
              <!-- View Details Button -->
              <div class="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 backdrop-blur-sm border border-primary rounded-lg text-primary hover:bg-primary hover:text-background-primary transition-all duration-300">
                <span class="font-serif">View Details</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation Dots -->
    <div class="flex justify-center gap-3 mt-6">
      <button
        v-for="(artwork, index) in artworks"
        :key="`dot-${artwork.id}`"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="[
          index === currentIndex 
            ? 'bg-primary scale-125' 
            : 'bg-border hover:bg-primary/50'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
    
    <!-- Navigation Arrows -->
    <button
      @click="previousSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background-secondary/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background-primary transition-all duration-300 opacity-0 group-hover:opacity-100"
      :class="{ 'opacity-100': showControls }"
      aria-label="Previous slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background-secondary/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background-primary transition-all duration-300 opacity-0 group-hover:opacity-100"
      :class="{ 'opacity-100': showControls }"
      aria-label="Next slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Artwork } from '@/services/artworkService';

const props = defineProps({
  artworks: {
    type: Array as () => Artwork[],
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  autoPlayInterval: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['select-artwork']);

const currentIndex = ref(0);
const showControls = ref(false);
let autoPlayTimer: NodeJS.Timeout | null = null;

function goToSlide(index: number) {
  currentIndex.value = index;
  resetAutoPlay();
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.artworks.length;
  resetAutoPlay();
}

function previousSlide() {
  currentIndex.value = currentIndex.value === 0 
    ? props.artworks.length - 1 
    : currentIndex.value - 1;
  resetAutoPlay();
}

function startAutoPlay() {
  if (props.autoPlay && props.artworks.length > 1) {
    autoPlayTimer = setInterval(() => {
      nextSlide();
    }, props.autoPlayInterval);
  }
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.group:hover .opacity-0 {
  opacity: 1;
}
</style>