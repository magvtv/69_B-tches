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
      <svg
        v-if="showPassword"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >;
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-1.414-1.414m4.242 4.242l1.414 1.414M9.878 14.12l4.242-4.242"
        />
      </svg>
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
