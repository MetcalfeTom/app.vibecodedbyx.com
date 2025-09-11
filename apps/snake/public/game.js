// Snake game implementation
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;

// Game state
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = {};
let score = 0;
let gameRunning = false;
let gameStarted = false;
let gameSpeed = 100;

// Initialize game
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    document.getElementById('score').textContent = score;
    placeFood();
    gameRunning = true;
    gameStarted = true;
}

// Place food randomly
function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Draw functions
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        const color = index === 0 ? '#2ecc71' : '#27ae60';
        drawCell(segment.x, segment.y, color);
    });
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Move snake
function moveSnake() {
    // Apply the next direction at the start of each move
    direction = { ...nextDirection };
    
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        endGame();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        placeFood();
        
        // Speed up game slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
    } else {
        snake.pop();
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    moveSnake();
    draw();
    
    setTimeout(gameLoop, gameSpeed);
}

// End game
async function endGame() {
    gameRunning = false;
    gameStarted = false;
    
    // Check for personal best
    const personalBest = localStorage.getItem('snakePersonalBest') || 0;
    if (score > personalBest) {
        localStorage.setItem('snakePersonalBest', score);
        document.getElementById('personal-best').textContent = score;
    }

    if (score > 0) {
        const name = prompt(`Game Over! Score: ${score}
Enter your name for the highscore:`);
        if (name) {
            await submitScore(name, score);
        }
    }
}

// Controls
document.addEventListener('keydown', (e) => {
    // Start game with any key if not started
    if (!gameStarted) {
        startGame();
        return;
    }
    
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
});

// Start game function
function startGame() {
    if (gameRunning) return;
    
    initGame();
    draw();
    gameLoop();
}

// Highscores functionality
async function loadHighscores() {
    try {
        const res = await fetch('api/highscores');
        const scores = await res.json();
        
        const list = document.getElementById('scores-list');
        if (scores.length === 0) {
            list.innerHTML = '<p>No highscores yet!</p>';
        } else {
            list.innerHTML = '<table><tr><th>Rank</th><th>Player</th><th>Score</th></tr>' +
                scores.map((s, i) => 
                    `<tr><td>#${i+1}</td><td>${s.player_name}</td><td>${s.score}</td></tr>`
                ).join('') + '</table>';
        }
    } catch (error) {
        console.error('Failed to load highscores:', error);
    }
}

async function submitScore(playerName, score) {
    try {
        await fetch('api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_name: playerName, score: score })
        });
        loadHighscores();
    } catch (error) {
        console.error('Failed to submit score:', error);
    }
}

// Draw initial instructions
function drawInstructions() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE GAME', canvas.width/2, 140);
    
    ctx.font = '14px monospace';
    ctx.fillText('Press ANY KEY to start', canvas.width/2, 180);
    
    ctx.font = '12px monospace';
    ctx.fillText('Use Arrow Keys or WASD', canvas.width/2, 220);
    ctx.fillText('to control the snake', canvas.width/2, 240);
    
    ctx.fillText('Eat red food to grow', canvas.width/2, 280);
    ctx.fillText('Avoid walls and yourself!', canvas.width/2, 300);
    
    ctx.textAlign = 'left';
}

// Initial setup
drawInstructions();

// Load highscores on page load
loadHighscores();

// Load personal best on page load
const personalBest = localStorage.getItem('snakePersonalBest') || 0;
document.getElementById('personal-best').textContent = personalBest;


// Make startGame available globally
window.startGame = startGame;

// Clear scores
