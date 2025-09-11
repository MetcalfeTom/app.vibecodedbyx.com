let playerName = '';
let gameActive = false;
let gamePaused = false;
let pineappleCount = 0;
let startTime = 0;
let gameTime = 0;
let spawnInterval;
let updateInterval;

// Game constants
const SPAWN_INTERVAL = 1000; // milliseconds
const PINEAPPLE_LIFETIME = 5000; // milliseconds

// DOM elements
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const pineappleCountDisplay = document.getElementById('pineappleCount');
const timeDisplay = document.getElementById('timeDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const clickArea = document.getElementById('clickArea');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const highscoresList = document.getElementById('highscoresList');

function startGame() {
    gameActive = true;
    gamePaused = false;
    pineappleCount = 0;
    startTime = Date.now();
    gameTime = 0;
    
    gameArea.style.display = 'block';
    startGameBtn.textContent = 'Restart Game';
    pauseBtn.textContent = 'Pause';
    
    updateDisplay();
    
    // Start spawning pineapples
    spawnInterval = setInterval(spawnPineapple, SPAWN_INTERVAL);
    
    // Start updating time and rate
    updateInterval = setInterval(updateTime, 100);
    
    // Clear any existing pineapples
    clearPineapples();
}

function spawnPineapple() {
    if (!gameActive || gamePaused) return;
    
    const pineapple = document.createElement('div');
    pineapple.className = 'pineapple-spawn';
    pineapple.textContent = '🍍';
    
    // Random position within click area
    const maxX = clickArea.clientWidth - 60;
    const maxY = clickArea.clientHeight - 60;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    pineapple.style.left = x + 'px';
    pineapple.style.top = y + 'px';
    
    // Add click handler
    pineapple.addEventListener('click', () => collectPineapple(pineapple));
    
    clickArea.appendChild(pineapple);
    
    // Remove pineapple after lifetime expires
    setTimeout(() => {
        if (pineapple.parentNode) {
            pineapple.remove();
        }
    }, PINEAPPLE_LIFETIME);
}

function collectPineapple(pineapple) {
    if (!gameActive || gamePaused) return;
    
    pineappleCount++;
    updateDisplay();
    
    // Animate collection
    pineapple.classList.add('pineapple-collected');
    
    setTimeout(() => {
        if (pineapple.parentNode) {
            pineapple.remove();
        }
    }, 300);
}

function updateTime() {
    if (!gameActive || gamePaused) return;
    
    gameTime = Date.now() - startTime;
    updateDisplay();
}

function updateDisplay() {
    pineappleCountDisplay.textContent = pineappleCount;
    timeDisplay.textContent = (gameTime / 1000).toFixed(1) + 's';
    
    const rate = gameTime > 0 ? (pineappleCount / (gameTime / 1000)).toFixed(1) : '0.0';
    rateDisplay.textContent = rate + '/s';
}

function pauseGame() {
    if (!gameActive) return;
    
    if (gamePaused) {
        // Resume
        gamePaused = false;
        startTime = Date.now() - gameTime; // Adjust start time
        pauseBtn.textContent = 'Pause';
        clickArea.classList.remove('paused');
        spawnInterval = setInterval(spawnPineapple, SPAWN_INTERVAL);
        updateInterval = setInterval(updateTime, 100);
    } else {
        // Pause
        gamePaused = true;
        pauseBtn.textContent = 'Resume';
        clickArea.classList.add('paused');
        clearInterval(spawnInterval);
        clearInterval(updateInterval);
    }
}

function stopGame() {
    if (!gameActive) return;
    
    gameActive = false;
    gamePaused = false;
    clearInterval(spawnInterval);
    clearInterval(updateInterval);
    clearPineapples();
    
    if (pineappleCount > 0) {
        saveScore();
    }
    
    startGameBtn.textContent = 'Start Collecting!';
    pauseBtn.textContent = 'Pause';
    clickArea.classList.remove('paused');
}

function clearPineapples() {
    const pineapples = clickArea.querySelectorAll('.pineapple-spawn');
    pineapples.forEach(pineapple => pineapple.remove());
}

// Event listeners
pauseBtn.addEventListener('click', pauseGame);
stopBtn.addEventListener('click', stopGame);

// Save score
async function saveScore() {
    if (!playerName || pineappleCount === 0) return;
    
    try {
        const response = await fetch('api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                score: pineappleCount,
            })
        });
        
        if (response.ok) {
            console.log('Score saved successfully');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        alert('Failed to save score');
    }
}

// Load highscores
async function loadHighscores() {
    try {
        const response = await fetch('api/highscores');
        const scores = await response.json();
        
        if (scores.length === 0) {
            highscoresList.innerHTML = '<p>No scores yet! Be the first to collect some pineapples!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">${score.player_name}</div>
                <div class="highscore-stats">
                    ${score.score} 🍍
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        pauseGame();
    }
});

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