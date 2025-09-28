<template>
    <div class="relative min-h-screen flex flex-col items-center justify-center px-6 text-center text-white overflow-hidden morph-bg" :style="bgStyle">
        <!-- Glitch overlay -->
        <div class="pointer-events-none absolute inset-0">
            <div class="absolute inset-0 bg-[#6A0DAD]/10 animate-glitch-purple mix-blend-screen"></div>
            <div class="absolute inset-0 bg-[#39FF14]/10 animate-glitch-green mix-blend-screen"></div>
        </div>

        <div class="mb-8 flex flex-col items-center relative z-10">
            <img 
                src="/images/logos/joker.png" 
                alt="Joker grinning"
                class="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_8px_20px_rgba(220,38,38,0.35)] mb-4"
            />
            
            <div class="relative mt-4">
                <h1 class="select-none text-6xl md:text-8xl font-extrabold tracking-tight rotate-[-2deg]" 
                    style="text-shadow: 0 0 6px rgba(229,9,20,0.4); color: #E50914;">
                    4<span class="inline-block -mx-1 rotate-[3deg]">0</span>4
                </h1>
                <div class="absolute inset-0 blur-[1px] opacity-50 pointer-events-none">
                    <h1 class="text-6xl md:text-8xl font-extrabold rotate-[-2deg]" style="color:#B22222; transform: translate(2px, -1px);">404</h1>
                </div>
            </div>
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
					to="/levels"
					class="w-full sm:w-auto border border-red-600/30 hover:border-red-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 dm-sans"
				>
					Explore Levels
				</router-link>
                <button
                    @click="tryAgain"
                    class="w-full sm:w-auto border border-[#6A0DAD]/40 hover:border-[#39FF14] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 dm-sans"
                >
                    Try again?
                </button>
			</div>
		</div>

		<div class="mt-10 opacity-70">
			<p class="text-sm dm-sans">If you think this is a mistake, the Joker probably did it.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const taunts = [
    'Oopsieee… Harley, you broke it. Or did I?',
    '404: This joke went too far.',
    'You weren’t supposed to get here. But chaos… is fair.'
]

const message = ref(taunts[0])

onMounted(() => {
    message.value = taunts[Math.floor(Math.random() * taunts.length)]
})

function tryAgain() {
    window.location.reload()
}

// Background PNGs for smooth crossfade
const harleyUrl = '/images/backgrounds/harley.png'
const jokerUrl = '/images/backgrounds/joker.png'

const bgStyle = computed(() => ({
    '--bg-harley': `url('${harleyUrl}')`,
    '--bg-joker': `url('${jokerUrl}')`,
}))
</script>

<style scoped>
/* Full-bleed PNG crossfade with theme colors */
.morph-bg {
    position: relative;
}
.morph-bg::before,
.morph-bg::after {
    content: "";
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: opacity 1.4s ease-in-out, filter 1.4s ease-in-out;
    z-index: 0;
}
.morph-bg::before {
    background-image: var(--bg-harley);
    /* Harley palette tint */
    filter: saturate(1.05) hue-rotate(-10deg) brightness(0.95);
    opacity: 1;
}
.morph-bg::after {
    background-image: var(--bg-joker);
    /* Joker palette tint */
    filter: saturate(1.1) hue-rotate(35deg) brightness(0.9);
    opacity: 0;
}
.morph-bg:hover::after { opacity: 1; }
.morph-bg:hover::before { opacity: 0; }

/* Content always above */
.morph-bg > * { position: relative; z-index: 10; }

@keyframes glitchPurple {
	0%, 100% { transform: translate(0,0); opacity: 0.4; }
	20% { transform: translate(-2px, 1px); opacity: 0.25; }
	40% { transform: translate(2px, -1px); opacity: 0.35; }
	60% { transform: translate(-1px, -2px); opacity: 0.2; }
	80% { transform: translate(1px, 2px); opacity: 0.3; }
}
@keyframes glitchGreen {
	0%, 100% { transform: translate(0,0); opacity: 0.35; }
	20% { transform: translate(2px, -1px); opacity: 0.2; }
	40% { transform: translate(-2px, 1px); opacity: 0.3; }
	60% { transform: translate(1px, 2px); opacity: 0.25; }
	80% { transform: translate(-1px, -2px); opacity: 0.15; }
}
.animate-glitch-purple { animation: glitchPurple 3s infinite linear; }
.animate-glitch-green { animation: glitchGreen 2.7s infinite linear; }
</style>
