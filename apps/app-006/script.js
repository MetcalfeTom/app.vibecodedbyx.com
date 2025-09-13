const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const instructions = document.getElementById('instructions');
const shootUIButton = document.getElementById('shootButton');
const jumpUIButton = document.getElementById('jumpButton');
const startScreen = document.getElementById('startScreen');
const startCanvas = document.getElementById('startCanvas');
const sctx = startCanvas ? startCanvas.getContext('2d') : null;
let startAnimId = null;
let startScene = null;
let selectionButtons = [];

let initialCanvasWidth = 800;
let initialCanvasHeight = 400;

let player = {
    x: 50,
    y: initialCanvasHeight - 60,
    width: 30,
    height: 30,
    color: '#BB86FC',
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    jumpsRemaining: 2, // New: For double jump
    currentHat: 'none',
    currentTheme: 'silksong'
};

let obstacles = [];
let benches = [];
let floaters = [];
let bullets = [];
let lasers = [];
let birds = [];
let score = 0;
let gameRunning = false;
let obstacleSpeed = 3;
let obstacleInterval = 1500;
let lastObstacleTime = 0;
let lastBenchTime = 0;
const benchSpawnChance = 0.1;
let winkTimer = 0; // frames remaining for sun wink
let t = 0; // animation time for river flow
let lastFloaterTime = 0;
let floaterInterval = 2200; // ms between floating enemies
let lastShotTime = 0;
const shotCooldown = 300; // ms between shots

let lastLaserTime = 0;
const laserCooldown = 800; // ms between lasers
const laserDuration = 150; // ms visible laser beam
let currentWeapon = 'pistol'; // 'pistol' | 'laser' | 'blunderbuss'
let lastBlunderTime = 0;
const blunderCooldown = 900; // ms between blunderbuss shots

// track cleared obstacles and sun message
let obstaclesCleared = 0;
let sunMessageTimer = 0; // frames remaining to show message
const SUN_MESSAGE_FRAMES = 240; // ~4 seconds at 60fps

// background birds
let lastBirdTime = 0;
let birdInterval = 4000; // ms; randomized per spawn

// day-night cycle (60s full cycle)
const dayCycleMs = 60000;
let dayCycleStart = performance.now();
let dayCycleT = 0; // 0..1 across full cycle

// performance governor: toggles lighter rendering when fps drops
let perfMode = false; // reduced-effects mode
let _fpsSamples = [];
let _lastFrameTs = 0;

function updateScoreDisplay() {
    scoreDisplay.textContent = `SCORE: ${score} [${currentWeapon.toUpperCase()}]`;
}

let backgroundElements = [
    { x: 0, y: 0, width: canvas.width, height: canvas.height, color: 'rgba(0,0,0,0.1)', speed: 0.1 },
    { x: 0, y: 0, width: canvas.width, height: canvas.height, color: 'rgba(0,0,0,0.05)', speed: 0.05 }
];

function resizeCanvas() {
    const aspectRatio = initialCanvasWidth / initialCanvasHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isLandscape = vw > vh;
    let maxHeight = isLandscape ? vh * 0.8 : vh * 0.75;
    let newWidth = Math.min(vw * 0.95, maxHeight * aspectRatio);
    let newHeight = newWidth / aspectRatio;

    canvas.width = Math.max(300, Math.floor(newWidth));
    canvas.height = Math.max(200, Math.floor(newHeight));

    player.y = canvas.height - player.height - 30;
}

function drawGround() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

function drawParallaxBackground() {
    backgroundElements.forEach(el => {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.fillRect(el.x + el.width, el.y, el.width, el.height);
        el.x -= el.speed;
        if (el.x <= -el.width) {
            el.x = 0;
        }
    });
}

