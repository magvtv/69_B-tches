<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-red-900 to-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <header class="mb-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div class="flex items-center gap-3">
          <img src="/images/logos/harley-quinn-logo.png" alt="Harley Quinn Logo" class="h-10 w-10 object-contain" />
          <h1 class="text-3xl font-extrabold">Harley</h1>
        </div>
      </header>

      <section class="grid md:grid-cols-2 gap-8 md:gap-12 items-start text-center md:text-left">
        <div class="md:pr-6">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Welcome To The Circus
          </h2>
          <p class="text-lg text-gray-200 mb-6">
            If you rage-quit, I'll mock you forever.
            <br>
            Five escalating levels across memories, music, memes, time, and a final real-world treasure. 
            <br><br>
            Built only for you by <a href="https://github.com/magvtv" class="text-white">Joker</a>.
          </p>
          <div class="flex justify-center md:justify-start md:mt-2">
            <router-link
              to="/"
              class="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/30"
            >
              Let&apos;s Bang, Puddin!
            </router-link>
          </div>
        </div>
        <div class="relative md:h-full">
          <div class="absolute inset-0 bg-white/10 rounded-3xl blur-2xl animate-pulse-slow"></div>
          <div class="relative bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-red-600/30 md:h-full overflow-hidden">
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="text-red-400">1.</span>
                <div>
                  <p class="font-semibold">What is The Circus?</p>
                  <p class="text-gray-300 text-sm">
                    A timebombed birthday quest yenye itaselfdestruct if you do not finish it by Sunday 19th October 2025.
                    Curated such that you must do it only on your home WiFi. Anywhere else, it will auto-lock you out!
                    Besides, timebombs are your speciality.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">2.</span>
                <div>
                  <p class="font-semibold">Everything &amp; Anything</p>
                  <p class="text-gray-300 text-sm">
                    We share a lot in common. Swali ni: How well do you remember everything &amp; anything we have shared Boo?
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">3.</span>
                <div>
                  <p class="font-semibold">Films To Watch</p>
                  <p class="text-gray-300 text-sm">
                    Mwakenya yako ya kuelewa some of the references. Watch <i>Birds of Prey (2020)</i>,  <i>Suicide Squad (2016, 2021)</i>, <i>Harley (2016)</i> &amp; <i>Batman and Harley Quinn (2017)</i>
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">4.</span>
                <div>
                  <p class="font-semibold">Ati Akona Playlist?</p>
                  <p class="text-gray-300 text-sm">
                    Mi nilijaribu kukusaidia from day one hii sector. Every tune you have been spinning since you met Mr. J...
                    Zinakungoja on way or another
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-400">5.</span>
                <div>
                  <p class="font-semibold">Our Kind of Chaos</p>
                  <p class="text-gray-300 text-sm">
                    Candlelight dinners ama blowing up the dinner table and dancing on the ashes?
                    Love letters ama whispered madness in the dark?
                    Holding each other ama devouring each other
                  </p>
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


