let playerName = '';
let gameActive = false;
let gamePaused = false;
let score = 0;
let grapesPopped = 0;
let chainsMade = 0;
let gameStartTime = 0;
let gameTime = 0;
let updateInterval;

let grid = [];
let selectedGrapes = [];
let isSelecting = false;

// Game settings
const GRID_WIDTH = 8;
const GRID_HEIGHT = 10;
const COLORS = ['purple', 'red', 'green', 'blue', 'yellow'];
const MIN_CHAIN = 3;

// DOM elements
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const grapeGrid = document.getElementById('grapeGrid');
const scoreDisplay = document.getElementById('scoreDisplay');
const grapesDisplay = document.getElementById('grapesDisplay');
const chainsDisplay = document.getElementById('chainsDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const newGameBtn = document.getElementById('newGameBtn');
const highscoresList = document.getElementById('highscoresList');

function startGame() {
    gameActive = true;
    gamePaused = false;
    score = 0;
    grapesPopped = 0;
    chainsMade = 0;
    gameStartTime = Date.now();
    selectedGrapes = [];
    isSelecting = false;
    
    gameArea.style.display = 'block';
    startGameBtn.textContent = 'Restart Game';
    pauseBtn.textContent = 'Pause';
    
    initializeGrid();
    renderGrid();
    updateDisplay();
    
    // Start time counter
    updateInterval = setInterval(updateTime, 100);
}

function initializeGrid() {
    grid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        grid[row] = [];
        for (let col = 0; col < GRID_WIDTH; col++) {
            grid[row][col] = {
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                selected: false
            };
        }
    }
}

function renderGrid() {
    grapeGrid.innerHTML = '';
    
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const grape = document.createElement('div');
            grape.className = `grape ${grid[row][col].color}`;
            grape.textContent = '🍇';
            grape.dataset.row = row;
            grape.dataset.col = col;
            
            if (grid[row][col].selected) {
                grape.classList.add('selected');
            }
            
            grape.addEventListener('mousedown', (e) => startSelection(row, col, e));
            grape.addEventListener('mouseenter', () => continueSelection(row, col));
            grape.addEventListener('mouseup', () => endSelection());
            
            grapeGrid.appendChild(grape);
        }
    }
}

function startSelection(row, col, e) {
    if (!gameActive || gamePaused) return;
    
    e.preventDefault();
    isSelecting = true;
    selectedGrapes = [];
    clearSelection();
    
    if (grid[row][col]) {
        addToSelection(row, col);
    }
}

function continueSelection(row, col) {
    if (!isSelecting || !gameActive || gamePaused) return;
    
    if (selectedGrapes.length === 0) return;
    
    // Check if this grape can be added to the selection
    if (canAddToSelection(row, col)) {
        // Check if it's already in selection (for backtracking)
        const index = selectedGrapes.findIndex(g => g.row === row && g.col === col);
        if (index !== -1) {
            // Remove all grapes after this one (backtracking)
            selectedGrapes.splice(index + 1);
            updateSelectionDisplay();
        } else {
            addToSelection(row, col);
        }
    }
}

function canAddToSelection(row, col) {
    if (!grid[row] || !grid[row][col]) return false;
    
    if (selectedGrapes.length === 0) return true;
    
    const lastGrape = selectedGrapes[selectedGrapes.length - 1];
    const sameColor = grid[row][col].color === grid[lastGrape.row][lastGrape.col].color;
    const adjacent = Math.abs(row - lastGrape.row) + Math.abs(col - lastGrape.col) === 1;
    
    return sameColor && adjacent;
}

function addToSelection(row, col) {
    selectedGrapes.push({ row, col });
    grid[row][col].selected = true;
    updateSelectionDisplay();
}

function updateSelectionDisplay() {
    const grapes = grapeGrid.querySelectorAll('.grape');
    grapes.forEach((grape, index) => {
        const row = Math.floor(index / GRID_WIDTH);
        const col = index % GRID_WIDTH;
        grape.classList.toggle('selected', grid[row][col].selected);
    });
}

function clearSelection() {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            grid[row][col].selected = false;
        }
    }
    updateSelectionDisplay();
}

function endSelection() {
    if (!isSelecting || !gameActive || gamePaused) return;
    
    isSelecting = false;
    
    if (selectedGrapes.length >= MIN_CHAIN) {
        popGrapes();
    } else {
        clearSelection();
    }
}