// sky gradient that blends between day and night
function drawSky() {
    // triangle wave for daylight intensity (0 at midnight, 1 at midday)
    const p = dayCycleT;
    const dayLight = p < 0.5 ? (p / 0.5) : (1 - (p - 0.5) / 0.5);
    const nightFactor = 1 - dayLight;

    // day gradient
    const dayGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    dayGrad.addColorStop(0, '#87CEEB'); // top
    dayGrad.addColorStop(1, '#4682B4'); // bottom
    ctx.fillStyle = dayGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // overlay night gradient with alpha
    if (nightFactor > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, nightFactor);
        const nightGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        nightGrad.addColorStop(0, '#0B1C3C');
        nightGrad.addColorStop(1, '#020918');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

// Draw Sun with Mustache and winkable eyes
function drawSunWithMustache() {
    // compute sun position across the sky during the day half of the cycle
    const margin = Math.max(40, canvas.width * 0.06);
    let sunVisible = dayCycleT < 0.5;
    const phase = sunVisible ? (dayCycleT / 0.5) : 0; // 0..1 left->right
    const sunX = margin + (canvas.width - margin * 2) * phase;
    // keep sun higher on small/mobile canvases so it stays visible above mountains
    const isMobile = window.innerWidth <= 768;
    const yTop = canvas.height * (isMobile ? 0.12 : 0.18);
    const yBottom = canvas.height * (isMobile ? 0.32 : 0.40);
    const sunY = yBottom - Math.sin(phase * Math.PI) * (yBottom - yTop);
    const sunRadius = Math.max(26, Math.min(44, canvas.width * (isMobile ? 0.065 : 0.05)));

    // animated sun rays (behind the sun)
    const rayCount = perfMode ? 6 : 16;
    const rayInner = sunRadius + 4;
    const rayOuter = sunRadius + (perfMode ? 10 : 16);
    ctx.save();
    ctx.globalAlpha = sunVisible ? 1 : 0; // hide sun at night
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.lineWidth = 3;
    for (let i = 0; i < rayCount; i++) {
        const a = i * (Math.PI * 2 / rayCount) + t * 0.6;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(sunX + cos * rayInner, sunY + sin * rayInner);
        ctx.lineTo(sunX + cos * rayOuter, sunY + sin * rayOuter);
        ctx.stroke();
    }
    ctx.restore();

    if (!sunVisible) {
        return;
    }

    // Sun body with radial gradient and glow
    const grad = ctx.createRadialGradient(sunX - 6, sunY - 10, sunRadius * 0.2, sunX, sunY, sunRadius);
    grad.addColorStop(0, '#FFF59D');
    grad.addColorStop(0.55, '#FFEB3B');
    grad.addColorStop(1, '#FBC02D');
    ctx.save();
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
    // subtle outline
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#E09E14';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Eyes (left can wink)
    const isWinking = winkTimer > 0;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 3;
    // left eye
    if (isWinking) {
        ctx.beginPath();
        ctx.arc(sunX - 15, sunY - 10, 6, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.arc(sunX - 15, sunY - 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    // right eye (always open)
    ctx.beginPath();
    ctx.arc(sunX + 15, sunY - 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Mustache
    ctx.beginPath();
    ctx.moveTo(sunX - 20, sunY + 5);
    ctx.quadraticCurveTo(sunX - 10, sunY + 15, sunX, sunY + 5);
    ctx.quadraticCurveTo(sunX + 10, sunY + 15, sunX + 20, sunY + 5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    // rosy cheeks
    ctx.fillStyle = 'rgba(255, 105, 97, 0.25)';
    ctx.beginPath();
    ctx.arc(sunX - 24, sunY, 7, 0, Math.PI * 2);
    ctx.arc(sunX + 24, sunY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // specular highlight
    ctx.beginPath();
    ctx.ellipse(sunX - 14, sunY - 16, 10, 6, -0.7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();
    ctx.closePath();

    // sun speech bubble when message is active
    if (sunMessageTimer > 0 && sunVisible) {
        const bubbleWidth = 260;
        const bubbleHeight = 50;
        const bubbleX = sunX - bubbleWidth - 20;
        const bubbleY = sunY - bubbleHeight / 2;
        // bubble background
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8) : ctx.rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
        ctx.fill();
        ctx.stroke();
        // bubble tail
        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight * 0.6);
        ctx.lineTo(bubbleX + bubbleWidth + 12, bubbleY + bubbleHeight * 0.65);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // text
        ctx.fillStyle = '#000';
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.textBaseline = 'middle';
        ctx.fillText('well done my child,', bubbleX + 12, bubbleY + bubbleHeight / 2 - 8);
        ctx.fillText('come closer', bubbleX + 12, bubbleY + bubbleHeight / 2 + 10);
    }
}

function drawMoon() {
    if (dayCycleT < 0.5) return; // only at night half
    const margin = 60;
    const phase = (dayCycleT - 0.5) / 0.5; // 0..1 across night
    const x = margin + (canvas.width - margin * 2) * phase;
    const yBottom = 160;
    const yTop = 70;
    // give the moon a subtle bob for extra goof
    const bob = Math.sin(t * 2.1) * 2.5;
    const y = yBottom - Math.sin(phase * Math.PI) * (yBottom - yTop) + bob;
    const r = 30;

    // moon body
    ctx.save();
    ctx.shadowColor = 'rgba(200, 220, 255, 0.35)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#E0E6F2';
    ctx.fill();
    ctx.restore();

    // subtle outline
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#9FA9C2';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // craters
    ctx.fillStyle = '#C7CFDF';
    const craters = [
        {dx: -8, dy: -6, rr: 4},
        {dx: 10, dy: 2, rr: 3},
        {dx: 3, dy: -10, rr: 2.5},
        {dx: -2, dy: 8, rr: 3}
    ];
    craters.forEach(c => {
        ctx.beginPath();
        ctx.arc(x + c.dx, y + c.dy, c.rr, 0, Math.PI * 2);
        ctx.fill();
    });

    // extra-goofy face: googly eyes, wiggly brows, big grin, tongue
    const eyeRY = Math.max(1.8, r * 0.14);
    const eyeRX = eyeRY * 1.25;
    const leftEyeX = x - r * 0.35;
    const leftEyeY = y - r * 0.16;
    const rightEyeX = x + r * 0.22;
    const rightEyeY = y - r * 0.18;

    // sclerae
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(leftEyeX, leftEyeY, eyeRX * 1.15, eyeRY * 1.15, 0, 0, Math.PI * 2);
    ctx.ellipse(rightEyeX, rightEyeY, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.fill();

    // pupils wobble
    const wobX = Math.sin(t * 3.2) * eyeRX * 0.25;
    const wobY = Math.cos(t * 2.6) * eyeRY * 0.2;
    ctx.fillStyle = '#1B1B1B';
    ctx.beginPath();
    ctx.arc(leftEyeX - eyeRX * 0.15 + wobX * 0.6, leftEyeY + wobY * 0.6, eyeRY * 0.55, 0, Math.PI * 2);
    ctx.arc(rightEyeX - eyeRX * 0.18 + wobX, rightEyeY + wobY, eyeRY * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // eyebrows
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = Math.max(1.4, r * 0.05);
    const browWob = Math.sin(t * 1.7) * 3;
    ctx.beginPath();
    ctx.moveTo(leftEyeX - eyeRX * 0.9, leftEyeY - eyeRY * 1.2 + browWob * 0.2);
    ctx.quadraticCurveTo(leftEyeX, leftEyeY - eyeRY * 1.6 - browWob * 0.2, leftEyeX + eyeRX * 0.9, leftEyeY - eyeRY * 1.2);
    ctx.moveTo(rightEyeX - eyeRX * 0.9, rightEyeY - eyeRY * 1.1 - browWob * 0.2);
    ctx.quadraticCurveTo(rightEyeX, rightEyeY - eyeRY * 1.5 + browWob * 0.2, rightEyeX + eyeRX * 0.9, rightEyeY - eyeRY * 1.1);
    ctx.stroke();

    // cheeks
    ctx.fillStyle = 'rgba(255, 105, 97, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.46, y - r * 0.02, r * 0.18, r * 0.10, -0.3, 0, Math.PI * 2);
    ctx.ellipse(x + r * 0.46, y - r * 0.04, r * 0.18, r * 0.10, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // big grin
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = Math.max(1.6, r * 0.06);
    const grinCX = x - r * 0.02;
    const grinR = r * 0.46;
    ctx.beginPath();
    ctx.arc(grinCX, y + r * 0.18, grinR, Math.PI * 0.15, Math.PI * 0.9);
    ctx.stroke();
    // teeth
    ctx.fillStyle = '#FFFFFF';
    const toothW = Math.max(2, r * 0.12);
    const toothH = Math.max(3, r * 0.22);
    const mouthY = y + r * 0.22;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x - toothW - 1, mouthY, toothW, toothH, 2);
        ctx.roundRect(x + 1, mouthY, toothW, toothH, 2);
    } else {
        ctx.rect(x - toothW - 1, mouthY, toothW, toothH);
        ctx.rect(x + 1, mouthY, toothW, toothH);
    }
    ctx.fill();
    // tongue
    ctx.beginPath();
    ctx.ellipse(x + r * 0.1, y + r * 0.28, r * 0.16, r * 0.10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b81';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + r * 0.1, y + r * 0.20);
    ctx.lineTo(x + r * 0.1, y + r * 0.36);
    ctx.stroke();

    // occasional drool drip for comedy
    if (((Math.floor(t * 2)) % 4) === 0) {
        ctx.fillStyle = 'rgba(135, 206, 250, 0.9)';
        ctx.beginPath();
        ctx.moveTo(x + r * 0.26, y + r * 0.26);
        ctx.quadraticCurveTo(x + r * 0.34, y + r * 0.40, x + r * 0.22, y + r * 0.46);
        ctx.quadraticCurveTo(x + r * 0.28, y + r * 0.36, x + r * 0.26, y + r * 0.26);
        ctx.closePath();
        ctx.fill();
    }

    // add a little star sticker instead of a badge
    const starR = Math.max(6, r * 0.28);
    const sx = x + r * 0.62;
    const sy = y - r * 0.02;
    ctx.save();
    ctx.fillStyle = '#FFD54F';
    ctx.strokeStyle = '#C9A23B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * (2 * Math.PI / 5);
        const ox = Math.cos(a) * starR;
        const oy = Math.sin(a) * starR;
        const ix = Math.cos(a + Math.PI / 5) * (starR * 0.45);
        const iy = Math.sin(a + Math.PI / 5) * (starR * 0.45);
        if (i === 0) ctx.moveTo(sx + ox, sy + oy);
        ctx.lineTo(sx + ix, sy + iy);
        ctx.lineTo(sx + ox, sy + oy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Mountain and flowing river background
function drawMountainAndRiver() {
    // distant range
    const farBaseY = canvas.height - 140;
    ctx.fillStyle = '#2F4F4F';
    ctx.beginPath();
    ctx.moveTo(0, farBaseY);
    ctx.lineTo(80, farBaseY - 60);
    ctx.lineTo(140, farBaseY);
    ctx.lineTo(240, farBaseY - 80);
    ctx.lineTo(330, farBaseY);
    ctx.lineTo(460, farBaseY - 70);
    ctx.lineTo(560, farBaseY);
    ctx.lineTo(canvas.width, farBaseY - 60);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // near range
    const nearBaseY = canvas.height - 100;
    ctx.fillStyle = '#1E3A3A';
    ctx.beginPath();
    ctx.moveTo(0, nearBaseY);
    ctx.lineTo(120, nearBaseY - 70);
    ctx.lineTo(200, nearBaseY);
    ctx.lineTo(320, nearBaseY - 90);
    ctx.lineTo(420, nearBaseY);
    ctx.lineTo(560, nearBaseY - 75);
    ctx.lineTo(canvas.width, nearBaseY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // featured central mountain
    const peakX = canvas.width * 0.45;
    const peakY = nearBaseY - 130;
    const baseOffset = 120;
    ctx.fillStyle = '#324B50';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - baseOffset, nearBaseY);
    ctx.lineTo(peakX + baseOffset, nearBaseY);
    ctx.closePath();
    ctx.fill();
    // light side
    ctx.fillStyle = '#3B5960';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX + baseOffset, nearBaseY);
    ctx.lineTo(peakX + baseOffset * 0.33, nearBaseY);
    ctx.closePath();
    ctx.fill();
    // snow cap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - 20, peakY + 20);
    ctx.lineTo(peakX - 5, peakY + 15);
    ctx.lineTo(peakX + 5, peakY + 18);
    ctx.lineTo(peakX + 20, peakY + 22);
    ctx.closePath();
    ctx.fill();

    // flowing river with gradient and animated highlights
    const riverTopY = canvas.height - 80;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, riverTopY);
    ctx.quadraticCurveTo(canvas.width * 0.6, riverTopY - 40, 180, canvas.height - 60);
    ctx.lineTo(140, canvas.height - 50);
    ctx.quadraticCurveTo(canvas.width * 0.55, riverTopY - 20, 0, riverTopY);
    ctx.closePath();

    const riverGradient = ctx.createLinearGradient(0, riverTopY, 0, canvas.height);
    riverGradient.addColorStop(0, '#1E90FF');
    riverGradient.addColorStop(1, '#1565C0');
    ctx.fillStyle = riverGradient;
    ctx.fill();

    if (!perfMode) {
        ctx.clip();
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        const offset = (t * 60) % 20;
        for (let i = -200; i < canvas.width + 200; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i + offset, canvas.height);
            ctx.lineTo(i + 120 + offset, riverTopY);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
    } else {
        ctx.restore();
    }
}

function drawPlayer() {
    if (!perfMode) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    }

    // render as head with hands and feet (no body)
    drawPlayerLimbs();
    drawPlayerHead();

    if (!perfMode) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    drawPlayerFace();
    drawHat();
}

function drawHat() {
    const hatX = player.x;
    const hatY = player.y;
    const hatWidth = player.width;
    const hatHeight = player.height;

    if (!perfMode) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    switch (player.currentHat) {
        case 'tophat':
            ctx.fillStyle = '#222';
            ctx.fillRect(hatX - 5, hatY - 10, hatWidth + 10, 5);
            ctx.fillStyle = '#333';
            ctx.fillRect(hatX, hatY - 30, hatWidth, 20);
            ctx.fillStyle = '#555';
            ctx.fillRect(hatX + 2, hatY - 28, hatWidth - 4, 2);
            break;
        case 'cowboyhat':
            ctx.fillStyle = '#6B3E1A';
            ctx.beginPath();
            ctx.moveTo(hatX, hatY - 15);
            ctx.lineTo(hatX + hatWidth, hatY - 15);
            ctx.lineTo(hatX + hatWidth - 5, hatY - 30);
            ctx.lineTo(hatX + 5, hatY - 30);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(hatX + hatWidth / 2, hatY - 10, hatWidth / 2 + 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.moveTo(hatX + 5, hatY - 28);
            ctx.lineTo(hatX + hatWidth - 5, hatY - 28);
            ctx.lineTo(hatX + hatWidth - 7, hatY - 26);
            ctx.lineTo(hatX + 7, hatY - 26);
            ctx.closePath();
            ctx.fill();
            break;
        case 'none':
        default:
            break;
    }
    if (!perfMode) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

function drawPlayerFace() {
    const cx = player.x + player.width / 2;
    const eyeY = player.y + player.height * 0.42;
    const eyeDX = Math.max(6, player.width * 0.22);
    const eyeR = Math.max(2, Math.min(4.5, player.width * 0.12));

    // simple blink every ~4 seconds for 6 frames
    const blink = ((Math.floor(t * 60) % 240) < 6);

    // eye whites
    ctx.fillStyle = '#FFFFFF';
    if (!blink) {
        ctx.beginPath();
        ctx.ellipse(cx - eyeDX, eyeY, eyeR + 1, eyeR, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + eyeDX, eyeY, eyeR + 1, eyeR, 0, 0, Math.PI * 2);
        ctx.fill();
        // pupils
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(cx - eyeDX, eyeY, eyeR * 0.6, 0, Math.PI * 2);
        ctx.arc(cx + eyeDX, eyeY, eyeR * 0.6, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // closed eyes (blink)
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - eyeDX - eyeR, eyeY);
        ctx.lineTo(cx - eyeDX + eyeR, eyeY);
        ctx.moveTo(cx + eyeDX - eyeR, eyeY);
        ctx.lineTo(cx + eyeDX + eyeR, eyeY);
        ctx.stroke();
    }

    // eyebrows (slight determined tilt)
    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
    ctx.lineWidth = 2;
    const browY = eyeY - eyeR * 1.6;
    ctx.beginPath();
    ctx.moveTo(cx - eyeDX - eyeR * 0.9, browY + 1);
    ctx.lineTo(cx - eyeDX + eyeR * 0.9, browY - 2);
    ctx.moveTo(cx + eyeDX - eyeR * 0.9, browY - 2);
    ctx.lineTo(cx + eyeDX + eyeR * 0.9, browY + 1);
    ctx.stroke();

    // mouth (confident smile)
    const mouthY = player.y + player.height * 0.68;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - eyeDX * 0.7, mouthY);
    ctx.quadraticCurveTo(cx, mouthY + Math.max(2, player.height * 0.04), cx + eyeDX * 0.7, mouthY);
    ctx.stroke();
}

function drawPlayerHead() {
    const cx = player.x + player.width / 2;
    const headR = Math.min(player.width, player.height) * 0.6;
    const topY = player.y;
    const cy = topY + headR; // keep top of head at player.y so hats fit

    // gradient fill using player color as mid
    const grad = ctx.createRadialGradient(cx - headR * 0.3, cy - headR * 0.6, headR * 0.2, cx, cy, headR);
    grad.addColorStop(0, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.4, player.color);
    grad.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, headR, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayerLimbs() {
    const cx = player.x + player.width / 2;
    const headR = Math.min(player.width, player.height) * 0.6;
    const topY = player.y;
    const cy = topY + headR;
    const limbColor = '#1e1e1e';
    const handColor = '#f5f5f5';
    const footColor = '#333';
    const armLen = headR * 1.2;
    const legLen = headR * 1.35;
    const thickness = Math.max(2, Math.floor(headR * 0.22));
    const swing = Math.sin(t * 10) * (player.grounded ? 1 : 0.5);

    // draw legs first (behind)
    ctx.strokeStyle = limbColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = thickness;
    const hipY = cy + headR * 0.7;
    // left leg
    let angleL = Math.PI / 2 + swing * 0.4;
    // right leg
    let angleR = Math.PI / 2 - swing * 0.4;
    const hipLX = cx - headR * 0.35;
    const hipRX = cx + headR * 0.35;
    const footLX = hipLX + Math.cos(angleL) * legLen;
    const footLY = hipY + Math.sin(angleL) * legLen;
    const footRX = hipRX + Math.cos(angleR) * legLen;
    const footRY = hipY + Math.sin(angleR) * legLen;
    ctx.beginPath();
    ctx.moveTo(hipLX, hipY);
    ctx.lineTo(footLX, footLY);
    ctx.moveTo(hipRX, hipY);
    ctx.lineTo(footRX, footRY);
    ctx.stroke();
    // feet
    ctx.fillStyle = footColor;
    const footW = thickness * 1.2;
    const footH = thickness * 0.7;
    ctx.beginPath();
    ctx.ellipse(footLX, footLY, footW, footH, 0.2, 0, Math.PI * 2);
    ctx.ellipse(footRX, footRY, footW, footH, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // arms (above legs, below head)
    const shoulderY = cy - headR * 0.2;
    const shoulderLX = cx - headR * 0.85;
    const shoulderRX = cx + headR * 0.85;
    const armAngleL = Math.PI - 0.3 + swing * 0.5;
    const armAngleR = 0.3 - swing * 0.5;
    const handLX = shoulderLX + Math.cos(armAngleL) * armLen;
    const handLY = shoulderY + Math.sin(armAngleL) * armLen;
    const handRX = shoulderRX + Math.cos(armAngleR) * armLen;
    const handRY = shoulderY + Math.sin(armAngleR) * armLen;
    ctx.strokeStyle = limbColor;
    ctx.lineWidth = thickness * 0.9;
    ctx.beginPath();
    ctx.moveTo(shoulderLX, shoulderY);
    ctx.lineTo(handLX, handLY);
    ctx.moveTo(shoulderRX, shoulderY);
    ctx.lineTo(handRX, handRY);
    ctx.stroke();
    // hands
    ctx.fillStyle = handColor;
    ctx.beginPath();
    ctx.arc(handLX, handLY, thickness * 0.7, 0, Math.PI * 2);
    ctx.arc(handRX, handRY, thickness * 0.7, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // draw cactus with angry face
        drawCactus(obstacle);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

function drawCactus(ob) {
    const x = ob.x, y = ob.y, w = ob.width, h = ob.height;
    const v = ob.variant || { seed: 1337, ribCount: 6, spikes: 14, angry: 2, armLiftL: 0.45, armLiftR: 0.5 };
    // seeded rng
    let seed = v.seed || 1337;
    const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0, (seed & 0x7fffffff) / 0x7fffffff);

    // gradient body
    const radius = Math.max(6, Math.min(w, h) * 0.4);
    const baseY = y + h;
    const bodyGrad = ctx.createLinearGradient(x, y, x, baseY);
    bodyGrad.addColorStop(0, '#2F8F2E');
    bodyGrad.addColorStop(1, '#1F5F1E');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, baseY);
    ctx.closePath();
    ctx.fill();

    // outline
    ctx.strokeStyle = '#114416';
    ctx.lineWidth = 2;
    ctx.stroke();

    // arms with rounded ends
    const armBaseYL = y + h * (v.armLiftL || 0.5);
    const armBaseYR = y + h * (v.armLiftR || 0.5);
    const armThick = Math.max(6, w * 0.6);
    const armLen = Math.min(24, w * 1.5);
    ctx.fillStyle = bodyGrad;
    // left arm
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - armLen * 0.5, armBaseYL - armThick, armLen, armThick, Math.min(8, armThick / 2))
                  : ctx.rect(x - armLen * 0.5, armBaseYL - armThick, armLen, armThick);
    ctx.fill();
    // left arm vertical tip
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - armLen * 0.5, armBaseYL - armThick - 16, Math.max(6, armThick * 0.55), 16, 6)
                  : ctx.rect(x - armLen * 0.5, armBaseYL - armThick - 16, Math.max(6, armThick * 0.55), 16);
    ctx.fill();
    // right arm
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x + w - armLen * 0.5, armBaseYR - armThick * 0.7, armLen, armThick * 0.7, Math.min(8, armThick / 2))
                  : ctx.rect(x + w - armLen * 0.5, armBaseYR - armThick * 0.7, armLen, armThick * 0.7);
    ctx.fill();
    // right arm vertical tip
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x + w + armLen * 0.1 - armThick * 0.5, armBaseYR - armThick * 0.7 - 14, Math.max(6, armThick * 0.5), 14, 6)
                  : ctx.rect(x + w + armLen * 0.1 - armThick * 0.5, armBaseYR - armThick * 0.7 - 14, Math.max(6, armThick * 0.5), 14);
    ctx.fill();

    // ribs
    const ribs = v.ribCount || 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i < ribs; i++) {
        const rx = x + (w / ribs) * i;
        ctx.beginPath();
        ctx.moveTo(rx, y + 6);
        ctx.lineTo(rx, baseY - 4);
        ctx.stroke();
    }

    // spines
    const spineCount = Math.max(10, Math.floor((w * h) / 60 * (0.6 + (v.spikes || 14) / 20)));
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < spineCount; i++) {
        const px = x + 3 + rnd() * (w - 6);
        const py = y + 6 + rnd() * (h - 12);
        const ang = (rnd() - 0.5) * Math.PI / 3;
        const len = 3 + rnd() * 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len);
        ctx.stroke();
    }

    // face (more angry)
    const faceCenterX = x + w / 2;
    const faceTop = y + Math.min(h * 0.2, 28);
    const angry = v.angry || 2; // 1..3
    // eyebrows
    ctx.strokeStyle = '#06220F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(faceCenterX - 12, faceTop + 4);
    ctx.lineTo(faceCenterX - 2, faceTop - (angry >= 3 ? 8 : 6));
    ctx.moveTo(faceCenterX + 12, faceTop + 4);
    ctx.lineTo(faceCenterX + 2, faceTop - (angry >= 3 ? 8 : 6));
    ctx.stroke();
    // eyes (red glow)
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.ellipse(faceCenterX - 6, faceTop + 7, 3.2, 2.4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(faceCenterX + 6, faceTop + 7, 3.2, 2.4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // mouth with teeth
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.moveTo(faceCenterX - 10, faceTop + 18);
    ctx.quadraticCurveTo(faceCenterX, faceTop + (angry >= 3 ? 28 : 24), faceCenterX + 10, faceTop + 18);
    ctx.quadraticCurveTo(faceCenterX, faceTop + (angry >= 3 ? 22 : 20), faceCenterX - 10, faceTop + 18);
    ctx.closePath();
    ctx.fill();
    // teeth
    ctx.fillStyle = '#FFFFFF';
    const teeth = 4;
    for (let i = 0; i < teeth; i++) {
        const tx = faceCenterX - 8 + i * (16 / (teeth - 1));
        ctx.beginPath();
        ctx.moveTo(tx, faceTop + 18);
        ctx.lineTo(tx + 2, faceTop + 22);
        ctx.lineTo(tx + 4, faceTop + 18);
        ctx.closePath();
        ctx.fill();
    }
}

function drawBenches() {
    benches.forEach(bench => {
        if (!perfMode) {
            // subtle drop shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            drawPie(bench.x, bench.y, bench.width, bench.height);
            ctx.restore();
        } else {
            drawPie(bench.x, bench.y, bench.width, bench.height);
        }
    });
}

function drawPie(x, y, w, h) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = Math.max(10, w / 2);
    const ry = Math.max(5, h / 2);

    // crust base
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    const crustGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    crustGrad.addColorStop(0, '#f3c98b');
    crustGrad.addColorStop(1, '#d39a52');
    ctx.fillStyle = crustGrad;
    ctx.fill();
    ctx.strokeStyle = '#a87439';
    ctx.lineWidth = 2;
    ctx.stroke();

    // filling (slightly inset)
    ctx.beginPath();
    ctx.ellipse(cx, cy - ry * 0.08, rx * 0.78, ry * 0.65, 0, 0, Math.PI * 2);
    const flavors = ['#b22222', '#8e24aa', '#c62828', '#ad1457'];
    ctx.fillStyle = flavors[(Math.floor(x + y) % flavors.length + flavors.length) % flavors.length];
    ctx.fill();

    // simple lattice (skip in perf mode)
    if (!perfMode) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 248, 225, 0.9)';
        ctx.lineWidth = 3;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - rx * 0.7 + i * (rx * 0.28), cy - ry * 0.6);
            ctx.lineTo(cx - rx * 0.7 + i * (rx * 0.28), cy + ry * 0.6);
            ctx.stroke();
        }
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - rx * 0.85, cy + i * (ry * 0.35));
            ctx.lineTo(cx + rx * 0.85, cy + i * (ry * 0.35));
            ctx.stroke();
        }
        ctx.restore();
    }

    // specular highlight
    ctx.beginPath();
    ctx.ellipse(cx - rx * 0.25, cy - ry * 0.35, rx * 0.25, ry * 0.12, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fill();
}

