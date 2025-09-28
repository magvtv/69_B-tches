export interface UserProfilePreferences {
  loveLanguage?: Array<{ questionIndex: number; answer: string }>
  intimateMoments?: string[]
}

export interface UserProfile {
  id?: string
  name?: string
  sessionId?: string
  totalSessionTime?: number
  preferences?: UserProfilePreferences
}

export interface UserInteraction {
  event: string
  properties?: Record<string, unknown>
  timestamp?: number
}

export interface InsightEngagementLevel {
  high?: boolean
  medium?: boolean
  low?: boolean
}

export interface TrackingInsights {
  totalEvents: number
  engagementLevel?: InsightEngagementLevel
  completionPattern?: {
    completionRate?: number
    progressionSpeed?: string
  }
}

class TrackingService {
  private profile: UserProfile | null = null
  private interactions: UserInteraction[] = []
  private sessionStart: number = Date.now()

  identify(profile: UserProfile) {
    this.profile = { ...this.profile, ...profile }
  }

  private ensureProfile(): UserProfile {
    if (!this.profile) {
      this.profile = {
        id: undefined,
        name: undefined,
        sessionId: Math.random().toString(36).slice(2),
        totalSessionTime: 0,
        preferences: { loveLanguage: [], intimateMoments: [] },
      }
      this.sessionStart = Date.now()
    }
    // Update session time dynamically on read
    const now = Date.now()
    const elapsed = now - this.sessionStart
    this.profile.totalSessionTime = elapsed
    return this.profile
  }

  getUserProfile(): UserProfile { return this.ensureProfile() }
  getAllInteractions(): UserInteraction[] { return [...this.interactions] }

  track(event: string, properties?: Record<string, unknown>) {
    const payload: UserInteraction = { event, properties, timestamp: Date.now() }
    this.interactions.push(payload)
    if (import.meta.env.DEV) {
      console.debug('[track]', payload)
    }
  }

  // Compatibility no-ops used by existing components
  trackEvent(event: string, properties?: Record<string, unknown>) { this.track(event, properties) }

  // Overloads remove 'any'
  trackIntimateMoments(moments: string[]): void
  trackIntimateMoments(selected: string[], all: string[]): void
  trackIntimateMoments(selectedOrMoments: string[], maybeAll?: string[]): void {
    const properties = { moments: selectedOrMoments, all: maybeAll }
    this.track('intimate_moments', properties)
    const p = this.ensureProfile()
    p.preferences!.intimateMoments = selectedOrMoments
  }

  trackLoveLanguage(questionIndex: number, answerIndex: number, question: string, answer: string): void {
    this.track('love_language', { questionIndex, answerIndex, question, answer })
    const p = this.ensureProfile()
    p.preferences!.loveLanguage!.push({ questionIndex, answer })
  }

  trackLevelProgress(levelName: string, payload: Record<string, unknown>): void {
    this.track('level_progress', { levelName, ...payload })
  }

  trackPersonalityInsight(type: string, data: Record<string, unknown>): void {
    this.track('personality_insight', { type, ...data })
  }

  generateInsights(): TrackingInsights { return { totalEvents: this.interactions.length, engagementLevel: { medium: true } } }
  exportData() {
    const p = this.ensureProfile()
    return { sessionId: p.sessionId, profile: p, interactions: this.getAllInteractions() }
  }
  async sendToBackend() { /* noop for MVP */ }
}

export const trackingService = new TrackingService()
export default trackingService
