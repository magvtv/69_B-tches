<template>
  <div 
    class="relative overflow-hidden rounded"
    :style="{ width: `${width}px`, height: `${height}px` }"
    @contextmenu.prevent
    @dragstart.prevent
    @selectstart.prevent
  >
    <canvas ref="canvasRef" :width="width" :height="height" class="block w-full h-full" />
    
    <div 
      class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 ease-in-out bg-pattern-protection"
      :class="{ 'opacity-100': protectionActive }"
    ></div>
    
    <div v-if="showWatermark" class="absolute bottom-2.5 right-2.5 font-serif text-sm text-primary opacity-30 pointer-events-none transform -rotate-15 shadow-sm">
      <span>Artelia</span>
    </div>
    
    <div v-if="debug" class="absolute top-2.5 left-2.5 bg-black/50 text-primary px-2 py-1 rounded text-xs pointer-events-none">
      {{ protectionLevel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';

interface ProtectionConfig {
  noiseLevel: number;
  segmentCount: number;
  overlayComplexity: number;
}

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 500
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
  debug: {
    type: Boolean,
    default: false
  }
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const protectionActive = ref(false);
const imageLoaded = ref(false);

// Protection configuration based on level
const protectionConfig = computed<ProtectionConfig>(() => {
  switch (props.protectionLevel) {
    case 'paranoid':
      return { noiseLevel: 0.3, segmentCount: 64, overlayComplexity: 0.8 };
    case 'advanced':
      return { noiseLevel: 0.2, segmentCount: 32, overlayComplexity: 0.5 };
    case 'basic':
    default:
      return { noiseLevel: 0.1, segmentCount: 16, overlayComplexity: 0.3 };
  }
});

// Expose loaded state to parent components
const emit = defineEmits(['loaded', 'error']);

onMounted(() => {
  renderProtectedImage();
});

watch(() => props.imageUrl, renderProtectedImage);
watch(() => props.protectionLevel, renderProtectedImage);

async function renderProtectedImage() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;
  
  imageLoaded.value = false;
  
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = props.imageUrl;
  
  img.onload = () => {
    // Clear canvas
    ctx.clearRect(0, 0, props.width, props.height);
    
    // Draw image with proper sizing
    const aspectRatio = img.width / img.height;
    let drawWidth = props.width;
    let drawHeight = props.height;
    
    if (aspectRatio > 1) {
      // Landscape
      drawHeight = props.width / aspectRatio;
    } else {
      // Portrait
      drawWidth = props.height * aspectRatio;
    }
    
    const x = (props.width - drawWidth) / 2;
    const y = (props.height - drawHeight) / 2;
    
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    
    // Apply protection techniques
    applyNoiseInjection(ctx);
    applyVignette(ctx);
    applySegmentation(ctx);
    
    // Activate protection overlay
    protectionActive.value = true;
    imageLoaded.value = true;
    
    // Emit loaded event
    emit('loaded');
  };
  
  img.onerror = (error) => {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, props.width, props.height);
    ctx.fillStyle = '#d4af37';
    ctx.font = '16px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Artwork not available', props.width / 2, props.height / 2);
    
    // Emit error event
    emit('error', error);
  };
}

// Protection techniques
function applyNoiseInjection(ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, props.width, props.height);
  const data = imageData.data;
  const noiseLevel = protectionConfig.value.noiseLevel * 25; // Scale to 0-25 range
  
  // Apply subtle noise to make scraping harder
  for (let i = 0; i < data.length; i += 4) {
    // Generate unique noise for each pixel
    const noise = (Math.random() - 0.5) * noiseLevel;
    
    // Apply noise to RGB channels
    data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function applyVignette(ctx: CanvasRenderingContext2D) {
  // Create radial gradient for vignette effect
  const gradient = ctx.createRadialGradient(
    props.width / 2, props.height / 2, props.height * 0.3,
    props.width / 2, props.height / 2, props.height * 0.8
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
  
  // Apply gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, props.width, props.height);
}

function applySegmentation(ctx: CanvasRenderingContext2D) {
  // Add subtle grid pattern based on segment count
  const segmentSize = props.width / protectionConfig.value.segmentCount;
  
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.03)';
  ctx.lineWidth = 0.5;
  
  // Draw vertical lines
  for (let x = 0; x < props.width; x += segmentSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, props.height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y < props.height; y += segmentSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(props.width, y);
    ctx.stroke();
  }
}
</script>

<style>
/* Add this to your global CSS or in a component where it's needed */
.bg-pattern-protection {
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5V0zm1 5v1H5v-1h1z'/%3E%3C/g%3E%3C/svg%3E");
}
</style>