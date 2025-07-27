<template>
  <div class="artwork-card" @click="$emit('click', artwork)">
    <div class="artwork-frame">
      <ProtectedImage
        :image-url="artwork.imageUrl"
        :width="width"
        :height="height"
        :protection-level="protectionLevel"
        :show-watermark="showWatermark"
      />
      <div class="artwork-hover-overlay">
        <span class="view-text">View Details</span>
      </div>
    </div>
    <div class="artwork-info">
      <h3 class="artwork-title">{{ artwork.title }}</h3>
      <p class="artwork-artist serif-text">{{ artwork.artist }}</p>
      
      <div v-if="showMeta" class="artwork-meta">
        <span v-if="artwork.year" class="meta-item">{{ artwork.year }}</span>
        <span v-if="artwork.medium" class="meta-item">{{ artwork.medium }}</span>
        <span v-if="artwork.hall" class="hall-tag">{{ artwork.hall }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ProtectedImage from '@/components/Protection/ProtectedImage.vue';

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
  artwork: {
    type: Object as () => Artwork,
    required: true
  },
  width: {
    type: Number,
    default: 350
  },
  height: {
    type: Number,
    default: 450
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

defineEmits(['click']);
</script>

<style scoped>
.artwork-card {
  position: relative;
  width: v-bind(width + 'px');
  height: v-bind('height + (showMeta ? 100 : 80) + "px"'); /* Extra height for info */
  border-radius: 8px;
  overflow: hidden;
  background: var(--background-tertiary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 1rem;
}

.artwork-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.artwork-frame {
  position: relative;
  width: 100%;
  height: v-bind(height + 'px');
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.artwork-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-card:hover .artwork-hover-overlay {
  opacity: 1;
}

.view-text {
  color: var(--primary-color);
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.artwork-card:hover .view-text {
  transform: translateY(0);
  opacity: 1;
}

.artwork-info {
  padding: 1rem;
  background: var(--background-tertiary);
}

.artwork-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.artwork-artist {
  font-size: 0.9rem;
  margin: 0;
  color: var(--primary-color);
  font-style: italic;
}

.artwork-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--background-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.hall-tag {
  font-size: 0.7rem;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background: transparent;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

/* Gold accent on hover */
.artwork-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.artwork-card:hover::after {
  width: 80%;
}

@media (max-width: 768px) {
  .artwork-card {
    width: 100%;
    max-width: 350px;
    margin: 1rem auto;
  }
}
</style>