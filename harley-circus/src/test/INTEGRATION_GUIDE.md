# Supabase Backend Integration Guide

This guide explains how the Supabase backend integration works with your Harley Circus frontend.

## 🏗️ **Architecture Overview**

```
Frontend (Vue.js)          Backend (Supabase)
┌─────────────────┐       ┌─────────────────┐
│   Components    │  ──►  │   Database      │
│   (Memes.vue)   │       │   (PostgreSQL)  │
├─────────────────┤       ├─────────────────┤
│   Stores        │  ──►  │   Real-time     │
│   (Pinia)       │       │   Subscriptions │
├─────────────────┤       ├─────────────────┤
│   Services      │  ──►  │   Row Level     │
│   (Progress)    │       │   Security      │
└─────────────────┘       └─────────────────┘
```

## 🔄 **Data Flow**

### 1. **User Interaction Flow**
```
User Action → Component → Store → Service → Supabase → Database
     ↓              ↓        ↓        ↓         ↓
  Click Meme → Memes.vue → Pinia → Progress → API → Tables
```

### 2. **Real-time Updates**
```
Database Change → Supabase → Frontend → UI Update
     ↓              ↓          ↓         ↓
  New Reaction → WebSocket → Store → Component
```

## 📊 **Database Schema Integration**

### **Core Tables**
- **`users`** - User session management
- **`game_sessions`** - Level session tracking  
- **`level_progress`** - Step-by-step progress
- **`meme_reactions`** - Individual meme responses
- **`vibe_responses`** - Vibe check answers
- **`math_responses`** - Math problem attempts
- **`user_interactions`** - General event tracking

### **Data Relationships**
```
users (1) ──► (many) game_sessions
game_sessions (1) ──► (many) level_progress
game_sessions (1) ──► (many) meme_reactions
game_sessions (1) ──► (many) vibe_responses
game_sessions (1) ──► (many) math_responses
game_sessions (1) ──► (many) user_interactions
```

## 🎯 **Integration Points**

### **1. Component Level Integration**

#### **Before (Local Only)**
```vue
<script setup>
import { useMemeMazeStore } from '@/stores/memeMaze'

const store = useMemeMazeStore()
const { react } = store

function onReact(type) {
  react(type) // Only updates local state
}
</script>
```

#### **After (With Supabase)**
```vue
<script setup>
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'

const store = useMemeMazeSupabaseStore()
const { react } = store

async function onReact(type) {
  await react(type) // Updates local state + syncs to Supabase
}
</script>
```

### **2. Store Level Integration**

#### **Enhanced Store Features**
```typescript
// Automatic session management
await store.initializeSession()

// Progress tracking with timing
await store.react('laugh', 1500) // 1500ms reaction time

// Vibe response tracking
await store.recordVibeResponse('V00', 'What is your vibe?', 0, 'Excited!')

// Math problem tracking
await store.recordMathResponse(0, 'What is 15 + 8?', 23, 23, 3000)

// Progress restoration
await store.loadProgressFromSupabase()
```

### **3. Service Level Integration**

#### **Progress Service API**
```typescript
// Session Management
const userSession = await progressService.initializeSession()
const gameSession = await progressService.startGameSession('01-meme-maze')

// Data Recording
await progressService.recordMemeReaction(sessionId, memeIndex, reaction, timeMs)
await progressService.recordVibeResponse(sessionId, vibeId, question, optionId, text)
await progressService.recordMathResponse(sessionId, problemIndex, question, answer, userAnswer)

// Progress Updates
await progressService.updateLevelProgress(sessionId, levelSlug, step, completed, data)

// Data Retrieval
const progress = await progressService.getUserProgress('01-meme-maze')
```

## 🔧 **How It Works in Practice**

### **Step 1: User Visits Meme Maze**
```typescript
// Component mounts
onMounted(async () => {
  // Initialize Supabase session
  await store.initializeSession()
  
  // Load existing progress if any
  await store.loadProgressFromSupabase()
})
```

### **Step 2: User Reacts to Meme**
```typescript
async function onReact(type: 'laugh' | 'meh') {
  const startTime = Date.now()
  
  // Update local state immediately (for UI responsiveness)
  store.react(type)
  
  // Track in Supabase (happens in background)
  await store.react(type, Date.now() - startTime)
  
  // Update progress
  await store.trackProgress('memes', false, {
    currentIndex: store.state.currentIndex,
    laughsCount: store.state.laughsCount
  })
}
```

### **Step 3: Data Persistence**
```typescript
// Data is automatically saved to multiple tables:
// 1. meme_reactions - Individual reaction data
// 2. level_progress - Overall progress state
// 3. user_interactions - Event tracking
// 4. game_sessions - Session metadata
```

### **Step 4: Progress Restoration**
```typescript
// When user returns, progress is restored:
const progress = await progressService.getUserProgress('01-meme-maze')

// Restore meme reactions
progress.memeReactions?.forEach(reaction => {
  store.state.reactions[reaction.memeIndex] = reaction.reaction
})

// Restore progress state
store.state.currentIndex = progress.memeReactions?.length || 0
store.state.laughsCount = progress.memeReactions?.filter(r => r.reaction === 'laugh').length || 0
```

