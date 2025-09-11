let playerName = '';
let gameActive = false;
let gamePaused = false;
let currentDifficulty = 'medium';
let gameStartTime = 0;
let gameTime = 0;
let moves = 0;
let matches = 0;
let totalPairs = 0;

let cards = [];
let flippedCards = [];
let updateInterval;

// Kiwi-themed symbols
const symbols = ['🥝', '🍃', '🌱', '🌿', '🥒', '🫛', '🍀', '🌾', '🥬', '🧄', '🫒', '🥦', '🌵', '🪴', '🎋', '🌳'];

// Grid configurations
const gridConfig = {
    easy: { pairs: 6, grid: '3x4' },
    medium: { pairs: 8, grid: '4x4' },
    hard: { pairs: 12, grid: '4x6' }
};

// DOM elements
const playerNameInput = document.getElementById('playerName');
const difficultySelect = document.getElementById('difficulty');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const gameBoard = document.getElementById('gameBoard');
const timeDisplay = document.getElementById('timeDisplay');
const movesDisplay = document.getElementById('movesDisplay');
const matchesDisplay = document.getElementById('matchesDisplay');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const newGameBtn = document.getElementById('newGameBtn');
const highscoresList = document.getElementById('highscoresList');
const winModal = document.getElementById('winModal');
const winStats = document.getElementById('winStats');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

function startGame() {
    gameActive = true;
    gamePaused = false;
    gameStartTime = Date.now();
    gameTime = 0;
    moves = 0;
    matches = 0;
    flippedCards = [];
    
    const config = gridConfig[currentDifficulty];
    totalPairs = config.pairs;
    
    gameArea.style.display = 'block';
    winModal.style.display = 'none';
    
    setupBoard();
    updateDisplay();
    
    // Start time counter
    updateInterval = setInterval(updateTime, 100);
}

function setupBoard() {
    gameBoard.innerHTML = '';
    gameBoard.className = `game-board ${currentDifficulty}`;
    
    const config = gridConfig[currentDifficulty];
    const selectedSymbols = symbols.slice(0, config.pairs);
    
    // Create pairs
    cards = [...selectedSymbols, ...selectedSymbols];
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Create card elements
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        card.innerHTML = `
            <div class="card-back">🥝</div>
            <div class="card-front">${symbol}</div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (!gameActive || gamePaused || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    if (flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        updateDisplay();
        
        setTimeout(() => {
            checkMatch();
        }, 600);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matches++;
        
        if (matches === totalPairs) {
            // Game won!
            gameActive = false;
            clearInterval(updateInterval);
            showWinModal();
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }
    
    flippedCards = [];
    updateDisplay();
}

function updateTime() {
    if (!gameActive || gamePaused) return;
    
    gameTime = Date.now() - gameStartTime;
    updateDisplay();
}

function updateDisplay() {
    timeDisplay.textContent = (gameTime / 1000).toFixed(1) + 's';
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = `${matches}/${totalPairs}`;
}

function pauseGame() {
    if (!gameActive) return;
    
    if (gamePaused) {
        // Resume
        gamePaused = false;
        gameStartTime = Date.now() - gameTime;
        pauseBtn.textContent = 'Pause';
        gameBoard.classList.remove('paused');
        updateInterval = setInterval(updateTime, 100);
    } else {
        // Pause
        gamePaused = true;
        pauseBtn.textContent = 'Resume';
        gameBoard.classList.add('paused');
        clearInterval(updateInterval);
    }
}

function restartGame() {
    if (gameActive || matches > 0) {
        if (confirm('Restart current game? Progress will be lost.')) {
            clearInterval(updateInterval);
            startGame();
        }
    }
}

function newGame() {
    clearInterval(updateInterval);
    gameActive = false;
    gameArea.style.display = 'none';
    winModal.style.display = 'none';
    startGameBtn.textContent = 'Start Game';
}

function showWinModal() {
    const score = calculateScore();
    winStats.innerHTML = `
        <div><strong>Difficulty:</strong> ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}</div>
        <div><strong>Time:</strong> ${(gameTime / 1000).toFixed(1)}s</div>
        <div><strong>Moves:</strong> ${moves}</div>
        <div><strong>Score:</strong> ${score}</div>
    `;
    winModal.style.display = 'block';
}

function calculateScore() {
    const basePoints = currentDifficulty === 'easy' ? 1000 : currentDifficulty === 'medium' ? 2000 : 3000;
    const timePenalty = Math.floor(gameTime / 1000) * 2;
    const movePenalty = moves * 5;
    return Math.max(100, basePoints - timePenalty - movePenalty);
}

// Event listeners
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);
newGameBtn.addEventListener('click', newGame);

saveScoreBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                difficulty: currentDifficulty,
                time_taken: gameTime,
                moves_made: moves
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            winModal.style.display = 'none';
            alert('Score saved successfully!');
            loadHighscores();
        }
    } catch (error) {
        console.error('Error saving score:', error);
        alert('Failed to save score');
    }
});

playAgainBtn.addEventListener('click', () => {
    winModal.style.display = 'none';
    startGame();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        pauseGame();
    } else if (e.code === 'KeyR' && gameActive) {
        e.preventDefault();
        restartGame();
    }
});

// Load highscores
async function loadHighscores() {
    try {
        const response = await fetch('api/highscores');
        const scores = await response.json();
        
        if (scores.length === 0) {
            highscoresList.innerHTML = '<p>No scores yet! Be the first to master the kiwi memory game!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">
                    ${score.player_name}
                    <span class="difficulty-badge ${score.difficulty}">${score.difficulty}</span>
                </div>
                <div class="highscore-stats">
                    Score: ${score.score}<br>
                    ${(score.time_taken / 1000).toFixed(1)}s | ${score.moves_made} moves
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

// Close modal when clicking outside
winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
        winModal.style.display = 'none';
    }
});

// Event listeners for start game and difficulty
startGameBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    currentDifficulty = difficultySelect.value;
    startGame();
});

difficultySelect.addEventListener('change', () => {
    currentDifficulty = difficultySelect.value;
});

// Load highscores on page load
loadHighscores();