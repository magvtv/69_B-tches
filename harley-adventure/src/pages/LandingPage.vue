<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <header class="flex items-center justify-between mb-10">
        <h1 class="text-3xl font-extrabold">Harley</h1>
        <router-link
          to="/game"
          class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Start
        </router-link>
      </header>

      <section class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Joker welcomes you to the circus!
            <br>
            A birthday quest!
          </h2>
          <p class="text-lg text-gray-200 mb-6">
            Five escalating levels across memories, music, memes, time, and a final real-world treasure. Built only for you.
          </p>
          <div class="flex sm:justify-center gap-4">
            <router-link
              to="/game"
              class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Let&apos;s Begin
            </router-link>
          </div>
        </div>
        <div class="relative">
          <div class="absolute inset-0 bg-white/10 rounded-3xl blur-2xl animate-pulse-slow"></div>
          <div class="relative bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="text-pink-400">1.</span>
                <div>
                  <p class="font-semibold">Our First Inside Joke</p>
                  <p class="text-gray-300 text-sm">Riddle with emoji codes from chat history</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-pink-400">2.</span>
                <div>
                  <p class="font-semibold">The Song That Binds</p>
                  <p class="text-gray-300 text-sm">Lyric unscramble + voice verify</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-pink-400">3.</span>
                <div>
                  <p class="font-semibold">Meme Drop</p>
                  <p class="text-gray-300 text-sm">Identify memes, spot hidden watermark</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-pink-400">4.</span>
                <div>
                  <p class="font-semibold">Decrypt the Date</p>
                  <p class="text-gray-300 text-sm">Chronological puzzle with meta-data</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-pink-400">5.</span>
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


