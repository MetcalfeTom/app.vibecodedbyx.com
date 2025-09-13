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
    currentHat: 'none',
    currentTheme: 'silksong' // New: Theme property
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

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    drawHat();
}

// Updated: Draw hat function with more detail
function drawHat() {
    const hatX = player.x;
    const hatY = player.y;
    const hatWidth = player.width;
    const hatHeight = player.height;

    switch (player.currentHat) {
        case 'tophat':
            ctx.fillStyle = '#333'; // Dark grey for tophat
            // Brim
            ctx.fillRect(hatX - 5, hatY - 10, hatWidth + 10, 5);
            // Main cylinder
            ctx.fillRect(hatX, hatY - 30, hatWidth, 20);
            break;
        case 'cowboyhat':
            ctx.fillStyle = '#8B4513'; // Saddle brown for cowboy hat
            // Crown
            ctx.beginPath();
            ctx.moveTo(hatX, hatY - 15);
            ctx.lineTo(hatX + hatWidth, hatY - 15);
            ctx.lineTo(hatX + hatWidth - 5, hatY - 30);
            ctx.lineTo(hatX + 5, hatY - 30);
            ctx.closePath();
            ctx.fill();
            // Brim
            ctx.beginPath();
            ctx.ellipse(hatX + hatWidth / 2, hatY - 10, hatWidth / 2 + 10, 8, 0, 0, Math.PI * 2);
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
        color: (player.currentTheme === 'sonic' || player.currentTheme === 'knuckles') ? '#FFD700' : '#03DAC6' // Gold for Sonic/Knuckles obstacles
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

// New: Function to set theme
function setTheme(themeType) {
    player.currentTheme = themeType;
    if (themeType === 'sonic') {
        player.color = '#0000FF'; // Blue for Sonic
    } else if (themeType === 'knuckles') {
        player.color = '#FF0000'; // Red for Knuckles
    } else {
        player.color = '#BB86FC'; // Default Silksong purple
    }
    // Obstacle color is handled in createObstacle based on theme
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
    player.y = canvas.height - 60;
    player.dy = 0;
    obstacleSpeed = 3;
    obstacleInterval = 1500;
    lastObstacleTime = Date.now();
    setTheme(player.currentTheme); // Apply theme on start
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

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

startButton.addEventListener('click', startGame);

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawPlayer();
