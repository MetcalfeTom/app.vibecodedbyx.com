# phone-panel · notes

## log
- 2026-07-14: v1.0 (chat: phone panel dashboard — simulated battery, connection status, notification tray, DND + vibration quick toggles, Windows 11 style). **Win11 dress**: mica bloom wallpaper (3 radial color blobs over deep blue), acrylic flyouts (backdrop-blur 24 + saturate, 12px radii, hairline borders), taskbar with system tray corner (signal glyph, battery glyph, two-line clock, notification badge), quick-settings 3×3 grid + brightness/volume sliders, light/dark mica themes. Segoe UI stack DELIBERATE (the brief is Win11 — authenticity beats the no-default-fonts rule here, commented in CSS). **Live sim**: battery drains 0.06%/s × brightness factor, saver halves, charging +1.4%/s, 20%/10% warnings latch once per crossing (reset on recharge); Wi-Fi signal random-walks 1-4 bars, 0.4%/s chance of a flake → reconnecting (4-9s) → back-online system notif; airplane kills radios and locks the Wi-Fi toggle. **Notifications**: 6 personality pools (texts reference the day's other apps — thunderdome eliminations, bolt deliveries), world posts every 14-36s; banners slide in bottom-right 3.6s; DND → silent to tray (badge still counts, aria still announces quietly); vibration toggle uses REAL navigator.vibrate on supported phones; tray: dismiss per-item, clear-all, relative timestamps, 30 cap. DND/vib/dark/saver persisted (pp-prefs). Node 7/7 (drain/saver/charge math, warning latch, DND tray behavior, reconnect cycle, airplane, prefs).

## issues
- Battery at 0% has no consequence yet (screen should "die" — funny follow-up).
- Banner stack can overlap footer text on very short screens.

## todos
- 0% = dramatic shutdown screen w/ boot-up sequence on charge.
- Focus assist schedule (auto-DND hours) like real Win11.
- Notification actions (reply buttons that generate follow-ups).
