// Tetris game implementation
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24; // Smaller blocks to fit 240x480 canvas
const COLORS = [
    '#000000', // 0 - empty
    '#FF0D72', // 1 - I
    '#0DC2FF', // 2 - O
    '#0DFF72', // 3 - T
    '#F538FF', // 4 - S
    '#FF8E0D', // 5 - Z
    '#FFE138', // 6 - J
    '#3877FF', // 7 - L
];

// Tetromino pieces
const PIECES = [
    [[1,1,1,1]],           // I
    [[1,1],[1,1]],         // O
    [[0,1,0],[1,1,1]],     // T
    [[0,1,1],[1,1,0]],     // S
    [[1,1,0],[0,1,1]],     // Z
    [[1,0,0],[1,1,1]],     // J
    [[0,0,1],[1,1,1]],     // L
];

// Game state
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let currentColor = 1;
let score = 0;
let gameOver = false;
let dropTime = 1000;
let lastDrop = Date.now();

// Initialize board
function initBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// Draw a block
function drawBlock(x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

// Draw the board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw board blocks
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
    
    // Draw current piece
    if (currentPiece) {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    drawBlock(currentX + x, currentY + y, currentColor);
                }
            }
        }
    }
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 1; i < ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE);
        ctx.stroke();
    }
}

// Check collision
function collision(piece, offsetX, offsetY) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                const newX = currentX + x + offsetX;
                const newY = currentY + y + offsetY;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge piece to board
function merge() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[currentY + y][currentX + x] = currentColor;
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100 * linesCleared;
        document.getElementById('score').textContent = score;
        
        // Speed up game
        dropTime = Math.max(100, dropTime - linesCleared * 10);
    }
}

// Rotate piece
function rotate(piece) {
    const rows = piece.length;
    const cols = piece[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            rotated[x][rows - 1 - y] = piece[y][x];
        }
    }
    
    return rotated;
}

// Spawn new piece
function spawnPiece() {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    currentPiece = PIECES[pieceIndex].map(row => [...row]);
    currentColor = pieceIndex + 1;
    currentX = Math.floor((COLS - currentPiece[0].length) / 2);
    currentY = 0;
    
    if (collision(currentPiece, 0, 0)) {
        gameOver = true;
        endGame();
    }
}

// Move piece
function movePiece(deltaX, deltaY) {
    if (!collision(currentPiece, deltaX, deltaY)) {
        currentX += deltaX;
        currentY += deltaY;
        return true;
    }
    return false;
}

// Drop piece
function drop() {
    if (!movePiece(0, 1)) {
        merge();
        clearLines();
        spawnPiece();
    }
}

// Hard drop
function hardDrop() {
    while (movePiece(0, 1)) {
        score += 2;
    }
    document.getElementById('score').textContent = score;
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    
    const now = Date.now();
    if (now - lastDrop > dropTime) {
        drop();
        lastDrop = now;
    }
    
    drawBoard();
    requestAnimationFrame(gameLoop);
}

// End game
async function endGame() {
    if (score > 0) {
        const name = prompt(`Game Over! Score: ${score}\nEnter your name for the highscore:`);
        if (name) {
            await submitScore(name, score);
        }
    }
}

// Controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            drop();
            score += 1;
            document.getElementById('score').textContent = score;
            break;
        case 'ArrowUp':
            const rotated = rotate(currentPiece);
            if (!collision(rotated, 0, 0)) {
                currentPiece = rotated;
            }
            break;
        case ' ':
            hardDrop();
            break;
    }
});

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

// Start game
function startGame() {
    initBoard();
    score = 0;
    gameOver = false;
    dropTime = 1000;
    document.getElementById('score').textContent = score;
    spawnPiece();
    gameLoop();
}

// Initialize
loadHighscores();
startGame();

// Clear scores
