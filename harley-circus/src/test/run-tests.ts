// Simple test runner for Supabase integration
// Run this in your browser console or import in a component

import { runSupabaseIntegrationTests, runPerformanceTest, cleanupTestData } from './supabase-integration.test'

// Test runner interface
export class SupabaseTestRunner {
  private results: Array<{ test: string; passed: boolean; duration: number }> = []
  
  async runIntegrationTests(): Promise<boolean> {
    console.log('🧪 Running Integration Tests...')
    const startTime = Date.now()
    
    try {
      const passed = await runSupabaseIntegrationTests()
      const duration = Date.now() - startTime
      
      this.results.push({
        test: 'Integration Tests',
        passed,
        duration
      })
      
      return passed
    } catch (error) {
      console.error('❌ Integration tests failed:', error)
      return false
    }
  }
  
  async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running Performance Tests...')
    const startTime = Date.now()
    
    try {
      await runPerformanceTest()
      const duration = Date.now() - startTime
      
      this.results.push({
        test: 'Performance Tests',
        passed: true,
        duration
      })
    } catch (error) {
      console.error('❌ Performance tests failed:', error)
      this.results.push({
        test: 'Performance Tests',
        passed: false,
        duration: Date.now() - startTime
      })
    }
  }
  
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up test data...')
    await cleanupTestData()
  }
  
  async runAll(): Promise<boolean> {
    console.log('🚀 Starting Complete Test Suite...')
    console.log('=' .repeat(50))
    
    const integrationPassed = await this.runIntegrationTests()
    await this.runPerformanceTests()
    await this.cleanup()
    
    this.printSummary()
    return integrationPassed
  }
  
  printSummary(): void {
    console.log('\n📊 Test Summary:')
    console.log('=' .repeat(30))
    
    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      console.log(`${status} ${result.test}: ${result.duration}ms`)
    })
    
    const totalPassed = this.results.filter(r => r.passed).length
    const totalTests = this.results.length
    const successRate = (totalPassed / totalTests) * 100
    
    console.log(`\n📈 Success Rate: ${successRate.toFixed(1)}% (${totalPassed}/${totalTests})`)
    
    if (successRate === 100) {
      console.log('🎉 All tests passed! Your Supabase integration is working perfectly.')
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.')
    }
  }
}

// Export singleton instance
export const testRunner = new SupabaseTestRunner()

// Quick test functions for browser console
export const quickTest = {
  // Test just the connection
  async connection() {
    console.log('🔌 Testing Supabase connection...')
    try {
      const { progressService } = await import('../lib/supabase/progressService')
      const session = await progressService.initializeSession()
      console.log('✅ Connection successful!', session.sessionId)
      return true
    } catch (error) {
      console.error('❌ Connection failed:', error)
      return false
    }
  },
  
  // Test a single meme reaction
  async memeReaction() {
    console.log('😂 Testing meme reaction...')
    try {
      const { progressService } = await import('../lib/supabase/progressService')
      const gameSession = await progressService.startGameSession('01-meme-maze')
      const reaction = await progressService.recordMemeReaction(
        gameSession.id,
        0,
        'laugh',
        1500
      )
      console.log('✅ Meme reaction recorded!', reaction.id)
      return true
    } catch (error) {
      console.error('❌ Meme reaction failed:', error)
      return false
    }
  },
  
  // Test progress retrieval
  async getProgress() {
    console.log('📊 Testing progress retrieval...')
    try {
      const { progressService } = await import('../lib/supabase/progressService')
      const progress = await progressService.getUserProgress('01-meme-maze')
      console.log('✅ Progress retrieved!', {
        hasSession: !!progress.gameSession,
        reactions: progress.memeReactions?.length || 0
      })
      return true
    } catch (error) {
      console.error('❌ Progress retrieval failed:', error)
      return false
    }
  }
}

// Auto-export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).supabaseTests = {
    runAll: () => testRunner.runAll(),
    runIntegration: () => testRunner.runIntegrationTests(),
    runPerformance: () => testRunner.runPerformanceTests(),
    cleanup: () => testRunner.cleanup(),
    quick: quickTest
  }
  
  console.log('🧪 Supabase test functions available:')
  console.log('  supabaseTests.runAll() - Run complete test suite')
  console.log('  supabaseTests.runIntegration() - Run integration tests only')
  console.log('  supabaseTests.runPerformance() - Run performance tests only')
  console.log('  supabaseTests.cleanup() - Clean up test data')
  console.log('  supabaseTests.quick.connection() - Test connection')
  console.log('  supabaseTests.quick.memeReaction() - Test meme reaction')
  console.log('  supabaseTests.quick.getProgress() - Test progress retrieval')
}
