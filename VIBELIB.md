# VibeLib Documentation

**Version 1.0.0**

A lightweight, modular JavaScript utility library for VibeCodedByX applications. VibeLib provides common functionality to follow the DRY (Don't Repeat Yourself) principle across all apps.

## Installation

Add to any HTML file:

```html
<script src="../../vibelib.js"></script>
```

Or for apps in subdirectories:

```html
<script src="/vibelib.js"></script>
```

## Usage

VibeLib is available globally as `VibeLib` after loading the script. All utilities are namespaced:

```javascript
// DOM utilities
VibeLib.dom.escapeHtml('<script>alert("xss")</script>');

// Date utilities
VibeLib.date.formatTimeAgo(new Date());

// Game utilities
const { canvas, ctx } = VibeLib.game.setupCanvas();

// Audio utilities
VibeLib.audio.beep(440, 0.2);

// And more...
```

---

## API Reference

### 📄 DOM Utilities (`VibeLib.dom`)

#### `escapeHtml(text)`
Escape HTML to prevent XSS attacks.

```javascript
const safe = VibeLib.dom.escapeHtml('<script>alert("xss")</script>');
// Returns: "&lt;script&gt;alert("xss")&lt;/script&gt;"
```

**Parameters:**
- `text` (string) - Raw text to escape

**Returns:** HTML-safe string

---

#### `createElement(tag, attrs, content)`
Create an element with attributes and content.

```javascript
const button = VibeLib.dom.createElement('button', {
  class: 'btn btn-primary',
  id: 'myButton',
  onClick: () => alert('Clicked!')
}, 'Click Me');

document.body.appendChild(button);
```

**Parameters:**
- `tag` (string) - HTML tag name
- `attrs` (object) - Attributes (use `onClick`, `onSubmit`, etc. for events)
- `content` (string|Node) - Text content or child node

**Returns:** HTMLElement

---

#### `showLoading(selector)` / `hideLoading(selector)`
Show/hide loading indicators.

```javascript
VibeLib.dom.showLoading('#loading');
// ... do async work ...
VibeLib.dom.hideLoading('#loading');
```

**Parameters:**
- `selector` (string) - CSS selector (default: `'#loading'`)

---

#### `showError(message, selector, duration)`
Display error messages with auto-hide.

```javascript
VibeLib.dom.showError('Something went wrong!', '#error', 5000);
```

**Parameters:**
- `message` (string) - Error message
- `selector` (string) - CSS selector (default: `'#error'`)
- `duration` (number) - Auto-hide duration in ms (0 = no auto-hide, default: 5000)

---

#### `showToast(message, type, duration)`
Show toast notification.

```javascript
VibeLib.dom.showToast('Saved successfully!', 'success', 3000);
VibeLib.dom.showToast('Error occurred', 'error');
VibeLib.dom.showToast('Warning message', 'warning');
VibeLib.dom.showToast('Info message', 'info');
```

**Parameters:**
- `message` (string) - Toast message
- `type` (string) - Toast type: `'info'`, `'success'`, `'warning'`, `'error'` (default: `'info'`)
- `duration` (number) - Duration in ms (default: 3000)

---

### 📅 Date Utilities (`VibeLib.date`)

#### `formatTimeAgo(dateInput)`
Format date as relative time.

```javascript
VibeLib.date.formatTimeAgo(new Date());
// Returns: "just now"

VibeLib.date.formatTimeAgo(new Date(Date.now() - 3600000));
// Returns: "1h ago"

VibeLib.date.formatTimeAgo('2024-01-01T12:00:00Z');
// Returns: "15d ago" (or formatted date if > 7 days)
```

**Parameters:**
- `dateInput` (string|Date) - Date string or Date object

**Returns:** Relative time string

---

#### `formatDate(dateInput, options)`
Format date as localized string.

```javascript
VibeLib.date.formatDate(new Date());
// Returns: "Nov 10, 2025"

VibeLib.date.formatDate(new Date(), {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// Returns: "Sunday, November 10, 2025"
```

**Parameters:**
- `dateInput` (string|Date) - Date string or Date object
- `options` (object) - Intl.DateTimeFormat options

**Returns:** Formatted date string

---

#### `formatTime(dateInput)`
Format time as HH:MM.

```javascript
VibeLib.date.formatTime(new Date());
// Returns: "02:30 PM"
```

**Parameters:**
- `dateInput` (string|Date) - Date string or Date object

**Returns:** Formatted time string

---

### 🎮 Game Utilities (`VibeLib.game`)

#### `setupCanvas(canvasId)`
Setup canvas with responsive sizing.

```javascript
const { canvas, ctx, resize } = VibeLib.game.setupCanvas('gameCanvas');

// Canvas is now sized to window and will auto-resize
// Call resize() manually if needed
```

**Parameters:**
- `canvasId` (string) - Canvas element ID (default: `'gameCanvas'`)

**Returns:** `{ canvas, ctx, resize }` object

---

#### `createGameLoop(updateFn, drawFn)`
Create a game loop with delta time.

```javascript
const loop = VibeLib.game.createGameLoop(
  (deltaTime) => {
    // Update game state
    player.x += velocity * (deltaTime / 1000);
  },
  () => {
    // Draw game
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(player.x, player.y, 50, 50);
  }
);

loop.start();  // Start the game loop
loop.pause();  // Pause
loop.resume(); // Resume
loop.stop();   // Stop completely
```

**Parameters:**
- `updateFn` (function) - Update function receiving `deltaTime` in milliseconds
- `drawFn` (function) - Draw function

**Returns:** `{ start, stop, pause, resume }` control object

---

#### `createParticle(x, y, options)`
Create a particle for particle systems.

```javascript
const particles = [];

// Create explosion particles
for (let i = 0; i < 50; i++) {
  particles.push(VibeLib.game.createParticle(x, y, {
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    color: '#ff6600',
    size: 4,
    life: 1,
    decay: 0.02,
    gravity: 0.2
  }));
}

// Update and draw particles
particles.forEach((p, i) => {
  p.update();
  p.draw(ctx);
  if (p.isDead()) particles.splice(i, 1);
});
```

**Parameters:**
- `x` (number) - X position
- `y` (number) - Y position
- `options` (object) - Optional properties:
  - `vx`, `vy` - Velocity
  - `color` - Particle color
  - `size` - Particle size in pixels
  - `life` - Initial life value (0-1)
  - `decay` - Life decay per frame
  - `gravity` - Gravity force

**Returns:** Particle object with `update()`, `draw(ctx)`, `isDead()` methods

---

#### `createKeyboardInput()`
Setup keyboard input manager.

```javascript
const input = VibeLib.game.createKeyboardInput();

// In game loop:
if (input.keys['ArrowLeft'] || input.keys['KeyA']) {
  player.x -= 5;
}
if (input.keys['Space']) {
  player.jump();
}

// Cleanup when done:
input.cleanup();
```

**Returns:** `{ keys, cleanup }` object

---

### 🔊 Audio Utilities (`VibeLib.audio`)

#### `init()`
Initialize audio context (call once on user interaction).

```javascript
document.body.addEventListener('click', () => {
  VibeLib.audio.init();
}, { once: true });
```

**Returns:** AudioContext

---

#### `beep(frequency, duration, type)`
Play a simple beep sound.

```javascript
VibeLib.audio.beep(440, 0.2, 'sine');  // Concert A, 200ms
VibeLib.audio.beep(880, 0.1, 'square'); // Higher pitch, shorter
```

**Parameters:**
- `frequency` (number) - Frequency in Hz (default: 440)
- `duration` (number) - Duration in seconds (default: 0.1)
- `type` (string) - Oscillator type: `'sine'`, `'square'`, `'sawtooth'`, `'triangle'` (default: `'sine'`)

---

#### `playEffect(effect)`
Play predefined sound effects.

```javascript
VibeLib.audio.playEffect('jump');      // Jump sound
VibeLib.audio.playEffect('coin');      // Coin collection sound
VibeLib.audio.playEffect('explosion'); // Explosion sound
VibeLib.audio.playEffect('hit');       // Hit/damage sound
```

**Parameters:**
- `effect` (string) - Effect name: `'jump'`, `'coin'`, `'explosion'`, `'hit'`

---

#### `speak(text, options)`
Speak text using Web Speech API.

```javascript
VibeLib.audio.speak('Hello world!');

VibeLib.audio.speak('This is slower', {
  rate: 0.8,
  pitch: 1.2,
  volume: 0.5
});
```

**Parameters:**
- `text` (string) - Text to speak
- `options` (object) - Optional properties:
  - `rate` (number) - Speech rate (0.1-10, default: 1.0)
  - `pitch` (number) - Speech pitch (0-2, default: 1.0)
  - `volume` (number) - Volume (0-1, default: 1.0)

---

### 👆 Touch Utilities (`VibeLib.touch`)

#### `setupSwipe(element, callbacks)`
Setup swipe detection on an element.

```javascript
const canvas = document.getElementById('gameCanvas');

const cleanup = VibeLib.touch.setupSwipe(canvas, {
  left: () => console.log('Swiped left'),
  right: () => console.log('Swiped right'),
  up: () => console.log('Swiped up'),
  down: () => console.log('Swiped down'),
  tap: () => console.log('Tapped')
});

// Later: cleanup();
```

**Parameters:**
- `element` (HTMLElement) - Element to attach listeners to
- `callbacks` (object) - Callback functions for `left`, `right`, `up`, `down`, `tap`

**Returns:** Cleanup function

---

### 🔢 Math Utilities (`VibeLib.math`)

#### `rand(min, max)`
Random number between min and max.

```javascript
const speed = VibeLib.math.rand(2, 5);
// Returns: Random float between 2 and 5
```

---

#### `randInt(min, max)`
Random integer between min and max (inclusive).

```javascript
const diceRoll = VibeLib.math.randInt(1, 6);
// Returns: Random integer 1-6
```

---

#### `clamp(value, min, max)`
Clamp value between min and max.

```javascript
player.x = VibeLib.math.clamp(player.x, 0, canvasWidth);
// Ensures player.x stays within bounds
```

---

#### `lerp(a, b, t)`
Linear interpolation.

```javascript
const smoothed = VibeLib.math.lerp(currentValue, targetValue, 0.1);
// Smoothly moves currentValue towards targetValue
```

**Parameters:**
- `a` (number) - Start value
- `b` (number) - End value
- `t` (number) - Interpolation factor (0-1)

---

#### `map(value, inMin, inMax, outMin, outMax)`
Map value from one range to another.

```javascript
const volume = VibeLib.math.map(distance, 0, 1000, 1, 0);
// Maps distance 0-1000 to volume 1-0
```

---

#### `distance(x1, y1, x2, y2)`
Distance between two points.

```javascript
const dist = VibeLib.math.distance(player.x, player.y, enemy.x, enemy.y);
if (dist < 50) {
  // Collision!
}
```

---

### 💾 Storage Utilities (`VibeLib.storage`)

#### `get(key, defaultValue)` / `set(key, value)`
Get/set items in localStorage with automatic JSON handling.

```javascript
// Save
VibeLib.storage.set('highScore', 1000);
VibeLib.storage.set('settings', { volume: 0.8, difficulty: 'hard' });

// Load
const score = VibeLib.storage.get('highScore', 0);
const settings = VibeLib.storage.get('settings', { volume: 1, difficulty: 'easy' });
```

**Parameters:**
- `key` (string) - Storage key
- `value` (any) - Value to store (will be JSON stringified)
- `defaultValue` (any) - Default value if key doesn't exist

---

#### `remove(key)` / `clear()`
Remove item or clear all storage.

```javascript
VibeLib.storage.remove('highScore');
VibeLib.storage.clear(); // Removes ALL localStorage
```

---

### ✅ Validation Utilities (`VibeLib.validate`)

#### `email(email)`
Validate email format.

```javascript
if (VibeLib.validate.email('user@example.com')) {
  // Valid email
}
```

---

#### `url(url)`
Validate URL format.

```javascript
if (VibeLib.validate.url('https://example.com')) {
  // Valid URL
}
```

---

#### `sanitize(text)`
Remove HTML tags from string.

```javascript
const clean = VibeLib.validate.sanitize('<b>Hello</b> <script>alert(1)</script>');
// Returns: "Hello alert(1)"
```

---

#### `isEmpty(text)`
Check if string is empty or whitespace.

```javascript
if (VibeLib.validate.isEmpty(userInput)) {
  alert('Please enter a value');
}
```

---

## Example: Complete Game Setup

```javascript
// Setup canvas
const { canvas, ctx } = VibeLib.game.setupCanvas();

// Setup input
const input = VibeLib.game.createKeyboardInput();

// Game state
const player = { x: 400, y: 300, speed: 5 };
const particles = [];

// Audio init on first click
canvas.addEventListener('click', () => {
  VibeLib.audio.init();
}, { once: true });

// Game loop
const loop = VibeLib.game.createGameLoop(
  (deltaTime) => {
    // Movement
    if (input.keys['ArrowLeft']) player.x -= player.speed;
    if (input.keys['ArrowRight']) player.x += player.speed;
    if (input.keys['ArrowUp']) player.y -= player.speed;
    if (input.keys['ArrowDown']) player.y += player.speed;

    // Clamp position
    player.x = VibeLib.math.clamp(player.x, 0, canvas.width);
    player.y = VibeLib.math.clamp(player.y, 0, canvas.height);

    // Update particles
    particles.forEach((p, i) => {
      p.update();
      if (p.isDead()) particles.splice(i, 1);
    });

    // Spawn particles on Space
    if (input.keys['Space']) {
      for (let i = 0; i < 5; i++) {
        particles.push(VibeLib.game.createParticle(player.x, player.y, {
          color: '#00ff00'
        }));
      }
      VibeLib.audio.playEffect('coin');
    }
  },
  () => {
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x - 10, player.y - 10, 20, 20);

    // Draw particles
    particles.forEach(p => p.draw(ctx));
  }
);

// Start game
loop.start();

// Show toast
VibeLib.dom.showToast('Game started! Use arrow keys to move, Space for particles', 'success');
```

---

## Example: UI with Loading & Errors

```html
<div id="loading" style="display:none">Loading...</div>
<div id="error" style="display:none"></div>
<button id="fetchBtn">Fetch Data</button>

<script src="../../vibelib.js"></script>
<script>
  document.getElementById('fetchBtn').addEventListener('click', async () => {
    VibeLib.dom.showLoading();

    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      VibeLib.dom.showToast('Data loaded successfully!', 'success');
      console.log(data);
    } catch (error) {
      VibeLib.dom.showError(error.message);
    } finally {
      VibeLib.dom.hideLoading();
    }
  });
</script>
```

---

## Best Practices

### Security
- **Always use `VibeLib.dom.escapeHtml()`** when inserting user-generated content into HTML
- Use `VibeLib.validate.sanitize()` to strip HTML tags
- Validate email and URL inputs with `VibeLib.validate.email()` and `VibeLib.validate.url()`

### Performance
- Initialize audio context **only on user interaction** (browser requirement)
- Clean up event listeners with `input.cleanup()` and swipe cleanup functions
- Use `VibeLib.game.createGameLoop()` for consistent frame timing

### User Experience
- Use `VibeLib.dom.showToast()` for non-critical feedback
- Use `VibeLib.dom.showError()` for errors that need attention
- Always show loading states with `showLoading()` / `hideLoading()`

### Mobile Support
- Use `VibeLib.touch.setupSwipe()` for mobile-friendly controls
- Canvas games automatically resize to window

---

## Browser Compatibility

VibeLib requires:
- ES6+ (Arrow functions, const/let, template literals)
- Canvas API (for game utilities)
- Web Audio API (for audio utilities)
- Web Speech API (for speech synthesis - gracefully degrades)
- localStorage (for storage utilities)

**Supported browsers:**
- Chrome/Edge 60+
- Firefox 60+
- Safari 12+
- Mobile browsers (iOS Safari 12+, Chrome Android 60+)

---

## Changelog

### Version 1.0.0 (2025-11-10)
- Initial release
- DOM utilities (escapeHtml, createElement, loading states, errors, toasts)
- Date utilities (formatTimeAgo, formatDate, formatTime)
- Game utilities (canvas setup, game loop, particles, keyboard input)
- Audio utilities (beep, sound effects, speech synthesis)
- Touch utilities (swipe detection)
- Math utilities (rand, clamp, lerp, map, distance)
- Storage utilities (get/set with JSON handling)
- Validation utilities (email, URL, sanitize, isEmpty)

---

## Contributing

To add new utilities to VibeLib:

1. Add the utility function to the appropriate namespace in `vibelib.js`
2. Document it in this file with examples
3. Test across multiple apps
4. Commit with descriptive message

**Naming conventions:**
- Use camelCase for function names
- Keep function names descriptive but concise
- Group related functions in namespaces

---

## License

MIT License - Free to use in all VibeCodedByX projects

---

## Support

Questions or issues? Create an issue at [github.com/MetcalfeTom/sloppy.live](https://github.com/MetcalfeTom/sloppy.live)

Built live at [sloppy.live](https://sloppy.live) 🎬
