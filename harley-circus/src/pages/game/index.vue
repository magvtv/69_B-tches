<template>
  <div class="max-w-6xl mx-auto p-6 text-white">
    <h1 class="text-3xl font-extrabold mb-4">The Circus Levels</h1>
    <p class="text-gray-300 mb-6">Choose a level to play.</p>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      <router-link
        v-for="n in 5"
        :key="n"
        :to="`/game/level${n}`"
        class="block bg-black/40 border border-red-600/30 rounded-xl p-4 hover:bg-black/50 transition"
      >
        <p class="font-semibold">Level {{ n }}</p>
        <p class="text-sm text-gray-300">Enter</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Acts as the hub page for levels
</script>

<style scoped>
</style>


