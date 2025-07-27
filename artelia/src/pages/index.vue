<template>
  <div>
    <HallNavigation :halls="halls" :activeHall="activeHall" @select="selectHall" />
    <GalleryGrid :artworks="filteredArtworks" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from '@vue/runtime-core';
import HallNavigation from '@/components/UI/HallNavigation.vue';
import GalleryGrid from '@/components/Gallery/GalleryGrid.vue';
import type { Artwork } from '@/services/artworkService';

const halls = ref([
  { id: 'renaissance', name: 'Renaissance' },
  { id: 'modern', name: 'Modern' },
  { id: 'contemporary', name: 'Contemporary' }
]);
const activeHall = ref('renaissance');
const artworks = ref<Artwork[]>([]);

onMounted(async () => {
  // TODO: Fetch from API - for now using empty array
  // artworks.value = await artworkService.getAllArtworks();
});

const filteredArtworks = computed(() =>
  artworks.value.filter(a => a.hall === activeHall.value)
);

function selectHall(hallId: string) {
  activeHall.value = hallId;
}
</script> 