/**
 * Vending Module - Core vending machine logic
 * Handles snack data, credits, and dispensing
 */

import { playScream, playStatic, playCoinSound, playErrorSound } from './audio.js';
import { triggerGlitch, spawnParticleBurst, shakeElement, dropItem, updateDisplay, startRandomGlitches } from './effects.js';

// Snack data
const snacks = [
  { code: 'A1', name: 'SCREAMING CHIPS', icon: '🍟', price: 2, desc: 'They scream when you bite them', sound: 'scream' },
  { code: 'A2', name: 'STATIC SODA', icon: '🥤', price: 3, desc: 'Fizzes with electromagnetic interference', sound: 'static' },
  { code: 'A3', name: 'GAMMA GUMMIES', icon: '🍬', price: 2, desc: 'Glow-in-the-dark flavor' },
  { code: 'B1', name: 'VOID COOKIES', icon: '🍪', price: 4, desc: 'Taste like nothing and everything' },
  { code: 'B2', name: 'GLITCH BARS', icon: '🍫', price: 3, desc: 'May cause temporary visual artifacts' },
  { code: 'B3', name: 'NEON NUTS', icon: '🥜', price: 2, desc: 'Crunch echoes in other dimensions' },
  { code: 'C1', name: 'PLASMA POPCORN', icon: '🍿', price: 3, desc: 'Pops at 10,000 degrees' },
  { code: 'C2', name: 'ISOTOPE ICE', icon: '🧊', price: 5, desc: 'Never melts, always glows' },
  { code: 'C3', name: 'MUTANT MINTS', icon: '🫧', price: 1, desc: 'Fresh breath for 1000 years' }
];

// State
let credits = 0;
let isDispensing = false;

/**
 * Get all snacks
 * @returns {Array} Array of snack objects
 */
export const getSnacks = () => [...snacks];

/**
 * Get current credits
 * @returns {number}
 */
export const getCredits = () => credits;

/**
 * Check if machine is currently dispensing
 * @returns {boolean}
 */
export const isCurrentlyDispensing = () => isDispensing;

/**
 * Add a credit to the machine
 * @param {number} amount - Amount to add (default: 1)
 * @returns {number} New credit total
 */
export const addCredit = (amount = 1) => {
  credits += amount;
  updateCreditsDisplay();
  updateDisplay('displayText', 'SELECT YOUR SNACK');
  spawnParticleBurst(1, 0);
  triggerGlitch();
  playCoinSound();
  return credits;
};

/**
 * Update the credits display
 */
const updateCreditsDisplay = () => {
  const el = document.getElementById('credits');
  if (el) el.textContent = credits;
};

/**
 * Reset the display to default message
 */
export const resetDisplay = () => {
  if (!isDispensing) {
    const msg = credits > 0 ? 'SELECT YOUR SNACK' : 'INSERT CREDITS TO BEGIN';
    updateDisplay('displayText', msg);
  }
};

/**
 * Show snack description on display
 * @param {Object} snack - Snack object
 */
export const showDescription = (snack) => {
  if (!isDispensing) {
    updateDisplay('displayText', snack.desc);
  }
};

/**
 * Select and dispense a snack
 * @param {number} index - Snack index
 * @returns {boolean} Success status
 */
export const selectSnack = (index) => {
  if (isDispensing) return false;

  const snack = snacks[index];
  if (!snack) return false;

  if (credits < snack.price) {
    updateDisplay('displayText', 'INSUFFICIENT CREDITS!');
    triggerGlitch();
    playErrorSound();
    setTimeout(resetDisplay, 1500);
    return false;
  }

  // Start dispensing
  isDispensing = true;
  credits -= snack.price;
  updateCreditsDisplay();

  // Animate slot
  const slots = document.querySelectorAll('.snack-slot');
  if (slots[index]) {
    shakeElement(slots[index], 'dispensing', 600);
  }

  updateDisplay('displayText', 'DISPENSING...');
  triggerGlitch();

  // Multiple glitches during dispense
  setTimeout(() => triggerGlitch(), 200);
  setTimeout(() => triggerGlitch(), 400);

  // Dispense item
  setTimeout(() => {
    dispenseItem(snack);
  }, 600);

  return true;
};

/**
 * Dispense an item into the tray
 * @param {Object} snack - Snack to dispense
 */
const dispenseItem = (snack) => {
  dropItem('dispenseTray', snack.icon);
  updateDisplay('displayText', `${snack.name} DISPENSED!`);

  // Spawn particles
  spawnParticleBurst(10, 100);
  triggerGlitch();

  // Play sound effect based on snack type
  if (snack.sound === 'scream') {
    playScream();
  } else if (snack.sound === 'static') {
    playStatic();
  }

  // Reset after delay
  setTimeout(() => {
    isDispensing = false;
    resetDisplay();
  }, 3000);
};

/**
 * Create a snack slot element
 * @param {Object} snack - Snack data
 * @param {number} index - Snack index
 * @returns {HTMLElement}
 */
export const createSnackSlot = (snack, index) => {
  const slot = document.createElement('div');
  slot.className = 'snack-slot';
  slot.innerHTML = `
    <div class="snack-code">${snack.code}</div>
    <div class="snack-icon">${snack.icon}</div>
    <div class="snack-name">${snack.name}</div>
    <div class="snack-price">${snack.price}☢️</div>
    <div class="static-effect"></div>
  `;

  slot.onclick = () => selectSnack(index);
  slot.onmouseenter = () => showDescription(snack);
  slot.onmouseleave = () => resetDisplay();

  return slot;
};

/**
 * Initialize the vending machine
 * @param {string} gridId - ID of the snack grid container
 */
export const initVendingMachine = (gridId = 'snackGrid') => {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Clear existing content
  grid.innerHTML = '';

  // Create snack slots
  snacks.forEach((snack, index) => {
    const slot = createSnackSlot(snack, index);
    grid.appendChild(slot);
  });

  // Start random glitches
  startRandomGlitches(5000, 0.1);
};
