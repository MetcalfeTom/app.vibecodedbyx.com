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

    // Sun
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
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

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
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
    });
    benches.forEach(bench => {
        bench.x -= obstacleSpeed;
    });
    floaters.forEach(f => {
        f.x -= f.speed; // horizontal drift
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    benches = benches.filter(bench => bench.x + bench.width > 0);
    floaters = floaters.filter(f => f.x + f.width > 0);

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
        color: (player.currentTheme === 'sonic' || player.currentTheme === 'knuckles') ? '#FFD700' : '#03DAC6'
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
            scoreDisplay.textContent = `SCORE: ${score}`;
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
}

function updateScore() {
    score += 1;
    scoreDisplay.textContent = `SCORE: ${score}`;
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
    drawGround();

    drawPlayer();
    drawObstacles();
    drawBenches();
    drawFloaters(currentTime);

    updatePlayer();
    updateObstacles(deltaTime);
    detectCollisions();
    updateScore();
    if (winkTimer > 0) winkTimer--;

    requestAnimationFrame(gameLoop);
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

function startGame() {
    gameRunning = true;
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = `SCORE: ${score}`;
    obstacles = [];
    benches = [];
    player.x = 50;
    player.y = canvas.height - player.height - 20;
    player.dy = 0;
    obstacleSpeed = 3;
    obstacleInterval = 1500;
    lastObstacleTime = Date.now();
    winkTimer = 0;
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
