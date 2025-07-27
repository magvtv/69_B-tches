<template>
  <div class="membership-tier">
    <h4>{{ tier.name }}</h4>
    <p>{{ tier.description }}</p>
    <div class="price">KES {{ tier.price }}</div>
    <RenaissanceButton @click="$emit('subscribe', tier.id)">Subscribe</RenaissanceButton>
  </div>
</template>

<script setup lang="ts">
import RenaissanceButton from './RenaissanceButton.vue';
const props = defineProps<{ tier: { id: string; name: string; description: string; price: number } }>();
</script>

<style scoped>
.membership-tier {
  border: 1px solid #e0c3fc;
  border-radius: 10px;
  padding: 1.5rem;
  background: #faf8ff;
  text-align: center;
  margin-bottom: 1rem;
}
.price {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem 0;
}
</style> 