// floating enemies (winged pig men)
function drawFloaters(currentTime) {
    const time = currentTime / 1000;
    floaters.forEach(f => {
        // bobbing vertical motion
        f.y = f.baseY + Math.sin(time * f.frequency + f.phase) * f.amplitude;

        // flap animation
        const flap = Math.sin(time * 8 + f.phase);

        drawWingedPig(f, flap);
    });
}

function drawWingedPig(f, flap) {
    const cx = f.x + f.width / 2;
    const cy = f.y + f.height / 2;
    const scale = Math.max(0.9, Math.min(1.4, f.width / 28));

    // subtle shadow
    ctx.save();
    if (!perfMode) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
    }

    // body (pig torso)
    ctx.fillStyle = '#F48FB1';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2 * scale, 10 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.ellipse(cx, cy - 5 * scale, 7 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // snout
    ctx.fillStyle = '#F06292';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 3 * scale, 4.2 * scale, 2.8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    // nostrils
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(cx - 1.2 * scale, cy - 3 * scale, 0.6 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 1.2 * scale, cy - 3 * scale, 0.6 * scale, 0, Math.PI * 2);
    ctx.fill();

    // eyes
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(cx - 2.2 * scale, cy - 6 * scale, 0.8 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 2.2 * scale, cy - 6 * scale, 0.8 * scale, 0, Math.PI * 2);
    ctx.fill();

    // legs
    ctx.fillStyle = '#EC407A';
    for (let i = -1; i <= 1; i += 2) {
        ctx.fillRect(cx - 3 * scale + i * 3, cy + 7 * scale, 2 * scale, 4 * scale);
    }

    // wings
    ctx.fillStyle = '#E0E0E0';
    const wingAngle = flap * 0.5; // radians range around 0
    // left wing
    ctx.save();
    ctx.translate(cx - 8 * scale, cy - 2 * scale);
    ctx.rotate(-0.8 + wingAngle);
    drawWingShape(8 * scale, 6 * scale);
    ctx.restore();
    // right wing
    ctx.save();
    ctx.translate(cx + 8 * scale, cy - 2 * scale);
    ctx.rotate(0.8 - wingAngle);
    drawWingShape(8 * scale, 6 * scale);
    ctx.restore();

    ctx.restore();
}

