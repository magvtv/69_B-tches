# Spotify Integration Setup Guide

This guide will help you set up the Spotify Web API integration for the Songs of Origin level.

## Prerequisites

1. A Spotify account
2. Node.js 20.x or higher
3. Your project environment variables configured

## Step 1: Create a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - **App name**: `Harley Circus Songs`
   - **App description**: `Music challenge game for Songs of Origin level`
   - **Website**: `http://localhost:5173` (for development)
   - **Redirect URI**: Not needed for Client Credentials flow
5. Accept the terms and create the app

## Step 2: Get Your Credentials

1. In your app dashboard, click on "Settings"
2. Copy the **Client ID** and **Client Secret**
3. **No Redirect URI needed** - we're using Client Credentials flow

## Step 3: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Add your Spotify credentials to `.env`:
   ```env
   # Spotify Web API Configuration
   VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id-here
   VITE_SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here
   ```

## Step 4: Generate Songs Data

Run the songs data generation script to fetch real data from Spotify:

```bash
npm run generate:songs
```

This script will:

- Search for each song on Spotify
- Get album covers
- Fetch lyrics from external APIs
- Generate challenge options
- Update `meta.json` with real data

## Step 5: Test the Integration

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to the Songs of Origin level
3. The level should now display:
   - Real album covers instead of text options
   - Actual song data from Spotify
   - Working audio integration

## Troubleshooting

### Common Issues

**1. "Invalid Client" Error**

- Verify your Client ID and Secret are correct
- Check for extra spaces or characters
- Ensure the credentials are properly set in `.env`

**2. "Redirect URI Mismatch"**

- Not applicable for Client Credentials flow - no redirect URI needed

**3. "No tracks found"**

- The song might not be available on Spotify
- Try adjusting the search query in the script
- Check if the artist name or song title has special characters

**4. "Lyrics not found"**

- Some songs might not have lyrics available
- The script will skip songs without lyrics
- You can manually add lyrics to `meta.json` if needed

### Rate Limiting

Spotify has rate limits for API calls. If you encounter rate limiting:

- The script includes delays between requests
- You can increase the delay in `songsDataGenerator.ts`
- Consider running the script during off-peak hours

### Development vs Production

For production deployment:

1. Update the environment variables for production
2. Ensure your production domain is whitelisted in Spotify (if needed)

## API Endpoints Used

- **Search**: `GET https://api.spotify.com/v1/search`
- **Track Details**: `GET https://api.spotify.com/v1/tracks/{id}`
- **Album Covers**: Retrieved from track details

## Lyrics Services

The integration uses multiple lyrics services as fallbacks:

- `lyrics.ovh` (primary)
- `lyricsapi.com` (fallback)
- Genius API (planned for future)

## File Structure

```
src/
├── lib/
│   ├── spotify.ts              # Spotify API service
│   ├── lyricsService.ts        # Lyrics fetching service
│   └── songsDataGenerator.ts   # Data generation script
├── components/
│   └── AlbumCoverChallenge.vue # Album cover challenge component
├── pages/
│   └── auth/
│       └── SpotifyCallback.vue # OAuth callback handler
└── scripts/
    └── generate-songs-data.js  # Data generation script
```

## Next Steps

1. **Album Cover Caching**: Implement caching for album covers to improve performance
2. **Lyrics Enhancement**: Add more lyrics services for better coverage
3. **Audio Preview**: Integrate Spotify's preview URLs for song snippets
4. **User Playlists**: Allow users to create custom challenges from their playlists

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Spotify app settings
3. Ensure all environment variables are set correctly
4. Check the network tab for failed API requests

For Spotify API specific issues, refer to the [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api/).
