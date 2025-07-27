<template>
  <div 
    class="relative w-full max-w-sm mx-auto transition-all duration-300 cursor-pointer group"
    :style="{ height: `${height + (showMeta ? 100 : 80)}px` }"
    @click="$emit('click', artwork)"
  >
    <div class="relative w-full overflow-hidden border-b border-border shadow-renaissance bg-background-tertiary rounded-t-lg"
         :style="{ height: `${height}px` }">
      <ProtectedImage
        :image-url="artwork.imageUrl"
        :width="width"
        :height="height"
        :protection-level="protectionLevel"
        :show-watermark="showWatermark"
      />
      <div class="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span class="px-6 py-2 text-lg font-serif text-primary border border-primary rounded">View Details</span>
      </div>
    </div>
    
    <div class="p-4 bg-background-tertiary rounded-b-lg">
      <h3 class="font-serif text-lg text-text mb-1">{{ artwork.title }}</h3>
      <p class="font-serif text-sm italic text-primary">{{ artwork.artist }}</p>
      
      <div v-if="showMeta" class="flex flex-wrap gap-2 mt-3">
        <span v-if="artwork.year" class="px-2 py-0.5 text-xs text-text-muted bg-background-secondary rounded">{{ artwork.year }}</span>
        <span v-if="artwork.medium" class="px-2 py-0.5 text-xs text-text-muted bg-background-secondary rounded">{{ artwork.medium }}</span>
        <span v-if="artwork.hall" class="px-2 py-0.5 text-xs text-primary border border-primary bg-transparent rounded">{{ artwork.hall }}</span>
      </div>
    </div>
    
    <!-- Gold accent on hover -->
    <div class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 transform -translate-x-1/2 group-hover:w-4/5"></div>
  </div>
</template>

<script setup lang="ts">

import ProtectedImage from '@/components/Protection/ProtectedImage.vue';
import type { Artwork } from '@/services/artworkService';


const props = defineProps({
  artwork: {
    type: Object as () => Artwork,
    required: true
  },
  width: {
    type: Number,
    default: 350
  },
  height: {
    type: Number,
    default: 450
  },
  protectionLevel: {
    type: String,
    default: 'basic',
    validator: (value: string) => ['basic', 'advanced', 'paranoid'].includes(value)
  },
  showWatermark: {
    type: Boolean,
    default: true
  },
  showMeta: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>