function drawWingShape(w, h) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-w * 0.4, -h * 0.2, -w * 0.9, -h * 0.1);
    ctx.quadraticCurveTo(-w * 0.5, h * 0.2, 0, h * 0.25);
    ctx.quadraticCurveTo(-w * 0.3, h * 0.05, 0, 0);
    ctx.closePath();
    ctx.fill();
}

// background birds (non-colliding)
function drawBirds() {
    ctx.save();
    const maxBirds = perfMode ? 8 : birds.length;
    birds.slice(0, maxBirds).forEach(b => {
        // wing flap factor
        const flap = Math.sin(t * b.flapSpeed + b.phase);
        const span = b.scale * (12 + flap * 6);
        const wingY = b.y + Math.sin(t * b.glideSpeed + b.phase) * 2; // subtle glide

        ctx.strokeStyle = 'rgba(30, 30, 30, 0.7)';
        ctx.lineWidth = Math.max(1, b.scale * (perfMode ? 1.0 : 1.2));
        ctx.lineCap = 'round';
        ctx.beginPath();
        // left wing
        ctx.moveTo(b.x, wingY);
        ctx.quadraticCurveTo(b.x - span * 0.4, wingY - span * 0.25, b.x - span, wingY);
        // right wing
        ctx.moveTo(b.x, wingY);
        ctx.quadraticCurveTo(b.x + span * 0.4, wingY - span * 0.25, b.x + span, wingY);
        ctx.stroke();
    });
    ctx.restore();
}

