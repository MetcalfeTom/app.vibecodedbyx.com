let playerName = '';
let gameActive = false;
let gamePaused = false;
let score = 0;
let level = 1;
let lives = 3;
let gameStartTime = 0;
let gameTime = 0;

let basketPosition = 50; // percentage
let spawnInterval;
let updateInterval;
let fallSpeed = 3000; // milliseconds for full fall

// Game constants
const LEVEL_UP_SCORE = 100;
const BASKET_SPEED = 5;

// DOM elements
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const basket = document.getElementById('basket');
const fallingArea = document.getElementById('fallingArea');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const highscoresList = document.getElementById('highscoresList');

function startGame() {
    gameActive = true;
    gamePaused = false;
    score = 0;
    level = 1;
    lives = 3;
    basketPosition = 50;
    gameStartTime = Date.now();
    
    gameArea.style.display = 'block';
    startGameBtn.textContent = 'Restart Game';
    pauseBtn.textContent = 'Pause';
    
    updateDisplay();
    updateBasketPosition();
    clearFallingItems();
    
    // Start spawning items
    scheduleNextItem();
    
    // Start time counter
    updateInterval = setInterval(updateTime, 100);
}

function scheduleNextItem() {
    if (!gameActive || gamePaused) return;
    
    const baseDelay = Math.max(500, 2000 - (level * 100)); // Faster spawning as level increases
    const randomDelay = Math.random() * 1000; // Add some randomness
    
    setTimeout(() => {
        if (gameActive && !gamePaused) {
            spawnItem();
            scheduleNextItem();
        }
    }, baseDelay + randomDelay);
}

function spawnItem() {
    const item = document.createElement('div');
    const isBomb = Math.random() < 0.2; // 20% chance of bomb
    
    item.className = isBomb ? 'bomb' : 'strawberry';
    item.textContent = isBomb ? '💣' : '🍓';
    item.dataset.type = isBomb ? 'bomb' : 'strawberry';
    
    // Random horizontal position
    const x = Math.random() * 90; // Keep within bounds
    item.style.left = x + '%';
    item.style.top = '-50px';
    
    // Set fall duration based on level
    const duration = Math.max(1500, fallSpeed - (level * 200));
    item.style.animationDuration = duration + 'ms';
    
    fallingArea.appendChild(item);
    
    // Remove item after animation
    setTimeout(() => {
        if (item.parentNode) {
            // Check if item hit the ground (not caught)
            if (item.dataset.type === 'strawberry' && !item.classList.contains('caught')) {
                loseLife();
            }
            item.remove();
        }
    }, duration + 100);
}

function updateTime() {
    if (!gameActive || gamePaused) return;
    gameTime = Date.now() - gameStartTime;
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    livesDisplay.textContent = lives;
}

function updateBasketPosition() {
    basket.style.left = basketPosition + '%';
}

function checkCollisions() {
    const basketRect = basket.getBoundingClientRect();
    const items = fallingArea.querySelectorAll('.strawberry, .bomb');
    
    items.forEach(item => {
        if (item.classList.contains('caught')) return;
        
        const itemRect = item.getBoundingClientRect();
        
        // Check if item overlaps with basket
        if (itemRect.bottom >= basketRect.top &&
            itemRect.top <= basketRect.bottom &&
            itemRect.right >= basketRect.left &&
            itemRect.left <= basketRect.right) {
            
            catchItem(item);
        }
    });
}

function catchItem(item) {
    item.classList.add('caught');
    
    if (item.dataset.type === 'strawberry') {
        score += 10;
        
        // Check for level up
        if (score >= level * LEVEL_UP_SCORE) {
            level++;
        }
    } else if (item.dataset.type === 'bomb') {
        loseLife();
    }
    
    updateDisplay();
}

function loseLife() {
    lives--;
    updateDisplay();
    
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameActive = false;
    gamePaused = false;
    clearInterval(updateInterval);
    clearFallingItems();
    
    if (score > 0) {
        saveScore();
    }
    
    alert(`Game Over! Final Score: ${score}, Level: ${level}`);
    startGameBtn.textContent = 'Start Catching!';
    pauseBtn.textContent = 'Pause';
}

function pauseGame() {
    if (!gameActive) return;
    
    if (gamePaused) {
        // Resume
        gamePaused = false;
        gameStartTime = Date.now() - gameTime;
        pauseBtn.textContent = 'Pause';
        fallingArea.classList.remove('paused');
        scheduleNextItem();
        updateInterval = setInterval(updateTime, 100);
    } else {
        // Pause
        gamePaused = true;
        pauseBtn.textContent = 'Resume';
        fallingArea.classList.add('paused');
        clearInterval(updateInterval);
    }
}

function stopGame() {
    if (!gameActive) return;
    
    gameActive = false;
    gamePaused = false;
    clearInterval(updateInterval);
    clearFallingItems();
    
    if (score > 0) {
        saveScore();
    }
    
    startGameBtn.textContent = 'Start Catching!';
    pauseBtn.textContent = 'Pause';
}

function clearFallingItems() {
    const items = fallingArea.querySelectorAll('.strawberry, .bomb');
    items.forEach(item => item.remove());
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive || gamePaused) return;
    
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        basketPosition = Math.max(0, basketPosition - BASKET_SPEED);
        updateBasketPosition();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        basketPosition = Math.min(90, basketPosition + BASKET_SPEED);
        updateBasketPosition();
    } else if (e.code === 'Space') {
        e.preventDefault();
        pauseGame();
    }
});

// Mouse/touch controls
let isDragging = false;

basket.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !gameActive || gamePaused) return;
    
    const gameBoard = document.getElementById('gameBoard');
    const rect = gameBoard.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    
    basketPosition = Math.max(0, Math.min(90, x - 5)); // Offset for basket width
    updateBasketPosition();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Collision detection loop
setInterval(() => {
    if (gameActive && !gamePaused) {
        checkCollisions();
    }
}, 50);

// Event listeners
pauseBtn.addEventListener('click', pauseGame);
stopBtn.addEventListener('click', stopGame);

// Save score
async function saveScore() {
    try {
        const response = await fetch('api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                score: score,
                level_reached: level,
                time_played: gameTime
            })
        });
        
        if (response.ok) {
            console.log('Score saved successfully');
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Load highscores
async function loadHighscores() {
    try {
        const response = await fetch('api/highscores');
        const scores = await response.json();
        
        if (scores.length === 0) {
            highscoresList.innerHTML = '<p>No scores yet! Be the first to catch some strawberries!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">${score.player_name}</div>
                <div class="highscore-stats">
                    Score: ${score.score}<br>
                    Level: ${score.level_reached} | ${(score.time_played / 1000).toFixed(1)}s
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

// Event listener for start game button
startGameBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    startGame();
});

// Load highscores on page load
loadHighscores();