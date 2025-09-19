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

export interface BonusRound {
  enabled: boolean
  title: string
  description: string
  task: string
  hidden_message: string
  timeLimit: number
}

export interface QuizLevel {
  level: number
  title: string
  description: string
  estimatedTime: string
  difficulty: string
  theme: string
  questions: QuizQuestion[]
  bonus_round: BonusRound
  completion_message: string
  unlock_requirement: string
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
      // Load from demo-level.json for level 0, fallback to individual files for others
      if (levelNumber === 0) {
        const demoData = await import(`../data/demo-level-old.json`)
        const demoLevels = demoData.default.levels
        const quizLevel = demoLevels.find(level => level.level === levelNumber) as QuizLevel
        
        if (!quizLevel) {
          throw new Error(`Level ${levelNumber} not found in demo-level.json`)
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
