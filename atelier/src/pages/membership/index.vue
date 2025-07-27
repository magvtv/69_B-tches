<template>
  <div class="py-16 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-display">
        Membership Tiers
      </h1>
      <p class="text-lg text-text-muted text-center mb-12 max-w-2xl mx-auto">
        Join our exclusive community and gain access to premium features, early access to new collections, 
        and special events.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <MembershipTier
          v-for="tier in membershipTiers"
          :key="tier.id"
          :tier="tier"
          @subscribe="subscribeToTier"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MembershipTier from '@/components/UI/MembershipTier.vue';

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const membershipTiers = ref<MembershipTier[]>([
  {
    id: 'basic',
    name: 'Basic Member',
    description: 'Access to basic gallery features and monthly newsletter',
    price: 5000,
    features: ['Gallery access', 'Monthly newsletter', 'Basic support']
  },
  {
    id: 'premium',
    name: 'Premium Member',
    description: 'Enhanced features including early access and exclusive content',
    price: 15000,
    features: ['All Basic features', 'Early access to new collections', 'Exclusive content', 'Priority support']
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Full access including curator tools and artist networking',
    price: 50000,
    features: ['All Premium features', 'Curator tools', 'Artist networking', 'VIP events', 'Personal curator']
  }
]);

function subscribeToTier(tierId: string) {
  // TODO: Implement M-Pesa payment integration
  console.log('Subscribe to tier:', tierId);
}
</script>

 