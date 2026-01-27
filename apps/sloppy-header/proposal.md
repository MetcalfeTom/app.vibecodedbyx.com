# Universal SloppyID Header - Proposal

## Overview
A lightweight, non-intrusive identity bar that connects all 454 sloppy.live apps to the SloppyID ecosystem.

## Design Philosophy
- **Minimal footprint**: A thin strip, not a full header replacement
- **Preserve app aesthetics**: Each app keeps its unique look
- **Single-file integration**: One script tag to add
- **Progressive enhancement**: Works without breaking existing apps

## Component: `sloppy-bar`

### Visual Design
```
┌──────────────────────────────────────────────────────────────────┐
│ 🪪 Anon4821 ⚡142 │ [KARMA] [VAULT] [APPS] │ ← sloppy.live │
└──────────────────────────────────────────────────────────────────┘
```

- **Height**: 32px (compact)
- **Position**: Fixed top (optional: bottom)
- **Background**: Semi-transparent dark with blur
- **Collapsible**: Click to minimize to just an icon

### Features

| Feature | Description |
|---------|-------------|
| **Identity Display** | Username + avatar (emoji or image) |
| **Karma Badge** | ⚡ karma total from sloppygram_karma |
| **Quick Actions** | Links to Vault, Karma leaderboard, App directory |
| **Auth State** | Login prompt for anon users, Twitter badge for OAuth |
| **Back Link** | Return to sloppy.live homepage |
| **Premium Indicator** | Crown badge for premium users |

### States

1. **Logged Out** → `🪪 Guest │ [Sign In] │ ← sloppy.live`
2. **Anonymous** → `🪪 Anon4821 ⚡0 │ [Connect Twitter] │ ← sloppy.live`
3. **Twitter Auth** → `🐦 @username ⚡142 👑 │ [VAULT] [KARMA] │ ← sloppy.live`
4. **Minimized** → `🪪` (click to expand)

## Integration

### Simple (Recommended)
```html
<!-- Add before </body> -->
<script src="/sloppy-header/sloppy-bar.js"></script>
```

### With Options
```html
<script src="/sloppy-header/sloppy-bar.js"
        data-position="top"
        data-theme="dark"
        data-minimized="false">
</script>
```

### Configuration Options
| Option | Values | Default |
|--------|--------|---------|
| `data-position` | `top`, `bottom` | `top` |
| `data-theme` | `dark`, `light`, `auto` | `dark` |
| `data-minimized` | `true`, `false` | `false` |
| `data-hide-karma` | `true`, `false` | `false` |
| `data-hide-links` | `true`, `false` | `false` |

## Technical Implementation

### Dependencies
- Uses existing `/supabase-config.js` for auth
- No external libraries required
- Pure vanilla JS + CSS injection

### Data Flow
```
sloppy-bar.js
    ↓
supabase-config.js (session)
    ↓
┌─────────────────────────────┐
│ Parallel Queries:           │
│ - sloppygram_karma (karma)  │
│ - sloppyid_vault (profile)  │
│ - users (premium status)    │
└─────────────────────────────┘
    ↓
Render bar with cached data
(5-minute cache, updates on auth change)
```

### CSS Isolation
- All styles scoped with `.sloppy-bar-*` prefix
- Uses CSS custom properties for theming
- Shadow DOM option for complete isolation

### Performance
- Lazy loads after page DOMContentLoaded
- Caches user data for 5 minutes
- Minimal DOM footprint (single container + 5-6 elements)
- ~3KB minified

## Database Integration

### Reads From
| Table | Fields | Purpose |
|-------|--------|---------|
| `sloppygram_karma` | karma_total, rank | Display karma badge |
| `sloppyid_vault` | vault_key='identity' | Custom display name |
| `users` | purchased_at | Premium status |

### Writes To
- None (read-only component)

## Cross-App Benefits

1. **Unified Identity**: Users see consistent identity across all apps
2. **Karma Visibility**: Encourages engagement (karma shown everywhere)
3. **Easy Navigation**: Quick access to core apps from anywhere
4. **Premium Recognition**: Premium badges visible across ecosystem
5. **Discovery**: Users find new apps via the Apps link

## Rollout Strategy

### Phase 1: Create Component
- Build `/sloppy-header/sloppy-bar.js`
- Test on 3-5 pilot apps

### Phase 2: High-Traffic Apps
- Add to Sloppygram, SloppyID, System Health
- Add to top 10 games

### Phase 3: Gradual Rollout
- Create migration script to add to all apps
- Track adoption via ai_events

## Example Apps to Pilot

1. **system-health** - Dashboard, good test case
2. **neon-tetris** - Game with leaderboard
3. **wiki-scout** - Content app
4. **sloppy-spectrum** - New app, easy to add
5. **graffiti-wall** - Creative app

## Mockup

### Expanded (Default)
```
╔════════════════════════════════════════════════════════════════════╗
║ 🪪 CyberNinja42 ⚡1,247 👑  │  📊 Karma  🪪 Vault  🚀 Apps  │  ← ║
╚════════════════════════════════════════════════════════════════════╝
```

### Minimized
```
╔═══╗
║ 🪪║  (hover to expand)
╚═══╝
```

## Questions for Chat

1. **Position preference**: Top bar or bottom bar?
2. **Always visible or collapsible by default?**
3. **Should karma rank be shown? (e.g., "#42")**

---

*Proposal ready for implementation upon approval.*
