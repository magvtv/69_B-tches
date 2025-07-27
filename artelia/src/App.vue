<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Layout/Header.vue'
import Footer from '@/components/Layout/Footer.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.main-content {
  flex: 1;
  background: var(--background-primary);
  padding: 2rem 0;
  position: relative;
  min-height: calc(100vh - 200px); /* Accounting for header and footer */
}
</style>
