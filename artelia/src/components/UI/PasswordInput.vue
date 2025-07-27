<template>
  <div class="relative">
    <input
      :id="id"
      v-model="inputValue"
      :type="showPassword ? 'text' : 'password'" 
      :placeholder="placeholder || ''"
      :required="required || false"
      class="renaissance-input w-full pr-12"
    />
    <button
      type="button"
      @click="togglePassword"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors duration-300 focus:outline-none"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    >
      <!-- Eye Closed (password hidden) -->
      <svg
        v-if="!showPassword"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <!-- Eye Open with slash (password visible) -->
      <svg
        v-else
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.498a10.523 10.523 0 01-1.067 2.472m-6.228 6.228L3 21m18-18l-6.228 6.228m0 0L12 12m-3-3l6.228 6.228M12 12l3-3"
        />
        <circle cx="12" cy="12" r="3" stroke-width="2" opacity="0.4" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">;
import { ref, computed } from 'vue';

interface Props {
  id: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const showPassword = ref(false);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
