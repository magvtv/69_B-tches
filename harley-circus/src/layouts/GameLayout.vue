<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-gray-900">
    <!-- Game Header -->
    <header class="bg-black/60 backdrop-blur-sm border-b border-red-600/30 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <router-link to="/" class="flex items-center gap-3 group">
              <img src="/images/logos/harley-quinn-logo.png" alt="Harley Quinn Logo" class="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h1 class="text-2xl text-white font-extrabold">Harley</h1>
              </div>
            </router-link>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <router-link 
              to="/levels" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors dm-sans text-sm"
              :class="$route.path === '/levels' ? 'bg-red-600/20 text-red-300 border border-red-500/30' : 'text-gray-300 hover:text-red-300 hover:bg-red-600/10'"
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
            class="md:hidden p-2 rounded-lg text-gray-300 hover:text-red-300 hover:bg-red-600/10 transition-colors"
          >
            <Bars3BottomRightIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pt-4 border-t border-red-600/30">
          <nav class="flex flex-col gap-2">
            <router-link 
              to="/levels" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors dm-sans"
              :class="$route.path === '/levels' ? 'bg-red-600/20 text-red-300' : 'text-gray-300 hover:text-red-300 hover:bg-red-600/10'"
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
      <div class="absolute top-20 left-10 w-32 h-32 bg-red-500/5 rounded-full animate-pulse-slow"></div>
      <div class="absolute top-40 right-20 w-24 h-24 bg-yellow-500/5 rounded-full animate-twinkle"></div>
      <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-red-600/5 rounded-full animate-float"></div>
      <div class="absolute bottom-40 right-1/3 w-20 h-20 bg-gray-500/5 rounded-full animate-pulse-slow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CakeIcon, Bars3BottomRightIcon, XMarkIcon} from '@heroicons/vue/24/solid'

// import { HomeIcon, PlayIcon Bars3BottomRightIcon, XMarkIcon, PuzzlePieceIcon } from '@heroicons/vue/24/solid'

// Component name for Vue linting
defineOptions({
  name: 'GameLayout'
})

// Mobile menu state
const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
