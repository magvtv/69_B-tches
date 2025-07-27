<template>
  <header 
    class="sticky-header bg-background-secondary border-b border-border shadow-renaissance relative z-50 transition-all duration-300"
    :class="{ 'scrolled': isScrolled }"
  >
    <div class="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="no-underline hover:no-underline">
          <h1 class="font-display font-bold text-2xl text-primary tracking-wide transition-all duration-300"
              :class="{ 'text-xl': isScrolled }">Artelia</h1>
        </RouterLink>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-8">
        <RouterLink
          to="/"
          class="nav-link font-body text-lg text-text hover:text-primary transition-colors duration-300 relative pb-1"
          :class="{ 'text-primary': $route.path === '/' }"
        >
          Home
          <span class="nav-underline" :class="{ 'active': $route.path === '/' }"></span>
        </RouterLink>
        
        <RouterLink
          to="/gallery"
          class="nav-link font-body text-lg text-text hover:text-primary transition-colors duration-300 relative pb-1"
          :class="{ 'text-primary': $route.path.startsWith('/gallery') }"
        >
          Gallery
          <span class="nav-underline" :class="{ 'active': $route.path.startsWith('/gallery') }"></span>
        </RouterLink>
        
        <RouterLink
          to="/about"
          class="nav-link font-body text-lg text-text hover:text-primary transition-colors duration-300 relative pb-1"
          :class="{ 'text-primary': $route.path === '/about' }"
        >
          About
          <span class="nav-underline" :class="{ 'active': $route.path === '/about' }"></span>
        </RouterLink>
        
        <RouterLink
          to="/membership"
          class="nav-link font-body text-lg text-text hover:text-primary transition-colors duration-300 relative pb-1"
          :class="{ 'text-primary': $route.path === '/membership' }"
        >
          Membership
          <span class="nav-underline" :class="{ 'active': $route.path === '/membership' }"></span>
        </RouterLink>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-border">
          <RouterLink
            to="/auth/login"
            class="nav-link font-body text-lg text-text hover:text-primary transition-colors duration-300 relative pb-1"
            :class="{ 'text-primary': $route.path === '/auth/login' }"
          >
            Login
            <span class="nav-underline" :class="{ 'active': $route.path === '/auth/login' }"></span>
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
const isScrolled = ref(false);

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

// Handle scroll events for sticky navigation effects
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
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
  window.addEventListener('scroll', handleScroll);
  
  // Check initial scroll position
  handleScroll();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Sticky Navigation Styles */
.sticky-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.sticky-header.scrolled {
  background: rgba(30, 30, 30, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-bottom-color: rgba(212, 175, 55, 0.2);
}

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

/* Enhanced scroll effects */
.sticky-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.sticky-header.scrolled::before {
  opacity: 1;
}

/* Navigation link styles */
.nav-link {
  outline: none !important;
}

.nav-link:focus {
  outline: none !important;
  box-shadow: none !important;
}

.nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-link:hover .nav-underline {
  width: 100%;
}

.nav-underline.active {
  width: 100%;
}
</style>