<script setup lang="ts">
import { ref } from 'vue';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';
import GalleryGrid from '@/components/Gallery/GalleryGrid.vue';

const featuredArtworks = ref([
  {
    id: '1',
    title: 'Mysterious Femininity',
    artist: 'Contemporary Artist',
    description: 'A powerful exploration of modern femininity',
    imageUrl: '/art-vault/bitch-1.jpeg',
    hall: 'renaissance'
  },
  {
    id: '2',
    title: 'Renaissance Reimagined',
    artist: 'Digital Master',
    description: 'Classical composition meets contemporary vision',
    imageUrl: '/art-vault/bitch-2.jpeg',
    hall: 'renaissance'
  }, 
  {
    id: '3',
    title: 'Contemporary Feminism',
    artist: 'Contemporary Artist',
    description: 'A powerful exploration of modern femininity',
    imageUrl: '/art-vault/bitch-3.jpeg',
    hall: 'contemporary'
  }
]);

function exploreGallery() {
  // Navigate to gallery
  console.log('Explore gallery clicked');
}
</script>

<template>
  <div class="home">
    <div class="hero-section">
      <h1>Atelier Digital Art Sanctuary</h1>
      <p>A curated collection of contemporary feminist art with Renaissance aesthetics</p>
      <RenaissanceButton @click="exploreGallery">Explore Gallery</RenaissanceButton>
    </div>
    
    <div class="featured-section">
      <h2>Featured Artworks</h2>
      <GalleryGrid :artworks="featuredArtworks" />
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(224, 195, 252, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border-radius: 16px;
  margin: 0 2rem 4rem 2rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.featured-section {
  padding: 0 2rem;
}

.featured-section h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
    margin: 0 1rem 2rem 1rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .featured-section {
    padding: 0 1rem;
  }
}
</style>
