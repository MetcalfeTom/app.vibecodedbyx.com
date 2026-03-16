# SloppyOS Installer

A sleek Linux installer web UI for "SloppyOS 4.20 Chaotic Capybara".

## log
- 2026-03-16: Initial build. 6-step installer wizard: Welcome, Disk Setup, Packages, User Setup, Install, Done. Step progress pills at top. Live terminal log sidebar with colored output (ok/warn/err/info/cmd). Disk partitioning: 3 schemes (auto, manual, encrypted LUKS), visual disk bar with colored segments, adjustable root/home split via slider, partition table display. Package selection: 4 desktop environments (SloppyWM, GNOME, KDE, TTY), 4 optional package groups with checkboxes, dynamic size calculation. User config: hostname, username, password, timezone, locale. Installation: 11-phase progress with animated check dots, progress bar, scrolling package install log with funny package names (chaos-engine, sudo-but-nicer, wifi-prayer, npm-node-modules, etc). Reboot sequence with mock systemd shutdown messages and GRUB boot screen. JetBrains Mono + IBM Plex Sans typography, dark purple/cyan palette.

## issues
- None yet

## todos
- Add BIOS vs UEFI selection
- Disk encryption passphrase input when encrypted scheme selected
- Network configuration step (WiFi SSID selection)
- Custom kernel parameter input for advanced users

## notes
- No database — pure frontend simulation
- 6 steps: Welcome → Disk Setup → Packages → User Setup → Install → Done
- Funny packages: cat-picture-downloader, ctrl-z-insurance, git-blame-deflector, etc.
- Install simulation: 200-600ms random delay per package, 11 phases
- Disk: 512GB SSD simulated, EFI 512MB, Swap 8GB, rest split between / and /home
- Desktop options: sloppy-wm (1.2GB), gnome (2.4GB), kde (2.8GB), none (0)
- Package groups: browsers (0.6G), dev (1.8G), media (0.4G), gaming (3.2G)
