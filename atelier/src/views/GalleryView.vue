<template>
  <div class="min-h-screen">
    <div class="bg-background-secondary py-12 md:py-16 mb-8 border-b border-border">
      <div class="container">
        <h1 class="font-serif text-4xl md:text-5xl text-primary font-bold tracking-wide text-center mb-4">
          Atelier Digital Art Sanctuary
        </h1>
        <p class="font-serif text-lg text-text-muted max-w-3xl mx-auto text-center mb-8">
          A curated collection of contemporary feminine art with Renaissance aesthetics
        </p>
        
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 p-4 bg-background-tertiary rounded-lg border border-border">
          <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div class="flex items-center gap-2 w-full md:w-auto">
              <label for="hall-filter" class="text-text-muted text-sm">Hall:</label>
              <select 
                id="hall-filter" 
                v-model="selectedHall" 
                class="bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded font-serif cursor-pointer transition-all duration-300 hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 w-full md:w-auto"
              >
                <option value="all">All Halls</option>
                <option value="renaissance">Renaissance</option>
                <option value="contemporary">Contemporary</option>
                <option value="chiaroscuro">Chiaroscuro</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2 w-full md:w-auto">
              <label for="sort-filter" class="text-text-muted text-sm">Sort By:</label>
              <select 
                id="sort-filter" 
                v-model="sortBy" 
                class="bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded font-serif cursor-pointer transition-all duration-300 hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 w-full md:w-auto"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-2 self-center md:self-auto">
            <button 
              class="w-10 h-10 flex items-center justify-center bg-gray-900 text-gray-400 border border-gray-600 rounded transition-all duration-300"
              :class="{ 'bg-yellow-500 text-gray-900 border-yellow-500': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <span class="text-xl">▦</span>
            </button>
            <button 
              class="w-10 h-10 flex items-center justify-center bg-gray-900 text-gray-400 border border-gray-600 rounded transition-all duration-300"
              :class="{ 'bg-yellow-500 text-gray-900 border-yellow-500': viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <span class="text-xl">≡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container py-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-text-muted">
        <div class="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Loading exquisite artworks...</p>
      </div>
      
      <div v-else-if="filteredArtworks.length === 0" class="text-center py-16 text-text-muted">
        <p>No artworks found in this hall.</p>
        <button 
          class="mt-4 px-6 py-3 bg-transparent border border-primary text-primary rounded-md font-serif transition-all duration-300 hover:bg-primary hover:text-background-primary"
          @click="resetFilters"
        >
          View All Halls
        </button>
      </div>
      
      <GalleryGrid 
        v-else-if="viewMode === 'grid'"
        :artworks="filteredArtworks" 
        @select-artwork="openArtworkModal"
      />
      
      <GalleryList
        v-else
        :artworks="filteredArtworks"
        @select-artwork="openArtworkModal"
      />
    </div>
    
    <ArtworkModal
      v-if="selectedArtwork"
      :visible="!!selectedArtwork"
      :artwork="selectedArtwork"
      @close="selectedArtwork = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GalleryGrid from '@/components/Gallery/GalleryGrid.vue';
import GalleryList from '@/components/Gallery/GalleryList.vue';
import ArtworkModal from '@/components/Gallery/ArtworkModal.vue';

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

const artworks = ref<Artwork[]>([]);
const loading = ref(true);
const selectedArtwork = ref<Artwork | null>(null);
const selectedHall = ref('all');
const sortBy = ref('newest');
const viewMode = ref('grid');

// Filter artworks based on selected hall
const filteredArtworks = computed(() => {
  let filtered = [...artworks.value];
  
  // Apply hall filter
  if (selectedHall.value !== 'all') {
    filtered = filtered.filter(artwork => artwork.hall === selectedHall.value);
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
      break;
    case 'oldest':
      filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'artist':
      filtered.sort((a, b) => a.artist.localeCompare(b.artist));
      break;
  }
  
  return filtered;
});

function resetFilters() {
  selectedHall.value = 'all';
  sortBy.value = 'newest';
}

function openArtworkModal(artwork: Artwork) {
  selectedArtwork.value = artwork;
}

// Load artworks from the art-vault directory
onMounted(async () => {
  // In a real app, this would be an API call
  // For now, we'll create sample data based on the art-vault files
  
  // Simulate loading delay
  setTimeout(() => {
    const artworkData: Artwork[] = [];
    
    // Generate 20 sample artworks based on the files in art-vault
    for (let i = 1; i <= 20; i++) {
      const halls = ['renaissance', 'contemporary', 'chiaroscuro'];
      const randomHall = halls[Math.floor(Math.random() * halls.length)];
      const randomYear = 2020 + Math.floor(Math.random() * 5);
      
      artworkData.push({
        id: i.toString(),
        title: `Artwork ${i}`,
        artist: `Artist ${Math.ceil(i/3)}`,
        description: 'This exquisite piece exemplifies the confluence of Renaissance techniques with contemporary digital artistry. The chiaroscuro lighting and classical composition pay homage to the masters, while the subject matter speaks to modern sensibilities.',
        imageUrl: `/art-vault/bitch-${i}.jpeg`,
        hall: randomHall,
        year: randomYear,
        medium: 'Digital Art'
      });
    }
    
    artworks.value = artworkData;
    loading.value = false;
  }, 1000);
});
</script>