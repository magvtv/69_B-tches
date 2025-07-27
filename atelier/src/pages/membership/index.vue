<template>
  <div class="membership">
    <div class="container">
      <h1>Membership Tiers</h1>
      <p class="membership-intro">
        Join our exclusive community and gain access to premium features, early access to new collections, 
        and special events.
      </p>
      
      <div class="membership-tiers">
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

<style scoped>
.membership {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  min-height: 100vh;
}

.membership h1 {
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.membership-intro {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.membership-tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .membership {
    padding: 2rem 0;
  }
  
  .membership-tiers {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style> 