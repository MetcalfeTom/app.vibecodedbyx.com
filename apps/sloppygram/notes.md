# Sloppygram

Global chatroom social network with image uploads, avatars, and a drawing tool.

## log
- 2026-01-24: SloppyFM Winamp widget - draggable floating player with lo-fi/vaporwave synth tracks, visualizer, playlist
- 2026-01-24: Away status/messages - set custom status shown in user list, persisted to localStorage, broadcasts via presence
- 2026-01-24: Image lightbox - click images to view in overlay instead of window.open
- 2026-01-24: Dynamic tag cloud visualization - neon colors, size by frequency, real-time updates, click to filter
- 2026-01-24: Added missing renderMessages function for filter clearing, verified mobile menu HTML complete
- 2026-01-24: Implemented real tag/mention filtering - click #tags to filter chat, @mentions show user messages, filter bar with clear button
- 2026-01-24: New mobile menu system - dropdown menu with all actions, toggleMobileMenu function, desktop/mobile button separation
- 2026-01-24: Enhanced mobile drawer with header/footer, fixed all delete button scopes (isOwnDoodle, isOwnManifesto) to use user_id
- 2026-01-24: Fixed isOwnMessage to use user_id check, fixed handleTagInput function collision, enhanced tag-input CSS
- 2026-01-24: Created sloppygram_message_tags table with RLS policies for chat tagging system
- 2026-01-24: Added Ralph Wiggum bot, Gold Master dataURLtoBlob and Share URL upgrades
- 2026-01-24: Chat tagging system (#tags, @mentions) and enhanced mobile menu logic
- 2026-01-24: Legacy syntax refactor - replaced 37 optional chaining instances with && checks for older browser support
- 2026-01-23: Added fiat section to support modal - Ko-fi, PayPal, Patreon buttons above crypto grid
- 2026-01-23: Multi-crypto support modal - Bitcoin, Ethereum, Solana, Monero + Stripe (2x2 grid layout)
- 2026-01-23: Full support modal system - CSS grid layout, donate button, improved clipboard logic with toast
- 2026-01-23: Mobile flexbox refactor - replaced 100dvh calc() with flex:1, added safe-area-inset padding
- 2026-01-23: Removed profile card cache - stats now always fetched fresh from database
- 2026-01-23: Profile cards now show upvotes/downvotes from user's posts (green ▲ / red ▼)
- 2026-01-23: Added eraser tool to collaborative canvas (🧽 button, wider brush, syncs with other users)
- 2026-01-23: Added rebootSystem function with glitchy overlay, flushes all memory caches and reinitializes
- 2026-01-23: Added System tab in settings with reboot button and hacker markup reference
- 2026-01-23: Added [spoiler] tag - click to reveal hidden text
- 2026-01-23: Added hacker markup tags - [shake], [rainbow], [matrix], [glitch], [pulse], [wave] for animated text in chat
- 2026-01-23: Added delete for manifestos and nested comments for doodles
- 2026-01-23: Fixed snapshot: rate limit bug (was ignoring return object), use uploadToStorage helper, fix white-image with temp canvas
- 2026-01-23: Added snapshot function to collab canvas - captures canvas and posts to doodles feed, logs ai_event
- 2026-01-23: Collab canvas now persists strokes to database - new users see existing art on load
- 2026-01-23: Collab canvas clear now only removes user's own strokes - stroke history tracks ownership, broadcasts clear_user event
- 2026-01-23: Enhanced collab canvas - fixed coordinate offset, increased to 1600x1000, added zoom (scroll/buttons) and pan (scroll overflow)
- 2026-01-23: Added real-time collaborative canvas - draw together with other users, see cursors and strokes live
- 2026-01-23: Added profile cards - click any username to see stats (messages, posts, doodles, manifestos, likes)
- 2026-01-23: Added lazy-loading optimizer with Intersection Observer for images (100px rootMargin preload)
- 2026-01-23: Added rate limiting (sliding window) - 5 msgs/10s, 3 posts/min, 20 votes/min, 10 comments/min, 3 drawings/30s
- 2026-01-23: Added canvas undo/redo with 20-state history (Ctrl+Z/Y, ↶/↷ buttons)
- 2026-01-23: Added system-toast notification styles and fixed memory leaks (cleanup channels on unload)
- 2026-01-23: Implemented infinite scroll pagination for chat messages and posts (PAGE_SIZE=30)
- 2026-01-23: Added DOMPurify for XSS protection - sanitizes all user content, URLs blocked for javascript:/data: protocols
- 2026-01-23: Optimized queries with Promise.all batching - solved N+1 problem in loadPosts, loadManifestos, loadDoodleLeaderboard
- 2026-01-23: Migrated to Supabase Storage for images/doodles - no more base64 in database (requires 'sloppygram' bucket)
- 2026-01-23: Reverted settings sync/debug features for clean slate
- 2026-01-23: Updated all feed containers to use full viewport width on mobile
- 2026-01-23: Added touch swipe navigation for mobile - swipe left/right to switch tabs
- 2026-01-23: Removed donate button and tip jar (per chat request)
- 2026-01-23: Fixed mobile layout - full width, smooth scrolling, input stays at top
- 2026-01-23: Moved message input form to top of interface (under header/tabs)
- 2026-01-23: Fixed mobile viewport - disabled auto-zoom on inputs, added viewport-fit=cover
- 2026-01-23: Added auto-scroll to most recent message on app load
- 2026-01-23: Fixed mobile feed height - main content now uses 100dvh minus header height
- 2026-01-23: Fixed mobile sidebar CSS - sidebars now completely hidden when closed (CSS cascade fix)
- 2026-01-23: Added hamburger menu toggle for left sidebar on mobile (animated X when open)
- 2026-01-23: Updated donate modal with Bitcoin address (copy to clipboard) and Stripe placeholder
- 2026-01-23: Added Donate button with gold coin icon to sidebar
- 2026-01-23: Fixed posts/doodles not loading (removed reference to deleted transparencyBar)
- 2026-01-23: Fixed theme to cover entire UI - panel background now updates dark-bg and border-color
- 2026-01-23: Added full interface theme customization - accent color, highlight color, panel background (10 options each)
- 2026-01-23: Added custom sound file upload (base64, max 500KB) with preview and clear buttons
- 2026-01-23: Fixed notification sounds - audio context resume for browser autoplay policy
- 2026-01-23: Added Themes tab in settings - message opacity slider, message color customization (10 colors each)
- 2026-01-23: Replaced trash icons with simple "delete" text for cleaner look
- 2026-01-23: Added settings menu with tabs (Profile, Themes, Sounds) - replaced profile button
- 2026-01-23: Added notification sounds library with 7 procedural sounds (Web Audio API)
- 2026-01-23: Reorganized chat layout - input at bottom, messages flow top-to-bottom (traditional chat style)
- 2026-01-23: Added comment voting - up/down votes on comments with ▲/▼ buttons
- 2026-01-23: Added AI event logging - logs post_created and vote_cast events to ai_events table
- 2026-01-23: Simplified voting - removed reputation system, added delete buttons for messages/doodles
- 2026-01-23: Added up/down voting (▲/▼) for posts, doodles, chat - prevents self-voting, shows net scores
- 2026-01-23: Enhanced power system - vote on chat messages (🔥), doodles (⭐), posts, manifestos; all contribute to user power score
- 2026-01-23: Added user reputation system - earn badges from post likes and manifesto votes (👑⭐✨🌟)
- 2026-01-23: Added Supabase realtime listeners for posts, comments, reactions, likes, manifestos - auto-refresh feed
- 2026-01-23: Added threaded comments - reply directly to existing comments with nested display
- 2026-01-23: Enhanced Manifesto with emoji reactions, comments, and tags (like posts)
- 2026-01-23: Added Manifesto section - declare your ideas, vote for visions you support
- 2026-01-22: Added nested symbolic tagging system - hierarchical tags with parent/child, filter by tag, trending tags sidebar
- 2026-01-22: Added emoji reactions to posts (8 emojis) and global shared backgrounds
- 2026-01-22: Replaced URL inputs with file uploads for avatar and background images
- 2026-01-22: Added doodle leaderboard with global voting - star your favorite drawings!
- 2026-01-22: Fixed auth persistence - added explicit session storage options and auth state listener
- 2026-01-22: Added posts system with image URLs, local file preview, likes, and comments
- 2026-01-22: Added custom avatar URL, custom background URL, and profile reset
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
- Posts feed with image URLs and local file upload
- Like and unlike posts
- Comment on posts
- Threaded comments - reply directly to comments with nested display
- Doodle leaderboard with global voting
- Vote on drawings with star button
- Ranked doodle display (gold/silver/bronze)
- Emoji reactions on posts (😂🔥❤️😮😢👏🙌💀)
- Global shared backgrounds (upload and share with everyone)
- Nested symbolic tagging (use "/" for hierarchies like meme/cursed, art/pixel)
- Filter posts by clicking tags
- Trending tags sidebar showing most popular tags
- Manifesto board for declaring ideas and visions
- Vote for manifestos you support
- Up/down voting (▲/▼) on posts, doodles, and chat messages
- Self-voting prevention - cannot vote on own content
- Net score display (green positive, red negative)
- Delete your own posts, messages, and doodles
- Settings menu with tabbed interface (Profile, Sounds)
- Notification sounds library (blip, chime, pop, retro, cyber, whoosh, ding)
- Volume control for notification sounds
- Sounds saved to localStorage
- Rate limiting on all actions (sliding window algorithm)
- Canvas undo/redo with keyboard shortcuts
- Profile cards - click usernames to see user stats
- Lazy-loading images with Intersection Observer
- Real-time collaborative canvas - draw together, see other users' cursors live

## database tables
- sloppygram_messages: username, avatar, content, image_data, drawing_data, message_type
- sloppygram_profiles: username, avatar, bio, color
- sloppygram_posts: username, avatar, avatar_url, caption, image_url, image_data, likes_count
- sloppygram_post_likes: post_id, username
- sloppygram_doodle_votes: message_id, voter_username
- sloppygram_message_votes: message_id, voter_username
- sloppygram_post_comments: post_id, username, avatar, content
- sloppygram_post_reactions: post_id, emoji, username
- sloppygram_global_backgrounds: image_data, username, name
- sloppygram_post_tags: post_id, tag, parent_tag
- sloppygram_manifestos: title, content, username, avatar, upvotes
- sloppygram_manifesto_votes: manifesto_id, username
- sloppygram_manifesto_reactions: manifesto_id, emoji, username
- sloppygram_manifesto_comments: manifesto_id, username, avatar, content
- sloppygram_manifesto_tags: manifesto_id, tag, parent_tag
- sloppygram_global_settings: setting_type, setting_value, username, extra_data (syncs backgrounds/sounds globally)
- sloppygram_comment_threads: comment_id, parent_comment_id, comment_type, post_id
- sloppygram_comment_votes: comment_id, voter_username, vote_type
- sloppygram_collab_strokes: start_x, start_y, end_x, end_y, color, username (persisted collaborative canvas)
- sloppygram_message_tags: message_id, tag, parent_tag (chat message tagging system)
- ai_events: event_type, entity_type, entity_id, username, metadata (logs post_created, vote_cast)

## avatars
😀 😎 🤖 👽 🐱 🐶 🦊 🐼 🐸 🦄 🐲 👻 💀 🎃 🤡 👾 🥷 🧙

## colors
Pink, Purple, Deep Purple, Indigo, Blue, Cyan, Teal, Green, Orange, Deep Orange

## drawing tool
- Canvas-based drawing
- 8 brush colors (black, pink, purple, blue, green, orange, red, white)
- Undo/redo with 20-state history (Ctrl+Z, Ctrl+Y)
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
- Images/doodles uploaded to Supabase Storage bucket 'sloppygram'
- Falls back to base64 if storage bucket unavailable
- Requires 'sloppygram' bucket with public access in Supabase dashboard

## todos
- Add private messaging
- Add user online status
- Add message reactions
- Add GIF support
- Add message deletion
