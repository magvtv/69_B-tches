<template>
  <div class="test-container">
    <h2>Candles Reactivity Test</h2>
    
    <div class="test-section">
      <h3>Current State:</h3>
      <p>Current Index: {{ state.currentIndex }}</p>
      <p>Laughs Count: {{ state.laughsCount }}</p>
      <p>Candles Lit: {{ candlesLit }}</p>
      <p>Reactions: {{ state.reactions.filter(r => r === 'laugh').length }} laughs, {{ state.reactions.filter(r => r === 'meh').length }} mehs</p>
    </div>
    
    <div class="test-section">
      <h3>Candles Progress:</h3>
      <CandlesProgress :key="`test-candles-${candlesLit}`" :lit="candlesLit" :total="23" />
    </div>
    
    <div class="test-section">
      <h3>Test Buttons:</h3>
      <button @click="addLaugh" class="test-btn laugh-btn">Add Laugh</button>
      <button @click="addMeh" class="test-btn meh-btn">Add Meh</button>
      <button @click="reset" class="test-btn reset-btn">Reset</button>
    </div>
    
    <div class="test-section">
      <h3>Debug Logs:</h3>
      <div class="debug-logs">
        <div v-for="(log, index) in debugLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMemeMazeStore } from '@/stores/memeMaze'
import CandlesProgress from '@/shared/CandlesProgress.vue'

const memeMazeStore = useMemeMazeStore()
const { state, react, candlesLit, reset: resetStore } = memeMazeStore

const debugLogs = ref<string[]>([])

function addLog(message: string) {
  debugLogs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
  if (debugLogs.value.length > 10) {
    debugLogs.value.pop()
  }
}

function addLaugh() {
  react('laugh')
  addLog(`Added laugh - Candles: ${candlesLit}`)
}

function addMeh() {
  react('meh')
  addLog(`Added meh - Candles: ${candlesLit}`)
}

function reset() {
  resetStore()
  debugLogs.value = []
  addLog('Reset store')
}

// Watch for candles changes
watch(() => candlesLit, (newCount, oldCount) => {
  addLog(`Candles changed: ${oldCount} → ${newCount}`)
}, { immediate: true })

// Watch for reactions changes
watch(() => state.reactions, (newReactions) => {
  const laughs = newReactions.filter(r => r === 'laugh').length
  const mehs = newReactions.filter(r => r === 'meh').length
  addLog(`Reactions updated: ${laughs} laughs, ${mehs} mehs`)
}, { deep: true })
</script>

<style scoped>
.test-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'DM Sans', sans-serif;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-btn {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.laugh-btn {
  background: #22c55e;
  color: white;
}

.meh-btn {
  background: #6b7280;
  color: white;
}

.reset-btn {
  background: #ef4444;
  color: white;
}

.debug-logs {
  max-height: 200px;
  overflow-y: auto;
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}

.log-entry {
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  border-bottom: 1px solid #374151;
}

.log-entry:last-child {
  border-bottom: none;
}
</style>
