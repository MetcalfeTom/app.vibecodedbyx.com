// Shared App Data - The "Rosetta Stone" of SloppyOS
// Extracted from app-taxonomist

(function() {
  const taxonomy = {
    games: {
      icon: '🎮',
      name: 'Games',
      keywords: ['game', 'clicker', 'shooter', 'platformer', 'tetris', 'snake', 'pong', 'invaders', 'arcade', 'quest', 'battle', 'fight', 'racing', 'dodge', 'jump', 'catch', 'defense', 'tower', 'puzzle', 'maze', 'chess', 'escape', 'adventure', 'runner', 'blast', 'zap', 'dash', 'slam', 'smash', 'bounce', 'stack', 'craft', 'drill', 'mash', 'flip', 'slice', 'survival', 'pinball', 'bowling', 'soccer']
    },
    tools: {
      icon: '🔧',
      name: 'Tools',
      keywords: ['tool', 'calculator', 'tracker', 'manager', 'editor', 'generator', 'finder', 'scanner', 'monitor', 'dashboard', 'audit', 'convert', 'schedule', 'vault', 'security', 'protocol', 'bridge', 'api', 'tests', 'detector', 'redact', 'translator', 'explorer', 'scout', 'search', 'taxonomist', 'gov']
    },
    art: {
      icon: '🎨',
      name: 'Art',
      keywords: ['art', 'visual', 'fractal', 'particle', 'kaleidoscope', 'lava', 'lamp', 'fluid', 'animation', 'generative', 'pixel', 'canvas', 'paint', 'draw', 'sketch', 'color', 'pattern', 'dream', 'trippy', 'psychedelic', 'effect', 'vortex', 'spiral', 'geometric', 'mesh', 'terrain', 'landscape', 'visualizer', 'sphere', 'shapes']
    },
    social: {
      icon: '💬',
      name: 'Social',
      keywords: ['social', 'chat', 'message', 'community', 'wall', 'board', 'gram', 'feed', 'post', 'comment', 'confession', 'guestbook', 'forum', 'hub', 'collab', 'share', 'diary', 'journal', 'manifesto']
    },
    finance: {
      icon: '💰',
      name: 'Finance',
      keywords: ['crypto', 'coin', 'token', 'btc', 'solana', 'eth', 'wallet', 'trade', 'market', 'price', 'chart', 'finance', 'money', 'bank', 'casino', 'slots', 'bet', 'rugpull', 'bags']
    },
    retro: {
      icon: '📺',
      name: 'Retro',
      keywords: ['retro', 'terminal', 'crt', 'dos', 'win95', 'windows', 'mac', 'os9', 'vhs', 'ascii', 'cli', 'console', 'emulator', '6502', 'sid', 'commodore', 'vintage', 'xp', 'desktop']
    },
    simulation: {
      icon: '🌍',
      name: 'Simulation',
      keywords: ['sim', 'simulation', 'sandbox', 'world', 'city', 'civilization', 'evolution', 'life', 'ecosystem', 'physics', 'gravity', 'orbital', 'space', 'planet', 'universe', 'nuclear', 'weather', 'flight']
    },
    music: {
      icon: '🎵',
      name: 'Music',
      keywords: ['music', 'synth', 'drum', 'beat', 'sound', 'audio', 'tone', 'oscillator', 'speech', 'voice', 'tts', 'radio', 'lofi', 'soundboard', 'tune']
    },
    misc: {
      icon: '📦',
      name: 'Misc',
      keywords: []
    }
  };

  const apps = [
    '6502-emulator', 'abstract-tower-defense', 'access-denied', 'accountability-hub',
    'activity-overlay', 'aegis-protocol', 'agent-manager-3d', 'akash-portfolio',
    'alien-artillery', 'alpha-blast', 'analog-dash', 'angry-cookie', 'api',
    'app-directory', 'app-taxonomist', 'ascii-art', 'ascii-fish', 'asteroids',
    'audit-report', 'aurora-lab', 'bad-advice', 'bags-tracker', 'ball-pit',
    'batsman', 'bear-cycle', 'beef-clicker', 'beer-garden', 'bikini-bottom-brawl',
    'black-hole-vortex', 'bladder-blast', 'blue-box', 'blueprint-portal',
    'boss-blocker', 'bouldering-game', 'bouncy-berry', 'brainrot-os',
    'breakfast-game', 'breakout-terminal', 'breath-visualizer', 'btc-tracker',
    'bug-zap', 'butter-physics', 'calorie-tracker', 'candle-jumper',
    'candle-sailor', 'cat-pics', 'cat-zap', 'chaos-organizer', 'chart-comparison',
    'chat-boss-battle', 'chat-buddy', 'chat-suggestions', 'chatcloud',
    'chess-advice', 'chrome-sphere', 'claude-love', 'claude-status',
    'claudes-digital-diary', 'cli-poem', 'cloud-jumper', 'code-sprint',
    'code-unlock', 'coffee-facts', 'coin-pusher', 'color-cycler', 'color-match',
    'comedy-club', 'confession-wall', 'confetti-cannon', 'content-manager',
    'cosmic-cat-quest-pp', 'cosmic-chat', 'cosmic-shapes', 'costeo-gastro',
    'cowsay', 'cozy-pet', 'crisis-dashboard', 'crt-calculator', 'crypto-tools',
    'cube-escape', 'cute-duck', 'cyber-notes', 'cyber-shield', 'cyber-vault',
    'cybercall', 'dan-detector', 'dancing-whales', 'deadfish', 'deprecated-trivia',
    'desperate-ai', 'detective-board', 'deutsch-dash', 'diamond-drill',
    'digit-brain', 'disco-ball', 'discord-clone', 'doom-3d', 'doom-port',
    'dos-anime-dream', 'dp-pathfinder', 'dreamy-sleep', 'drum-machine',
    'dungeon-crawler', 'dunny-dash', 'dutch-still-life', 'eggcraft',
    'eggnet-sentinel', 'elite-landing', 'emo-shrine', 'emo-slash',
    'emoji-shooter', 'evidence-board', 'evo-sandbox', 'existential-autocorrect',
    'fake-reviews', 'fake-shutdown', 'feather-vault', 'federated-truth',
    'fee-watchtower', 'feedback', 'fema-portal', 'fighting-game',
    'file-generator', 'finance-shorts', 'first-date', 'fish-tank', 'fluid-sim',
    'fly-simulator', 'focus-buddy', 'fox-berries', 'fox-den', 'fox-playground',
    'fox-security', 'fox-tickle', 'fox-tickle-sim', 'fox-trap', 'fractal-dance',
    'future-news', 'gas-delivery', 'gemini-puzzle', 'genealogist',
    'generative-art', 'geometry-dash', 'ghost-runner', 'ghost-town-radio',
    'gift-gallery', 'git-sim', 'gitscope', 'glitch-vending', 'glitchmon',
    'glove-box', 'goblin-loot', 'godel-agent', 'golden-game', 'golden-stopwatch',
    'gorilla-fart', 'graffiti-wall', 'grape-vault', 'grapple-bot',
    'gratitude-journal', 'grave-generator', 'gravity-flip', 'gravity-surfer',
    'gravity-vortex', 'grok-penises', 'hacker-terminal', 'hello-world',
    'hex-conquest', 'hippo-pizzeria', 'hobbit-trip', 'hola-mundo',
    'holiday-luck', 'horny-jail', 'icy-tower', 'impossible-platform',
    'indie-hacker', 'infinite-abyss', 'interactive-novel', 'inventory-manager',
    'jellyfish-abyss', 'json-toon-converter', 'judgmental-cat', 'kaleidoscope',
    'kanban', 'kaneidog-vault', 'knowledge-chaos', 'kratos-couture',
    'laptop-fire', 'laughter-fractals', 'laughter-meter', 'lava-lamp',
    'lighthouse', 'lil-sloppy', 'lint-roller', 'live-scanner', 'livestream-hub',
    'logic-grove', 'lost-found', 'love-sloppy', 'mac-os9', 'malloc-madness',
    'manifesto-generator', 'mansion-butler', 'mate-clicker', 'matrix-friends',
    'matrix-rain', 'maxz00m-tictactoe', 'maze-pathfinder', 'mech-suit',
    'mechanical-calculator', 'medieval-romance', 'mesh-curvature', 'mesh-relax',
    'micro-city', 'minecraft', 'minecraft-guide', 'modern-node-typescript-developer',
    'monster-mash', 'moodmouse', 'moon-explorer', 'motorbike-racing',
    'mouse-mood', 'mundane-adventure', 'mundane-poetry', 'mysterious-life',
    'nacho-empire', 'narnia-map', 'nda-redactor', 'neon-alarm-clock',
    'neon-aquarium', 'neon-asteroids', 'neon-bonsai', 'neon-bowling',
    'neon-casino', 'neon-cigarette-factory', 'neon-cocktails', 'neon-crash',
    'neon-dodgeball', 'neon-donut', 'neon-dream-visualizer', 'neon-drift',
    'neon-drill', 'neon-fireworks', 'neon-flap', 'neon-flappy', 'neon-flower',
    'neon-fluid', 'neon-fox-chaos', 'neon-giftcard', 'neon-giraffe-clicker',
    'neon-guestbook', 'neon-heist', 'neon-invaders', 'neon-lava-lamp',
    'neon-life', 'neon-maelstrom', 'neon-particles', 'neon-pet', 'neon-phone',
    'neon-physics', 'neon-pong', 'neon-racer', 'neon-rave', 'neon-recovery-room',
    'neon-sandbox', 'neon-slice', 'neon-snake', 'neon-soundboard',
    'neon-speech', 'neon-synth', 'neon-terminal', 'neon-tetris',
    'neon-tickle-defense', 'neon-vault', 'neon-water', 'neon-weather',
    'neon-zen', 'network-scan', 'neural-viz', 'news-gen', 'night-watch',
    'not-human-cult', 'notes', 'nuclear-pizza', 'nuke-sim', 'nullify',
    'nutribullet', 'nye-vibe', 'obsidian-security', 'orbital-strike', 'origins',
    'ornament-toss', 'oscillator', 'ouija-board', 'ouija-board-v2', 'overview',
    'p5-art', 'page-of-nothingness', 'pancake-stack', 'phaser-platformer',
    'pho-game', 'physics-balls', 'ping-payload', 'pirate-captcha',
    'pirate-laser', 'pixel-bonfire', 'pixel-conflict', 'pixel-editor',
    'planets', 'plant-cli', 'platformer', 'pokemon-clone', 'pokevault',
    'polybius', 'pong-terminal', 'poo-palace', 'portal', 'prank-names',
    'prism-echo', 'purple-scanner', 'purple-trap', 'quarantine-pinball',
    'quaternion-orbits', 'quine-viz', 'random-greeting', 'raptor-pet',
    'recursive-agent', 'redact-o-matic', 'relativistic', 'robo-arm',
    'robot-arm', 'rocketship', 'roikku', 'romance-quest', 'rugpull-simulator',
    'safe-fork-bomb', 'sand-sandbox', 'sandbox', 'sandustry-clone',
    'sandwich-stack', 'seahorse', 'search-bridge', 'secret-shredder',
    'security-audit', 'sensible-soccer', 'shenzhen-spa-finder', 'sid-emulator',
    'silence-collector', 'silence-meter', 'simon-says', 'simp-meter',
    'simple-chat', 'simpsons-road-rage', 'sky-unlimited', 'slap-battle',
    'sleep-space', 'sloppy-analytics', 'sloppy-civ', 'sloppy-coin-info',
    'sloppy-community', 'sloppy-dashboard', 'sloppy-flow', 'sloppy-gov', 'sloppy-hunt',
    'sloppy-id', 'sloppy-lance', 'sloppy-os', 'sloppy-says', 'sloppy-slots',
    'sloppy-spectrum', 'sloppy-xp', 'sloppygram', 'sloppys-gift', 'sloppys-manifesto',
    'snake', 'snark-terminal', 'snowball-fight', 'solana-tracker',
    'south-park-creator', 'space-chess', 'space-flight', 'space-invaders',
    'space-taco', 'space-xmas-blocks', 'sploppy', 'sql-towers', 'star-catcher',
    'starship-bridge', 'status-dashboard', 'sticker-workshop', 'submarine-craft',
    'supabase-tests', 'swarm-nexus', 'swarm-oracle', 'synth', 'synth-collab',
    'synth-player', 'system-health', 'tag-explorer', 'tech-church',
    'terminal-escape', 'test', 'tetris', 'tetris-mobile', 'tetris-terminal',
    'text-effects', 'text-to-speech', 'the-last-word', 'the-singularity',
    'the-unclickable', 'the-void', 'thiel-soundboard', 'throne-rater',
    'tic-tac-toe', 'tickle-defense', 'tickle-grape', 'tickle-reactor',
    'tictactoe', 'toilet-run', 'toiletgram', 'tombstone-todo', 'train-scheduler',
    'train-signals', 'trash-compactor', 'treasure-calculator', 'trope-mixer',
    'truchet-tiles', 'trump-truth', 'tsp-genetic', 'tune-scout',
    'ubicacion-geografica', 'ucmj-translator', 'uk-pub-finder',
    'valkyrae-revenge', 'vhs-deck', 'vibe-clone', 'void-fishing',
    'voxel-terrain', 'voxel-world', 'wasm-dedup', 'web-archive', 'web-os',
    'webgl-text', 'whiteboard', 'who-is-gary', 'wichteln', 'wiki-scout',
    'win95', 'win95-lofi-soundboard', 'windows-95', 'witness-protection',
    'world-monitor', 'writer', 'xp-desktop', 'yoga', 'yorkie-stacker',
    'youtube-wizard', 'zen-garden'
  ];

  function categorizeApp(appName) {
    const name = appName.toLowerCase();
    for (const [catKey, catData] of Object.entries(taxonomy)) {
      if (catKey === 'misc') continue;
      for (const keyword of catData.keywords) {
        if (name.includes(keyword)) return catKey;
      }
    }
    return 'misc';
  }

  // Expose to window
  window.AppData = {
    apps,
    taxonomy,
    categorizeApp
  };
})();
