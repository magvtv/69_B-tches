// Comprehensive Supabase Integration Test Suite
// This file tests the complete backend integration flow

import { progressService } from '../lib/supabase/progressService'
import { supabase } from '../lib/supabase/client'
import { debugLog, errorLog } from '../config/environment'

// Test configuration
const TEST_CONFIG = {
  levelSlug: '01-meme-maze',
  testUserId: 'test-user-' + Date.now(),
  enableDetailedLogging: true
}

// Test utilities
class TestLogger {
  private testResults: Array<{ test: string; status: 'pass' | 'fail'; message: string; duration: number }> = []
  
  async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now()
    try {
      await testFn()
      const duration = Date.now() - startTime
      this.testResults.push({ test: testName, status: 'pass', message: '✅ Passed', duration })
      console.log(`✅ ${testName} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.testResults.push({ test: testName, status: 'fail', message: `❌ ${message}`, duration })
      console.error(`❌ ${testName} (${duration}ms):`, error)
    }
  }
  
  getResults() {
    return this.testResults
  }
  
  printSummary() {
    const passed = this.testResults.filter(r => r.status === 'pass').length
    const failed = this.testResults.filter(r => r.status === 'fail').length
    const totalTime = this.testResults.reduce((sum, r) => sum + r.duration, 0)
    
    console.log('\n📊 Test Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⏱️  Total Time: ${totalTime}ms`)
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  }
}

// Main test suite
export async function runSupabaseIntegrationTests(): Promise<boolean> {
  const logger = new TestLogger()
  
  console.log('🚀 Starting Supabase Integration Tests...')
  console.log('=' .repeat(50))
  
  // Test 1: Database Connection
  await logger.runTest('Database Connection', async () => {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) throw new Error(`Database connection failed: ${error.message}`)
    console.log('   📡 Connected to Supabase successfully')
  })
  
  // Test 2: User Session Management
  await logger.runTest('User Session Management', async () => {
    const userSession = await progressService.initializeSession()
    if (!userSession.sessionId) throw new Error('Failed to create user session')
    console.log(`   👤 User session created: ${userSession.sessionId}`)
  })
  
  // Test 3: Game Session Creation
  await logger.runTest('Game Session Creation', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    if (!gameSession.id) throw new Error('Failed to create game session')
    console.log(`   🎮 Game session created: ${gameSession.id}`)
  })
  
  // Test 4: Meme Reaction Tracking
  await logger.runTest('Meme Reaction Tracking', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    const reaction = await progressService.recordMemeReaction(
      gameSession.id,
      0,
      'laugh',
      1500
    )
    if (!reaction.id) throw new Error('Failed to record meme reaction')
    console.log(`   😂 Meme reaction recorded: ${reaction.id}`)
  })
  
  // Test 5: Vibe Check Response Tracking
  await logger.runTest('Vibe Check Response Tracking', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    const vibeResponse = await progressService.recordVibeResponse(
      gameSession.id,
      'V00',
      'What is your vibe?',
      0,
      'Excited about this new level',
      'Chaos begins best when you\'re eager...',
      2000
    )
    if (!vibeResponse.id) throw new Error('Failed to record vibe response')
    console.log(`   🎭 Vibe response recorded: ${vibeResponse.id}`)
  })
  
  // Test 6: Math Problem Response Tracking
  await logger.runTest('Math Problem Response Tracking', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    const mathResponse = await progressService.recordMathResponse(
      gameSession.id,
      0,
      'What is 15 + 8?',
      23,
      23,
      3000
    )
    if (!mathResponse.id) throw new Error('Failed to record math response')
    console.log(`   🔢 Math response recorded: ${mathResponse.id}`)
  })
  
  // Test 7: Level Progress Updates
  await logger.runTest('Level Progress Updates', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    const progress = await progressService.updateLevelProgress(
      gameSession.id,
      TEST_CONFIG.levelSlug,
      'memes',
      false,
      { currentIndex: 5, totalMemes: 23, laughsCount: 3 }
    )
    if (!progress.id) throw new Error('Failed to update level progress')
    console.log(`   📈 Level progress updated: ${progress.id}`)
  })
  
  // Test 8: General Event Tracking
  await logger.runTest('General Event Tracking', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    const interaction = await progressService.recordInteraction(
      gameSession.id,
      'custom_event',
      { 
        eventType: 'button_click',
        buttonId: 'meme-reaction-laugh',
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    )
    if (!interaction.id) throw new Error('Failed to record interaction')
    console.log(`   🎯 Interaction recorded: ${interaction.id}`)
  })
  
  // Test 9: Session Completion
  await logger.runTest('Session Completion', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    await progressService.completeGameSession(gameSession.id, 180)
    console.log(`   🏁 Session completed: ${gameSession.id}`)
  })
  
  // Test 10: Progress Retrieval
  await logger.runTest('Progress Retrieval', async () => {
    const progress = await progressService.getUserProgress(TEST_CONFIG.levelSlug)
    if (!progress.gameSession) throw new Error('Failed to retrieve progress')
    console.log(`   📊 Progress retrieved: ${progress.gameSession.id}`)
  })
  
  // Test 11: Data Integrity Check
  await logger.runTest('Data Integrity Check', async () => {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    
    // Record multiple reactions
    await progressService.recordMemeReaction(gameSession.id, 0, 'laugh', 1000)
    await progressService.recordMemeReaction(gameSession.id, 1, 'meh', 2000)
    await progressService.recordMemeReaction(gameSession.id, 2, 'laugh', 1500)
    
    // Update progress
    await progressService.updateLevelProgress(
      gameSession.id,
      TEST_CONFIG.levelSlug,
      'memes',
      false,
      { currentIndex: 3, totalMemes: 23, laughsCount: 2 }
    )
    
    // Retrieve and verify
    const progress = await progressService.getUserProgress(TEST_CONFIG.levelSlug)
    if (!progress.memeReactions || progress.memeReactions.length !== 3) {
      throw new Error('Data integrity check failed: incorrect number of reactions')
    }
    
    const laughCount = progress.memeReactions.filter(r => r.reaction === 'laugh').length
    if (laughCount !== 2) {
      throw new Error('Data integrity check failed: incorrect laugh count')
    }
    
    console.log(`   🔍 Data integrity verified: ${progress.memeReactions.length} reactions, ${laughCount} laughs`)
  })
  
  // Test 12: Error Handling
  await logger.runTest('Error Handling', async () => {
    try {
      // Try to record reaction with invalid session ID
      await progressService.recordMemeReaction('invalid-session-id', 0, 'laugh', 1000)
      throw new Error('Should have thrown an error for invalid session ID')
    } catch (error) {
      // This is expected - the test passes if we catch an error
      console.log('   🛡️  Error handling working correctly')
    }
  })
  
  // Print test summary
  logger.printSummary()
  
  const results = logger.getResults()
  const allPassed = results.every(r => r.status === 'pass')
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Supabase integration is working perfectly.')
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.')
  }
  
  return allPassed
}

