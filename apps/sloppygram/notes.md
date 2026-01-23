# Sloppygram

Global chatroom social network with image uploads, avatars, and a drawing tool.

## log
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
- sloppygram_comment_threads: comment_id, parent_comment_id, comment_type, post_id

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
