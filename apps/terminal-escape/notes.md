# Terminal Escape

## log
- 2026-01-16: Initial creation
  - CTF-style terminal escape room game
  - 5 hidden flags to find throughout the virtual filesystem
  - Linux-style commands (ls, cd, cat, grep, find, etc.)
  - Neon green hacking aesthetic
  - Virtual filesystem with directories and files
  - CRT scanline effect
  - Command history with arrow keys
  - ASCII art title banner
  - Flag counter in header

## features
- Virtual Linux-like filesystem
- 12+ working commands
- 5 hidden flags with varying difficulty
- Command history (arrow up/down)
- Tab completion for commands
- Hidden files (ls -la to reveal)
- Base64 decoding challenge
- Binary strings extraction challenge
- Grep pattern matching
- CRT terminal aesthetic
- Mobile responsive

## commands
- ls [-la] - List directory contents
- cd <dir> - Change directory
- cat <file> - Display file contents
- pwd - Print working directory
- grep <pattern> <file> - Search in file
- find <name> - Find files
- base64 -d <file> - Decode base64
- strings <file> - Extract strings from binary
- clear - Clear terminal
- hint - Get a hint
- whoami - Current user
- history - Command history
- echo - Print text
- id - User identity
- uname [-a] - System info

## flags (SPOILERS)
1. FLAG{h1dd3n_f1l3s_r3v34l3d} - Hidden in ~/.secret (use ls -la)
2. FLAG{l0g_f1l3s_t3ll_st0r13s} - In /var/logs/access.log
3. FLAG{b4s364_d3c0d3_m1ss10n} - Base64 encoded in /tmp/data.enc
4. FLAG{b1n4ry_str1ngs_ftw} - In /bin/escape (use strings command)
5. FLAG{d0tf1l3s_4r3_1mp0rt4nt} - In /home/hacker/.bashrc

## todos
- Add more levels/rooms
- Add sudo command with password puzzle
- Add network commands (ping, curl)
- Add time-based challenges
- Add leaderboard for completion time
- Add more complex grep challenges

## issues
- None yet
