# Tickle-Blocker

## log
- 2026-03-29: V1 — Funny firewall app that blocks incoming "tickle threats." Big neon hex-grid shield in center of screen. Colored threat particles fly in from edges and get blocked (or breach if shield disabled). 28 tickle attack types (Feather Attack, Belly Poke, The Claw, Tickle Tornado, etc). 12 fake source IPs/domains. 13 blocked responses (Vaporized, Yeeted Into Void, Sent To Shadow Realm, etc). 7 breach responses. Live threat log, blocks counter, tickles/min rate, uptime timer, threat level indicator (Low/Moderate/High/Extreme). Shield toggle button (disable at your own peril). Canvas hex-grid shield with pulse on impact, hit flash effects. Grid background. Bungee Shade + VT323 typography, cyan/dark cyberpunk aesthetic.

## features
- Neon hex-grid shield with pulse animation
- Incoming tickle threat particles with trails
- 28 tickle attack types
- 12 fake source addresses
- 13 humorous block responses
- 7 breach responses when shield is down
- Shield toggle (enable/disable)
- Live threat log (last 12 entries)
- Blocks counter
- Tickles per minute rate
- Uptime timer
- 4-tier threat level indicator
- Hit flash effects on shield impact
- Canvas grid background

## issues
- None currently

## todos
- Sound effects (block sound, breach alarm)
- Threat difficulty escalation over time
- "Tickle Storm" event (rapid barrage)
- Statistics panel with graphs
- Share your block count

## notes
- Threat spawn rate: 3% base + 0.02% per block
- Shield radius: 22% of min(W,H)
- Shield pulse decay: 0.95 per frame
- Hit flash decay: 0.03 per frame
- TPM calculated from blocks in last 60 seconds
- Motion trails via 0.15 alpha clear
