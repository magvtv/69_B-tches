<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login</h1>
        <p class="auth-subtitle">Welcome back to the Atelier</p>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-actions">
            <RenaissanceButton type="submit" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </RenaissanceButton>
          </div>
        </form>
        
        <div class="auth-links">
          <RouterLink to="/auth/register">Don't have an account? Register</RouterLink>
          <a href="#" @click.prevent="forgotPassword">Forgot password?</a>
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

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.auth-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  margin-top: 2rem;
}

.auth-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.auth-links a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.auth-links a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem;
  }
}
</style> 