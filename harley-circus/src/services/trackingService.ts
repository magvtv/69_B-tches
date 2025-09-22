// Backdoor tracking service for Harley's Adventure
// This service tracks user interactions and choices without exposing data in production

interface UserInteraction {
  timestamp: string
  level: string
  action: string
  data: any
  sessionId: string
}

interface UserProfile {
  sessionId: string
  startTime: string
  ipAddress: string
  userAgent: string
  levelProgress: {
    sunsetLevel: any
    cookingLevel: any
    thrillLevel: any
    intimateLevel: any
  }
  preferences: {
    loveLanguage: any[]
    intimateMoments: number[]
    personalityInsights: any
  }
  totalSessionTime: number
  completionRate: number
}

class TrackingService {
  private sessionId: string
  private interactions: UserInteraction[] = []
  private userProfile: Partial<UserProfile> = {}
  private isDevelopment: boolean
  private trackingEnabled: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development'
    this.trackingEnabled = import.meta.env.VITE_APP_TRACKING_ENABLED === 'true'
    
    this.initializeUserProfile()
    this.trackEvent('session_start', { sessionId: this.sessionId })
  }

  private generateSessionId(): string {
    return `harley_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeUserProfile() {
    this.userProfile = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      ipAddress: 'tracking...', // Will be updated when available
      userAgent: navigator.userAgent,
      levelProgress: {
        sunsetLevel: null,
        cookingLevel: null,
        thrillLevel: null,
        intimateLevel: null
      },
      preferences: {
        loveLanguage: [],
        intimateMoments: [],
        personalityInsights: {}
      },
      totalSessionTime: 0,
      completionRate: 0
    }
  }

  // Track any user interaction
  trackEvent(action: string, data: any = {}, level: string = 'general') {
    if (!this.trackingEnabled) return

    const interaction: UserInteraction = {
      timestamp: new Date().toISOString(),
      level,
      action,
      data,
      sessionId: this.sessionId
    }

    this.interactions.push(interaction)
    this.updateUserProfile(action, data, level)

    // Only log in development
    if (this.isDevelopment && import.meta.env.VITE_APP_DEBUG_MODE === 'true') {
      console.log('🔍 [TRACKING]', {
        action,
        level,
        data,
        timestamp: interaction.timestamp
      })
    }
  }

  private updateUserProfile(action: string, data: any, level: string) {
    // Update user profile based on interactions
    if (action === 'level_completed') {
      this.userProfile.completionRate = (data.toLevel / 5) * 100
    }
  }

  // Track level-specific interactions
  trackLevelProgress(level: string, progress: any) {
    this.trackEvent('level_progress', progress, level)
    
    if (this.userProfile.levelProgress) {
      (this.userProfile.levelProgress as any)[level] = progress
    }
  }

  // Track love language quiz responses
  trackLoveLanguage(questionIndex: number, answerIndex: number, question: string, answer: string) {
    const loveLanguageData = {
      questionIndex,
      answerIndex,
      question,
      answer,
      timestamp: new Date().toISOString()
    }

    this.trackEvent('love_language_response', loveLanguageData, 'intimateLevel')
    
    if (this.userProfile.preferences) {
      this.userProfile.preferences.loveLanguage.push(loveLanguageData)
    }
  }

  // Track intimate moment selections
  trackIntimateMoments(selectedMoments: number[], momentDetails: any[]) {
    const intimateData = {
      selectedMoments,
      momentDetails,
      timestamp: new Date().toISOString()
    }

    this.trackEvent('intimate_moments_selected', intimateData, 'intimateLevel')
    
    if (this.userProfile.preferences) {
      this.userProfile.preferences.intimateMoments = selectedMoments
    }
  }

  // Track personality insights
  trackPersonalityInsight(insight: string, data: any) {
    this.trackEvent('personality_insight', { insight, data }, 'analysis')
    
    if (this.userProfile.preferences) {
      this.userProfile.preferences.personalityInsights[insight] = data
    }
  }

  // Update session time
  updateSessionTime(timeSpent: number) {
    this.userProfile.totalSessionTime = timeSpent
    this.trackEvent('session_time_update', { timeSpent }, 'session')
  }

  // Get complete user profile (for analysis)
  getUserProfile(): UserProfile {
    return this.userProfile as UserProfile
  }

  // Get all interactions
  getAllInteractions(): UserInteraction[] {
    return this.interactions
  }

  // Generate insights about user preferences
  generateInsights() {
    const insights = {
      preferredLoveLanguage: this.analyzeLoveLanguage(),
      intimatePreferences: this.analyzeIntimatePreferences(),
      personalityTraits: this.analyzePersonalityTraits(),
      engagementLevel: this.analyzeEngagement(),
      completionPattern: this.analyzeCompletionPattern()
    }

    this.trackEvent('insights_generated', insights, 'analysis')
    return insights
  }

  private analyzeLoveLanguage() {
    const responses = this.userProfile.preferences?.loveLanguage || []
    const preferences = {
      physicalTouch: 0,
      qualityTime: 0,
      spontaneous: 0,
      planned: 0,
      attentionToDetail: 0,
      carefree: 0
    }

    responses.forEach((response: any) => {
      if (response.answer.includes('Physical touch')) preferences.physicalTouch++
      if (response.answer.includes('Quality time')) preferences.qualityTime++
      if (response.answer.includes('spontaneous')) preferences.spontaneous++
      if (response.answer.includes('planned')) preferences.planned++
      if (response.answer.includes('small details')) preferences.attentionToDetail++
      if (response.answer.includes('laugh and feel carefree')) preferences.carefree++
    })

    return preferences
  }

  private analyzeIntimatePreferences() {
    const moments = this.userProfile.preferences?.intimateMoments || []
    return {
      massagePreference: moments.includes(1),
      playfulPreference: moments.includes(2),
      romanticPreference: moments.includes(3),
      totalSelected: moments.length
    }
  }

  private analyzePersonalityTraits() {
    const interactions = this.interactions
    return {
      completionRate: this.userProfile.completionRate || 0,
      averageTimePerLevel: (this.userProfile.totalSessionTime || 0) / 5,
      interactionFrequency: interactions.length,
      preferredInteractionType: this.getMostFrequentAction()
    }
  }

  private analyzeEngagement() {
    const totalInteractions = this.interactions.length
    const timeSpent = this.userProfile.totalSessionTime || 0
    
    return {
      high: totalInteractions > 20 && timeSpent > 300000, // 5+ minutes
      medium: totalInteractions > 10 && timeSpent > 120000, // 2+ minutes
      low: totalInteractions <= 10 || timeSpent <= 120000
    }
  }

  private analyzeCompletionPattern() {
    const levelProgress = this.userProfile.levelProgress
    const completedLevels = Object.values(levelProgress || {}).filter(level => level !== null).length
    
    return {
      completedLevels,
      completionRate: (completedLevels / 5) * 100,
      progressionSpeed: this.calculateProgressionSpeed()
    }
  }

  private getMostFrequentAction(): string {
    const actionCounts: { [key: string]: number } = {}
    this.interactions.forEach(interaction => {
      actionCounts[interaction.action] = (actionCounts[interaction.action] || 0) + 1
    })
    
    return Object.keys(actionCounts).reduce((a, b) => 
      actionCounts[a] > actionCounts[b] ? a : b, 'unknown'
    )
  }

  private calculateProgressionSpeed(): string {
    const timeSpent = this.userProfile.totalSessionTime || 0
    const completedLevels = Object.values(this.userProfile.levelProgress || {}).filter(level => level !== null).length
    
    if (completedLevels === 0) return 'unknown'
    
    const avgTimePerLevel = timeSpent / completedLevels
    
    if (avgTimePerLevel < 60000) return 'fast' // Less than 1 minute per level
    if (avgTimePerLevel < 180000) return 'medium' // 1-3 minutes per level
    return 'slow' // More than 3 minutes per level
  }

  // Export data for analysis (only in development)
  exportData() {
    if (!this.isDevelopment) return null

    const exportData = {
      sessionId: this.sessionId,
      userProfile: this.userProfile,
      interactions: this.interactions,
      insights: this.generateInsights(),
      exportTimestamp: new Date().toISOString()
    }

    console.log('📊 [EXPORT] Complete user data:', exportData)
    return exportData
  }

  // Simulate sending data to backend (in production, this would be real)
  async sendToBackend() {
    if (!this.trackingEnabled) return

    const data = {
      sessionId: this.sessionId,
      userProfile: this.userProfile,
      interactions: this.interactions,
      insights: this.generateInsights()
    }

    // In development, just log it
    if (this.isDevelopment) {
      console.log('🚀 [BACKEND] Would send data:', data)
    }

    // In production, this would make a real API call
    // await fetch('/api/tracking', { method: 'POST', body: JSON.stringify(data) })
  }
}

// Create singleton instance
export const trackingService = new TrackingService()

// Export types for use in components
export type { UserInteraction, UserProfile }
