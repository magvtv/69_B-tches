<template>
  <div class="min-h-screen" :class="layoutBackgroundClass">
    <!-- Game Header -->
    <header class="backdrop-blur-sm sticky top-0 z-50" :class="headerClass">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <router-link to="/" class="flex items-center gap-3 group">
              <img :src="logoIcon" :alt="logoAlt" class="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h1 class="text-2xl text-white font-extrabold" :class="titleClass">{{ titleText }}</h1>
              </div>
            </router-link>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <router-link 
              to="/levels" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors dm-sans text-sm"
              :class="navLinkClass"
            >
              <CakeIcon class="h-4 w-4" />
              <span>Levels</span>
            </router-link>
            
            <!-- <router-link 
              to="/demo/quiz" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors dm-sans text-sm"
              :class="$route.path === '/demo/quiz' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' : 'text-gray-300 hover:text-yellow-300 hover:bg-yellow-600/10'"
            >
              <PlayIcon class="h-4 w-4" />
              <span>Demo Quiz</span>
            </router-link> -->
            
            <!-- <router-link 
              to="/demo/puzzle" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors dm-sans text-sm"
              :class="$route.path === '/demo/puzzle' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-gray-300 hover:text-purple-300 hover:bg-purple-600/10'"
            >
              <PuzzlePieceIcon class="h-4 w-4" />
              <span>Demo Puzzle</span>
            </router-link> -->
          </nav>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg transition-colors"
            :class="mobileMenuButtonClass"
          >
            <Bars3BottomRightIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pt-4" :class="mobileNavBorderClass">
          <nav class="flex flex-col gap-2">
            <router-link 
              to="/levels" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors dm-sans"
              :class="mobileNavLinkClass"
            >
              <CakeIcon class="h-5 w-5" />
              <span>Levels</span>
            </router-link>
            
            <!-- <router-link 
              to="/demo/quiz" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors dm-sans"
              :class="$route.path === '/game/level0' ? 'bg-yellow-600/20 text-yellow-300' : 'text-gray-300 hover:text-yellow-300 hover:bg-yellow-600/10'"
            >
              <PlayIcon class="h-5 w-5" />
              <span>Demo Quiz</span>
            </router-link> -->
            
            <!-- <router-link 
              to="/demo/puzzle" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors dm-sans"
              :class="$route.path === '/game/puzzle-demo' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300 hover:text-purple-300 hover:bg-purple-600/10'"
            >
              <PuzzlePieceIcon class="h-5 w-5" />
              <span>Demo Puzzle</span>
            </router-link> -->
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative">
      <slot />
    </main>

    <!-- Background Decoration -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-32 h-32 rounded-full animate-pulse-slow" :class="decorationClass1"></div>
      <div class="absolute top-40 right-20 w-24 h-24 rounded-full animate-twinkle" :class="decorationClass2"></div>
      <div class="absolute bottom-20 left-1/4 w-16 h-16 rounded-full animate-float" :class="decorationClass3"></div>
      <div class="absolute bottom-40 right-1/3 w-20 h-20 rounded-full animate-pulse-slow" :class="decorationClass4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { CakeIcon, Bars3BottomRightIcon, XMarkIcon} from '@heroicons/vue/24/solid'

// import { HomeIcon, PlayIcon Bars3BottomRightIcon, XMarkIcon, PuzzlePieceIcon } from '@heroicons/vue/24/solid'

// Component name for Vue linting
defineOptions({
  name: 'GameLayout'
})

const route = useRoute()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Detect if we're in a game level
const isGameLevel = computed(() => {
  return route.path.includes('/levels/') && route.path !== '/levels'
})

// Theme-aware computed properties
const layoutBackgroundClass = computed(() => {
  return isGameLevel.value 
    ? 'bg-gradient-to-br from-black via-purple-900 to-gray-900' 
    : 'bg-gradient-to-br from-black via-red-900 to-gray-900'
})

const headerClass = computed(() => {
  return isGameLevel.value
    ? 'bg-black/60 border-b border-purple-600/30'
    : 'bg-black/60 border-b border-red-600/30'
})

const logoIcon = computed(() => {
  return isGameLevel.value 
    ? '/images/logos/joker.png' 
    : '/images/logos/harley-quinn-logo.png'
})

const logoAlt = computed(() => {
  return isGameLevel.value ? 'Joker Logo' : 'Harley Quinn Logo'
})

const titleText = computed(() => {
  return 'Harley' // Always show Harley as the title
})

const titleClass = computed(() => {
  return 'text-white' // Always use white text for Harley
})

const navLinkClass = computed(() => {
  const isActive = route.path === '/levels'
  if (isGameLevel.value) {
    return isActive 
      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
      : 'text-gray-300 hover:text-purple-300 hover:bg-purple-600/10'
  } else {
    return isActive 
      ? 'bg-red-600/20 text-red-300 border border-red-500/30' 
      : 'text-gray-300 hover:text-red-300 hover:bg-red-600/10'
  }
})

const mobileNavLinkClass = computed(() => {
  const isActive = route.path === '/levels'
  if (isGameLevel.value) {
    return isActive 
      ? 'bg-purple-600/20 text-purple-300' 
      : 'text-gray-300 hover:text-purple-300 hover:bg-purple-600/10'
  } else {
    return isActive 
      ? 'bg-red-600/20 text-red-300' 
      : 'text-gray-300 hover:text-red-300 hover:bg-red-600/10'
  }
})

const mobileNavBorderClass = computed(() => {
  return isGameLevel.value 
    ? 'border-t border-purple-600/30' 
    : 'border-t border-red-600/30'
})

const mobileMenuButtonClass = computed(() => {
  return isGameLevel.value
    ? 'text-gray-300 hover:text-purple-300 hover:bg-purple-600/10'
    : 'text-gray-300 hover:text-red-300 hover:bg-red-600/10'
})

// Background decoration classes
const decorationClass1 = computed(() => {
  return isGameLevel.value ? 'bg-purple-500/5' : 'bg-red-500/5'
})

const decorationClass2 = computed(() => {
  return isGameLevel.value ? 'bg-green-500/5' : 'bg-yellow-500/5'
})

const decorationClass3 = computed(() => {
  return isGameLevel.value ? 'bg-purple-600/5' : 'bg-red-600/5'
})

const decorationClass4 = computed(() => {
  return isGameLevel.value ? 'bg-green-600/5' : 'bg-gray-500/5'
})
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
