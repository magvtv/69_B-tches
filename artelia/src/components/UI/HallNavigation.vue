<template>
  <div class="hall-navigation">
    <h2 class="hall-title">Exhibition Halls</h2>
    <nav class="hall-nav">
      <ul>
        <li v-for="hall in halls" :key="hall.id">
          <button
            :class="{ active: hall.id === activeHall }"
            @click="$emit('select', hall.id)"
          >
            <span class="hall-name">{{ hall.name }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  halls: Array<{ id: string; name: string }>;
  activeHall: string
}>();
</script>

<style scoped>
.hall-navigation {
  margin-bottom: 2rem;
  text-align: center;
}

.hall-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.hall-nav ul {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  justify-content: center;
  flex-wrap: wrap;
}

.hall-nav button {
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: 'Playfair Display', serif;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
}

.hall-nav button::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.hall-nav button:hover {
  background: var(--background-secondary);
  border-color: var(--primary-color);
}

.hall-nav button:hover::after {
  transform: scaleX(1);
}

.hall-nav button.active {
  background: var(--background-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.hall-nav button.active::after {
  transform: scaleX(1);
}

.hall-name {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .hall-nav ul {
    flex-direction: column;
    align-items: center;
  }
  
  .hall-nav button {
    width: 100%;
    min-width: 200px;
  }
}
</style>