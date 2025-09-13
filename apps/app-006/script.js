const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const instructions = document.getElementById('instructions');

canvas.width = 800;
canvas.height = 400;

let player = {
    x: 50,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    color: '#BB86FC', // Silksong-like purple
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false
};

let obstacles = [];
let benches = []; // New: Array for benches
let score = 0;
let gameRunning = false;
let obstacleSpeed = 3;
let obstacleInterval = 1500; // Milliseconds
let lastObstacleTime = 0;
let lastBenchTime = 0; // New: For bench spawning
const benchSpawnChance = 0.1; // 10% chance to spawn a bench instead of an obstacle

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// New: Draw benches
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
    benches.forEach(bench => { // New: Move benches
        bench.x -= obstacleSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    benches = benches.filter(bench => bench.x + bench.width > 0); // New: Filter benches

    if (Date.now() - lastObstacleTime > obstacleInterval) {
        if (Math.random() < benchSpawnChance) { // New: Chance to spawn bench
            createBench();
        } else {
            createObstacle();
        }
        lastObstacleTime = Date.now();
        // Make it harder over time
        obstacleSpeed += 0.1;
        obstacleInterval = Math.max(500, obstacleInterval - 50);
    }
}

function createObstacle() {
    const obstacleWidth = 20;
    const obstacleHeight = Math.random() * 50 + 20; // Random height
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight;
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: '#03DAC6' // Silksong-like teal
    });
}

// New: Create bench
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
        color: '#C0C0C0', // Grey for bench
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

    // New: Bench collision
    benches.forEach(bench => {
        if (
            !bench.collected &&
            player.x < bench.x + bench.width &&
            player.x + player.width > bench.x &&
            player.y < bench.y + bench.height &&
            player.y + player.height > bench.y
        ) {
            bench.collected = true;
            score += 50; // Score for collecting a bench
            scoreDisplay.textContent = `SCORE: ${score}`;
            // Optionally, remove bench immediately or add a visual effect
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
    drawBenches(); // New: Draw benches

    updatePlayer();
    updateObstacles(deltaTime);
    detectCollisions();
    // updateScore(); // Score is now updated in detectCollisions and implicitly by time

    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameRunning = true;
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = `SCORE: ${score}`;
    obstacles = [];
    benches = []; // New: Reset benches
    player.x = 50;
    player.y = canvas.height - 60;
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

startButton.addEventListener('click', startGame);

// Initial draw
drawPlayer();
// createObstacle(); // Removed: Obstacles will spawn via updateObstacles