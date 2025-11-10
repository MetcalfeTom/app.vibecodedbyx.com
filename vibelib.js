/**
 * VibeLib - Shared JavaScript Library for VibeCodedByX Apps
 *
 * A lightweight, modular utility library providing common functionality
 * across all VibeCodedByX applications including:
 * - DOM utilities
 * - Date/time formatting
 * - Canvas/game helpers
 * - UI components
 * - Audio utilities
 * - Input handling
 *
 * @version 1.0.0
 * @author VibeCodedByX
 * @license MIT
 */

const VibeLib = (() => {
  'use strict';

  // ============================================================================
  // DOM UTILITIES
  // ============================================================================

  const dom = {
    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Raw text to escape
     * @returns {string} HTML-safe text
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Create an element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes object
     * @param {string|Node} content - Text content or child node
     * @returns {HTMLElement}
     */
    createElement(tag, attrs = {}, content = null) {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') {
          el.className = value;
        } else if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          el.setAttribute(key, value);
        }
      });

      if (content !== null) {
        if (typeof content === 'string') {
          el.textContent = content;
        } else {
          el.appendChild(content);
        }
      }

      return el;
    },

    /**
     * Show loading indicator
     * @param {string} selector - CSS selector for loading element
     */
    showLoading(selector = '#loading') {
      const el = document.querySelector(selector);
      if (el) el.style.display = 'block';
    },

    /**
     * Hide loading indicator
     * @param {string} selector - CSS selector for loading element
     */
    hideLoading(selector = '#loading') {
      const el = document.querySelector(selector);
      if (el) el.style.display = 'none';
    },

    /**
     * Display error message
     * @param {string} message - Error message to display
     * @param {string} selector - CSS selector for error element
     * @param {number} duration - Auto-hide duration in ms (0 = no auto-hide)
     */
    showError(message, selector = '#error', duration = 5000) {
      const el = document.querySelector(selector);
      if (!el) {
        console.error('Error element not found:', selector);
        return;
      }

      el.textContent = message;
      el.style.display = 'block';

      if (duration > 0) {
        setTimeout(() => {
          el.style.display = 'none';
        }, duration);
      }
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type: 'info', 'success', 'warning', 'error'
     * @param {number} duration - Duration in ms
     */
    showToast(message, type = 'info', duration = 3000) {
      let toast = document.getElementById('vibe-toast');

      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'vibe-toast';
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          z-index: 10000;
          transform: translateX(400px);
          transition: transform 0.3s ease;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(toast);
      }

      const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      };

      toast.style.background = colors[type] || colors.info;
      toast.textContent = message;

      // Slide in
      setTimeout(() => toast.style.transform = 'translateX(0)', 10);

      // Slide out
      setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
      }, duration);
    }
  };

  // ============================================================================
  // DATE UTILITIES
  // ============================================================================

  const date = {
    /**
     * Format date as relative time (e.g., "2h ago", "just now")
     * @param {string|Date} dateInput - Date string or Date object
     * @returns {string} Relative time string
     */
    formatTimeAgo(dateInput) {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 10) return 'just now';
      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return this.formatDate(date);
    },

    /**
     * Format date as localized string
     * @param {string|Date} dateInput - Date string or Date object
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date string
     */
    formatDate(dateInput, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return date.toLocaleDateString('en-US', options);
    },

    /**
     * Format time as HH:MM
     * @param {string|Date} dateInput - Date string or Date object
     * @returns {string} Formatted time string
     */
    formatTime(dateInput) {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // ============================================================================
  // GAME UTILITIES
  // ============================================================================

  const game = {
    /**
     * Setup canvas with responsive sizing
     * @param {string} canvasId - Canvas element ID
     * @returns {Object} { canvas, ctx, resize }
     */
    setupCanvas(canvasId = 'gameCanvas') {
      const canvas = document.getElementById(canvasId);
      if (!canvas) {
        throw new Error(`Canvas element #${canvasId} not found`);
      }

      const ctx = canvas.getContext('2d');

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resize();
      window.addEventListener('resize', resize);

      return { canvas, ctx, resize };
    },

    /**
     * Create a game loop with delta time
     * @param {Function} updateFn - Update function (receives deltaTime)
     * @param {Function} drawFn - Draw function
     * @returns {Object} { start, stop, pause, resume }
     */
    createGameLoop(updateFn, drawFn) {
      let animationId = null;
      let lastTime = 0;
      let running = false;
      let paused = false;

      const loop = (timestamp) => {
        if (!running) return;

        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (!paused) {
          updateFn(deltaTime);
        }
        drawFn();

        animationId = requestAnimationFrame(loop);
      };

      return {
        start() {
          if (!running) {
            running = true;
            lastTime = performance.now();
            animationId = requestAnimationFrame(loop);
          }
        },
        stop() {
          running = false;
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        },
        pause() {
          paused = true;
        },
        resume() {
          paused = false;
        }
      };
    },

    /**
     * Simple particle system
     */
    createParticle(x, y, options = {}) {
      return {
        x,
        y,
        vx: options.vx ?? (Math.random() - 0.5) * 4,
        vy: options.vy ?? (Math.random() - 0.5) * 4,
        life: options.life ?? 1,
        decay: options.decay ?? 0.02,
        color: options.color ?? '#ffffff',
        size: options.size ?? 3,

        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life -= this.decay;
          this.vy += options.gravity ?? 0.1; // Apply gravity
        },

        draw(ctx) {
          ctx.save();
          ctx.globalAlpha = this.life;
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size);
          ctx.restore();
        },

        isDead() {
          return this.life <= 0;
        }
      };
    },

    /**
     * Keyboard input manager
     * @returns {Object} keys object and cleanup function
     */
    createKeyboardInput() {
      const keys = {};

      const keyDown = (e) => { keys[e.code] = true; };
      const keyUp = (e) => { keys[e.code] = false; };

      document.addEventListener('keydown', keyDown);
      document.addEventListener('keyup', keyUp);

      return {
        keys,
        cleanup() {
          document.removeEventListener('keydown', keyDown);
          document.removeEventListener('keyup', keyUp);
        }
      };
    }
  };

  // ============================================================================
  // AUDIO UTILITIES
  // ============================================================================

  const audio = {
    context: null,

    /**
     * Initialize audio context (call once, on user interaction)
     */
    init() {
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      }
      return this.context;
    },

    /**
     * Play a simple beep sound
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle'
     */
    beep(frequency = 440, duration = 0.1, type = 'sine') {
      if (!this.context) this.init();

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.start(this.context.currentTime);
      oscillator.stop(this.context.currentTime + duration);
    },

    /**
     * Play a sound effect from a frequency sweep
     * @param {string} effect - Effect type: 'jump', 'coin', 'explosion', 'hit'
     */
    playEffect(effect) {
      const effects = {
        jump: () => this.beep(300, 0.1, 'square'),
        coin: () => {
          this.beep(523, 0.05, 'square');
          setTimeout(() => this.beep(659, 0.1, 'square'), 50);
        },
        explosion: () => this.beep(100, 0.3, 'sawtooth'),
        hit: () => this.beep(150, 0.05, 'square')
      };

      if (effects[effect]) {
        effects[effect]();
      }
    },

    /**
     * Speak text using Web Speech API
     * @param {string} text - Text to speak
     * @param {Object} options - SpeechSynthesisUtterance options
     */
    speak(text, options = {}) {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      if (options.voice) {
        utterance.voice = options.voice;
      }

      speechSynthesis.speak(utterance);
    }
  };

  // ============================================================================
  // TOUCH UTILITIES
  // ============================================================================

  const touch = {
    /**
     * Setup swipe detection on an element
     * @param {HTMLElement} element - Element to attach listeners to
     * @param {Object} callbacks - { left, right, up, down, tap }
     * @returns {Function} cleanup function
     */
    setupSwipe(element, callbacks) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      const minSwipeDistance = 30;

      const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Check if it's a tap (very small movement)
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          if (callbacks.tap) callbacks.tap();
          return;
        }

        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && callbacks.right) callbacks.right();
            else if (deltaX < 0 && callbacks.left) callbacks.left();
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && callbacks.down) callbacks.down();
            else if (deltaY < 0 && callbacks.up) callbacks.up();
          }
        }
      };

      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  };

  // ============================================================================
  // MATH UTILITIES
  // ============================================================================

  const math = {
    /**
     * Random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    rand(min, max) {
      return min + Math.random() * (max - min);
    },

    /**
     * Random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    randInt(min, max) {
      return Math.floor(min + Math.random() * (max - min + 1));
    },

    /**
     * Clamp value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number}
     */
    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    /**
     * Map value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input range minimum
     * @param {number} inMax - Input range maximum
     * @param {number} outMin - Output range minimum
     * @param {number} outMax - Output range maximum
     * @returns {number}
     */
    map(value, inMin, inMax, outMin, outMax) {
      return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
    },

    /**
     * Distance between two points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
  };

  // ============================================================================
  // STORAGE UTILITIES
  // ============================================================================

  const storage = {
    /**
     * Get item from localStorage with JSON parsing
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*}
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
      }
    },

    /**
     * Set item in localStorage with JSON stringification
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Error writing to localStorage:', e);
        return false;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      localStorage.removeItem(key);
    },

    /**
     * Clear all localStorage
     */
    clear() {
      localStorage.clear();
    }
  };

  // ============================================================================
  // VALIDATION UTILITIES
  // ============================================================================

  const validate = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    email(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    url(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Sanitize string (remove HTML tags)
     * @param {string} text - Text to sanitize
     * @returns {string}
     */
    sanitize(text) {
      return text.replace(/<[^>]*>/g, '');
    },

    /**
     * Check if string is empty or whitespace
     * @param {string} text - Text to check
     * @returns {boolean}
     */
    isEmpty(text) {
      return !text || text.trim().length === 0;
    }
  };

  // ============================================================================
  // EXPORT PUBLIC API
  // ============================================================================

  return {
    dom,
    date,
    game,
    audio,
    touch,
    math,
    storage,
    validate,
    version: '1.0.0'
  };
})();

// Support both ES6 modules and global variable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VibeLib;
}
