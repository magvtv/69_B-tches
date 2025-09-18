/// <reference types="vite/client" />

// Enable TypeScript to understand Vue SFC imports (avoid `{}` which accepts non-nullish)
declare module '*.vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}
