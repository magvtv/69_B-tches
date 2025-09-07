# Harley's Adventure Game 💕

A personalized, intimate adventure game built specifically for Harley. This is a playful labyrinth that's secretly about her - weaving tech into romance instead of just showing off.

## 🌟 Features

- **IP Restriction**: Only accessible from Harley's IP address
- **Time Tracking**: Monitors session time and user interactions
- **5 Adventure Levels**: Each tailored to Harley's preferences
  - 🌅 Sunset & Stargazing Challenge
  - 👩‍🍳 Culinary Adventure Challenge  
  - ⚡ Adrenaline Rush Challenge
  - 💕 Intimate Moments Challenge
  - 🎁 Final Reward

## 🎮 Game Concept

This isn't just a "I built you a website" situation. The frame is: *"I got bored, so I coded a game. You're the test subject. If you rage-quit, I'll mock you forever."*

It keeps things playful, challenging, and effortless. Harley feels chosen, not like you're seeking approval.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Update IP restriction:
   - Edit `src/App.vue`
   - Add Harley's actual IP address to the `authorizedIPs` array
   - Remove localhost IPs for production

4. Start development server:
   ```bash
   pnpm dev
   ```

5. Build for production:
   ```bash
   pnpm build
   ```

## 🔒 IP Restriction Setup

To restrict access to only Harley's IP:

1. Find Harley's current IP address
2. Update the `authorizedIPs` array in `src/App.vue`:
   ```typescript
   const authorizedIPs = [
     'HARLEY_ACTUAL_IP_HERE', // Replace with real IP
     // Remove localhost for production
   ]
   ```

## 💕 Personalization

The game is deeply personalized for Harley based on her preferences:

- **Adventures**: Love for adrenaline and new experiences
- **Sunset/Stargazing**: Her love for beautiful moments
- **Cooking**: Her passion for food and trying new spots
- **Intimate Moments**: The simple things that make her feel special
  - Massaging with olive oil
  - Whipped cream & Nutella playtime
  - Ice cream deep kisses

## 🎯 Rewards System

Each level unlocks personalized rewards:
- Sunset stargazing date
- Cooking together
- Real adventure experiences
- Intimate moments and massages
- Final package with all rewards

## 📱 Deployment

For production deployment:

1. Build the project: `pnpm build`
2. Deploy the `dist` folder to your hosting service
3. Ensure the IP restriction is properly configured
4. Test from Harley's actual IP address

## 🔧 Customization

The game can be easily customized:
- Add new levels in `src/components/`
- Modify rewards and messages
- Update the personal journal entries
- Add more interactive elements

## 💌 The Personal Touch

This isn't just a game - it's a love letter disguised as an adventure. Every element is designed to show Harley that she's seen, understood, and cherished. The intimate journal entries and personalized rewards create a connection that goes beyond just playing a game.

---

*Built with love, Vue.js, and a whole lot of thought about what makes Harley special.* 💕