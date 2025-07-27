<template>
  <header class="bg-background-secondary border-b border-border shadow-renaissance relative z-10">
    <div class="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="no-underline hover:no-underline">
          <h1 class="font-serif font-bold text-2xl text-primary tracking-wide">Atelier</h1>
        </RouterLink>
      </div>
      
      <nav class="flex items-center gap-8">
        <RouterLink
          to="/"
          class="font-serif text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/' }"
        >
          Home
        </RouterLink>
        
        <RouterLink
          to="/gallery"
          class="font-serif text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path.startsWith('/gallery') }"
        >
          Gallery
        </RouterLink>
        
        <RouterLink
          to="/about"
          class="font-serif text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/about' }"
        >
          About
        </RouterLink>
        
        <RouterLink
          to="/membership"
          class="font-serif text-lg text-text hover:text-primary transition-colors duration-300"
          :class="{ 'text-primary border-b-2 border-primary': $route.path === '/membership' }"
        >
          Membership
        </RouterLink>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-border">
          <RouterLink
            to="/auth/login"
            class="font-serif text-lg text-text hover:text-primary transition-colors duration-300"
            :class="{ 'text-primary border-b-2 border-primary': $route.path === '/auth/login' }"
          >
            Login
          </RouterLink>
          
          <RouterLink
            to="/auth/register"
            class="font-serif text-sm px-4 py-2 bg-transparent border border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-md"
          >
            Register
          </RouterLink>
        </div>
      </nav>
    </div>
    
    <!-- Gold accent line at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-50"></div>
  </header>
</template>

<script setup lang="ts">
// No script needed for basic header
</script>