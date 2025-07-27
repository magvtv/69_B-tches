<template>
  <div class="w-full">
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-text-muted">
      <div class="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
      <p>Loading exquisite artworks...</p>
    </div>
    
    <div v-else-if="artworks.length === 0" class="py-16 text-center text-text-muted italic w-full border border-dashed border-border rounded-lg">
      <p>No artworks available in this hall.</p>
    </div>
    
    <div v-else class="grid gap-8 md:gap-6 justify-items-center" 
         :class="[
           compact ? 
             'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 
             'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
         ]">
      <ArtworkCard
        v-for="artwork in artworks"
        :key="artwork.id"
        :artwork="artwork"
        :width="cardWidth"
        :height="cardHeight"
        :protection-level="protectionLevel"
        :show-watermark="showWatermark"
        :show-meta="showMeta"
        @click="selectArtwork(artwork)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ArtworkCard from './ArtworkCard.vue';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description?: string;
  imageUrl: string;
  hall?: string;
  year?: number;
  medium?: string;
}

const props = defineProps({
  artworks: {
    type: Array as () => Artwork[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Number,
    default: 3
  },
  protectionLevel: {
    type: String,
    default: 'basic',
    validator: (value: string) => ['basic', 'advanced', 'paranoid'].includes(value)
  },
  showWatermark: {
    type: Boolean,
    default: true
  },
  showMeta: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select-artwork']);

// Calculate card dimensions based on compact mode
const cardWidth = computed(() => props.compact ? 280 : 350);
const cardHeight = computed(() => props.compact ? 360 : 450);

function selectArtwork(artwork: Artwork) {
  emit('select-artwork', artwork);
}
</script>