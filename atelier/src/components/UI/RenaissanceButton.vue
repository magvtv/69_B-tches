<template>
  <button 
    class="renaissance-button" 
    :class="[
      variant, 
      { 'outline': outline, 'small': small, 'large': large, 'full-width': fullWidth }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.icon" class="button-icon">
      <slot name="icon"></slot>
    </span>
    <span class="button-content">
      <slot></slot>
    </span>
    <span v-if="loading" class="button-loader"></span>
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

<style scoped>
.renaissance-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
  border: 1px solid transparent;
}

/* Size variants */
.renaissance-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.renaissance-button.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.renaissance-button.full-width {
  width: 100%;
}

/* Color variants */
.renaissance-button.primary {
  background: var(--primary-color);
  color: var(--background-primary);
  border-color: var(--primary-color);
}

.renaissance-button.primary:hover {
  background: var(--primary-light);
  border-color: var(--primary-light);
}

.renaissance-button.primary:active {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.renaissance-button.secondary {
  background: var(--secondary-color);
  color: var(--background-primary);
  border-color: var(--secondary-color);
}

.renaissance-button.secondary:hover {
  background: var(--secondary-light);
  border-color: var(--secondary-light);
}

.renaissance-button.secondary:active {
  background: var(--secondary-dark);
  border-color: var(--secondary-dark);
}

.renaissance-button.accent {
  background: var(--accent-color);
  color: var(--background-primary);
  border-color: var(--accent-color);
}

.renaissance-button.accent:hover {
  background: var(--accent-light);
  border-color: var(--accent-light);
}

.renaissance-button.accent:active {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
}

.renaissance-button.ghost {
  background: transparent;
  color: var(--text-color);
  border-color: var(--border-color);
}

.renaissance-button.ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--text-color);
}

/* Outline variants */
.renaissance-button.primary.outline {
  background: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.renaissance-button.primary.outline:hover {
  background: rgba(212, 175, 55, 0.1);
}

.renaissance-button.secondary.outline {
  background: transparent;
  color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.renaissance-button.secondary.outline:hover {
  background: rgba(139, 69, 19, 0.1);
}

.renaissance-button.accent.outline {
  background: transparent;
  color: var(--accent-color);
  border-color: var(--accent-color);
}

.renaissance-button.accent.outline:hover {
  background: rgba(184, 115, 51, 0.1);
}

/* Disabled state */
.renaissance-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading state */
.renaissance-button.loading {
  cursor: wait;
}

.button-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.renaissance-button.loading .button-content {
  opacity: 0;
}

/* Icon styling */
.button-icon {
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}

/* Renaissance-inspired decorative elements */
.renaissance-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  z-index: -1;
}

.renaissance-button:hover::before {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .renaissance-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .renaissance-button.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .renaissance-button.large {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}
</style>