## 📈 **Analytics & Insights**

### **What Data is Collected**
- **User Behavior**: Reaction times, completion rates, drop-off points
- **Content Performance**: Which memes get more laughs, vibe check responses
- **Session Analytics**: Duration, completion status, interaction patterns
- **Error Tracking**: Failed operations, network issues, data inconsistencies

### **How to Access Analytics**
```typescript
// Get user progress
const progress = await progressService.getUserProgress('01-meme-maze')

// Analyze meme performance
const memeStats = progress.memeReactions?.reduce((acc, reaction) => {
  acc[reaction.memeIndex] = acc[reaction.memeIndex] || { laughs: 0, mehs: 0 }
  acc[reaction.memeIndex][reaction.reaction]++
  return acc
}, {})

// Calculate completion rate
const completionRate = progress.gameSession?.status === 'completed' ? 100 : 
  (progress.memeReactions?.length || 0) / 23 * 100
```

## 🚀 **Performance Optimizations**

### **1. Batch Operations**
```typescript
// Instead of individual calls
for (const reaction of reactions) {
  await progressService.recordMemeReaction(sessionId, reaction.index, reaction.type)
}

// Use batch operations
await progressService.recordBatchReactions(sessionId, reactions)
```

### **2. Local-First Strategy**
```typescript
// Update local state immediately
store.react(type)

// Sync to backend in background
setTimeout(() => {
  progressService.recordMemeReaction(sessionId, index, type)
}, 0)
```

### **3. Caching**
```typescript
// Cache progress data
const cachedProgress = localStorage.getItem('meme-maze-progress')
if (cachedProgress) {
  store.state = JSON.parse(cachedProgress)
}
```

## 🛡️ **Security & Privacy**

### **Row Level Security (RLS)**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view their own sessions"
ON game_sessions FOR SELECT
USING (auth.uid() = user_id);
```

### **Data Anonymization**
```typescript
// No personal data is stored
// Only session IDs and interaction data
// IP addresses and user agents are not logged
```

## 🔄 **Real-time Features**

### **Live Progress Updates**
```typescript
// Subscribe to real-time updates
const subscription = supabase
  .channel('progress-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'meme_reactions'
  }, (payload) => {
    // Update UI in real-time
    updateProgressDisplay(payload.new)
  })
  .subscribe()
```

### **Multi-device Sync**
```typescript
// Progress syncs across devices
// User can start on mobile, continue on desktop
const progress = await progressService.getUserProgress('01-meme-maze')
// Automatically restores state from any device
```

## 🧪 **Testing the Integration**

### **Run the Test Suite**
```typescript
import { runAllTests } from '@/test/supabase-integration.test'

// Run comprehensive tests
const success = await runAllTests()
console.log('Integration test result:', success)
```

### **Test Individual Components**
```typescript
// Test specific functionality
await testSupabaseIntegration()
await runPerformanceTest()
await cleanupTestData()
```

## 📱 **Frontend Integration Examples**

### **1. Memes Component**
```vue
<template>
  <div class="meme-container">
    <img :src="currentMeme.src" @load="onImageLoad" />
    <button @click="onReact('laugh')">Got me</button>
    <button @click="onReact('meh')">Meh</button>
    
    <!-- Progress indicator -->
    <div v-if="tracking.isInitialized" class="sync-status">
      Progress Synced
    </div>
  </div>
</template>

<script setup>
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'

const store = useMemeMazeSupabaseStore()
const { state, react, tracking } = store

async function onReact(type) {
  const startTime = Date.now()
  await react(type, Date.now() - startTime)
}
</script>
```

### **2. Vibe Check Component**
```vue
<script setup>
import { useSupabaseTracking } from '@/composables/useSupabaseTracking'

const tracking = useSupabaseTracking({
  levelSlug: '01-meme-maze',
  autoInitialize: true
})

async function onVibeResponse(option) {
  await tracking.trackVibeResponse(
    'V00',
    'What is your vibe?',
    option.id,
    option.text,
    option.explanation,
    responseTime
  )
}
</script>
```

## 🎯 **Key Benefits**

1. **Persistent Progress**: Users never lose their progress
2. **Cross-device Sync**: Continue on any device
3. **Analytics Ready**: Rich data for insights
4. **Real-time Updates**: Live progress tracking
5. **Scalable**: Easy to add new levels and features
6. **Secure**: Row-level security protects user data
7. **Performance**: Local-first with background sync

## 🚀 **Next Steps**

1. **Deploy the schema** to your Supabase project
2. **Set up environment variables** with your credentials
3. **Run the test suite** to verify everything works
4. **Integrate into your components** using the provided examples
5. **Monitor the data** in your Supabase dashboard

The integration is designed to be **non-intrusive** - your existing code continues to work while gaining powerful backend capabilities!
