<template>
  <div class="min-h-screen flex items-center justify-center py-16 px-4">
    <div class="w-full max-w-md">
      <div class="bg-background-tertiary p-8 rounded-2xl shadow-renaissance border border-border">
        <h1 class="text-3xl text-center mb-2 text-text font-display">Login</h1>
        <p class="text-center text-text-muted mb-8">Welcome back to the Atelier</p>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
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
          
          <div class="pt-4">
            <RenaissanceButton type="submit" variant="primary" class="w-full" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </RenaissanceButton>
          </div>
        </form>
        
        <div class="mt-8 space-y-3 text-center">
          <RouterLink to="/auth/register" class="block text-sm text-primary hover:text-primary-light transition-colors">
            Don't have an account? Register
          </RouterLink>
          <a href="#" @click.prevent="forgotPassword" class="block text-sm text-primary hover:text-primary-light transition-colors">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  
  try {
    // TODO: Implement authentication logic
    console.log('Login attempt:', { email: email.value, password: password.value });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Handle successful login
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
}

function forgotPassword() {
  // TODO: Implement forgot password flow
  console.log('Forgot password clicked');
}
</script>

 