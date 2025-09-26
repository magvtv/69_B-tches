<template>
  <div class="flex items-center gap-1">
    <div v-for="i in total" :key="i" class="w-2 h-4 rounded-sm"
      :class="i <= lit ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-gray-600'" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ lit: number; total: number }>()
</script>

<style scoped>
</style>