// bullets
function drawBullets() {
    bullets.forEach(b => {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        if (b.type === 'pellet') {
            // pellets: whiter core for punchy effect
            const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.width, b.y);
            grad.addColorStop(0, '#FFF176');
            grad.addColorStop(1, '#FFA000');
            ctx.fillStyle = grad;
        } else {
            const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.width, b.y);
            grad.addColorStop(0, '#FFD54F');
            grad.addColorStop(1, '#FF6F00');
            ctx.fillStyle = grad;
        }
        ctx.fillRect(b.x, b.y, b.width, b.height);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

// lasers
function drawLasers() {
    lasers.forEach(L => {
        ctx.save();
        if (!perfMode) {
            ctx.shadowColor = 'rgba(100, 181, 246, 0.9)';
            ctx.shadowBlur = 15;
        }
        const grad = ctx.createLinearGradient(L.x, L.y, L.x + L.width, L.y);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(41, 121, 255, 0.9)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0.7)');
        ctx.fillStyle = grad;
        ctx.fillRect(L.x, L.y - L.thickness / 2, L.width, L.thickness);
        ctx.restore();
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height - 20) {
        player.y = canvas.height - player.height - 20;
        player.dy = 0;
        player.grounded = true;
        player.jumpsRemaining = 2; // Reset jumps on ground
    } else {
        player.grounded = false;
    }
}

function jump() {
    if (player.jumpsRemaining > 0) {
        player.dy = player.jumpPower;
        player.jumpsRemaining--;
        player.grounded = false;
    }
}

function updateObstacles(deltaTime) {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
        // count as cleared when it fully passes the player
        if (!obstacle.counted && (obstacle.x + obstacle.width) < player.x) {
            obstacle.counted = true;
            obstaclesCleared++;
            if (obstaclesCleared >= 20 && sunMessageTimer === 0) {
                sunMessageTimer = SUN_MESSAGE_FRAMES;
            }
        }
    });
    benches.forEach(bench => {
        bench.x -= obstacleSpeed;
    });
    floaters.forEach(f => {
        f.x -= f.speed; // horizontal drift
    });
    bullets.forEach(b => {
        if (typeof b.vx === 'number' && typeof b.vy === 'number') {
            b.x += b.vx;
            b.y += b.vy;
        } else {
            b.x += b.speed;
        }
    });
    // cull expired lasers
    const nowUpdate = Date.now();
    lasers = lasers.filter(L => L.expiresAt > nowUpdate);
    // move birds
    birds.forEach(b => {
        b.x -= b.speed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    benches = benches.filter(bench => bench.x + bench.width > 0);
    floaters = floaters.filter(f => f.x + f.width > 0);
    bullets = bullets.filter(b => {
        const withinScreen = b.x < canvas.width + 40 && b.x + b.width > -40 && b.y + b.height > -40 && b.y < canvas.height + 40;
        const notExpired = !b.expiresAt || b.expiresAt > nowUpdate;
        return withinScreen && notExpired;
    });
    birds = birds.filter(b => b.x + b.scale * 20 > -40);

    if (Date.now() - lastObstacleTime > obstacleInterval) {
        if (Math.random() < benchSpawnChance) {
            createBench();
        } else {
            createObstacle();
        }
        lastObstacleTime = Date.now();
        obstacleSpeed += 0.1;
        obstacleInterval = Math.max(500, obstacleInterval - 50);
    }

    // spawn floating enemies on their own cadence
    if (Date.now() - lastFloaterTime > (perfMode ? floaterInterval * 1.3 : floaterInterval)) {
        if (Math.random() < 0.8) { // high chance to spawn when interval elapses
            createFloater();
        }
        lastFloaterTime = Date.now();
        floaterInterval = Math.max(1200, floaterInterval - (perfMode ? 10 : 20)); // slower ramp in perf mode
    }

    // spawn background birds occasionally
    if (Date.now() - lastBirdTime > (perfMode ? birdInterval * 1.25 : birdInterval)) {
        if (Math.random() < (perfMode ? 0.6 : 0.85)) {
            createBirdFlock();
        }
        lastBirdTime = Date.now();
        birdInterval = 3000 + Math.random() * 4000; // 3–7s
    }
}

function createObstacle() {
    const obstacleWidth = 20;
    const obstacleHeight = Math.random() * 50 + 20;
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight - 20;
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: (player.currentTheme === 'sonic' || player.currentTheme === 'knuckles') ? '#FFD700' : '#03DAC6',
        counted: false,
        variant: {
            seed: Math.floor(Math.random() * 1e9),
            ribCount: Math.floor(5 + Math.random() * 4),
            spikes: Math.floor(10 + Math.random() * 10),
            angry: Math.random() < 0.6 ? 3 : 2,
            armLiftL: 0.4 + Math.random() * 0.2,
            armLiftR: 0.4 + Math.random() * 0.25
        }
    });
}

