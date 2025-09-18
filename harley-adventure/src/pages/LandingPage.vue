<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <header class="mb-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div class="flex items-center gap-3">
          <img src="/images/logos/harley-quinn-logo.png" alt="Harley Quinn Logo" class="h-10 w-10 object-contain" />
          <h1 class="text-3xl font-extrabold">Harley</h1>
        </div>
      </header>

      <section class="grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div>
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Welcome To The Circus
          </h2>
          <p class="text-lg text-gray-200 mb-6">
            Five escalating levels across memories, music, memes, time, and a final real-world treasure. Built only for you.
          </p>
          <div class="flex justify-center md:justify-start">
            <router-link
              to="/game"
              class="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/30"
            >
              Let&apos;s Bang, Puddin!
            </router-link>
          </div>
        </div>
        <div class="relative">
          <div class="absolute inset-0 bg-white/10 rounded-3xl blur-2xl animate-pulse-slow"></div>
          <div class="relative bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-red-600/30">
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="text-red-400">1.</span>
                <div>
                  <p class="font-semibold">Our First Inside Joke</p>
                  <p class="text-gray-300 text-sm">Riddle with emoji codes from chat history</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">2.</span>
                <div>
                  <p class="font-semibold">The Song That Binds</p>
                  <p class="text-gray-300 text-sm">Lyric unscramble + voice verify</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">3.</span>
                <div>
                  <p class="font-semibold">Meme Drop</p>
                  <p class="text-gray-300 text-sm">Identify memes, spot hidden watermark</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">4.</span>
                <div>
                  <p class="font-semibold">Decrypt the Date</p>
                  <p class="text-gray-300 text-sm">Chronological puzzle with meta-data</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">5.</span>
                <div>
                  <p class="font-semibold">Final Quest</p>
                  <p class="text-gray-300 text-sm">Real-world QR reveal + final surprise</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
  
</template>

<script setup lang="ts">
// Landing page is static for now
</script>

<style scoped>
</style>


