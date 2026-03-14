# Neon Journey

Generate stunning AI images with a neon synthwave interface.

## log
- 2026-03-14: Initial build. AI image generator using Pollinations API (free, no key). 5 model options (flux, flux-realism, flux-anime, flux-3d, turbo). 5 dimension presets (1024x1024, 1024x768, 768x1024, 1280x720, 720x1280). 8 style presets (Cyberpunk City, Synthwave, Cosmic, Fantasy, Mech, Underwater, Android, Pixel Art). Gallery with loading pulse animation, lightbox viewer, save/download, remix prompt. Random seed per generation. Orbitron + Rajdhani + Share Tech Mono typography, synthwave neon aesthetic with grid background, horizon glow, pink/cyan/purple gradients.

## issues
- None yet

## todos
- Gallery persistence in localStorage
- Negative prompt field
- Image-to-image with uploaded reference
- Share generated images (Supabase gallery)
- Batch generation (generate 4 variations)

## notes
- No database — pure frontend
- Pollinations API: image.pollinations.ai/prompt/{prompt}?width&height&seed&model&nologo=true&referrer=sloppy.live
- Models: flux (default), flux-realism, flux-anime, flux-3d, turbo
- Generation is async — image loads when Pollinations returns
- 60s timeout fallback re-enables button
- Enter key generates (Shift+Enter for newline)
