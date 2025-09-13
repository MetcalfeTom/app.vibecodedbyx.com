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
    const sunX = canvas.width - 60;
    const sunY = 60;
    const sunRadius = 25;

    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(sunX - 20, sunY + 5);
    ctx.quadraticCurveTo(sunX - 10, sunY + 15, sunX, sunY + 5);
    ctx.quadraticCurveTo(sunX + 10, sunY + 15, sunX + 20, sunY + 5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
