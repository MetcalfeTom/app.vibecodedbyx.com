let playerName = '';
let gameActive = false;
let currentGrid = '4x4';
let gridSize = 4;
let moves = 0;
let startTime = 0;
let gameTime = 0;
let updateInterval;

let puzzle = [];
let solvedState = [];
let emptyPos = { row: 0, col: 0 };

// DOM elements
const playerNameInput = document.getElementById('playerName');
const gridSizeSelect = document.getElementById('gridSize');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const puzzleBoard = document.getElementById('puzzleBoard');
const movesDisplay = document.getElementById('movesDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const shuffleBtn = document.getElementById('shuffleBtn');
const solveBtn = document.getElementById('solveBtn');
const newPuzzleBtn = document.getElementById('newPuzzleBtn');
const highscoresList = document.getElementById('highscoresList');
const winModal = document.getElementById('winModal');
const winStats = document.getElementById('winStats');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

function startGame() {
    gameActive = true;
    moves = 0;
    startTime = Date.now();
    gameTime = 0;
    
    gameArea.style.display = 'block';
    winModal.style.display = 'none';
    
    initializePuzzle();
    renderPuzzle();
    updateDisplay();
    
    // Start time counter
    updateInterval = setInterval(updateTime, 100);
}

function initializePuzzle() {
    // Create solved state
    solvedState = [];
    for (let i = 0; i < gridSize * gridSize - 1; i++) {
        solvedState.push(i + 1);
    }
    solvedState.push(0); // Empty space
    
    // Create puzzle as copy of solved state
    puzzle = [...solvedState];
    emptyPos = { row: gridSize - 1, col: gridSize - 1 };
    
    // Shuffle the puzzle
    shufflePuzzle();
    
    // Set up board
    puzzleBoard.className = `puzzle-board size-${gridSize}`;
}

function shufflePuzzle() {
    // Perform random valid moves to shuffle
    for (let i = 0; i < 1000; i++) {
        const validMoves = getValidMoves();
        if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            movePiece(randomMove.row, randomMove.col, false); // Don't count as player moves
        }
    }
    moves = 0; // Reset move count after shuffling
}

function getValidMoves() {
    const moves = [];
    const { row, col } = emptyPos;
    
    // Check all four directions
    if (row > 0) moves.push({ row: row - 1, col }); // Up
    if (row < gridSize - 1) moves.push({ row: row + 1, col }); // Down
    if (col > 0) moves.push({ row, col: col - 1 }); // Left
    if (col < gridSize - 1) moves.push({ row, col: col + 1 }); // Right
    
    return moves;
}

function renderPuzzle() {
    puzzleBoard.innerHTML = '';
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const piece = document.createElement('div');
            const value = puzzle[row * gridSize + col];
            
            piece.className = value === 0 ? 'puzzle-piece empty' : 'puzzle-piece';
            piece.textContent = value === 0 ? '' : value;
            piece.dataset.row = row;
            piece.dataset.col = col;
            
            if (value !== 0) {
                piece.addEventListener('click', () => handlePieceClick(row, col));
            }
            
            puzzleBoard.appendChild(piece);
        }
    }
}

function handlePieceClick(row, col) {
    if (!gameActive) return;
    
    // Check if piece can move (adjacent to empty space)
    const rowDiff = Math.abs(row - emptyPos.row);
    const colDiff = Math.abs(col - emptyPos.col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        movePiece(row, col, true);
    }
}

function movePiece(row, col, countMove = true) {
    const pieceIndex = row * gridSize + col;
    const emptyIndex = emptyPos.row * gridSize + emptyPos.col;
    
    // Swap pieces
    [puzzle[pieceIndex], puzzle[emptyIndex]] = [puzzle[emptyIndex], puzzle[pieceIndex]];
    
    // Update empty position
    emptyPos = { row, col };
    
    if (countMove) {
        moves++;
        updateDisplay();
        
        // Check if puzzle is solved
        if (isPuzzleSolved()) {
            gameActive = false;
            clearInterval(updateInterval);
            setTimeout(() => showWinModal(), 500);
        }
    }
    
    renderPuzzle();
}