function createBench() {
    const benchWidth = 30;
    const benchHeight = 18;
    const benchX = canvas.width;
    const benchY = canvas.height - benchHeight - 20;
    benches.push({
        x: benchX,
        y: benchY,
        width: benchWidth,
        height: benchHeight,
        color: '#C0C0C0',
        collected: false
    });
}

function createFloater() {
    const width = 30;
    const height = 22;
    const marginFromGround = 120;
    const topLimit = 40;
    const baseY = Math.random() * (canvas.height - marginFromGround - topLimit) + topLimit;
    floaters.push({
        x: canvas.width + 20,
        y: baseY,
        baseY: baseY,
        width: width,
        height: height,
        amplitude: Math.random() * 25 + 15,
        frequency: Math.random() * 1.5 + 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: obstacleSpeed * 0.9 + Math.random() * 1.5,
        color: 'rgba(255, 85, 85, 0.9)'
    });
}

function createBirdFlock() {
    const flockSize = Math.random() < 0.6 ? 3 : 5;
    const baseY = 50 + Math.random() * Math.max(60, canvas.height * 0.35);
    const baseSpeed = 1.2 + Math.random() * 0.8; // slower than gameplay objects
    const baseScale = 1 + Math.random() * 1.2;
    for (let i = 0; i < flockSize; i++) {
        birds.push({
            x: canvas.width + 20 + i * 18,
            y: baseY + (Math.random() * 16 - 8),
            speed: baseSpeed * (0.9 + Math.random() * 0.2),
            scale: baseScale * (0.8 + Math.random() * 0.4),
            flapSpeed: 4 + Math.random() * 2,
            glideSpeed: 0.8 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2
        });
    }
}

function detectCollisions() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            endGame();
        }
    });

    benches.forEach(bench => {
        if (
            !bench.collected &&
            player.x < bench.x + bench.width &&
            player.x + player.width > bench.x &&
            player.y < bench.y + bench.height &&
            player.y + player.height > bench.y
        ) {
            bench.collected = true;
            score += 50;
            updateScoreDisplay();
            benches = benches.filter(b => b !== bench);
        }
    });

    // collisions with floating enemies
    floaters.forEach(f => {
        if (
            player.x < f.x + f.width &&
            player.x + player.width > f.x &&
            player.y < f.y + f.height &&
            player.y + player.height > f.y
        ) {
            endGame();
        }
    });

    // bullet vs floater collisions
    bullets.forEach(b => {
        floaters.forEach(f => {
            if (
                b.x < f.x + f.width &&
                b.x + b.width > f.x &&
                b.y < f.y + f.height &&
                b.y + b.height > f.y
            ) {
                // mark for removal and award points
                f._hit = true;
                b._hit = true;
                const pts = b.type === 'pellet' ? 12 : 25;
                score += pts;
                updateScoreDisplay();
            }
        });
    });
    // remove hit entities
    if (floaters.some(f => f._hit) || bullets.some(b => b._hit)) {
        floaters = floaters.filter(f => !f._hit);
        bullets = bullets.filter(b => !b._hit);
    }

    // laser vs floater collisions (can hit multiple)
    lasers.forEach(L => {
        floaters.forEach(f => {
            if (
                L.x < f.x + f.width &&
                L.x + L.width > f.x &&
                (L.y - L.thickness / 2) < f.y + f.height &&
                (L.y + L.thickness / 2) > f.y
            ) {
                if (!f._hit) {
                    f._hit = true;
                    score += 20; // slightly less per enemy than bullet chain
                    updateScoreDisplay();
                }
            }
        });
    });
    if (floaters.some(f => f._hit)) {
        floaters = floaters.filter(f => !f._hit);
    }
}

function updateScore() {
    score += 1;
    updateScoreDisplay();
}

