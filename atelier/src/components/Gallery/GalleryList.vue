<template>
  <div class="gallery-list">
    <div v-if="artworks.length === 0" class="empty-gallery">
      <p>No artworks available in this hall.</p>
    </div>
    
    <div v-else class="artwork-list">
      <div 
        v-for="artwork in artworks" 
        :key="artwork.id" 
        class="artwork-list-item"
        @click="selectArtwork(artwork)"
      >
        <div class="artwork-preview">
          <ProtectedImage 
            :image-url="artwork.imageUrl" 
            :width="150" 
            :height="150"
            protection-level="basic"
            :show-watermark="false"
          />
        </div>
        
        <div class="artwork-info">
          <h3 class="artwork-title">{{ artwork.title }}</h3>
          <p class="artwork-artist serif-text">{{ artwork.artist }}</p>
          <p class="artwork-description">{{ truncateDescription(artwork.description) }}</p>
          
          <div class="artwork-meta">
            <span v-if="artwork.year" class="meta-item">{{ artwork.year }}</span>
            <span v-if="artwork.medium" class="meta-item">{{ artwork.medium }}</span>
            <span v-if="artwork.hall" class="meta-item hall-tag">{{ artwork.hall }}</span>
          </div>
        </div>
        
        <div class="artwork-actions">
          <button class="view-btn">View</button>
        </div>
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
  description: string;
  imageUrl: string;
  hall?: string;
  year?: number;
  medium?: string;
}

const props = defineProps<{
  artworks: Artwork[]
}>();

const emit = defineEmits(['select-artwork']);

function selectArtwork(artwork: Artwork) {
  emit('select-artwork', artwork);
}

function truncateDescription(description: string, maxLength = 120): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
}
</script>

<style scoped>
.gallery-list {
  width: 100%;
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

.artwork-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.artwork-list-item {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--background-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.artwork-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color);
}

.artwork-preview {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
}

.artwork-info {
  display: flex;
  flex-direction: column;
}

.artwork-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.artwork-artist {
  font-size: 1rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-style: italic;
}

.artwork-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.artwork-meta {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.meta-item {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--background-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.hall-tag {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background: transparent;
}

.artwork-actions {
  display: flex;
  align-items: center;
}

.view-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-family: 'Playfair Display', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.view-btn:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

@media (max-width: 768px) {
  .artwork-list-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .artwork-preview {
    width: 100%;
    height: 200px;
  }
  
  .artwork-actions {
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>