<template>
  <div class="gallery-container">
    <div v-if="loading" class="gallery-loading">
      <div class="loading-spinner"></div>
      <p>Loading exquisite artworks...</p>
    </div>
    
    <div v-else-if="artworks.length === 0" class="empty-gallery">
      <p>No artworks available in this hall.</p>
    </div>
    
    <div v-else class="gallery-grid" :class="{ 'compact': compact }">
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
import { ref, computed, defineProps, defineEmits } from 'vue';
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

<style scoped>
.gallery-container {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.gallery-grid.compact {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--text-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-gallery {
  padding: 4rem;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  width: 100%;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
}

@media (max-width: 1200px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .gallery-grid.compact {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .gallery-grid.compact {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .gallery-grid, .gallery-grid.compact {
    grid-template-columns: 1fr;
  }
}
</style>