# Deployment Instructions for Harley's Adventure

## 🚀 Quick Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Update IP Restriction**:
   - Get the deployed URL
   - Find Harley's IP address
   - Update `authorizedIPs` in `src/App.vue`
   - Redeploy

## 🌐 Alternative: Netlify

1. **Build the project**:
   ```bash
   pnpm build
   ```

2. **Drag and drop** the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

3. **Update IP restriction** and redeploy

## 🔒 IP Restriction Setup

### Finding Harley's IP:
1. Ask her to visit: https://whatismyipaddress.com/
2. Or use: https://api.ipify.org

### Updating the Code:
```typescript
// In src/App.vue, line ~45
const authorizedIPs = [
  'HARLEY_ACTUAL_IP_HERE', // Replace with real IP
  // Remove '127.0.0.1' for production
]
```

## 📱 Testing

1. **From your IP**: Should show "Access Restricted"
2. **From Harley's IP**: Should show the full game
3. **Test all levels** to ensure they work properly

## 🎯 Final Steps

1. **Deploy** the application
2. **Get Harley's IP** and update the restriction
3. **Test** from her IP address
4. **Send her the link** with a playful message like:
   > "I got bored, so I coded a game. You're the test subject. If you rage-quit, I'll mock you forever. 😏"
   > 
   > [Link to the game]

## 💡 Pro Tips

- **Keep it mysterious**: Don't explain what the game is about
- **Playful frame**: "You're the test subject" not "I built this for you"
- **Time pressure**: The 48-hour reward claim creates urgency
- **Personal touches**: The journal entries are the most intimate part

## 🔧 Troubleshooting

- **IP not working**: Check if she's on VPN or mobile data
- **Game not loading**: Check browser console for errors
- **Styling issues**: Ensure Tailwind CSS is properly built

---

*Remember: This is about creating intrigue and showing you understand her, not about the technology itself.* 💕
