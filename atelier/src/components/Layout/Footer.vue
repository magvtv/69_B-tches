<template>
  <footer class="renaissance-footer">
    <div class="footer-content">
      <div class="footer-logo">
        <div class="emblem">69</div>
      </div>
      <div class="footer-info">
        <p class="copyright">&copy; 2025 Atelier Digital Art Sanctuary</p>
        <p class="tagline serif-text">The Confluence of Art and the Renaissance</p>
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">Terms</a>
        <a href="#" class="footer-link">Privacy</a>
        <a href="#" class="footer-link">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script needed for basic footer
</script>

<style scoped>
.renaissance-footer {
  background-color: var(--background-secondary);
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  position: relative;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.emblem {
  width: 40px;
  height: 40px;
  border: 1px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: var(--primary-color);
}

.footer-info {
  text-align: center;
}

.copyright {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.tagline {
  font-style: italic;
  color: var(--primary-color);
  font-size: 0.95rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

/* Gold accent line at top */
.renaissance-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gradient-gold);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }
  
  .footer-links {
    width: 100%;
    justify-content: center;
  }
}
</style>