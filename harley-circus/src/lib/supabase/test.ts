// Test script for Supabase integration
// This file can be used to test the Supabase connection and basic operations

import { progressService } from './progressService'
import { errorLog } from '../../config/environment'

export async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase Integration...')
  
  try {
    // Test 1: Initialize session
    console.log('1. Testing session initialization...')
    const userSession = await progressService.initializeSession()
    console.log('✅ Session initialized:', userSession.sessionId)

    // Test 2: Start game session
    console.log('2. Testing game session creation...')
    const gameSession = await progressService.startGameSession('01-meme-maze')
    console.log('✅ Game session created:', gameSession.id)

    // Test 3: Record a meme reaction
    console.log('3. Testing meme reaction recording...')
    const memeReaction = await progressService.recordMemeReaction(
      gameSession.id,
      0,
      'laugh',
      1500
    )
    console.log('✅ Meme reaction recorded:', memeReaction.id)

    // Test 4: Record a vibe response
    console.log('4. Testing vibe response recording...')
    const vibeResponse = await progressService.recordVibeResponse(
      gameSession.id,
      'V00',
      'What is your vibe?',
      0,
      'Excited about this new level',
      'Chaos begins best when you\'re eager...',
      2000
    )
    console.log('✅ Vibe response recorded:', vibeResponse.id)

    // Test 5: Record a math response
    console.log('5. Testing math response recording...')
    const mathResponse = await progressService.recordMathResponse(
      gameSession.id,
      0,
      'What is 15 + 8?',
      23,
      23,
      3000
    )
    console.log('✅ Math response recorded:', mathResponse.id)

    // Test 6: Update level progress
    console.log('6. Testing level progress update...')
    const levelProgress = await progressService.updateLevelProgress(
      gameSession.id,
      '01-meme-maze',
      'memes',
      false,
      { currentIndex: 1, totalMemes: 23, laughsCount: 1 }
    )
    console.log('✅ Level progress updated:', levelProgress.id)

    // Test 7: Record general interaction
    console.log('7. Testing general interaction recording...')
    const interaction = await progressService.recordInteraction(
      gameSession.id,
      'test_event',
      { testData: 'This is a test', timestamp: Date.now() }
    )
    console.log('✅ Interaction recorded:', interaction.id)

    // Test 8: Complete game session
    console.log('8. Testing game session completion...')
    await progressService.completeGameSession(gameSession.id, 120)
    console.log('✅ Game session completed')

    // Test 9: Get user progress
    console.log('9. Testing progress retrieval...')
    const progress = await progressService.getUserProgress('01-meme-maze')
    console.log('✅ Progress retrieved:', {
      hasGameSession: !!progress.gameSession,
      memeReactionsCount: progress.memeReactions?.length || 0,
      vibeResponsesCount: progress.vibeResponses?.length || 0,
      mathResponsesCount: progress.mathResponses?.length || 0
    })

    console.log('🎉 All tests passed! Supabase integration is working correctly.')
    return true

  } catch (error) {
    console.error('❌ Test failed:', error)
    errorLog('Supabase integration test failed', error)
    return false
  }
}

// Export for use in browser console or components
export { testSupabaseIntegration as testSupabase }

// Auto-run test in development mode
if (import.meta.env.DEV) {
  // Uncomment the line below to auto-run tests when this file is imported
  // testSupabaseIntegration()
}