function popGrapes() {
    if (selectedGrapes.length < MIN_CHAIN) return;
    
    // Calculate score
    const basePoints = selectedGrapes.length * 10;
    const chainBonus = selectedGrapes.length > MIN_CHAIN ? (selectedGrapes.length - MIN_CHAIN) * 25 : 0;
    const totalPoints = basePoints + chainBonus;
    
    score += totalPoints;
    grapesPopped += selectedGrapes.length;
    chainsMade++;
    
    // Show chain indicator
    showChainIndicator(selectedGrapes.length, totalPoints);
    
    // Remove grapes with animation
    selectedGrapes.forEach(({ row, col }) => {
        const grapeElement = grapeGrid.children[row * GRID_WIDTH + col];
        grapeElement.classList.add('popping');
    });
    
    setTimeout(() => {
        // Remove grapes from grid
        selectedGrapes.forEach(({ row, col }) => {
            grid[row][col] = null;
        });
        
        // Drop grapes down
        dropGrapes();
        
        // Fill empty spaces
        fillEmptySpaces();
        
        // Re-render grid
        renderGrid();
        updateDisplay();
        
        selectedGrapes = [];
    }, 500);
}

function showChainIndicator(grapeCount, points) {
    const indicator = document.createElement('div');
    indicator.className = 'chain-indicator';
    indicator.textContent = `${grapeCount} Chain! +${points}`;
    
    grapeGrid.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 1000);
}

function dropGrapes() {
    for (let col = 0; col < GRID_WIDTH; col++) {
        // Collect all non-null grapes in this column
        const grapes = [];
        for (let row = 0; row < GRID_HEIGHT; row++) {
            if (grid[row][col] !== null) {
                grapes.push(grid[row][col]);
                grid[row][col] = null;
            }
        }
        
        // Place grapes at the bottom
        for (let i = 0; i < grapes.length; i++) {
            grid[GRID_HEIGHT - 1 - i][col] = grapes[grapes.length - 1 - i];
        }
    }
}

function fillEmptySpaces() {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (grid[row][col] === null) {
                grid[row][col] = {
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    selected: false
                };
            }
        }
    }
}

function updateTime() {
    if (!gameActive || gamePaused) return;
    gameTime = Date.now() - gameStartTime;
    updateDisplay();
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    grapesDisplay.textContent = grapesPopped;
    chainsDisplay.textContent = chainsMade;
    timeDisplay.textContent = (gameTime / 1000).toFixed(1) + 's';
}

function pauseGame() {
    if (!gameActive) return;
    
    if (gamePaused) {
        // Resume
        gamePaused = false;
        gameStartTime = Date.now() - gameTime;
        pauseBtn.textContent = 'Pause';
        grapeGrid.classList.remove('paused');
        updateInterval = setInterval(updateTime, 100);
    } else {
        // Pause
        gamePaused = true;
        pauseBtn.textContent = 'Resume';
        grapeGrid.classList.add('paused');
        clearInterval(updateInterval);
        clearSelection();
        isSelecting = false;
    }
}

function stopGame() {
    if (!gameActive) return;
    
    gameActive = false;
    gamePaused = false;
    clearInterval(updateInterval);
    clearSelection();
    isSelecting = false;
    
    if (score > 0) {
        saveScore();
    }
    
    startGameBtn.textContent = 'Start Popping!';
    pauseBtn.textContent = 'Pause';
    grapeGrid.classList.remove('paused');
}

function newGame() {
    if (gameActive) {
        if (confirm('Start a new game? Current progress will be lost.')) {
            clearInterval(updateInterval);
            startGame();
        }
    } else {
        gameArea.style.display = 'none';
        startGameBtn.textContent = 'Start Popping!';
    }
}

// Global mouse events
document.addEventListener('mouseup', endSelection);

// Event listeners
pauseBtn.addEventListener('click', pauseGame);
stopBtn.addEventListener('click', stopGame);
newGameBtn.addEventListener('click', newGame);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        pauseGame();
    }
});

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
                grapes_popped: grapesPopped,
                chains_made: chainsMade,
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
            highscoresList.innerHTML = '<p>No scores yet! Be the first to pop some grapes!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">${score.player_name}</div>
                <div class="highscore-stats">
                    Score: ${score.score}<br>
                    ${score.grapes_popped} grapes | ${score.chains_made} chains | ${(score.time_played / 1000).toFixed(1)}s
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

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