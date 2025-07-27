<template>
  <div class="renaissance-card text-center p-8">
    <h4 class="text-2xl font-serif text-text mb-4">{{ tier.name }}</h4>
    <p class="text-text-muted mb-6">{{ tier.description }}</p>
    <div class="text-3xl font-bold text-primary mb-8">KES {{ tier.price.toLocaleString() }}</div>
    <RenaissanceButton @click="$emit('subscribe', tier.id)" variant="primary" class="w-full">
      Subscribe
    </RenaissanceButton>
  </div>
</template>

<script setup lang="ts">
import RenaissanceButton from './RenaissanceButton.vue';
const props = defineProps<{ tier: { id: string; name: string; description: string; price: number } }>();
</script>

 