<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
		<div class="mb-8">
			<h1 class="text-6xl md:text-8xl font-extrabold dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
				404
			</h1>
			<p class="mt-2 text-lg md:text-xl text-gray-300 dm-sans">Looks like you took a wrong turn in the circus.</p>
		</div>

		<div class="bg-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-red-600/20 max-w-xl w-full">
			<p class="dm-sans text-gray-300">The page you’re seeking vanished into the maze. Let’s guide you back to the show.</p>
			<div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
				<router-link
					to="/"
					class="w-full sm:w-auto bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-red-900/30 dm-sans"
				>
					Back Home
				</router-link>
				<router-link
					to="/game"
					class="w-full sm:w-auto border border-red-600/30 hover:border-red-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 dm-sans"
				>
					Explore Levels
				</router-link>
			</div>
		</div>

		<div class="mt-10 opacity-70">
			<p class="text-sm dm-sans">If you think this is a mistake, the Joker probably did it.</p>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
</style>
