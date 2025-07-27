<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';

const router = useRouter();
const featuredArtworks = ref([
  {
    id: '1',
    title: 'Mysterious Femininity',
    artist: 'Contemporary Artist',
    description: 'A powerful exploration of modern femininity through bold colors and expressive brushwork',
    imageUrl: '/art-vault/bitch-1.jpeg',
    hall: 'renaissance',
    year: 2024,
    medium: 'Digital Art'
  },
  {
    id: '2',
    title: 'Renaissance Reimagined',
    artist: 'Digital Master',
    description: 'Classical composition meets contemporary vision in this stunning digital masterpiece',
    imageUrl: '/art-vault/bitch-2.jpeg',
    hall: 'renaissance',
    year: 2024,
    medium: 'Mixed Media'
  },
  {
    id: '3',
    title: 'Contemporary Feminism',
    artist: 'Modern Visionary',
    description: 'A bold statement on contemporary feminine ideals expressed through vibrant artistic language',
    imageUrl: '/art-vault/bitch-3.jpeg',
    hall: 'contemporary',
    year: 2024,
    medium: 'Digital Painting'
  },
  {
    id: '4',
    title: 'Ethereal Beauty',
    artist: 'Renaissance Soul',
    description: 'Capturing the essence of timeless beauty with modern artistic techniques',
    imageUrl: '/art-vault/bitch-4.jpeg',
    hall: 'renaissance',
    year: 2024,
    medium: 'Digital Art'
  },
  {
    id: '5',
    title: 'Urban Goddess',
    artist: 'Street Poet',
    description: 'Where street art meets classical portraiture in a celebration of modern femininity',
    imageUrl: '/art-vault/bitch-5.jpeg',
    hall: 'modern',
    year: 2024,
    medium: 'Digital Collage'
  },
  {
    id: '6',
    title: 'Golden Hour Dreams',
    artist: 'Light Weaver',
    description: 'A mesmerizing play of light and shadow that captures the magic of golden hour',
    imageUrl: '/art-vault/bitch-6.jpeg',
    hall: 'contemporary',
    year: 2024,
    medium: 'Digital Photography'
  }
]);

// Define the Artwork interface
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
        Atelier Digital Art Sanctuary
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
            <img :src="artwork.imageUrl" :alt="artwork.title" class="w-full h-64 object-cover rounded-t-lg" />
          </div>
          <div class="renaissance-card-body">
            <h3 class="font-serif text-xl text-text mb-2">{{ artwork.title }}</h3>
            <p class="font-serif text-primary italic mb-3">{{ artwork.artist }}</p>
            <p class="text-sm text-text-muted">{{ artwork.description }}</p>
            <div class="flex gap-2 mt-4">
              <span v-if="artwork.year" class="renaissance-badge">{{ artwork.year }}</span>
              <span v-if="artwork.medium" class="renaissance-badge secondary">{{ artwork.medium }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
