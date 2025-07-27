<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" @click.self="close">
      <div class="bg-background-secondary border border-border rounded-lg max-w-6xl w-full max-h-[90vh] relative shadow-2xl overflow-hidden">
        <button class="absolute top-6 right-6 bg-transparent border-none z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-primary/10" @click="close">
          <span class="text-3xl text-primary leading-none">×</span>
        </button>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-hidden">
          <div class="bg-gray-900 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            <div 
              ref="imageContainer"
              class="relative border border-border shadow-renaissance w-full h-[70vh] overflow-hidden cursor-move"
              @mousedown="startPan"
              @mousemove="pan"
              @mouseup="endPan"
              @mouseleave="endPan"
              @touchstart="startPanTouch"
              @touchmove="panTouch"
              @touchend="endPan"
              @wheel="handleWheel"
            >
              <div 
                ref="imageWrapper"
                class="absolute inset-0 transition-transform duration-200 ease-out"
                :style="{ 
                  transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center'
                }"
              >
                <ProtectedImage
                  :image-url="artwork.imageUrl"
                  :width="500"
                  :height="600"
                  protection-level="advanced"
                  :show-watermark="true"
                  @loaded="artworkLoaded = true"
                  class="w-full h-full object-contain pointer-events-none"
                />
              </div>
              
              <div v-if="!artworkLoaded" class="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div class="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              
              <AntiScrapeLayer protection-level="advanced">
                <div class="absolute bottom-4 right-4 flex gap-2 z-10">
                  <button 
                    class="w-9 h-9 rounded-full bg-black/80 border border-primary text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-background-primary" 
                    @click.stop="zoomIn"
                    :disabled="zoomLevel >= maxZoom"
                  >
                    +
                  </button>
                  <button 
                    class="w-9 h-9 rounded-full bg-black/80 border border-primary text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-background-primary" 
                    @click.stop="zoomOut"
                    :disabled="zoomLevel <= minZoom"
                  >
                    -
                  </button>
                  <button 
                    class="w-9 h-9 rounded-full bg-black/80 border border-primary text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-background-primary" 
                    @click.stop="resetZoom"
                    title="Reset zoom"
                  >
                    ⌂
                  </button>
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
import { ref, onMounted, onUnmounted } from 'vue';
import RenaissanceButton from '../UI/RenaissanceButton.vue';
import ProtectedImage from '@/components/Protection/ProtectedImage.vue';
import AntiScrapeLayer from '@/components/Protection/AntiScrapeLayer.vue';

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

const props = defineProps<{
  visible: boolean;
  artwork: Artwork;
}>();

const emit = defineEmits(['close']);
const artworkLoaded = ref(false);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });
const imageContainer = ref<HTMLElement | null>(null);
const imageWrapper = ref<HTMLElement | null>(null);

// Zoom constraints
const minZoom = 0.5;
const maxZoom = 3;
const zoomStep = 0.2;

function close() {
  emit('close');
  resetZoom();
}

function zoomIn() {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(maxZoom, zoomLevel.value + zoomStep);
    constrainPan();
  }
}

function zoomOut() {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(minZoom, zoomLevel.value - zoomStep);
    constrainPan();
  }
}

function resetZoom() {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
}

function handleWheel(event: WheelEvent) {
  event.preventDefault();
  
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

function startPan(event: MouseEvent) {
  if (zoomLevel.value <= 1) return;
  
  isPanning.value = true;
  lastPanPoint.value = { x: event.clientX, y: event.clientY };
  
  if (imageContainer.value) {
    imageContainer.value.style.cursor = 'grabbing';
  }
}

function pan(event: MouseEvent) {
  if (!isPanning.value || zoomLevel.value <= 1) return;
  
  const deltaX = event.clientX - lastPanPoint.value.x;
  const deltaY = event.clientY - lastPanPoint.value.y;
  
  panX.value += deltaX;
  panY.value += deltaY;
  
  lastPanPoint.value = { x: event.clientX, y: event.clientY };
  
  constrainPan();
}

function endPan() {
  isPanning.value = false;
  
  if (imageContainer.value) {
    imageContainer.value.style.cursor = zoomLevel.value > 1 ? 'move' : 'default';
  }
}

// Touch support
function startPanTouch(event: TouchEvent) {
  if (zoomLevel.value <= 1 || event.touches.length !== 1) return;
  
  event.preventDefault();
  isPanning.value = true;
  const touch = event.touches[0];
  lastPanPoint.value = { x: touch.clientX, y: touch.clientY };
}

function panTouch(event: TouchEvent) {
  if (!isPanning.value || zoomLevel.value <= 1 || event.touches.length !== 1) return;
  
  event.preventDefault();
  const touch = event.touches[0];
  const deltaX = touch.clientX - lastPanPoint.value.x;
  const deltaY = touch.clientY - lastPanPoint.value.y;
  
  panX.value += deltaX;
  panY.value += deltaY;
  
  lastPanPoint.value = { x: touch.clientX, y: touch.clientY };
  
  constrainPan();
}

function constrainPan() {
  if (!imageContainer.value) return;
  
  const containerRect = imageContainer.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  
  // Calculate the scaled image dimensions
  const scaledWidth = containerWidth * zoomLevel.value;
  const scaledHeight = containerHeight * zoomLevel.value;
  
  // Calculate maximum pan distances
  const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
  const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);
  
  // Constrain pan values
  panX.value = Math.max(-maxPanX, Math.min(maxPanX, panX.value));
  panY.value = Math.max(-maxPanY, Math.min(maxPanY, panY.value));
}

// Keyboard shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (!props.visible) return;
  
  switch (event.key) {
    case '+':
    case '=':
      event.preventDefault();
      zoomIn();
      break;
    case '-':
      event.preventDefault();
      zoomOut();
      break;
    case '0':
      event.preventDefault();
      resetZoom();
      break;
    case 'Escape':
      close();
      break;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

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