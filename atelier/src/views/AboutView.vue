<template>
  <div class="about-view">
    <!-- Dynamic Background with Moving Artworks -->
    <div class="artwork-background">
      <div 
        v-for="(artwork, index) in backgroundArtworks" 
        :key="index"
        class="floating-artwork"
        :style="{
          backgroundImage: `url(${artwork.url})`,
          left: `${artwork.left}%`,
          animationDelay: `${artwork.delay}s`,
          animationDuration: `${artwork.duration}s`
        }"
      ></div>
    </div>

    <!-- Content Overlay -->
    <div class="about-content">
      <div class="container mx-auto px-4 py-16">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-6xl font-serif text-primary mb-6 tracking-wide">
            About Atelier
          </h1>
          <div class="renaissance-divider fancy mx-auto mb-8"></div>
          <p class="text-xl text-text-muted font-body max-w-3xl mx-auto leading-relaxed">
            A digital sanctuary where contemporary feminine expression meets the timeless elegance of Renaissance aesthetics
          </p>
        </div>

        <!-- Mission Section -->
        <div class="renaissance-card mb-12">
          <div class="renaissance-card-header">
            <h2 class="text-3xl font-serif text-primary mb-4">Our Mission</h2>
          </div>
          <div class="renaissance-card-body">
            <p class="text-lg leading-relaxed mb-6">
              Atelier curates and showcases contemporary feminine art that draws inspiration from the masterpieces of the Renaissance era. 
              We bridge the gap between classical artistic traditions and modern feminine expression, creating a space where powerful 
              feminine narratives are celebrated through the lens of timeless aesthetic principles.
            </p>
            <p class="text-lg leading-relaxed">
              Our platform serves as both a gallery and a community, bringing together artists, collectors, and art enthusiasts 
              who appreciate the sophisticated interplay of light, composition, and emotional depth that defines both Renaissance 
              masterworks and contemporary feminine art.
            </p>
          </div>
        </div>

        <!-- Art Philosophy Grid -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Painterly Sophistication -->
          <div class="renaissance-card">
            <div class="renaissance-card-header">
              <h3 class="text-2xl font-serif text-primary mb-3">Painterly Sophistication</h3>
            </div>
            <div class="renaissance-card-body">
              <p class="leading-relaxed">
                Our collection features artworks with exceptional technical mastery that appeals to serious art collectors. 
                Each piece demonstrates a deep understanding of composition, color theory, and artistic technique.
              </p>
            </div>
          </div>

          <!-- Mysterious Femininity -->
          <div class="renaissance-card">
            <div class="renaissance-card-header">
              <h3 class="text-2xl font-serif text-primary mb-3">Mysterious Femininity</h3>
            </div>
            <div class="renaissance-card-body">
              <p class="leading-relaxed">
                We celebrate powerful feminine expression that is not sexualized but embodies strength, mystery, and depth. 
                Our artists explore the multifaceted nature of feminine identity through nuanced and sophisticated portrayals.
              </p>
            </div>
          </div>

          <!-- Renaissance Qualities -->
          <div class="renaissance-card">
            <div class="renaissance-card-header">
              <h3 class="text-2xl font-serif text-primary mb-3">Renaissance Qualities</h3>
            </div>
            <div class="renaissance-card-body">
              <p class="leading-relaxed">
                Drawing from the masters, our artworks feature chiaroscuro lighting, classical composition, and the dramatic 
                interplay of light and shadow that defined the Renaissance aesthetic movement.
              </p>
            </div>
          </div>

          <!-- Modern Edge -->
          <div class="renaissance-card">
            <div class="renaissance-card-header">
              <h3 class="text-2xl font-serif text-primary mb-3">Contemporary Edge</h3>
            </div>
            <div class="renaissance-card-body">
              <p class="leading-relaxed">
                While honoring classical traditions, our collection embraces contemporary styling and diverse subjects, 
                creating a bridge between historical artistic excellence and modern creative expression.
              </p>
            </div>
          </div>
        </div>

        <!-- Protection Section -->
        <div class="renaissance-card">
          <div class="renaissance-card-header">
            <h2 class="text-3xl font-serif text-primary mb-4">Digital Protection & Integrity</h2>
          </div>
          <div class="renaissance-card-body">
            <p class="text-lg leading-relaxed mb-6">
              We employ state-of-the-art digital protection technologies to ensure the integrity and exclusivity of our 
              digital art collection. Our multi-layered approach includes:
            </p>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="font-serif text-lg text-primary mb-2">Canvas Rendering</h4>
                <p class="text-sm text-text-muted">Advanced rendering techniques that protect against unauthorized copying</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="font-serif text-lg text-primary mb-2">Noise Injection</h4>
                <p class="text-sm text-text-muted">Subtle digital signatures that maintain visual integrity while preventing theft</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="font-serif text-lg text-primary mb-2">Anti-Scraping</h4>
                <p class="text-sm text-text-muted">Comprehensive measures to prevent automated collection and unauthorized use</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <RouterLink 
            to="/gallery" 
            class="renaissance-btn primary text-lg px-8 py-4"
          >
            Explore Our Collection
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Background artworks configuration
const backgroundArtworks = ref([
  { url: '/art-vault/bitch-1.jpeg', left: 10, delay: 0, duration: 20 },
  { url: '/art-vault/bitch-2.jpeg', left: 25, delay: 2, duration: 25 },
  { url: '/art-vault/bitch-3.jpeg', left: 40, delay: 4, duration: 22 },
  { url: '/art-vault/bitch-4.jpeg', left: 55, delay: 6, duration: 28 },
  { url: '/art-vault/bitch-5.jpeg', left: 70, delay: 8, duration: 24 },
  { url: '/art-vault/bitch-6.jpeg', left: 85, delay: 10, duration: 26 },
  { url: '/art-vault/bitch-7.jpeg', left: 15, delay: 12, duration: 23 },
  { url: '/art-vault/bitch-8.jpeg', left: 30, delay: 14, duration: 27 },
  { url: '/art-vault/bitch-9.jpeg', left: 45, delay: 16, duration: 21 },
  { url: '/art-vault/bitch-10.jpeg', left: 60, delay: 18, duration: 29 },
  { url: '/art-vault/bitch-11.jpeg', left: 75, delay: 20, duration: 25 },
  { url: '/art-vault/bitch-12.jpeg', left: 90, delay: 22, duration: 24 }
]);

onMounted(() => {
  // Additional initialization if needed
});
</script>

<style scoped>
.about-view {
  position: relative;
  min-height: 100vh;
  background: var(--background-primary);
  overflow: hidden;
}

/* Dynamic Background */
.artwork-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.floating-artwork {
  position: absolute;
  width: 200px;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.03;
  border-radius: 8px;
  animation: floatUp linear infinite;
  filter: grayscale(100%) sepia(100%) hue-rotate(30deg);
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.03;
  }
  90% {
    opacity: 0.03;
  }
  100% {
    transform: translateY(-300px) rotate(360deg);
    opacity: 0;
  }
}

/* Content Overlay */
.about-content {
  position: relative;
  z-index: 10;
  background: linear-gradient(
    135deg, 
    rgba(18, 18, 18, 0.95) 0%, 
    rgba(30, 30, 30, 0.95) 100%
  );
  min-height: 100vh;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-artwork {
    width: 150px;
    height: 225px;
  }
  
  .about-content h1 {
    font-size: 3rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .floating-artwork {
    width: 120px;
    height: 180px;
  }
  
  .about-content h1 {
    font-size: 2.5rem;
  }
}
</style>
