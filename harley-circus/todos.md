## FEATURES TO ADD/REMOVE:
- [x] have a catchy name for the web application
- [x] change the icon for the web application
- [] might need to make it more personalized for her
- [] implement a "back-door" code that can check her interaction and choices. have them as a json and store them in some database
- [] remove the personal journal entry part. think of an alternative feature
- [] need to make the final reward as quick and scarce as possible.
- [x] update the font of the browser to a goofier one
- [] add toaster messages for her
- [] custom error pages

- [ ] Music taste: which song would she say was the first that I ever recommended to her
- [ ] Funny memes and stickers: just to make
- [ ] Sarcastic, dark-themed, romantic-tinged jokes inspired by Harley Quinn & the Joker
- [ ] Kama sutra
- [ ] Easter egg hunts: I am yet to explore this one. Hide
- [ ] A fake 404 error page on the game, just to troll her that the game is broken
- [ ] Reward of me saying something dumb and goofy after great effort in a given level.
- [ ] Small coupon or token “Reedem this for one back massage”
- [ ] Clue to be found only if she comes to my place in-person over the weekend (cheeky dares)
- [ ] Inside jokes in plenty — how good she can decode in
- [ ] Love tension and hints to something in real life and pseudo-danger vibes
- [ ] Back-door tracking system: a way to track her interactions, preferences and choices without exposing any evidence on production



## REFACTORING IMPLEMENTATION
- [] having the tracking debug componet in another folder, outside the pages
- [] a progress bar to help her track how she is moving in each challenge or level
- [] IP restricting implementation should be in a separate file, outside the pages. be able to detect her WiFi IP address, save it and never open the experience elsewhere unless she is at home. 
riding on that scarcity factor. get the wifi name to know this in advance
- [] rename the game levels into better names (multi-name issues)


## HOT FIXES WITH THE AESTHETICS
- [] the container content on the landing page is not looking great on tab view


## DEMO PLAY
- [ ] on the quiz, reduce the time per question to 10 seconds. the faster she answers the more points she gets. this points are saved and cummulatively added to the next level.
this points could help her as currency in other difficult levels
- [] for the puzzle demo
- [] merge the puzzle demo and quiz into the demo page, create a demo folder haha
- [] think of an optimized manner in which we can have the game level directory and its slug page.tsx for its corresponding ARG experience


## BACKEND TRACKING PLAN (Cross-device interactions, device info, recent scores)
- [ ] Define tracking data schema
  - [ ] User: id (anonymous or code), device fingerprint, userAgent, ip (hashed), createdAt
  - [ ] Session: sessionId, userId, startedAt, endedAt, device, geo (coarse), appVersion
  - [ ] Interaction: timestamp, sessionId, level, action, payload (JSON)
  - [ ] Score: userId, levelId, score, moves, elapsedSeconds, remainingSeconds, completedAt
- [ ] Client-side events to send
  - [ ] Hook `trackingService` to enqueue and flush interactions to backend
  - [ ] On puzzle complete: send score payload (moves, elapsed, remaining, points)
  - [ ] Capture basic device fingerprint (UA, platform, screen, timezone)
- [ ] Backend service (Node/Express or Vercel functions)
  - [ ] POST `/api/track/interaction` (batch supported)
  - [ ] POST `/api/track/score`
  - [ ] GET `/api/users/:userId/scores/recent` (last N)
  - [ ] GET `/api/users/:userId/overview` (devices, sessions, last active)
- [ ] Storage layer
  - [ ] Choose DB: SQLite (vercel/postgres) or Mongo (atlas) for JSON payloads
  - [ ] Create indexes: by userId, sessionId, createdAt
  - [ ] Add TTL/archival strategy for interactions (e.g., 30–90 days)
- [ ] Privacy & safety
  - [ ] Do not store raw IPs; hash with salt; coarse geo via edge if needed
  - [ ] Provide opt-out flag; disable in prod via env if desired
  - [ ] Redact sensitive fields in payload before storage
- [ ] Auth/identification
  - [ ] Anonymous userId cookie/localStorage with rotation strategy
  - [ ] HMAC signature on client payloads using server-issued token
- [ ] Admin dashboard (read-only)
  - [ ] Protected route: basic auth via env credentials
  - [ ] Views: Recent interactions stream, Recent scores list, Devices per user
  - [ ] Filters: by userId, level, date range
- [ ] Deployment & config
  - [ ] Env vars: `VITE_APP_TRACKING_ENABLED`, `API_BASE_URL`, `TRACKING_SECRET`
  - [ ] Vercel functions or small Express server deploy target
  - [ ] Rate limiting and basic abuse protection
- [ ] Integration plan
  - [ ] Feature-flag network sending in `trackingService`
  - [ ] Retry/backoff queue for offline support
  - [ ] Periodic flush timer and onUnload flush