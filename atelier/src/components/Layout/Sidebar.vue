<template>
  <aside class="site-sidebar">
    <slot />
  </aside>
</template>

<script setup lang="ts">
// No script needed for basic sidebar
</script>

<style scoped>
.site-sidebar {
  width: 260px;
  background: #f5f7fa;
  padding: 2rem 1rem;
  border-right: 1px solid #e0c3fc;
  min-height: 100vh;
}
</style> 