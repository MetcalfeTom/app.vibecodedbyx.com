# Sloppy Support

Donation/support modal for the stream. Crypto addresses (BTC, ETH, SOL, XMR) and fiat links (Ko-fi, PayPal, Patreon). Works standalone or as an iframe embed for Sloppygram.

## log
- 2026-02-04: Initial creation — extracted from Sloppygram monolith
  - Crypto address cards with click-to-copy and toast notification
  - Fiat payment links (Ko-fi, PayPal, Patreon)
  - Stripe card payment placeholder
  - Embed mode: overlay backdrop, listens for postMessage commands
  - postMessage API: open-support → renders overlay
  - Responses: support-close, address-copied → sent to parent

## architecture
- Full-viewport overlay pattern in embed mode (same as sloppy-media)
- Parent shows/hides the iframe; iframe renders the support overlay
- Escape key closes and notifies parent
- Standalone mode shows the content directly without overlay

## data sources
- None — pure static content (crypto addresses, external payment links)

## issues
- Clipboard API for copy requires HTTPS or localhost
- Crypto addresses are placeholders (TODO comments in original monolith code)
- Stripe payment link is a placeholder

## todos
- Replace placeholder crypto addresses with actual addresses
- Set up real Stripe payment link
- Could add QR codes for crypto addresses
