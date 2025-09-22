// Quiz data service for loading and managing quiz levels
export interface QuizQuestion {
  id: number
  type: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  timeLimit: number
}

// BonusRound interface removed

export interface QuizLevel {
  level: number
  title: string
  description: string
  estimatedTime: string
  difficulty: string
  theme: string
  questions: QuizQuestion[]
  completion_message: string
  unlock_requirement: string
}

export interface ConsolidatedQuizData {
  project: string
  questions: QuizQuestion[]
  completion_message: string
  unlock_requirement: string
  global_hint_policy: {
    hints_per_level: number
    unlock_conditions: string
    hint_style: string
  }
  rewards: {
    visual: string[]
    social: string[]
  }
}

class QuizService {
  private cache = new Map<number, QuizLevel>()

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Shuffle question options while maintaining correct answer tracking
  private shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
    const originalOptions = [...question.options]
    const correctAnswerText = originalOptions[question.correct_answer]
    
    // Shuffle the options
    const shuffledOptions = this.shuffleArray(originalOptions)
    
    // Find the new position of the correct answer
    const newCorrectAnswerIndex = shuffledOptions.findIndex(option => option === correctAnswerText)
    
    return {
      ...question,
      options: shuffledOptions,
      correct_answer: newCorrectAnswerIndex
    }
  }

  async loadLevel(levelNumber: number): Promise<QuizLevel> {
    // Check cache first
    if (this.cache.has(levelNumber)) {
      return this.cache.get(levelNumber)!
    }

    try {
      // Load from demo-level-old.json for level 0 (now consolidated)
      if (levelNumber === 0) {
        const demoData = await import(`../data/demo-level-old.json`)
        const consolidatedData = demoData.default as ConsolidatedQuizData
        
        // Create a QuizLevel from the consolidated data
        const quizLevel: QuizLevel = {
          level: 0,
          title: "Prologue — The Partial Circus Experience",
          description: "Hey Babe. PH says you need to and inside references. This is a just taste of the experience.",
          estimatedTime: "4 minutes",
          difficulty: "Very Easy",
          theme: "Complete journey: nicknames, memories, music & craft",
          questions: consolidatedData.questions,
          completion_message: consolidatedData.completion_message,
          unlock_requirement: consolidatedData.unlock_requirement
        }
        
        // Shuffle options for all questions to make the quiz less predictable
        const shuffledQuizLevel = {
          ...quizLevel,
          questions: quizLevel.questions.map(question => this.shuffleQuestionOptions(question))
        }
        
        // Cache the shuffled level
        this.cache.set(levelNumber, shuffledQuizLevel)
        return shuffledQuizLevel
      } else {
        // For other levels, try individual files
        const levelData = await import(`../data/level${levelNumber}.json`)
        const quizLevel = levelData.default as QuizLevel
        
        // Shuffle options for all questions to make the quiz less predictable
        const shuffledQuizLevel = {
          ...quizLevel,
          questions: quizLevel.questions.map(question => this.shuffleQuestionOptions(question))
        }
        
        this.cache.set(levelNumber, shuffledQuizLevel)
        return shuffledQuizLevel
      }
    } catch (error) {
      console.error(`Failed to load level ${levelNumber}:`, error)
      throw new Error(`Level ${levelNumber} not found`)
    }
  }

  async loadAllLevels(): Promise<QuizLevel[]> {
    const levels: QuizLevel[] = []
    
    // Try to load levels 0-10 (adjust range as needed)
    for (let i = 0; i <= 10; i++) {
      try {
        const level = await this.loadLevel(i)
        levels.push(level)
      } catch {
        // Level doesn't exist, continue
        break
      }
    }
    
    return levels
  }

  getCachedLevel(levelNumber: number): QuizLevel | null {
    return this.cache.get(levelNumber) || null
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const quizService = new QuizService()
export default quizService
