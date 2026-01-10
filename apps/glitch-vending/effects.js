/**
 * Effects Module - Reusable visual effects
 * Provides glitch, particle, and animation effects
 */

/**
 * Trigger a full-screen glitch overlay effect
 * @param {string} overlayId - The ID of the overlay element
 * @param {number} duration - Duration in ms (default: 300)
 */
export const triggerGlitch = (overlayId = 'glitchOverlay', duration = 300) => {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), duration);
};

/**
 * Spawn a floating particle effect
 * @param {Object} options - Particle configuration
 * @param {string[]} options.symbols - Array of symbols to use
 * @param {number} options.x - X position (random if not set)
 * @param {number} options.y - Y position (random if not set)
 * @param {number} options.duration - Duration in ms (default: 3000)
 * @param {string} options.className - CSS class name (default: 'radiation-particle')
 */
export const spawnParticle = (options = {}) => {
  const {
    symbols = ['☢️', '⚡', '✨', '💫', '🔆'],
    x = Math.random() * window.innerWidth,
    y = Math.random() * 200 + 300,
    duration = 3000,
    className = 'radiation-particle'
  } = options;

  const particle = document.createElement('div');
  particle.className = className;
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.fontSize = (1 + Math.random()) + 'rem';

  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), duration);

  return particle;
};

/**
 * Spawn multiple particles in sequence
 * @param {number} count - Number of particles
 * @param {number} delay - Delay between particles in ms
 * @param {Object} options - Options passed to spawnParticle
 */
export const spawnParticleBurst = (count = 10, delay = 100, options = {}) => {
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnParticle(options), i * delay);
  }
};

/**
 * Add shake animation to an element
 * @param {HTMLElement} element - The element to shake
 * @param {string} className - The shake class name
 * @param {number} duration - Duration in ms
 */
export const shakeElement = (element, className = 'dispensing', duration = 500) => {
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), duration);
};

/**
 * Create and animate a drop item in a container
 * @param {string} containerId - Container element ID
 * @param {string} content - HTML content to display
 * @param {number} duration - Duration to show in ms
 */
export const dropItem = (containerId, content, duration = 3000) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="dispensed-item">${content}</div>`;

  setTimeout(() => {
    container.innerHTML = '';
  }, duration);
};

/**
 * Start random glitch effects at interval
 * @param {number} interval - Check interval in ms
 * @param {number} probability - Probability 0-1 of glitch occurring
 * @param {string} overlayId - Overlay element ID
 * @returns {number} Interval ID for clearing
 */
export const startRandomGlitches = (interval = 5000, probability = 0.1, overlayId = 'glitchOverlay') => {
  return setInterval(() => {
    if (Math.random() < probability) {
      triggerGlitch(overlayId);
    }
  }, interval);
};

/**
 * Update display text with optional animation
 * @param {string} elementId - Display element ID
 * @param {string} text - Text to display
 * @param {boolean} uppercase - Convert to uppercase
 */
export const updateDisplay = (elementId, text, uppercase = true) => {
  const display = document.getElementById(elementId);
  if (!display) return;

  display.textContent = uppercase ? text.toUpperCase() : text;
};

/**
 * Flash an element with a color
 * @param {HTMLElement} element - Element to flash
 * @param {string} color - CSS color
 * @param {number} duration - Flash duration in ms
 */
export const flashElement = (element, color = '#fff', duration = 200) => {
  const originalBg = element.style.backgroundColor;
  element.style.backgroundColor = color;
  setTimeout(() => {
    element.style.backgroundColor = originalBg;
  }, duration);
};
