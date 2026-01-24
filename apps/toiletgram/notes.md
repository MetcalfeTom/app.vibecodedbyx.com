# Toiletgram

The social feed for your throne time.

## log
- 2026-01-24: Moved radio player to Radio tab only, added shuffle/random track selection
- 2026-01-24: Added global radio player, audio upload, and profile editing (nickname + avatar color)
- 2026-01-24: Replaced emoji avatars with canvas-generated identicons, made all nav tabs functional
- 2026-01-24: Replaced sidebar with 2015 maximalist blue-purple-pink gradient header
- 2026-01-24: Added responsive desktop layout, dark mode toggle, Instagram-style nav bar
- 2026-01-24: Initial creation - mobile-first feed with toilet theme

## features
- Global loopable radio player with prev/play/next controls
- Audio upload to shared playlist (max 5MB, base64 stored)
- Profile editing: change nickname and avatar color
- Canvas-generated identicons with customizable color
- Fully functional navigation: Home, Search, Post, Radio, Profile
- Clean blue header with Lobster font
- Dark mode toggle with localStorage persistence
- Instagram-style navigation (Home, Search, Create, Reels, Profile)
- Compose modal with image upload preview
- Mobile-first phone-frame design (max 420px)
- Brown and porcelain white color palette
- Toilet paper edge decorations with perforated lines
- TP-style scrollbar
- Skibidi toilet head animation in logo
- Floating toilet/TP/plunger decorations
- Post "unroll" animation (like unrolling TP)
- Flush (upvote) and Stink (downvote) reactions
- Random toilet-themed avatars and usernames
- Real-time updates via Supabase
- Error catcher for debugging

## database
- toiletgram_posts: username, avatar, content, image_url, flush_count, stink_count
- toiletgram_radio: title, artist, audio_url, duration, username, play_count

## color palette
- Porcelain: #f5f0e8
- Brown: #8b6914
- Poop brown: #6b4423
- TP white: #fdfcfa
- Flush blue: #4fc3f7
- Stink green: #9ccc65

## todos
- Add image upload
- Add user profiles
- Add comment threads
- Add "golden throne" badge for top posts
- Add toilet sound effects
