<template>
  <header class="bg-background-secondary border-b border-border shadow-renaissance relative z-10">
    <div class="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="no-underline hover:no-underline">
          <h1 class="font-display font-bold text-2xl text-primary tracking-wide">Artelia</h1>
        </RouterLink>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-8">
        <RouterLink
          to="/"
          class="font-body text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/' }"
        >
          Home
        </RouterLink>
        
        <RouterLink
          to="/gallery"
          class="font-body text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path.startsWith('/gallery') }"
        >
          Gallery
        </RouterLink>
        
        <RouterLink
          to="/about"
          class="font-body text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/about' }"
        >
          About
        </RouterLink>
        
        <RouterLink
          to="/membership"
          class="font-body text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/membership' }"
        >
          Membership
        </RouterLink>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-border">
          <RouterLink
            to="/auth/login"
            class="font-body text-lg text-text hover:text-primary transition-colors duration-300"
            :class="{ 'text-primary border-b-2 border-primary': $route.path === '/auth/login' }"
          >
            Login
          </RouterLink>
          
          <RouterLink
            to="/auth/register"
            class="font-body text-sm px-4 py-2 bg-transparent border border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-md"
          >
            Register
          </RouterLink>
        </div>
      </nav>

      <!-- Mobile Menu Toggle -->
      <button
        @click="toggleMobileMenu"
        class="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center group z-50"
        :class="{ 'menu-open': isMobileMenuOpen }"
        aria-label="Toggle mobile menu"
      >
        <!-- Hamburger Lines -->
        <span 
          class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out transform origin-center"
          :class="{ 'rotate-45 translate-y-1.5': isMobileMenuOpen }"
        ></span>
        <span 
          class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out mt-1.5 transform origin-center"
          :class="{ 'opacity-0 scale-0': isMobileMenuOpen }"
        ></span>
        <span 
          class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out mt-1.5 transform origin-center"
          :class="{ '-rotate-45 -translate-y-1.5': isMobileMenuOpen }"
        ></span>
        
        <!-- Decorative Elements -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary/30"></div>
          <div class="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary/30"></div>
          <div class="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary/30"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary/30"></div>
        </div>
      </button>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div 
      class="lg:hidden fixed inset-0 bg-background-primary/95 backdrop-blur-md z-40 transition-all duration-500 ease-in-out"
      :class="{ 'opacity-100 pointer-events-auto': isMobileMenuOpen, 'opacity-0 pointer-events-none': !isMobileMenuOpen }"
      @click="closeMobileMenu"
    >
      <!-- Mobile Menu Content -->
      <div 
        class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center"
        :class="{ 'translate-y-0': isMobileMenuOpen, 'translate-y-8': !isMobileMenuOpen }"
        style="transition: transform 0.5s ease-in-out 0.1s"
      >
        <!-- Decorative Border -->
        <div class="absolute inset-4 border border-primary/20 rounded-lg pointer-events-none"></div>
        
        <!-- Navigation Links -->
        <nav class="flex flex-col items-center gap-6 text-center">
          <RouterLink
            to="/"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-active': $route.path === '/' }"
            @click="closeMobileMenu"
          >
            <span class="text-3xl font-display text-primary">Home</span>
          </RouterLink>
          
          <RouterLink
            to="/gallery"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-active': $route.path.startsWith('/gallery') }"
            @click="closeMobileMenu"
          >
            <span class="text-3xl font-display text-primary">Gallery</span>
          </RouterLink>
          
          <RouterLink
            to="/about"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-active': $route.path === '/about' }"
            @click="closeMobileMenu"
          >
            <span class="text-3xl font-display text-primary">About</span>
          </RouterLink>
          
          <RouterLink
            to="/membership"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-active': $route.path === '/membership' }"
            @click="closeMobileMenu"
          >
            <span class="text-3xl font-display text-primary">Membership</span>
          </RouterLink>
        </nav>
        
        <!-- Auth Section -->
        <div class="mt-12 flex items-center gap-6">
          <div class="w-12 h-px bg-primary/30"></div>
          
          <RouterLink
            to="/auth/login"
            class="mobile-auth-link"
            :class="{ 'mobile-nav-active': $route.path === '/auth/login' }"
            @click="closeMobileMenu"
          >
            <span class="text-lg font-body text-text">Login</span>
          </RouterLink>
          
          <RouterLink
            to="/auth/register"
            class="mobile-auth-button"
            @click="closeMobileMenu"
          >
            <span class="text-lg font-body">Register</span>
          </RouterLink>
          
          <div class="w-12 h-px bg-primary/30"></div>
        </div>
        
        <!-- Decorative Elements -->
        <div class="absolute top-8 left-8 w-8 h-8 border border-primary/20 rounded-full"></div>
        <div class="absolute top-8 right-8 w-8 h-8 border border-primary/20 rounded-full"></div>
        <div class="absolute bottom-8 left-8 w-8 h-8 border border-primary/20 rounded-full"></div>
        <div class="absolute bottom-8 right-8 w-8 h-8 border border-primary/20 rounded-full"></div>
      </div>
    </div>
    
    <!-- Gold accent line at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-50"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Close menu on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Close menu on window resize (if switching to desktop)
const handleResize = () => {
  if (window.innerWidth >= 1024 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Mobile Navigation Styles */
.mobile-nav-link {
  @apply relative px-8 py-4 rounded-lg transition-all duration-300 ease-in-out;
  @apply hover:bg-primary/5 hover:scale-105;
  @apply transform-gpu;
  @apply min-w-[200px];
}

.mobile-nav-active {
  @apply bg-primary/10 border border-primary/30;
}

.mobile-auth-link {
  @apply px-6 py-3 text-text hover:text-primary transition-colors duration-300;
  @apply font-body;
}

.mobile-auth-button {
  @apply px-6 py-3 bg-transparent border border-primary text-primary rounded-md;
  @apply hover:bg-primary hover:text-background-primary transition-all duration-300;
  @apply font-body;
}

/* Hamburger Menu Animation Enhancements */
.menu-open {
  @apply transform-gpu;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .mobile-nav-link {
    @apply w-full max-w-xs;
  }
}

@media (max-width: 640px) {
  .mobile-nav-link {
    @apply px-6 py-3;
    @apply min-w-[180px];
  }
  
  .mobile-nav-link span {
    @apply text-2xl;
  }
}
</style>