const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const instructions = document.getElementById('instructions');

// Initial canvas dimensions (will be adjusted by resizeCanvas)
let initialCanvasWidth = 800;
let initialCanvasHeight = 400;

let player = {
    x: 50,
    y: initialCanvasHeight - 60, // Will be updated on resize
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
let obstacleSpeed = 3;
let obstacleInterval = 1500;
let lastObstacleTime = 0;
let lastBenchTime = 0;
const benchSpawnChance = 0.1;

// New: Function to resize canvas
function resizeCanvas() {
    const aspectRatio = initialCanvasWidth / initialCanvasHeight;
    let newWidth = window.innerWidth * 0.9; // 90% of viewport width
    let newHeight = newWidth / aspectRatio;

    if (newHeight > window.innerHeight * 0.8) { // Don't exceed 80% of viewport height
        newHeight = window.innerHeight * 0.8;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Adjust player position relative to new canvas height
    player.y = canvas.height - player.height - 30; // Keep player near bottom
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    drawHat();
}

function drawHat() {
    ctx.fillStyle = 'brown';
    switch (player.currentHat) {
        case 'tophat':
            ctx.fillRect(player.x - 5, player.y - 15, player.width + 10, 15);
            ctx.fillRect(player.x + 5, player.y - 30, player.width - 10, 15);
            break;
        case 'cowboyhat':
            ctx.beginPath();
            ctx.moveTo(player.x - 10, player.y - 5);
            ctx.lineTo(player.x + player.width + 10, player.y - 5);
            ctx.lineTo(player.x + player.width, player.y - 20);
            ctx.lineTo(player.x, player.y - 20);
            ctx.closePath();
            ctx.fill();
            break;
        case 'none':
        default:
            break;
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawBenches() {
    benches.forEach(bench => {
        ctx.fillStyle = bench.color;
        ctx.fillRect(bench.x, bench.y, bench.width, bench.height);
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }
}

function updateObstacles(deltaTime) {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });
    benches.forEach(bench => {
        bench.x -= obstacleSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    benches = benches.filter(bench => bench.x + bench.width > 0);

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
}

function createObstacle() {
    const obstacleWidth = 20;
    const obstacleHeight = Math.random() * 50 + 20;
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight;
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: '#03DAC6'
    });
}

function createBench() {
    const benchWidth = 40;
    const benchHeight = 20;
    const benchX = canvas.width;
    const benchY = canvas.height - benchHeight;
    benches.push({
        x: benchX,
        y: benchY,
        width: benchWidth,
        height: benchHeight,
        color: '#C0C0C0',
        collected: false
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
}

function updateScore() {
    score += 1;
    scoreDisplay.textContent = `SCORE: ${score}`;
}

function gameLoop(currentTime) {
    if (!gameRunning) return;

    const deltaTime = currentTime - lastObstacleTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    drawBenches();

    updatePlayer();
    updateObstacles(deltaTime);
    detectCollisions();
    updateScore();

    requestAnimationFrame(gameLoop);
}

function setHat(hatType) {
    player.currentHat = hatType;
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
    player.y = canvas.height - 60; // Reset player Y
    player.dy = 0;
    obstacleSpeed = 3;
    obstacleInterval = 1500;
    lastObstacleTime = Date.now();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    startButton.style.display = 'block';
    instructions.style.display = 'block';
    alert(`GAME OVER! YOUR SCORE: ${score}`);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

// New: Touch event listener for jump
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling on touch
    if (player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

startButton.addEventListener('click', startGame);

// Initial setup
resizeCanvas(); // Call resize on load
window.addEventListener('resize', resizeCanvas); // Call resize on window resize
drawPlayer();