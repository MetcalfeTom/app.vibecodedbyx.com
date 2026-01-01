# WebOS

## log
- 2025-01-01: Added curl command with real API fetching and mock endpoints
- 2025-01-01: Added ping command with simulated network responses
- 2025-01-01: Initial creation - full web-based operating system

## features
- Complete desktop environment with draggable/resizable windows
- Persistent file system (localStorage)
- Bash-like terminal with 20+ commands
- File manager with navigation
- Text editor with save/open functionality
- Start menu and taskbar with clock
- Context menu (right-click)
- Window management (minimize, maximize, focus)

## terminal commands
- ls, cd, pwd - directory navigation
- cat, touch, mkdir, rm - file operations
- cp, mv - copy and move
- echo (with > and >> redirection)
- curl <url> - fetch from real APIs or mock endpoints
- wget - alias for curl
- ping <host> - simulated ping
- clear, whoami, date, uname, history, exit

## mock APIs
- mock://weather - weather data
- mock://user - user profile
- mock://posts - blog posts
- mock://time - current time
- mock://system - system info

## technical
- Class-based architecture (FileSystem, WindowManager, Terminal, etc.)
- Virtual file system with directories and files
- Tab completion in terminal
- Command history with arrow keys
- localStorage persistence

## issues
- CORS blocks many real API endpoints (use mock:// for demos)

## todos
- Add grep command
- Add nano/vim text editor mode
- Add calculator app
- Add image viewer
- Add more window themes
