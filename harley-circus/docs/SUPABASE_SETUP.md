# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for tracking user progress in the Harley Circus levels.

## 1. Database Setup

### Step 1: Create Tables in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL to create all necessary tables

### Step 2: Verify Tables Created

You should see these tables in your Supabase dashboard:
- `users` - User session management
- `game_sessions` - Game session tracking
- `level_progress` - Level progress tracking
- `meme_reactions` - Meme reaction data
- `vibe_responses` - Vibe check responses
- `math_responses` - Math problem responses
- `user_interactions` - General event tracking

## 2. Environment Configuration

### Step 1: Create Environment File

1. Copy `env.example` to `.env` in your project root
2. Fill in your Supabase credentials:

```bash
cp env.example .env
```

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key
4. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=development
VITE_APP_TRACKING_ENABLED=true
VITE_APP_DEBUG_MODE=true
```

## 3. Integration Options

You have two options for integrating Supabase tracking:

### Option A: Use the Enhanced Store (Recommended)

Replace your existing store import in components:

```typescript
// Instead of:
import { useMemeMazeStore } from '@/stores/memeMaze'

// Use:
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'
```

### Option B: Use the Composable

Add tracking to any component:

```typescript
import { useSupabaseTracking } from '@/composables/useSupabaseTracking'

const tracking = useSupabaseTracking({
  levelSlug: '01-meme-maze',
  autoInitialize: true
})

// Track events
await tracking.trackEvent('custom_event', { data: 'value' })
await tracking.trackProgress('current_step', true, { completed: true })
```

## 4. Testing the Integration

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Test the Meme Maze

1. Navigate to the meme maze level
2. React to a few memes
3. Check your Supabase dashboard to see data being recorded

### Step 3: Verify Data

In your Supabase dashboard:
1. Go to Table Editor
2. Check the `game_sessions` table for new sessions
3. Check the `meme_reactions` table for reaction data
4. Check the `user_interactions` table for event tracking

## 5. Data Structure Overview

### User Session Flow

1. **User visits level** → Creates user record and game session
2. **User interacts** → Records interactions and progress
3. **User completes level** → Marks session as completed

### Key Data Points Tracked

- **Meme Reactions**: Which memes got laughs vs meh reactions
- **Reaction Times**: How long users take to react
- **Vibe Responses**: User's vibe check answers
- **Math Responses**: Math problem attempts and accuracy
- **Progress Steps**: Which parts of the level are completed
- **Session Duration**: Total time spent in level

## 6. Scaling to Other Levels

To add Supabase tracking to other levels:

1. Create a new store similar to `memeMazeSupabase.ts`
2. Define level-specific data structures
3. Add tracking calls to your components
4. Update the database schema if needed

Example for a new level:

```typescript
const tracking = useSupabaseTracking({
  levelSlug: '02-songs-origin',
  autoInitialize: true
})

// Track level-specific events
await tracking.trackEvent('song_selected', { songId: 'song-123' })
```

## 7. Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure your `.env` file is in the project root
   - Restart your development server after adding environment variables

2. **Supabase connection errors**
   - Verify your URL and anon key are correct
   - Check that your Supabase project is active

3. **Database permission errors**
   - Ensure RLS policies are set up correctly
   - Check that your anon key has the right permissions

### Debug Mode

Enable debug mode to see detailed logging:

```env
VITE_APP_DEBUG_MODE=true
```

This will show detailed logs in the browser console for all Supabase operations.

## 8. Production Considerations

### Security

- The current setup uses RLS policies that allow all operations
- For production, implement proper user authentication
- Restrict data access based on user ownership

### Performance

- Consider implementing data batching for high-frequency events
- Add indexes for frequently queried columns
- Implement data retention policies for old sessions

### Monitoring

- Set up Supabase monitoring for database performance
- Implement error tracking for failed operations
- Monitor storage usage and costs

## 9. Next Steps

1. **User Authentication**: Implement proper user accounts
2. **Analytics Dashboard**: Create admin interface to view user progress
3. **Data Export**: Add functionality to export user data
4. **Real-time Updates**: Implement real-time progress syncing
5. **Mobile Support**: Ensure tracking works on mobile devices

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Supabase project is active and accessible
3. Ensure all environment variables are set correctly
4. Check the Supabase logs for any database errors
