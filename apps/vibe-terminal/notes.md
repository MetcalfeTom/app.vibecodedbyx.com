# Vibe Terminal

Safe simulated terminal environment with a fake filesystem and fun commands.

## log
- 2026-03-18: Initial build. Simulated terminal with CRT scanline/vignette effects. Virtual filesystem with ~40 nodes (dirs, files with humorous content). 25+ commands: ls, cd, cat, pwd, tree, find, grep, echo (with $VAR expansion), env, export, uname, uptime, neofetch, fortune, cowsay, matrix (animated), hack (animated sequence), vibe-check, coffee, ping, history, about. Tab completion for commands and paths. Arrow key history navigation. Ctrl+L to clear. Easter eggs: sl, sudo, vim, rm -rf, git blame, npm install, python, node. Safe by design — no real filesystem access, no deletion, no network. Fira Code typography, green-on-black terminal aesthetic with CRT overlay.

## issues
- None yet

## todos
- Writable filesystem (in-memory, lost on refresh)
- Pipe support (cmd1 | cmd2)
- Custom themes (change terminal colors)
- ASCII art gallery command

## notes
- No database — pure frontend
- All filesystem data is a JS object, read-only
- Commands are a simple dispatch table
- Tab completion works for both commands and paths
- History uses arrow keys, stored in array
