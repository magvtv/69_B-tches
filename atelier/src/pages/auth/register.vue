<template>
  <div class="min-h-screen flex items-center justify-center py-16 px-4">
    <div class="w-full max-w-md">
      <div class="bg-background-tertiary p-8 rounded-2xl shadow-renaissance border border-border">
        <h1 class="text-3xl text-center mb-2 text-text font-display">Register</h1>
        <p class="text-center text-text-muted mb-8">Join the Artelia community</p>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-text mb-2">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Enter your full name"
              class="renaissance-input w-full"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-text mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              class="renaissance-input w-full"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-text mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
              class="renaissance-input w-full"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-text mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              class="renaissance-input w-full"
            />
          </div>
          
          <div class="pt-4">
            <RenaissanceButton type="submit" variant="primary" class="w-full" :disabled="loading || !passwordsMatch">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </RenaissanceButton>
          </div>
        </form>
        
        <div class="mt-8 space-y-3 text-center">
          <RouterLink to="/auth/login" class="block text-sm text-primary hover:text-primary-light transition-colors">
            Already have an account? Login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const passwordsMatch = computed(() => {
  return password.value && confirmPassword.value && password.value === confirmPassword.value;
});

async function handleRegister() {
  if (!passwordsMatch.value) {
    alert('Passwords do not match');
    return;
  }
  
  loading.value = true;
  
  try {
    // TODO: Implement registration logic
    console.log('Register attempt:', { 
      name: name.value, 
      email: email.value, 
      password: password.value 
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Handle successful registration
    router.push('/auth/login');
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    loading.value = false;
  }
}
</script> 