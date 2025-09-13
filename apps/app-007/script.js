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
    currentHat: 'none'
};

let obstacles = [];
let benches = [];
let score = 0;
let gameRunning = false;
let t = 0; // animation time for river flow
let winkTimer = 0; // frames remaining for sun wink

canvas.width = initialCanvasWidth;
canvas.height = initialCanvasHeight;

function resizeCanvas() {
    const scale = Math.min(window.innerWidth / initialCanvasWidth, window.innerHeight / initialCanvasHeight);
    canvas.style.width = initialCanvasWidth * scale + 'px';
    canvas.style.height = initialCanvasHeight * scale + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBackground() {
    // SUN
    const sunX = canvas.width - 60;
    const sunY = 60;
    const sunRadius = 25;

    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // SUN FACE (EYES + OPTIONAL WINK)
    const isWinking = winkTimer > 0;
    // left eye
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 3;
    if (isWinking) {
        // draw a closed eye (arc) for a wink
        ctx.beginPath();
        ctx.arc(sunX - 10, sunY - 5, 5, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.arc(sunX - 10, sunY - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    // right eye (always open)
    ctx.beginPath();
    ctx.arc(sunX + 10, sunY - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // SUN MUSTACHE
    ctx.beginPath();
    ctx.moveTo(sunX - 20, sunY + 5);
    ctx.quadraticCurveTo(sunX - 10, sunY + 15, sunX, sunY + 5);
    ctx.quadraticCurveTo(sunX + 10, sunY + 15, sunX + 20, sunY + 5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    // DISTANT MOUNTAINS
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

    // NEAR MOUNTAINS
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

    // FEATURED CENTRAL MOUNTAIN WITH SNOW CAP
    const peakX = canvas.width * 0.45;
    const peakY = nearBaseY - 130;
    const baseOffset = 120;
    // main mountain body
    ctx.fillStyle = '#324B50';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - baseOffset, nearBaseY);
    ctx.lineTo(peakX + baseOffset, nearBaseY);
    ctx.closePath();
    ctx.fill();
    // light side shading
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

    // FLOWING RIVER (ANIMATED STRIPES)
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
    // subtle vertical gradient for depth
    const riverGradient = ctx.createLinearGradient(0, riverTopY, 0, canvas.height);
    riverGradient.addColorStop(0, '#1E90FF');
    riverGradient.addColorStop(1, '#1565C0');
    ctx.fillStyle = riverGradient;
    ctx.fill();

    // Clip to river shape for animated highlights
    ctx.clip();
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    const offset = (t * 60) % 20; // move rightward
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

function update() {
    if (!gameRunning) return;
    // trigger wink every 500 points for a short duration
    if (score > 0 && score % 500 === 0 && winkTimer === 0) {
        winkTimer = 45; // ~0.75s at 60fps
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.016; // advance animation time
    drawBackground();
    drawObstacles();
    drawBenches();

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });

    benches.forEach(bench => {
        bench.x -= 2;
    });

    drawPlayer();
    score++;
    scoreDisplay.textContent = `SCORE: ${score}`;
    if (winkTimer > 0) winkTimer--;
    requestAnimationFrame(update);
}

function spawnObstacle() {
    const height = Math.random() * 30 + 20;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 20,
        height: height,
        color: '#ff5555'
    });
}

function spawnBench() {
    const width = 50;
    benches.push({
        x: canvas.width + 100,
        y: canvas.height - 10,
        width: width,
        height: 10,
        color: '#8B4513'
    });
}

function startGame() {
    obstacles = [];
    benches = [];
    score = 0;
    gameRunning = true;
    winkTimer = 0;
    instructions.style.display = 'none';
    player.x = 50;
    player.y = canvas.height - 60;
    player.dy = 0;
    spawnObstacle();
    spawnBench();
    update();
}

function gameOver() {
    gameRunning = false;
    instructions.style.display = 'block';
    instructions.textContent = 'GAME OVER! PRESS START TO TRY AGAIN.';
}

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowUp' || e.key === ' ') && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

startButton.addEventListener('click', startGame);

window.setInterval(() => {
    if (!gameRunning) return;
    if (Math.random() < 0.6) spawnObstacle();
    if (Math.random() < 0.3) spawnBench();
}, 1000);

window.setHat = function(hat) {
    player.currentHat = hat;
};

window.setTheme = function(theme) {
    // Placeholder for theme switching if needed later
};
