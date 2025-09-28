<template>
  <div class="test-page">
    <h1>Test Page</h1>
    <p>If you can see this, Vue is working!</p>
    <button @click="testClick">Test Button</button>
  </div>
</template>

<script setup lang="ts">
// Define component name for linting
defineOptions({
  name: 'TestPage'
})

function testClick() {
  alert('Vue is working!')
}
</script>

<style scoped>
.test-page {
  padding: 2rem;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #0D0D0D 0%, #6A0DAD 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  color: #39FF14;
  margin-bottom: 1rem;
  font-size: 2rem;
}

p {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

button {
  background: linear-gradient(45deg, #39FF14, #6A0DAD);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px) scale(1.05);
}
</style>
