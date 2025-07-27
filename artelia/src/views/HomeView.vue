<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';
import { artworkService, type Artwork } from '@/services/artworkService';

const router = useRouter();
const featuredArtworks = ref<Artwork[]>([]);


onMounted(async () => {
  try {
    const artworks = await artworkService.getFeaturedArtworks(6);
    featuredArtworks.value = artworks;
  } catch (error) {
    console.error('Error loading featured artworks:', error);
  }
});

function exploreGallery() {
  // Navigate to gallery
  router.push('/gallery');
}

function viewArtworkDetails(artwork: Artwork) {
  // Navigate to artwork detail page
  router.push(`/gallery/artwork/${artwork.id}`);
}
</script>

<template>
  <div class="py-8">
    <div class="text-center py-16 md:py-20 px-4 md:px-8 bg-gradient-highlight rounded-2xl mx-4 md:mx-8 mb-16">
      <h1 class="text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-display">
        Artelia Digital Art Sanctuary
      </h1>
      <p class="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
        A curated collection of contemporary feminine art with Renaissance aesthetics
      </p>
      <RenaissanceButton @click="exploreGallery" variant="primary">
        Explore Gallery
      </RenaissanceButton>
    </div>
    
    <div class="px-4 md:px-8">
      <h2 class="text-3xl md:text-4xl text-center mb-12 text-primary font-serif">
        Featured Artworks
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="artwork in featuredArtworks.slice(0, 6)" 
          :key="artwork.id"
          class="renaissance-card cursor-pointer"
          @click="viewArtworkDetails(artwork)"
        >
          <div class="renaissance-card-header">
            <img :src="artwork.assets.original" :alt="artwork.title" class="w-full h-64 object-cover rounded-t-lg" />
          </div>
          <div class="renaissance-card-body">
            <h3 class="font-serif text-xl text-text mb-2">{{ artwork.title }}</h3>
            <p class="font-serif text-primary italic mb-3">{{ artwork.artist }}</p>
            <p class="text-sm text-text-muted">{{ artwork.description }}</p>
            <div class="flex gap-2 mt-4">
              <span v-if="artwork.year" class="renaissance-badge">{{ artwork.year }}</span>
              <span v-if="artwork.medium" class="renaissance-badge secondary">{{ artwork.medium }}</span>
              <span v-if="artwork.metadata?.mood" class="renaissance-badge mood">{{ artwork.metadata.mood }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
