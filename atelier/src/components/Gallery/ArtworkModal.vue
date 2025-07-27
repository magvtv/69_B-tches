<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-btn" @click="close">
          <span class="close-icon">×</span>
        </button>
        
        <div class="modal-grid">
          <div class="artwork-display">
            <div class="artwork-frame">
              <ProtectedImage
                :image-url="artwork.imageUrl"
                :width="600"
                :height="700"
                protection-level="advanced"
                :show-watermark="true"
                @loaded="artworkLoaded = true"
              />
              <div v-if="!artworkLoaded" class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
              <AntiScrapeLayer protection-level="advanced">
                <div class="artwork-controls">
                  <button class="control-btn zoom-in" @click.stop="zoomIn">+</button>
                  <button class="control-btn zoom-out" @click.stop="zoomOut">-</button>
                </div>
              </AntiScrapeLayer>
            </div>
          </div>
          
          <div class="artwork-details">
            <h2 class="artwork-title">{{ artwork.title }}</h2>
            <p class="artwork-artist serif-text">{{ artwork.artist }}</p>
            
            <div class="artwork-divider"></div>
            
            <div class="artwork-meta">
              <div v-if="artwork.year" class="meta-item">
                <span class="meta-label">Year:</span>
                <span class="meta-value">{{ artwork.year }}</span>
              </div>
              <div v-if="artwork.medium" class="meta-item">
                <span class="meta-label">Medium:</span>
                <span class="meta-value">{{ artwork.medium }}</span>
              </div>
              <div v-if="artwork.hall" class="meta-item">
                <span class="meta-label">Hall:</span>
                <span class="meta-value">{{ artwork.hall }}</span>
              </div>
            </div>
            
            <div class="artwork-description serif-body">
              <p>{{ artwork.description || 'This exquisite piece exemplifies the confluence of Renaissance techniques with contemporary digital artistry. The chiaroscuro lighting and classical composition pay homage to the masters, while the subject matter speaks to modern sensibilities.' }}</p>
            </div>
            
            <div class="artwork-actions">
              <RenaissanceButton @click="viewFullResolution">View in Full Resolution</RenaissanceButton>
              <RenaissanceButton outline @click="addToCollection">Add to Collection</RenaissanceButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RenaissanceButton from '../UI/RenaissanceButton.vue';
import ProtectedImage from '@/components/Protection/ProtectedImage.vue';
import AntiScrapeLayer from '@/components/Protection/AntiScrapeLayer.vue';

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

const props = defineProps<{
  visible: boolean;
  artwork: Artwork;
}>();

const emit = defineEmits(['close']);
const artworkLoaded = ref(false);
const zoomLevel = ref(1);

function close() {
  emit('close');
}

function zoomIn() {
  if (zoomLevel.value < 1.5) {
    zoomLevel.value += 0.1;
  }
}

function zoomOut() {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.1;
  }
}

function viewFullResolution() {
  // In a real app, this would check for membership level
  // and either show full resolution or prompt for upgrade
  console.log('View full resolution:', props.artwork.id);
}

function addToCollection() {
  // In a real app, this would add to user's collection
  console.log('Add to collection:', props.artwork.id);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 2rem;
}

.modal-content {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.artwork-display {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-primary);
}

.artwork-frame {
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  transform: scale(v-bind(zoomLevel));
  transition: transform 0.3s ease;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.artwork-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

.artwork-details {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.artwork-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.artwork-artist {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  font-style: italic;
}

.artwork-divider {
  width: 60px;
  height: 2px;
  background: var(--primary-color);
  margin-bottom: 2rem;
}

.artwork-meta {
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.meta-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.meta-value {
  color: var(--text-color);
  font-size: 0.9rem;
}

.artwork-description {
  margin-bottom: 2rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.artwork-actions {
  margin-top: auto;
  display: flex;
  gap: 1rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  z-index: 10;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(212, 175, 55, 0.1);
}

.close-icon {
  font-size: 2rem;
  color: var(--primary-color);
  line-height: 1;
}

@media (max-width: 992px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }
  
  .artwork-display {
    padding: 1rem;
  }
  
  .artwork-details {
    padding: 2rem;
  }
  
  .artwork-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .artwork-title {
    font-size: 1.5rem;
  }
  
  .artwork-artist {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .artwork-divider {
    margin-bottom: 1.5rem;
  }
}
</style>