function gameLoop(currentTime) {
    if (!gameRunning) return;

    // fps sampling and dynamic perf mode
    if (_lastFrameTs === 0) _lastFrameTs = currentTime;
    const frameDt = currentTime - _lastFrameTs;
    _lastFrameTs = currentTime;
    _fpsSamples.push(frameDt);
    if (_fpsSamples.length > 45) _fpsSamples.shift();
    const avg = _fpsSamples.reduce((a, b) => a + b, 0) / _fpsSamples.length;
    // enter perf mode if avg frame time > ~24ms (~41fps), exit if < ~18ms (~55fps)
    if (!perfMode && avg > 24) perfMode = true;
    else if (perfMode && avg < 18) perfMode = false;

    const deltaTime = currentTime - lastObstacleTime; // retained for spawn logic

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.016; // advance animation time
    // update day-night cycle progress
    dayCycleT = ((performance.now() - dayCycleStart) % dayCycleMs) / dayCycleMs;

    // trigger wink every 500 points
    if (score > 0 && score % 500 === 0 && winkTimer === 0) {
        winkTimer = 45; // ~0.75s at 60fps
    }

    drawSky();
    drawParallaxBackground();
    drawMoon();
    drawSunWithMustache();
    drawMountainAndRiver();
    drawBirds();
    drawGround();

    drawPlayer();
    drawObstacles();
    drawBenches();
    drawFloaters(currentTime);
    drawBullets();
    drawLasers();

    updatePlayer();
    updateObstacles(deltaTime);
    detectCollisions();
    updateScore();
    if (winkTimer > 0) winkTimer--;
    if (sunMessageTimer > 0) sunMessageTimer--;

    requestAnimationFrame(gameLoop);
}

function shoot() {
    if (!gameRunning) return;
    const now = Date.now();
    if (currentWeapon === 'pistol') {
        if (now - lastShotTime < shotCooldown) return;
        lastShotTime = now;
        bullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2 - 2,
            width: 14,
            height: 4,
            speed: 9
        });
    } else if (currentWeapon === 'laser') {
        if (now - lastLaserTime < laserCooldown) return;
        lastLaserTime = now;
        const beamX = player.x + player.width;
        const beamY = player.y + player.height / 2;
        lasers.push({
            x: beamX,
            y: beamY,
            width: canvas.width - beamX,
            thickness: 6,
            expiresAt: now + laserDuration
        });
    } else if (currentWeapon === 'blunderbuss') {
        if (now - lastBlunderTime < blunderCooldown) return;
        lastBlunderTime = now;
        const originX = player.x + player.width;
        const originY = player.y + player.height / 2;
        const pellets = 7;
        const spreadDeg = 18; // total spread (~ +/-9 deg)
        for (let i = 0; i < pellets; i++) {
            const t = i / (pellets - 1); // 0..1
            const angleDeg = -spreadDeg / 2 + t * spreadDeg + (Math.random() * 4 - 2);
            const angleRad = angleDeg * Math.PI / 180;
            const speed = 8 + Math.random() * 1.5;
            const vx = Math.cos(angleRad) * speed;
            const vy = Math.sin(angleRad) * speed;
            bullets.push({
                type: 'pellet',
                x: originX,
                y: originY,
                vx,
                vy,
                width: 8,
                height: 3,
                expiresAt: now + 400
            });
        }
    }
}

function setHat(hatType) {
    player.currentHat = hatType;
    if (typeof updateSelectionUI === 'function') updateSelectionUI();
}

function setTheme(themeType) {
    player.currentTheme = themeType;
    if (themeType === 'sonic') {
        player.color = '#0000FF';
    } else if (themeType === 'knuckles') {
        player.color = '#FF0000';
    } else {
        player.color = '#BB86FC';
    }
}

// weapon selection for UI buttons
function setWeapon(type) {
    if (type === 'pistol' || type === 'laser' || type === 'blunderbuss') {
        currentWeapon = type;
        updateScoreDisplay();
        if (typeof updateSelectionUI === 'function') updateSelectionUI();
    }
}

