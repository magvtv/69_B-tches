// Environment configuration for Harley's Adventure
// This file controls the behavior of the tracking system

export const config = {
  // Environment detection
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  
  // Tracking configuration
  trackingEnabled: import.meta.env.VITE_APP_TRACKING_ENABLED === 'true',
  debugMode: import.meta.env.VITE_APP_DEBUG_MODE === 'true',
  
  // API endpoints (for future backend integration)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Tracking settings
  tracking: {
    // How often to update session time (in milliseconds)
    sessionUpdateInterval: 1000,
    
    // How often to send data to backend (in milliseconds)
    backendSyncInterval: 30000, // 30 seconds
    
    // Maximum number of interactions to keep in memory
    maxInteractions: 1000,
    
    // Whether to persist data to localStorage
    persistToLocalStorage: true,
    
    // Whether to show debug panel in development
    showDebugPanel: true
  }
}

// Helper functions
export const isTrackingEnabled = () => config.trackingEnabled
export const isDebugMode = () => config.debugMode && config.isDevelopment
export const shouldShowDebugPanel = () => config.isDevelopment && config.tracking.showDebugPanel

// Logging helper that respects environment settings
export const debugLog = (message: string, data?: any) => {
  if (isDebugMode()) {
    console.log(`🔍 [HARLEY-TRACKING] ${message}`, data || '')
  }
}

export const errorLog = (message: string, error?: any) => {
  if (isDebugMode()) {
    console.error(`❌ [HARLEY-TRACKING] ${message}`, error || '')
  }
}
