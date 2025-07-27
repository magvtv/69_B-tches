<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" @click.self="close">
      <div class="bg-background-secondary border border-border rounded-lg max-w-6xl w-full max-h-[90vh] relative shadow-2xl overflow-hidden">
        <button class="absolute top-6 right-6 bg-transparent border-none z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-primary/10" @click="close">
          <span class="text-3xl text-primary leading-none">×</span>
        </button>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-hidden">
          <div class="bg-gray-900 p-4 md:p-8 flex items-center justify-center overflow-hidden">
            <div class="relative border border-border shadow-renaissance max-w-full max-h-[70vh] overflow-hidden" :style="{ transform: `scale(${zoomLevel || 1})` }">
              <ProtectedImage
                :image-url="artwork?.assets.original"
                :width="500"
                :height="600"
                protection-level="advanced"
                :show-watermark="true"
                @loaded="artworkLoaded = true"
                class="max-w-full max-h-full object-contain"
              />
              <div v-if="!artworkLoaded" class="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div class="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              <AntiScrapeLayer protection-level="advanced">
                <div class="absolute bottom-4 right-4 flex gap-2">
                  <button class="w-9 h-9 rounded-full bg-black/50 border border-primary text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-background-primary" @click.stop="() => zoomLevel = (zoomLevel || 1) * 1.2">+</button>
                  <button class="w-9 h-9 rounded-full bg-black/50 border border-primary text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-background-primary" @click.stop="() => zoomLevel = (zoomLevel || 1) / 1.2">-</button>
                </div>
              </AntiScrapeLayer>
            </div>
          </div>
          
          <div class="p-6 md:p-12 flex flex-col overflow-y-auto max-h-[90vh]">
            <h2 class="font-serif text-3xl md:text-4xl text-primary font-bold mb-2">{{ artwork.title }}</h2>
            <p class="font-serif text-lg text-text italic mb-8">{{ artwork.artist }}</p>
            
            <div class="w-16 h-0.5 bg-primary mb-8"></div>
            
            <div class="mb-8">
              <div v-if="artwork.year" class="flex justify-between py-2 border-b border-border">
                <span class="text-text-muted text-sm">Year:</span>
                <span class="text-text text-sm">{{ artwork.year }}</span>
              </div>
              <div v-if="artwork.medium" class="flex justify-between py-2 border-b border-border">
                <span class="text-text-muted text-sm">Medium:</span>
                <span class="text-text text-sm">{{ artwork.medium }}</span>
              </div>
              <div v-if="artwork.hall" class="flex justify-between py-2 border-b border-border">
                <span class="text-text-muted text-sm">Hall:</span>
                <span class="text-text text-sm">{{ artwork.hall }}</span>
              </div>
            </div>
            
            <div class="font-body text-text-muted leading-relaxed mb-8">
              <p>{{ artwork.description || 'This exquisite piece exemplifies the confluence of Renaissance techniques with contemporary digital artistry. The chiaroscuro lighting and classical composition pay homage to the masters, while the subject matter speaks to modern sensibilities.' }}</p>
            </div>
            
            <div class="mt-auto flex flex-col sm:flex-row gap-4">
              <RenaissanceButton @click="viewFullResolution" variant="primary">View in Full Resolution</RenaissanceButton>
              <RenaissanceButton @click="addToCollection" variant="primary" outline>Add to Collection</RenaissanceButton>
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
import type { Artwork } from '@/services/artworkService';

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