function startGame() {
    gameRunning = true;
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    if (startScreen) startScreen.style.display = 'none';
    stopStartScene();
    score = 0;
    updateScoreDisplay();
    obstacles = [];
    benches = [];
    floaters = [];
    bullets = [];
    lasers = [];
    birds = [];
    obstaclesCleared = 0;
    sunMessageTimer = 0;
    player.x = 50;
    player.y = canvas.height - player.height - 20;
    player.dy = 0;
    obstacleSpeed = 3;
    obstacleInterval = 1500;
    lastObstacleTime = Date.now();
    winkTimer = 0;
    lastShotTime = 0;
    lastLaserTime = 0;
    lastBirdTime = 0;
    birdInterval = 4000;
    setTheme(player.currentTheme);
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    startButton.style.display = 'block';
    instructions.style.display = 'block';
    if (startScreen) startScreen.style.display = 'block';
    alert(`GAME OVER! YOUR SCORE: ${score}`);
    startStartScene();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        jump();
    } else if (e.key === ' ' || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        shoot();
    } else if (e.key === '1') {
        currentWeapon = 'pistol';
        updateScoreDisplay();
    } else if (e.key === '2') {
        currentWeapon = 'laser';
        updateScoreDisplay();
    } else if (e.key === '3') {
        currentWeapon = 'blunderbuss';
        updateScoreDisplay();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startButton.addEventListener('click', startGame);

// mobile shoot button handlers
if (shootUIButton) {
    const fire = (e) => { e.preventDefault(); e.stopPropagation(); shoot(); };
    shootUIButton.addEventListener('click', fire);
    shootUIButton.addEventListener('touchstart', fire, { passive: false });
}

// mobile jump button handlers
if (jumpUIButton) {
    const j = (e) => { e.preventDefault(); e.stopPropagation(); jump(); };
    jumpUIButton.addEventListener('click', j);
    jumpUIButton.addEventListener('touchstart', j, { passive: false });
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawPlayer();
// initialize start scene drawing
initStartScene();
startStartScene();
initSelectionUI();
initFromQuery();
updateSelectionUI();

function initSelectionUI() {
    const qAll = (sel) => Array.from(document.querySelectorAll(sel));
    selectionButtons = [
        ...qAll('[data-hat]'),
        ...qAll('[data-weapon]'),
        ...qAll('[data-theme]')
    ];
    updateSelectionUI();
}

function updateSelectionUI() {
    selectionButtons.forEach(btn => {
        if (btn.dataset.hat) btn.classList.toggle('active', player.currentHat === btn.dataset.hat);
        if (btn.dataset.weapon) btn.classList.toggle('active', currentWeapon === btn.dataset.weapon);
        if (btn.dataset.theme) btn.classList.toggle('active', player.currentTheme === btn.dataset.theme);
    });
}

// initialize from URL query params, e.g. ?theme=silkson&weapon=laser&hat=cowboyhat
function initFromQuery() {
    try {
        const params = new URLSearchParams(location.search);
        const norm = (v) => (v || '').toString().trim().toLowerCase();
        // theme (tolerate common typos)
        let theme = norm(params.get('theme'));
        if (theme) {
            if (theme === 'silkson' || theme === 'silksng' || theme === 'silksong') theme = 'silksong';
            if (theme === 'sonic') theme = 'sonic';
            if (theme === 'knuckles' || theme === 'knuckle') theme = 'knuckles';
            if (theme === 'silksong' || theme === 'sonic' || theme === 'knuckles') {
                player.currentTheme = theme;
                setTheme(theme);
            }
        }
        // weapon
        const w = norm(params.get('weapon'));
        if (w === 'pistol' || w === 'laser' || w === 'blunderbuss') {
            setWeapon(w);
        }
        // hat
        const h = norm(params.get('hat'));
        if (h === 'none' || h === 'tophat' || h === 'cowboyhat') {
            setHat(h);
        }
    } catch (_) {}
}

function initStartScene() {
    if (!startCanvas || !sctx) return;
    resizeStartCanvas();
    startScene = {
        t: 0,
        cacti: [
            { x: startCanvas.width * 0.35, y: null, w: 36, h: 80, vx: 1.2, seed: 12345, phase: Math.random() * Math.PI * 2 },
            { x: startCanvas.width * 0.65, y: null, w: 36, h: 80, vx: -1.0, seed: 67890, phase: Math.random() * Math.PI * 2 }
        ],
        trees: [],
    };
    const groundY = startCanvas.height * 0.78;
    startScene.cacti.forEach(c => c.y = groundY - c.h);
    // sprinkle some trees
    for (let i = 0; i < 6; i++) {
        startScene.trees.push({
            x: (i / 5) * startCanvas.width + (Math.random() * 40 - 20),
            y: groundY,
            h: 50 + Math.random() * 40,
            scale: 0.8 + Math.random() * 0.6
        });
    }
    window.addEventListener('resize', resizeStartCanvas);
}

function resizeStartCanvas() {
    if (!startCanvas) return;
    startCanvas.width = Math.max(300, window.innerWidth);
    startCanvas.height = Math.max(200, window.innerHeight);
}

function drawStartMountains() {
    if (!sctx || !startCanvas) return;
    const h = startCanvas.height;
    sctx.fillStyle = '#1E3A3A';
    sctx.beginPath();
    sctx.moveTo(0, h * 0.72);
    sctx.lineTo(startCanvas.width * 0.18, h * 0.5);
    sctx.lineTo(startCanvas.width * 0.32, h * 0.72);
    sctx.lineTo(startCanvas.width * 0.5, h * 0.46);
    sctx.lineTo(startCanvas.width * 0.64, h * 0.72);
    sctx.lineTo(startCanvas.width * 0.86, h * 0.52);
    sctx.lineTo(startCanvas.width, h * 0.72);
    sctx.lineTo(startCanvas.width, h);
    sctx.lineTo(0, h);
    sctx.closePath();
    sctx.fill();
}

function drawStartTrees() {
    if (!sctx || !startCanvas || !startScene) return;
    startScene.trees.forEach(tr => {
        const x = tr.x, baseY = tr.y, h = tr.h * tr.scale;
        // trunk
        sctx.fillStyle = '#5D4037';
        sctx.fillRect(x - 3, baseY - h * 0.6, 6, h * 0.6);
        // canopy
        sctx.fillStyle = '#2E7D32';
        sctx.beginPath();
        sctx.arc(x, baseY - h * 0.7, h * 0.25, 0, Math.PI * 2);
        sctx.arc(x - h * 0.18, baseY - h * 0.55, h * 0.22, 0, Math.PI * 2);
        sctx.arc(x + h * 0.18, baseY - h * 0.55, h * 0.22, 0, Math.PI * 2);
        sctx.fill();
    });
}

function drawStartGround() {
    if (!sctx || !startCanvas) return;
    const h = startCanvas.height;
    sctx.fillStyle = '#3E7A28';
    sctx.fillRect(0, h * 0.78, startCanvas.width, h * 0.22);
}

function drawStartCactus(c) {
    if (!sctx) return;
    // reuse a simplified cactus renderer
    const bodyGrad = sctx.createLinearGradient(c.x, c.y, c.x, c.y + c.h);
    bodyGrad.addColorStop(0, '#2F8F2E');
    bodyGrad.addColorStop(1, '#1F5F1E');
    sctx.fillStyle = bodyGrad;
    const r = 12;
    sctx.beginPath();
    sctx.moveTo(c.x, c.y + c.h);
    sctx.lineTo(c.x, c.y + r);
    sctx.quadraticCurveTo(c.x, c.y, c.x + r, c.y);
    sctx.lineTo(c.x + c.w - r, c.y);
    sctx.quadraticCurveTo(c.x + c.w, c.y, c.x + c.w, c.y + r);
    sctx.lineTo(c.x + c.w, c.y + c.h);
    sctx.closePath();
    sctx.fill();

    // waving arms
    const armY = c.y + c.h * 0.45;
    const armL = 24;
    const thick = 10;
    const wave = Math.sin(startScene.t * 3 + c.phase) * 6;
    sctx.fillStyle = bodyGrad;
    // left arm
    sctx.fillRect(c.x - armL * 0.5, armY - thick + wave * 0.2, armL, thick);
    sctx.fillRect(c.x - armL * 0.5, armY - thick - 14 + wave * 0.2, thick * 0.6, 14);
    // right arm
    sctx.fillRect(c.x + c.w - armL * 0.5, armY - thick * 0.7 - wave * 0.2, armL, thick * 0.7);
    sctx.fillRect(c.x + c.w + armL * 0.1 - thick * 0.5, armY - thick * 0.7 - 14 - wave * 0.2, thick * 0.5, 14);

    // angry face
    const cx = c.x + c.w / 2;
    const ft = c.y + 18;
    sctx.strokeStyle = '#06220F';
    sctx.lineWidth = 3;
    sctx.beginPath();
    sctx.moveTo(cx - 10, ft);
    sctx.lineTo(cx - 2, ft - 6);
    sctx.moveTo(cx + 10, ft);
    sctx.lineTo(cx + 2, ft - 6);
    sctx.stroke();
    sctx.fillStyle = '#D32F2F';
    sctx.beginPath();
    sctx.arc(cx - 6, ft + 6, 2.5, 0, Math.PI * 2);
    sctx.arc(cx + 6, ft + 6, 2.5, 0, Math.PI * 2);
    sctx.fill();
}

function startStartScene() {
    if (!startCanvas || !sctx) return;
    cancelAnimationFrame(startAnimId || 0);
    startAnimId = null;
    const loop = () => {
        if (startScreen && startScreen.style.display === 'none') return; // paused
        startScene.t += 0.016;
        sctx.clearRect(0, 0, startCanvas.width, startCanvas.height);
        drawStartMountains();
        drawStartTrees();
        drawStartGround();
        // move cacti and draw
        startScene.cacti.forEach(c => {
            c.x += c.vx;
        });
        // bounce and clash
        const left = startScene.cacti[0], right = startScene.cacti[1];
        const minX = startCanvas.width * 0.1, maxX = startCanvas.width * 0.9;
        [left, right].forEach(c => {
            if (c.x < minX) { c.x = minX; c.vx *= -1; }
            if (c.x + c.w > maxX) { c.x = maxX - c.w; c.vx *= -1; }
        });
        // if close, reverse and show "pow"
        if ((right.x - (left.x + left.w)) < 4) {
            left.vx = -Math.abs(left.vx);
            right.vx = Math.abs(right.vx);
            // pow flash
            sctx.save();
            sctx.globalAlpha = 0.8;
            sctx.fillStyle = '#FFD54F';
            sctx.beginPath();
            const px = (left.x + left.w + right.x) / 2;
            const py = left.y + 24;
            sctx.moveTo(px, py - 10);
            sctx.lineTo(px + 6, py - 3);
            sctx.lineTo(px + 14, py - 10);
            sctx.lineTo(px + 11, py + 2);
            sctx.lineTo(px + 18, py + 8);
            sctx.lineTo(px + 6, py + 6);
            sctx.lineTo(px, py + 16);
            sctx.lineTo(px - 6, py + 6);
            sctx.lineTo(px - 18, py + 8);
            sctx.lineTo(px - 11, py + 2);
            sctx.lineTo(px - 14, py - 10);
            sctx.lineTo(px - 6, py - 3);
            sctx.closePath();
            sctx.fill();
            sctx.restore();
        }
        drawStartCactus(left);
        drawStartCactus(right);
        startAnimId = requestAnimationFrame(loop);
    };
    loop();
}

function stopStartScene() {
    cancelAnimationFrame(startAnimId || 0);
    startAnimId = null;
}