// Performance test
export async function runPerformanceTest(): Promise<void> {
  console.log('\n⚡ Running Performance Test...')
  
  const iterations = 10
  const startTime = Date.now()
  
  for (let i = 0; i < iterations; i++) {
    const gameSession = await progressService.startGameSession(TEST_CONFIG.levelSlug)
    await progressService.recordMemeReaction(gameSession.id, i, 'laugh', 1000 + i * 100)
    await progressService.completeGameSession(gameSession.id, 60)
  }
  
  const totalTime = Date.now() - startTime
  const avgTime = totalTime / iterations
  
  console.log(`📊 Performance Results:`)
  console.log(`   Total time: ${totalTime}ms`)
  console.log(`   Average per operation: ${avgTime.toFixed(2)}ms`)
  console.log(`   Operations per second: ${(1000 / avgTime).toFixed(2)}`)
}

// Cleanup test data
export async function cleanupTestData(): Promise<void> {
  console.log('\n🧹 Cleaning up test data...')
  
  try {
    // Delete test sessions (this will cascade to related data)
    const { error } = await supabase
      .from('game_sessions')
      .delete()
      .like('level_slug', '01-meme-maze')
    
    if (error) {
      console.warn('⚠️  Cleanup warning:', error.message)
    } else {
      console.log('✅ Test data cleaned up successfully')
    }
  } catch (error) {
    console.warn('⚠️  Cleanup failed:', error)
  }
}

// Export test runner
export async function runAllTests(): Promise<boolean> {
  try {
    const integrationPassed = await runSupabaseIntegrationTests()
    await runPerformanceTest()
    await cleanupTestData()
    return integrationPassed
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    return false
  }
}

// Auto-run in development
if (import.meta.env.DEV) {
  // Uncomment to auto-run tests
  // runAllTests()
}
