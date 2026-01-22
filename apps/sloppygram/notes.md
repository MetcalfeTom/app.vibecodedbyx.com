# Sloppygram

Global chatroom social network with image uploads, avatars, and a drawing tool.

## log
- 2026-01-22: Removed RoastBot and neon borders - cleaner muted aesthetic
- 2026-01-22: Toned down neon glow effects, improved RoastBot with POST endpoint + timeout + more fallbacks
- 2026-01-22: Major redesign - dark 1990s cyber aesthetic, online users, public feed, AI roast bot
- 2026-01-22: Rewrote real-time with hybrid broadcast+postgres_changes - instant updates for all users
- 2026-01-22: Fixed drawing offset (canvas scaling), improved real-time subscription with status indicator
- 2026-01-22: Initial creation with full chat, images, avatars, and drawing tool

## features
- Dark retro aesthetic with muted colors and scanlines
- VT323 monospace font, CRT scanline overlay
- Marquee header with visitor counter
- Online user list with Supabase Presence
- Public activity feed sidebar
- Global real-time chatroom via Supabase
- Anonymous authentication
- Custom username and avatar
- 18 emoji avatar options
- 10 avatar background colors
- Image uploads (base64, max 500KB)
- Drawing tool with 8 brush colors
- Real-time message updates
- Message timestamps
- Own messages highlighted
- Mobile-friendly responsive design

## database tables
- sloppygram_messages: username, avatar, content, image_data, drawing_data, message_type
- sloppygram_profiles: username, avatar, bio, color

## avatars
😀 😎 🤖 👽 🐱 🐶 🦊 🐼 🐸 🦄 🐲 👻 💀 🎃 🤡 👾 🥷 🧙

## colors
Pink, Purple, Deep Purple, Indigo, Blue, Cyan, Teal, Green, Orange, Deep Orange

## drawing tool
- Canvas-based drawing
- 8 brush colors (black, pink, purple, blue, green, orange, red, white)
- Clear button
- Send as PNG
- Touch support for mobile

## message types
- text: Regular text messages
- image: Uploaded images
- drawing: Canvas drawings

## storage
- Profile saved to localStorage
- Messages stored in Supabase
- Images stored as base64 (limited to 500KB)

## todos
- Add private messaging
- Add user online status
- Add message reactions
- Add GIF support
- Add message deletion
