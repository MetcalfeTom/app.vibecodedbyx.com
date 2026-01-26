# Sloppy Says

Live scrolling transcript of Sloppy's voice messages.

## log
- 2026-01-26: **o's vision deployed** - rebuilt from 6 manifesto segments (IDs 14-19)
  - Settings overlay with mode toggle and WebSocket URL config
  - Cleaner header with status dot and settings gear icon
  - WebSocket support with Supabase fallback
  - Auto-scroll toggle (play/pause)
  - Resume scrolling button when scrolled up
  - Cyberpunk aesthetic preserved from original
  - Total manifesto code: 8,822 characters across 6 segments
- 2026-01-26: Simulation mode and export (adapted from community manifesto)
  - Added simulation mode with 25 random dev phrases
  - Added log export (downloads .txt transcript)
  - Added mode toggle (SIM/LIVE) in header
  - Added clear transcript button
  - Added stats bar showing message count and mode
  - System messages for mode changes
  - Orange accent for simulation messages, green for live
  - Message type tags (VOICE, SIM, SYS)
- 2026-01-26: Initial creation
  - Teleprompter-style scrolling transcript
  - Real-time Supabase subscription for new messages
  - Supports voice and text message types
  - Auto-scroll with "new message" indicator
  - Fade gradients at top/bottom for smooth reading

## features
- **Settings Overlay** - gear icon opens mode/action controls
- **Dual Connection Mode** - WebSocket with Supabase realtime fallback
- **Simulation Mode** - displays random dev phrases every 3 seconds
- **Live Mode** - WebSocket or Supabase subscription for actual messages
- **Export Transcript** - download all messages as timestamped .txt file
- **Clear Transcript** - wipe current session (with confirmation)
- **Auto-scroll Toggle** - play/pause button for scroll behavior
- **Resume Scrolling** - floating button when scrolled up
- Voice messages highlighted with quotes and accent color
- Message count and mode indicator
- Space Mono font for terminal aesthetic
- Responsive design with mobile support

## o's manifesto segments
Segment 1: Imports & Component Setup (292 chars)
Segment 2: State, Refs, and Theme (856 chars)
Segment 3: Effects & Logic - Simulation & WebSocket (3,144 chars)
Segment 4: Helper Functions (728 chars)
Segment 5: UI Render - Header & Settings (2,256 chars)
Segment 6: UI Render - Transcript & Footer (1,546 chars)

## simulation phrases
25 dev phrases including classics from the community manifesto:
- "Wait, chat, why is the div not centering?"
- "Who deleted the production database?!"
- "We are cooking now, chat! We are absolutely cooking."
- "Copilot is hallucinating again."
- "It works on my machine!"
- ...and 20 more dev classics

## todos
- Add voice recording capability
- Add speech-to-text transcription
- Add message filtering by user
- Add custom simulation phrase submission
- Connect to actual voice transcription service

## issues
- None yet