function isPuzzleSolved() {
    for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] !== solvedState[i]) {
            return false;
        }
    }
    return true;
}

function updateTime() {
    if (!gameActive) return;
    gameTime = Date.now() - startTime;
    updateDisplay();
}

function updateDisplay() {
    movesDisplay.textContent = moves;
    timeDisplay.textContent = (gameTime / 1000).toFixed(1) + 's';
}

function showSolution() {
    if (!gameActive) return;
    
    puzzleBoard.classList.add('solving');
    puzzle = [...solvedState];
    emptyPos = { row: gridSize - 1, col: gridSize - 1 };
    renderPuzzle();
    
    setTimeout(() => {
        puzzleBoard.classList.remove('solving');
        gameActive = false;
        clearInterval(updateInterval);
        alert('Solution shown! This won\'t count for the leaderboard.');
    }, 2000);
}

function newPuzzle() {
    if (gameActive) {
        if (confirm('Start a new puzzle? Current progress will be lost.')) {
            clearInterval(updateInterval);
            startGame();
        }
    } else {
        gameArea.style.display = 'none';
        startGameBtn.textContent = 'Start Puzzle!';
    }
}

function showWinModal() {
    const score = calculateScore();
    winStats.innerHTML = `
        <div><strong>Grid Size:</strong> ${currentGrid}</div>
        <div><strong>Moves:</strong> ${moves}</div>
        <div><strong>Time:</strong> ${(gameTime / 1000).toFixed(1)}s</div>
        <div><strong>Score:</strong> ${score}</div>
    `;
    winModal.style.display = 'block';
}

function calculateScore() {
    const basePoints = currentGrid === '3x3' ? 1000 : currentGrid === '4x4' ? 2500 : 5000;
    const movePenalty = moves * 10;
    const timePenalty = Math.floor(gameTime / 1000) * 5;
    return Math.max(100, basePoints - movePenalty - timePenalty);
}

// Event listeners
shuffleBtn.addEventListener('click', () => {
    if (gameActive && confirm('Shuffle the puzzle? This will reset your moves.')) {
        shufflePuzzle();
        moves = 0;
        updateDisplay();
        renderPuzzle();
    }
});

solveBtn.addEventListener('click', showSolution);
newPuzzleBtn.addEventListener('click', newPuzzle);

saveScoreBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                grid_size: currentGrid,
                moves: moves,
                time_taken: gameTime
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
});

playAgainBtn.addEventListener('click', () => {
    winModal.style.display = 'none';
    startGame();
});

// Load highscores
async function loadHighscores() {
    try {
        const response = await fetch('api/highscores');
        const scores = await response.json();
        
        if (scores.length === 0) {
            highscoresList.innerHTML = '<p>No scores yet! Be the first to solve an orange puzzle!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">
                    ${score.player_name}
                    <span class="grid-badge">${score.grid_size}</span>
                </div>
                <div class="highscore-stats">
                    Score: ${score.score}<br>
                    ${score.moves} moves | ${(score.time_taken / 1000).toFixed(1)}s
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    let targetRow = emptyPos.row;
    let targetCol = emptyPos.col;
    
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            targetRow = emptyPos.row + 1;
            break;
        case 'ArrowDown':
        case 'KeyS':
            targetRow = emptyPos.row - 1;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            targetCol = emptyPos.col + 1;
            break;
        case 'ArrowRight':
        case 'KeyD':
            targetCol = emptyPos.col - 1;
            break;
    }
    
    if (targetRow >= 0 && targetRow < gridSize && targetCol >= 0 && targetCol < gridSize) {
        e.preventDefault();
        handlePieceClick(targetRow, targetCol);
    }
});

// Close modal when clicking outside
winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
        winModal.style.display = 'none';
    }
});

// Event listeners for start game and grid size
startGameBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    currentGrid = gridSizeSelect.value;
    gridSize = parseInt(currentGrid.split('x')[0]);
    startGame();
});

gridSizeSelect.addEventListener('change', () => {
    currentGrid = gridSizeSelect.value;
    gridSize = parseInt(currentGrid.split('x')[0]);
});

// Load highscores on page load
loadHighscores();