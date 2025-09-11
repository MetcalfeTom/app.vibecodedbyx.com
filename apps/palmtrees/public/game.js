const scene = document.getElementById('scene');
const wind = document.getElementById('wind');
const waterBtn = document.getElementById('water');
const clearBtn = document.getElementById('clear');
const countEl = document.getElementById('count');

let planting = false;
let palms = [];

function save() {
  const data = palms.map(p => ({ x: p.x, size: p.size }));
  localStorage.setItem('palmtrees-grove', JSON.stringify(data));
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem('palmtrees-grove') || '[]');
    palms = [];
    data.forEach(({ x, size }) => plantPalm(x, size));
  } catch {}
}

function updateCount() { countEl.textContent = palms.length.toString(); }

function createPalmElement(size = 1) {
  const palm = document.createElement('div');
  palm.className = 'palm';
  palm.style.setProperty('--dur', `${3 + Math.random() * 4}s`);
  palm.style.transform = 'rotate(0)';

  const trunk = document.createElement('div');
  trunk.className = 'trunk';
  trunk.style.height = `${90 + size * 40}px`;

  const leaves = document.createElement('div');
  leaves.className = 'leaves';
  for (let i = 0; i < 6; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.width = `${60 + size * 30}px`;
    leaves.appendChild(leaf);
  }

  const nuts = document.createElement('div');
  nuts.className = 'coconuts';
  for (let i = 0; i < Math.min(3, 1 + Math.floor(size * 2)); i++) {
    const n = document.createElement('div');
    n.className = 'nut';
    nuts.appendChild(n);
  }

  palm.appendChild(trunk);
  palm.appendChild(leaves);
  palm.appendChild(nuts);
  return palm;
}

function plantPalm(x, size = Math.random()) {
  const palm = createPalmElement(size);
  const left = Math.max(12, Math.min(scene.clientWidth - 24, x));
  palm.style.left = `${left}px`;
  scene.appendChild(palm);
  palms.push({ el: palm, x: left, size });
  updateCount();
  save();
}

function water() {
  palms.forEach(({ el, size }) => {
    // Grow slightly, capped
    const newSize = Math.min(1.5, size + 0.1);
    const trunk = el.querySelector('.trunk');
    const leaves = el.querySelectorAll('.leaf');
    trunk.style.height = `${90 + newSize * 40}px`;
    leaves.forEach(leaf => { leaf.style.width = `${60 + newSize * 30}px`; });
  });

  // Visual splash at center
  const splash = document.createElement('div');
  splash.className = 'water-splash';
  scene.appendChild(splash);
  setTimeout(() => splash.remove(), 900);

  // Persist new sizes
  palms = palms.map(p => ({ ...p, size: Math.min(1.5, p.size + 0.1) }));
  save();
}

function clearAll() {
  palms.forEach(p => p.el.remove());
  palms = [];
  updateCount();
  save();
}

// Wind control -> map [0..100] to sway degrees [0..12]
function applyWind() {
  const deg = (parseInt(wind.value, 10) / 100) * 12;
  document.querySelectorAll('.palm').forEach(p => p.style.setProperty('--sway', `${deg}deg`));
}

// Planting via clicks or press-and-hold
scene.addEventListener('mousedown', (e) => {
  planting = true; plantPalm(e.offsetX);
});
scene.addEventListener('mousemove', (e) => { if (planting) plantPalm(e.offsetX); });
document.addEventListener('mouseup', () => { planting = false; });

waterBtn.addEventListener('click', water);
clearBtn.addEventListener('click', clearAll);
wind.addEventListener('input', applyWind);

// Init
load();
applyWind();
updateCount();

