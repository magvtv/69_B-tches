<template>
  <div
    class="relative w-full h-full select-none"
    @contextmenu.prevent
    @dragstart.prevent
    @selectstart.prevent
    @copy.prevent
    @mousedown="trackMouseBehavior"
    @mousemove="trackMouseBehavior"
    @keydown="trackKeyboardBehavior"
  >
    <slot />
    <div 
      class="absolute inset-0 pointer-events-none bg-pattern-protection transition-opacity duration-300"
      :class="{ 'opacity-100': isProtectionActive, 'opacity-0': !isProtectionActive }"
    ></div>
    <div v-if="showWatermark" class="absolute bottom-2.5 right-2.5 font-serif text-sm text-primary opacity-30 pointer-events-none transform -rotate-15 shadow-sm">
      <span>Atelier</span>
    </div>
    <div v-if="showWarning" class="absolute inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
      <div class="bg-background-secondary border border-primary p-8 rounded-lg text-center max-w-[80%]">
        <div class="text-3xl mb-4">⚠️</div>
        <p class="mb-2">Suspicious behavior detected.</p>
        <p class="text-sm text-text-muted">This artwork is protected against unauthorized copying.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  protectionLevel: {
    type: String,
    default: 'basic', // 'basic', 'advanced', 'paranoid'
    validator: (value: string) => ['basic', 'advanced', 'paranoid'].includes(value)
  },
  showWatermark: {
    type: Boolean,
    default: true
  }
});

const isProtectionActive = ref(true);
const showWarning = ref(false);
const mouseEvents = ref<{x: number, y: number, timestamp: number}[]>([]);
const keyEvents = ref<{key: string, timestamp: number}[]>([]);

// Track mouse behavior for bot detection
function trackMouseBehavior(event: MouseEvent) {
  mouseEvents.value.push({
    x: event.clientX,
    y: event.clientY,
    timestamp: Date.now()
  });
  
  // Keep only the last 20 events
  if (mouseEvents.value.length > 20) {
    mouseEvents.value.shift();
  }
  
  // Analyze mouse behavior
  analyzeMouseBehavior();
}

// Track keyboard behavior for bot detection
function trackKeyboardBehavior(event: KeyboardEvent) {
  // Check for screenshot attempts
  if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'PrintScreen')) {
    triggerWarning();
    event.preventDefault();
    return;
  }
  
  keyEvents.value.push({
    key: event.key,
    timestamp: Date.now()
  });
  
  // Keep only the last 10 events
  if (keyEvents.value.length > 10) {
    keyEvents.value.shift();
  }
}

// Analyze mouse behavior for bot detection
function analyzeMouseBehavior() {
  if (mouseEvents.value.length < 5) return;
  
  // Check for perfectly straight lines (bot behavior)
  let straightLineCount = 0;
  for (let i = 2; i < mouseEvents.value.length; i++) {
    const p1 = mouseEvents.value[i-2];
    const p2 = mouseEvents.value[i-1];
    const p3 = mouseEvents.value[i];
    
    // Calculate if three points are in a straight line
    const slope1 = p1.x !== p2.x ? (p2.y - p1.y) / (p2.x - p1.x) : Infinity;
    const slope2 = p2.x !== p3.x ? (p3.y - p2.y) / (p3.x - p2.x) : Infinity;
    
    if (Math.abs(slope1 - slope2) < 0.01) {
      straightLineCount++;
    }
  }
  
  // If too many straight lines, trigger warning
  if (straightLineCount > 3) {
    triggerWarning();
  }
  
  // Check for unnaturally consistent timing (bot behavior)
  const timeDiffs = [];
  for (let i = 1; i < mouseEvents.value.length; i++) {
    timeDiffs.push(mouseEvents.value[i].timestamp - mouseEvents.value[i-1].timestamp);
  }
  
  // Calculate standard deviation of time differences
  const avg = timeDiffs.reduce((sum, val) => sum + val, 0) / timeDiffs.length;
  const variance = timeDiffs.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / timeDiffs.length;
  const stdDev = Math.sqrt(variance);
  
  // If timing is too consistent (low standard deviation), trigger warning
  if (stdDev < 5 && timeDiffs.length > 5) {
    triggerWarning();
  }
}

function triggerWarning() {
  showWarning.value = true;
  
  // Hide warning after 3 seconds
  setTimeout(() => {
    showWarning.value = false;
  }, 3000);
}

onMounted(() => {
  // Add global event listeners
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  // Remove global event listeners
  window.removeEventListener('keydown', handleGlobalKeydown);
});

function handleGlobalKeydown(event: KeyboardEvent) {
  // Detect screenshot attempts
  if (event.key === 'PrintScreen' ||
      ((event.ctrlKey || event.metaKey) && event.key === 'c') ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 's')) {
    triggerWarning();
  }
}
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
</style>