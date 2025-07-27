<template>
  <div class="w-full">
    <div v-if="artworks.length === 0" class="py-16 text-center text-text-muted italic w-full border border-dashed border-border rounded-lg">
      <p>No artworks available in this hall.</p>
    </div>
    
    <div v-else class="flex flex-col gap-6">
      <div 
        v-for="artwork in artworks" 
        :key="artwork.id" 
        class="grid grid-cols-1 md:grid-cols-[150px_1fr_auto] gap-6 p-6 bg-background-tertiary rounded-lg border border-border transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-renaissance hover:border-primary"
        @click="selectArtwork(artwork)"
      >
        <div class="w-full md:w-[150px] h-[150px] overflow-hidden rounded">
          <ProtectedImage 
            :image-url="artwork.imageUrl" 
            :width="150" 
            :height="150"
            protection-level="basic"
            :show-watermark="false"
          />
        </div>
        
        <div class="flex flex-col">
          <h3 class="font-serif text-xl text-text mb-2">{{ artwork.title }}</h3>
          <p class="font-serif text-primary italic mb-3">{{ artwork.artist }}</p>
          <p class="text-sm text-text-muted leading-relaxed mb-4">{{ truncateDescription(artwork.description) }}</p>
          
          <div class="flex gap-4 mt-auto">
            <span v-if="artwork.year" class="text-xs text-text-muted bg-background-secondary px-3 py-1 rounded">{{ artwork.year }}</span>
            <span v-if="artwork.medium" class="text-xs text-text-muted bg-background-secondary px-3 py-1 rounded">{{ artwork.medium }}</span>
            <span v-if="artwork.hall" class="text-xs text-primary border border-primary bg-transparent px-3 py-1 rounded">{{ artwork.hall }}</span>
          </div>
        </div>
        
        <div class="flex items-center md:justify-end">
          <button class="px-6 py-2 bg-transparent border border-primary text-primary rounded transition-all duration-300 hover:bg-primary hover:text-background-primary font-serif">
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

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
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
}
</script>