<template>
  <button 
    :class="[
      'inline-flex items-center justify-center px-6 py-3 rounded-md font-serif text-base transition-all duration-300 cursor-pointer relative overflow-hidden z-10',
      {
        'bg-primary text-background-primary border border-primary hover:bg-primary-light hover:border-primary-light': variant === 'primary' && !outline,
        'bg-secondary text-background-primary border border-secondary hover:bg-secondary-light hover:border-secondary-light': variant === 'secondary' && !outline,
        'bg-accent text-background-primary border border-accent hover:bg-accent-light hover:border-accent-light': variant === 'accent' && !outline,
        'bg-transparent text-text border border-border hover:bg-white/5 hover:border-text': variant === 'ghost' && !outline,
        
        'bg-transparent text-primary border border-primary hover:bg-primary/10': variant === 'primary' && outline,
        'bg-transparent text-secondary border border-secondary hover:bg-secondary/10': variant === 'secondary' && outline,
        'bg-transparent text-accent border border-accent hover:bg-accent/10': variant === 'accent' && outline,
        
        'px-4 py-2 text-sm': small,
        'px-8 py-4 text-lg': large,
        'w-full': fullWidth,
        'opacity-60 cursor-not-allowed': disabled,
        'cursor-wait': loading
      }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.icon" class="mr-2 flex items-center">
      <slot name="icon"></slot>
    </span>
    <span :class="{ 'opacity-0': loading }" class="relative z-10">
      <slot></slot>
    </span>
    <span v-if="loading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'accent', 'ghost'].includes(value)
  },
  outline: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  },
  large: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>