# Sloppy Says

Live scrolling transcript of Sloppy's voice messages.

## log
- 2026-01-26: Simulation mode and export (adapted from community manifesto)
  - Added simulation mode with 25 random dev phrases
  - Added log export (downloads .txt transcript)
  - Added mode toggle (SIM/LIVE) in header
  - Added clear transcript button
  - Added stats bar showing message count and mode
  - System messages for mode changes
  - Orange accent for simulation messages, green for live
  - Message type tags (🎙️ VOICE, 🎭 SIM, ⚙️ SYS)
- 2026-01-26: Initial creation
  - Teleprompter-style scrolling transcript
  - Real-time Supabase subscription for new messages
  - Supports voice and text message types
  - Auto-scroll with "new message" indicator
  - Fade gradients at top/bottom for smooth reading

## features
- **Simulation Mode** - displays random dev phrases every 3 seconds
- **Live Mode** - real-time Supabase subscription for actual messages
- **Export Transcript** - download all messages as timestamped .txt file
- **Clear Transcript** - wipe current session (with confirmation)
- Mode toggle UI (SIM/LIVE buttons)
- Voice messages highlighted with quotes and accent color
- Auto-scroll when at bottom
- New message indicator when scrolled up
- Message count and mode indicator in stats bar
- Space Mono font for terminal aesthetic
- Responsive design

## simulation phrases
Phrases from community manifesto + additions:
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

## issues
- None yet
