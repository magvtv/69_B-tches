<template>
  <div class="gallery-view">
    <div class="gallery-header">
      <div class="container">
        <h1 class="gallery-title">Atelier Digital Art Sanctuary</h1>
        <p class="gallery-subtitle serif-text">A curated collection of contemporary feminist art with Renaissance aesthetics</p>
        
        <div class="gallery-filters">
          <div class="filter-group">
            <label for="hall-filter">Hall:</label>
            <select id="hall-filter" v-model="selectedHall" class="renaissance-select">
              <option value="all">All Halls</option>
              <option value="renaissance">Renaissance</option>
              <option value="contemporary">Contemporary</option>
              <option value="chiaroscuro">Chiaroscuro</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sort-filter">Sort By:</label>
            <select id="sort-filter" v-model="sortBy" class="renaissance-select">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
              <option value="artist">Artist</option>
            </select>
          </div>
          
          <div class="view-toggle">
            <button 
              class="view-toggle-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <span class="toggle-icon">▦</span>
            </button>
            <button 
              class="view-toggle-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <span class="toggle-icon">≡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="gallery-content container">
      <div v-if="loading" class="gallery-loading">
        <div class="loading-spinner"></div>
        <p>Loading exquisite artworks...</p>
      </div>
      
      <div v-else-if="filteredArtworks.length === 0" class="gallery-empty">
        <p>No artworks found in this hall.</p>
        <button class="renaissance-btn" @click="resetFilters">View All Halls</button>
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

<style scoped>
.gallery-view {
  min-height: 100vh;
}

.gallery-header {
  background: var(--background-secondary);
  padding: 3rem 0 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.gallery-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center;
}

.gallery-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 2rem;
  text-align: center;
}

.gallery-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: var(--background-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.renaissance-select {
  background: var(--background-primary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'Playfair Display', serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.renaissance-select:hover {
  border-color: var(--primary-color);
}

.renaissance-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle-btn {
  background: var(--background-primary);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle-btn.active {
  background: var(--primary-color);
  color: var(--background-primary);
  border-color: var(--primary-color);
}

.toggle-icon {
  font-size: 1.2rem;
}

.gallery-content {
  padding: 2rem 0;
}

.gallery-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--text-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.gallery-empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-muted);
}

.renaissance-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: 'Playfair Display', serif;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.renaissance-btn:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

@media (max-width: 768px) {
  .gallery-filters {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .view-toggle {
    align-self: center;
    margin-top: 0.5rem;
  }
  
  .gallery-title {
    font-size: 2rem;
  }
  
  .gallery-subtitle {
    font-size: 1rem;
  }
}
</style>