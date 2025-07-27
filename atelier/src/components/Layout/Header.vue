<template>
  <header class="renaissance-header">
    <div class="header-content">
      <div class="logo-container">
        <!-- <img src="@/assets/logo.svg" alt="Logo" class="logo" /> -->
        <h1 class="site-title">Atelier</h1>
      </div>
      <nav>
        <slot />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// No script needed for basic header
</script>

<style scoped>
.renaissance-header {
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 48px;
  filter: brightness(0) invert(1);
}

.site-title {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0;
  color: var(--primary-color);
  letter-spacing: 1px;
}

nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* Gold accent line at bottom */
.renaissance-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gradient-gold);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  nav {
    justify-content: center;
    width: 100%;
  }
}
</style>