<template>
  <div class="about">
    <div class="container">
      <h1>About Atelier</h1>
      
      <div class="about-content">
        <div class="mission-section">
          <h2>Our Mission</h2>
          <p>
            We curate and showcase contemporary feminist art that draws inspiration from Renaissance aesthetics, 
            creating a digital sanctuary where powerful feminine expression meets classical artistic tradition.
          </p>
        </div>
        
        <div class="art-style-section">
          <h2>Art Style Philosophy</h2>
          <p>
            Our collection features artworks with painterly sophistication that appeals to serious art collectors, 
            mysterious femininity that is not sexualized but powerful, Renaissance qualities with chiaroscuro lighting 
            and classical composition, and a modern edge with contemporary styling and diverse subjects.
          </p>
        </div>
        
        <div class="protection-section">
          <h2>Digital Protection</h2>
          <p>
            We employ advanced image protection technologies including canvas rendering, noise injection, 
            and anti-scraping measures to ensure the integrity and exclusivity of our digital art collection.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for static content
</script>

<style scoped>
.about {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  min-height: 100vh;
}

.about h1 {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.mission-section,
.art-style-section,
.protection-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.mission-section h2,
.art-style-section h2,
.protection-section h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.mission-section p,
.art-style-section p,
.protection-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .about {
    padding: 2rem 0;
  }
  
  .mission-section,
  .art-style-section,
  .protection-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
