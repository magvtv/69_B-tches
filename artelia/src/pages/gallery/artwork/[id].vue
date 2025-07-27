<template>
  <div class="artwork-detail">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading masterpiece...</p>
      </div>
      
      <div v-else-if="!artwork" class="error-container">
        <h2>Artwork Not Found</h2>
        <p>The masterpiece you're looking for could not be found.</p>
        <RouterLink to="/gallery" class="back-link">Return to Gallery</RouterLink>
      </div>
      
      <div v-else class="artwork-content">
        <div class="artwork-image">
          <AntiScrapeLayer protection-level="paranoid">
            <ProtectedImage
              :image-url="artwork.assets.original"
              :width="600"
              :height="800"
              protection-level="paranoid"
              :show-watermark="true"
              @loaded="artworkLoaded = true"
            />
            <div v-if="!artworkLoaded" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
          </AntiScrapeLayer>
          
          <div class="artwork-controls">
            <button class="control-btn" @click="zoomIn">
              <span class="control-icon">+</span>
            </button>
            <button class="control-btn" @click="zoomOut">
              <span class="control-icon">-</span>
            </button>
            <button class="control-btn" @click="toggleFullscreen">
              <span class="control-icon">⛶</span>
            </button>
          </div>
        </div>
        
        <div class="artwork-info">
          <div class="artwork-header">
            <h1>{{ artwork.title }}</h1>
            <p class="artist">by {{ artwork.artist }}</p>
          </div>
          
          <div class="artwork-divider"></div>
          
          <div class="artwork-description serif-body">
            <p>{{ artwork.description }}</p>
          </div>
          
          <div class="artwork-meta">
            <div class="meta-item">
              <span class="label">Year:</span>
              <span class="value">{{ artwork.year }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Medium:</span>
              <span class="value">{{ artwork.medium }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Dimensions:</span>
              <span class="value">{{ artwork.dimensions }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Hall:</span>
              <span class="value">{{ artwork.hall || 'Renaissance' }}</span>
            </div>
          </div>
          
          <div class="artwork-price" v-if="artwork.price">
            <span class="price-label">Price:</span>
            <span class="price-amount">KES {{ formatPrice(artwork.price) }}</span>
          </div>
          
          <div class="artwork-actions">
            <RenaissanceButton @click="purchaseArtwork">Purchase Artwork</RenaissanceButton>
            <button class="contact-btn" @click="contactArtist">Contact Artist</button>
            <button class="favorite-btn" :class="{ active: isFavorite }" @click="toggleFavorite">
              <span class="favorite-icon">♥</span>
              <span class="favorite-text">{{ isFavorite ? 'Favorited' : 'Add to Favorites' }}</span>
            </button>
          </div>
          
          <div class="artwork-share">
            <p class="share-label">Share this artwork:</p>
            <div class="share-buttons">
              <button class="share-btn">Facebook</button>
              <button class="share-btn">Twitter</button>
              <button class="share-btn">Pinterest</button>
              <button class="share-btn">Email</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="artwork" class="related-artworks">
        <h2>Related Artworks</h2>
        <div class="related-grid">
          <div v-for="i in 3" :key="i" class="related-item">
            <ProtectedImage
              :image-url="`/art-vault/bitch-${(parseInt(artwork.id) + i) % 20 + 1}.jpeg`"
              :width="300"
              :height="300"
              protection-level="basic"
              :show-watermark="false"
            />
            <div class="related-info">
              <h3>Related Artwork {{ i }}</h3>
              <p>Artist {{ i }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';
import ProtectedImage from '@/components/Protection/ProtectedImage.vue';
import AntiScrapeLayer from '@/components/Protection/AntiScrapeLayer.vue';
import { artworkService, type Artwork } from '@/services/artworkService';


const route = useRoute();
const loading = ref(true);
const artwork = ref<Artwork | null>(null);
const artworkLoaded = ref(false);
const isFavorite = ref(false);
const zoomLevel = ref(1);

onMounted(async () => {
  const artworkId = route.params.id as string;
  
  try {
    const result = await artworkService.getArtwork(artworkId);
    artwork.value = result;
  } catch (error) {
    console.error('Error loading artwork:', error);
  } finally {
    loading.value = false;
  }
});

function formatPrice(price: number): string {
  return price.toLocaleString('en-KE');
}

function purchaseArtwork() {
  // In a real app, this would open a purchase flow
  console.log('Purchase artwork:', artwork.value?.id);
}

function contactArtist() {
  // In a real app, this would open a contact form
  console.log('Contact artist for:', artwork.value?.id);
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  // In a real app, this would call an API to save the favorite status
  console.log('Toggle favorite:', artwork.value?.id, isFavorite.value);
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

function toggleFullscreen() {
  // In a real app, this would toggle fullscreen mode
  console.log('Toggle fullscreen for:', artwork.value?.id);
}
</script>

<style scoped>
.artwork-detail {
  padding: 3rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

.artwork-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.artwork-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transform: scale(v-bind(zoomLevel));
  transition: transform 0.3s ease;
  transform-origin: center center;
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

.artwork-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
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

.control-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.artwork-info {
  display: flex;
  flex-direction: column;
}

.artwork-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-family: 'Playfair Display', serif;
}

.artist {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-style: italic;
  font-family: 'Playfair Display', serif;
}

.artwork-divider {
  width: 80px;
  height: 2px;
  background: var(--primary-color);
  margin-bottom: 2rem;
}

.artwork-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: var(--text-muted);
}

.artwork-meta {
  margin-bottom: 2rem;
  background: var(--background-tertiary);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.meta-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: var(--text-muted);
}

.value {
  color: var(--text-color);
}

.artwork-price {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--primary-color);
  padding: 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  text-align: center;
}

.artwork-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.contact-btn, .favorite-btn {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-btn:hover, .favorite-btn:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

.favorite-btn.active {
  background: var(--primary-color);
  color: var(--background-primary);
}

.favorite-icon {
  font-size: 1.2rem;
}

.artwork-share {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.share-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.share-btn {
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.share-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.related-artworks {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.related-artworks h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-align: center;
  font-family: 'Playfair Display', serif;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.related-item {
  border-radius: 8px;
  overflow: hidden;
  background: var(--background-tertiary);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.related-info {
  padding: 1rem;
}

.related-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.related-info p {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-style: italic;
}

@media (max-width: 992px) {
  .artwork-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .artwork-image {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .artwork-detail {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .artwork-header h1 {
    font-size: 2rem;
  }
  
  .artist {
    font-size: 1.1rem;
  }
  
  .artwork-actions {
    flex-direction: column;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>