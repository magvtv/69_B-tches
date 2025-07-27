<template>
  <div
    class="anti-scrape-layer"
    @contextmenu.prevent
    @dragstart.prevent
    @selectstart.prevent
    @copy.prevent
    @mousedown="trackMouseBehavior"
    @mousemove="trackMouseBehavior"
    @keydown="trackKeyboardBehavior"
  >
    <slot />
    <div class="protection-overlay" :class="{ active: isProtectionActive }"></div>
    <div v-if="showWatermark" class="watermark">
      <span>Atelier</span>
    </div>
    <div v-if="showWarning" class="scrape-warning">
      <div class="warning-content">
        <div class="warning-icon">⚠️</div>
        <p>Suspicious behavior detected.</p>
        <p class="warning-detail">This artwork is protected against unauthorized copying.</p>
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

<style scoped>
.anti-scrape-layer {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.protection-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5V0zm1 5v1H5v-1h1z'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0;
  transition: opacity 0.3s ease;
}

.protection-overlay.active {
  opacity: 1;
}

.watermark {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  color: var(--primary-color);
  opacity: 0.3;
  pointer-events: none;
  transform: rotate(-15deg);
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
}

.scrape-warning {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

.warning-content {
  background: var(--background-secondary);
  border: 1px solid var(--primary-color);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 80%;
}

.warning-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.warning-detail {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>