import { debugLog, errorLog } from '../config/environment'

export interface Reward {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: number
  challengeId?: string
}

export interface Coupon {
  id: string
  title: string
  description: string
  value: string
  expiresAt?: number
  used: boolean
  earnedAt: number
}

export interface DarePrompt {
  id: string
  title: string
  description: string
  challenge: string
  reward: string
  completed: boolean
  earnedAt: number
}

class RewardEngine {
  private rewards: Map<string, Reward> = new Map()
  private coupons: Map<string, Coupon> = new Map()
  private darePrompts: Map<string, DarePrompt> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  awardReward(challengeId: string, rewardType: string): Reward {
    const reward: Reward = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: this.getRewardName(rewardType),
      description: this.getRewardDescription(rewardType),
      icon: this.getRewardIcon(rewardType),
      earnedAt: Date.now(),
      challengeId,
    }

    this.rewards.set(reward.id, reward)
    this.saveToStorage()

    debugLog('Reward awarded', { reward, rewardType, challengeId })
    return reward
  }

  generateCoupon(score: number, totalChallenges: number): Coupon | null {
    const percentage = (score / totalChallenges) * 100

    let coupon: Coupon | null = null

    if (percentage >= 90) {
      coupon = {
        id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Perfect Score Coupon',
        description: 'You know these songs by heart!',
        value: 'FREE_DESSERT_OR_DRINK',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        used: false,
        earnedAt: Date.now(),
      }
    } else if (percentage >= 70) {
      coupon = {
        id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Music Lover Coupon',
        description: 'Great job remembering our songs!',
        value: 'HALF_PRICE_DESSERT',
        expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
        used: false,
        earnedAt: Date.now(),
      }
    } else if (percentage >= 50) {
      coupon = {
        id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Try Again Coupon',
        description: "You're getting there! Keep practicing",
        value: 'BUY_ONE_GET_ONE_HALF',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        used: false,
        earnedAt: Date.now(),
      }
    }

    if (coupon) {
      this.coupons.set(coupon.id, coupon)
      this.saveToStorage()
      debugLog('Coupon generated', { coupon, score, percentage })
    }

    return coupon
  }

  generateDarePrompt(score: number, totalChallenges: number): DarePrompt | null {
    const percentage = (score / totalChallenges) * 100

    let darePrompt: DarePrompt | null = null

    if (percentage >= 80) {
      darePrompt = {
        id: `dare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Voice Note Dare',
        description: "You're a music expert! Now prove it with your voice",
        challenge: 'Record yourself singing 30 seconds of your favorite song from this level',
        reward: 'SPECIAL_PLAYLIST_ACCESS',
        completed: false,
        earnedAt: Date.now(),
      }
    } else if (percentage >= 60) {
      darePrompt = {
        id: `dare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Lyric Challenge Dare',
        description: 'Time to test your memory!',
        challenge: 'Write down the lyrics to 3 songs from this level from memory',
        reward: 'LYRIC_MASTER_BADGE',
        completed: false,
        earnedAt: Date.now(),
      }
    } else {
      darePrompt = {
        id: `dare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Practice Dare',
        description: "Keep practicing! You'll get there",
        challenge: 'Listen to each song from this level once more',
        reward: 'PRACTICE_MODE_UNLOCKED',
        completed: false,
        earnedAt: Date.now(),
      }
    }

    if (darePrompt) {
      this.darePrompts.set(darePrompt.id, darePrompt)
      this.saveToStorage()
      debugLog('Dare prompt generated', { darePrompt, score, percentage })
    }

    return darePrompt
  }

  completeDarePrompt(dareId: string): boolean {
    const dare = this.darePrompts.get(dareId)
    if (dare) {
      dare.completed = true
      this.saveToStorage()
      debugLog('Dare prompt completed', { dareId })
      return true
    }
    return false
  }

  useCoupon(couponId: string): boolean {
    const coupon = this.coupons.get(couponId)
    if (coupon && !coupon.used) {
      coupon.used = true
      this.saveToStorage()
      debugLog('Coupon used', { couponId })
      return true
    }
    return false
  }

  getAllRewards(): Reward[] {
    return Array.from(this.rewards.values()).sort((a, b) => b.earnedAt - a.earnedAt)
  }

  getAllCoupons(): Coupon[] {
    return Array.from(this.coupons.values())
      .filter((c) => !c.used && (!c.expiresAt || c.expiresAt > Date.now()))
      .sort((a, b) => b.earnedAt - a.earnedAt)
  }

  getAllDarePrompts(): DarePrompt[] {
    return Array.from(this.darePrompts.values())
      .filter((d) => !d.completed)
      .sort((a, b) => b.earnedAt - a.earnedAt)
  }

  getStats() {
    const rewards = this.getAllRewards()
    const coupons = this.getAllCoupons()
    const darePrompts = this.getAllDarePrompts()

    return {
      totalRewards: rewards.length,
      totalCoupons: coupons.length,
      totalDarePrompts: darePrompts.length,
      completedDares: Array.from(this.darePrompts.values()).filter((d) => d.completed).length,
      usedCoupons: Array.from(this.coupons.values()).filter((c) => c.used).length,
    }
  }

  clearAll(): void {
    this.rewards.clear()
    this.coupons.clear()
    this.darePrompts.clear()
    this.saveToStorage()
    debugLog('All reward data cleared')
  }

  private getRewardName(rewardType: string): string {
    const names: Record<string, string> = {
      music_token: 'Music Token',
      mereba_token: 'Mereba Token',
      throwback_token: 'Throwback Token',
      attention_token: 'Attention Token',
      voice_note_token: 'Voice Note Token',
    }
    return names[rewardType] || 'Unknown Token'
  }

  private getRewardDescription(rewardType: string): string {
    const descriptions: Record<string, string> = {
      music_token: 'Earned for correct lyric recognition',
      mereba_token: 'Special token for Mereba recognition',
      throwback_token: 'Earned for remembering the past',
      attention_token: 'For paying attention to background audio',
      voice_note_token: 'For completing the voice challenge',
    }
    return descriptions[rewardType] || 'Unknown reward'
  }

  private getRewardIcon(rewardType: string): string {
    const icons: Record<string, string> = {
      music_token: '[MUSIC]',
      mereba_token: '[SPARKLE]',
      throwback_token: '[TIME]',
      attention_token: '[EAR]',
      voice_note_token: '[MIC]',
    }
    return icons[rewardType] || '[GIFT]'
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(
        'reward_engine_rewards',
        JSON.stringify(Array.from(this.rewards.entries())),
      )
      localStorage.setItem(
        'reward_engine_coupons',
        JSON.stringify(Array.from(this.coupons.entries())),
      )
      localStorage.setItem(
        'reward_engine_dare_prompts',
        JSON.stringify(Array.from(this.darePrompts.entries())),
      )
    } catch (error) {
      errorLog('Failed to save reward data to storage', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const rewardsData = localStorage.getItem('reward_engine_rewards')
      if (rewardsData) {
        const rewards = JSON.parse(rewardsData)
        this.rewards = new Map(rewards)
      }

      const couponsData = localStorage.getItem('reward_engine_coupons')
      if (couponsData) {
        const coupons = JSON.parse(couponsData)
        this.coupons = new Map(coupons)
      }

      const darePromptsData = localStorage.getItem('reward_engine_dare_prompts')
      if (darePromptsData) {
        const darePrompts = JSON.parse(darePromptsData)
        this.darePrompts = new Map(darePrompts)
      }
    } catch (error) {
      errorLog('Failed to load reward data from storage', error)
    }
  }
}

export const rewardEngine = new RewardEngine()
export default rewardEngine
