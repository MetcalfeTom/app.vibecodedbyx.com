let playerName = '';
let gameActive = false;
let gamePaused = false;
let bananaCount = 0;
let startTime = 0;
let gameTime = 0;
let spawnInterval;
let updateInterval;

// Game settings
const SPAWN_INTERVAL = 1500; // milliseconds
const BANANA_LIFETIME = 3000; // milliseconds

// DOM elements
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const bananaCountDisplay = document.getElementById('bananaCount');
const timeDisplay = document.getElementById('timeDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const clickArea = document.getElementById('clickArea');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const highscoresList = document.getElementById('highscoresList');

function startGame() {
    gameActive = true;
    gamePaused = false;
    bananaCount = 0;
    startTime = Date.now();
    gameTime = 0;
    
    gameArea.style.display = 'block';
    startGameBtn.textContent = 'Restart Game';
    pauseBtn.textContent = 'Pause';
    
    updateDisplay();
    
    // Start spawning bananas
    spawnInterval = setInterval(spawnBanana, SPAWN_INTERVAL);
    
    // Start updating time and rate
    updateInterval = setInterval(updateTime, 100);
    
    // Clear any existing bananas
    clearBananas();
}

function spawnBanana() {
    if (!gameActive || gamePaused) return;
    
    const banana = document.createElement('div');
    banana.className = 'banana-spawn';
    banana.textContent = '🍌';
    
    // Random position within click area
    const maxX = clickArea.clientWidth - 60;
    const maxY = clickArea.clientHeight - 60;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    banana.style.left = x + 'px';
    banana.style.top = y + 'px';
    
    // Add click handler
    banana.addEventListener('click', () => collectBanana(banana));
    
    clickArea.appendChild(banana);
    
    // Remove banana after lifetime expires
    setTimeout(() => {
        if (banana.parentNode) {
            banana.remove();
        }
    }, BANANA_LIFETIME);
}

function collectBanana(banana) {
    if (!gameActive || gamePaused) return;
    
    bananaCount++;
    updateDisplay();
    
    // Animate collection
    banana.classList.add('banana-collected');
    
    setTimeout(() => {
        if (banana.parentNode) {
            banana.remove();
        }
    }, 300);
}

function updateTime() {
    if (!gameActive || gamePaused) return;
    
    gameTime = Date.now() - startTime;
    updateDisplay();
}

function updateDisplay() {
    bananaCountDisplay.textContent = bananaCount;
    timeDisplay.textContent = (gameTime / 1000).toFixed(1) + 's';
    
    const rate = gameTime > 0 ? (bananaCount / (gameTime / 1000)).toFixed(1) : '0.0';
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
        spawnInterval = setInterval(spawnBanana, SPAWN_INTERVAL);
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
    clearBananas();
    
    if (bananaCount > 0) {
        saveScore();
    }
    
    startGameBtn.textContent = 'Start Collecting!';
    pauseBtn.textContent = 'Pause';
    clickArea.classList.remove('paused');
}

function clearBananas() {
    const bananas = clickArea.querySelectorAll('.banana-spawn');
    bananas.forEach(banana => banana.remove());
}

// Event listeners
pauseBtn.addEventListener('click', pauseGame);
stopBtn.addEventListener('click', stopGame);

// Save score
async function saveScore() {
    if (!playerName || bananaCount === 0) return;
    
    try {
        const response = await fetch('api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                bananas_collected: bananaCount,
                time_played: gameTime
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Score saved successfully!');
            loadHighscores();
        } else {
            throw new Error('Failed to save score');
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
            highscoresList.innerHTML = '<p>No scores yet! Be the first to collect some bananas!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">${score.player_name}</div>
                <div class="highscore-stats">
                    ${score.bananas_collected} 🍌<br>
                    ${(score.time_played / 1000).toFixed(1)}s | ${score.bananas_per_second.toFixed(1)}/s
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

// Event listeners for start game
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