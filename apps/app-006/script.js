const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const instructions = document.getElementById('instructions');

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

function updateScoreDisplay() {
    scoreDisplay.textContent = `SCORE: ${score} [${currentWeapon.toUpperCase()}]`;
}

let backgroundElements = [
    { x: 0, y: 0, width: canvas.width, height: canvas.height, color: 'rgba(0,0,0,0.1)', speed: 0.1 },
    { x: 0, y: 0, width: canvas.width, height: canvas.height, color: 'rgba(0,0,0,0.05)', speed: 0.05 }
];

function resizeCanvas() {
    const aspectRatio = initialCanvasWidth / initialCanvasHeight;
    let newWidth = window.innerWidth * 0.9;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > window.innerHeight * 0.8) {
        newHeight = window.innerHeight * 0.8;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

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

// Draw Sun with Mustache and winkable eyes
function drawSunWithMustache() {
    const sunX = canvas.width - 100;
    const sunY = 80;
    const sunRadius = 40;

    // animated sun rays (behind the sun)
    const rayCount = 16;
    const rayInner = sunRadius + 4;
    const rayOuter = sunRadius + 16;
    ctx.save();
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
    if (sunMessageTimer > 0) {
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
}

function drawPlayer() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    drawHat();
}

function drawHat() {
    const hatX = player.x;
    const hatY = player.y;
    const hatWidth = player.width;
    const hatHeight = player.height;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

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
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // draw cactus with angry face
        drawCactus(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

function drawCactus(x, y, w, h) {
    // body
    const radius = Math.max(6, Math.min(w, h) * 0.4);
    const baseY = y + h;
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, baseY);
    ctx.closePath();
    ctx.fill();

    // arms
    const armY = y + h * 0.45;
    const armThickness = Math.max(6, w * 0.6);
    const armLen = Math.min(18, w * 1.2);
    // left arm
    ctx.fillRect(x - armLen * 0.4, armY - armThickness, armLen, armThickness);
    ctx.fillRect(x - armLen * 0.4, armY - armThickness - 14, armThickness * 0.6, 14);
    // right arm
    ctx.fillRect(x + w - armLen * 0.6, armY - armThickness * 0.6, armLen, armThickness * 0.6);
    ctx.fillRect(x + w + armLen * 0.4 - armThickness * 0.6, armY - armThickness * 0.6 - 12, armThickness * 0.6, 12);

    // face (angry)
    const faceCenterX = x + w / 2;
    const faceTop = y + Math.min(h * 0.2, 28);
    ctx.strokeStyle = '#0D3B1E';
    ctx.lineWidth = 2;
    // eyebrows
    ctx.beginPath();
    ctx.moveTo(faceCenterX - 10, faceTop + 2);
    ctx.lineTo(faceCenterX - 2, faceTop - 4);
    ctx.moveTo(faceCenterX + 10, faceTop + 2);
    ctx.lineTo(faceCenterX + 2, faceTop - 4);
    ctx.stroke();
    // eyes
    ctx.fillStyle = '#0D3B1E';
    ctx.beginPath();
    ctx.arc(faceCenterX - 6, faceTop + 6, 2.2, 0, Math.PI * 2);
    ctx.arc(faceCenterX + 6, faceTop + 6, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // angry mouth
    ctx.beginPath();
    ctx.moveTo(faceCenterX - 8, faceTop + 16);
    ctx.quadraticCurveTo(faceCenterX, faceTop + 22, faceCenterX + 8, faceTop + 16);
    ctx.stroke();

    // subtle spines (dots)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 6; i++) {
        const px = x + 4 + Math.random() * (w - 8);
        const py = y + 8 + Math.random() * (h - 16);
        ctx.fillRect(px, py, 1.5, 1.5);
    }
}

function drawBenches() {
    benches.forEach(bench => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        ctx.fillStyle = bench.color;
        ctx.fillRect(bench.x, bench.y, bench.width, bench.height);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

// floating enemies
function drawFloaters(currentTime) {
    const time = currentTime / 1000;
    floaters.forEach(f => {
        // sine wave vertical motion
        f.y = f.baseY + Math.sin(time * f.frequency + f.phase) * f.amplitude;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // draw as glowing orb
        const gradient = ctx.createRadialGradient(f.x + f.width/2, f.y + f.height/2, 2, f.x + f.width/2, f.y + f.height/2, Math.max(f.width, f.height));
        gradient.addColorStop(0, f.color);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(f.x + f.width/2, f.y + f.height/2, f.width/2, f.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

// background birds (non-colliding)
function drawBirds() {
    ctx.save();
    birds.forEach(b => {
        // wing flap factor
        const flap = Math.sin(t * b.flapSpeed + b.phase);
        const span = b.scale * (12 + flap * 6);
        const wingY = b.y + Math.sin(t * b.glideSpeed + b.phase) * 2; // subtle glide

        ctx.strokeStyle = 'rgba(30, 30, 30, 0.7)';
        ctx.lineWidth = Math.max(1, b.scale * 1.2);
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
        ctx.shadowColor = 'rgba(100, 181, 246, 0.9)';
        ctx.shadowBlur = 15;
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
    if (Date.now() - lastFloaterTime > floaterInterval) {
        if (Math.random() < 0.8) { // high chance to spawn when interval elapses
            createFloater();
        }
        lastFloaterTime = Date.now();
        floaterInterval = Math.max(1200, floaterInterval - 20); // get slightly more frequent
    }

    // spawn background birds occasionally
    if (Date.now() - lastBirdTime > birdInterval) {
        if (Math.random() < 0.85) {
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
        counted: false
    });
}

function createBench() {
    const benchWidth = 40;
    const benchHeight = 20;
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
    const width = 26;
    const height = 18;
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

    const deltaTime = currentTime - lastObstacleTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.016; // advance animation time

    // trigger wink every 500 points
    if (score > 0 && score % 500 === 0 && winkTimer === 0) {
        winkTimer = 45; // ~0.75s at 60fps
    }

    drawParallaxBackground();
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
    }
}

function startGame() {
    gameRunning = true;
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    score = 0;
    currentWeapon = 'pistol';
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
    alert(`GAME OVER! YOUR SCORE: ${score}`);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && player.jumpsRemaining > 0) { // Modified for double jump
        player.dy = player.jumpPower;
        player.jumpsRemaining--;
        player.grounded = false; // Ensure not grounded after jump
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
    if (player.jumpsRemaining > 0) { // Modified for double jump
        player.dy = player.jumpPower;
        player.jumpsRemaining--;
        player.grounded = false; // Ensure not grounded after jump
    }
});

startButton.addEventListener('click', startGame);

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawPlayer();
