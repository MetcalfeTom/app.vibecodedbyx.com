// Basic input controls for SpaceCraft
export const keys = {};

export function initKeyboard() {
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

export let mouseX = 0;
export let mouseY = 0;
export function initMouse() {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });
}

export function setupMobileButton(btnId, key) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys[key] = true;
  });
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys[key] = false;
  });
}

