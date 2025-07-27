<template>
  <div>
    <HallNavigation :halls="halls" :activeHall="activeHall" @select="selectHall" />
    <GalleryGrid :artworks="filteredArtworks" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HallNavigation from '@/components/UI/HallNavigation.vue';
import GalleryGrid from '@/components/Gallery/GalleryGrid.vue';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  hall: string;
}

const halls = ref([
  { id: 'renaissance', name: 'Renaissance' },
  { id: 'modern', name: 'Modern' },
  { id: 'contemporary', name: 'Contemporary' }
]);
const activeHall = ref('renaissance');
const artworks = ref<Artwork[]>([
  // TODO: Fetch from API
]);

const filteredArtworks = computed(() =>
  artworks.value.filter(a => a.hall === activeHall.value)
);

function selectHall(hallId: string) {
  activeHall.value = hallId;
}
</script> 