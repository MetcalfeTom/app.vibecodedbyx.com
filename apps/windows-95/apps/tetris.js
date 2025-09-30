// Tetris Game - Windows 95 Style with Leaderboard
class Tetris {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.nextCanvas = null;
        this.nextCtx = null;
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.gameLoop = null;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.playerName = localStorage.getItem('tetris_player_name') || null;

        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 25;
        this.COLORS = ['#000', '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];

        this.SHAPES = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[1,0,0],[1,1,1]], // L
            [[0,0,1],[1,1,1]], // J
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]]  // Z
        ];

        this.initGame();
    }

    async initGame() {
        if (!this.playerName) {
            await this.askPlayerName();
        }
        this.render();
        this.setupCanvas();
        this.resetGame();
    }

    async askPlayerName() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('dialogOverlay');
            const titleElement = document.getElementById('dialogTitle');
            const iconElement = document.getElementById('dialogIcon');
            const messageElement = document.getElementById('dialogMessage');
            const buttonsContainer = document.getElementById('dialogButtons');

            if (overlay && titleElement && iconElement && messageElement && buttonsContainer) {
                titleElement.textContent = 'Tetris';
                iconElement.textContent = '🎮';
                messageElement.innerHTML = `
                    <div style="margin-bottom: 10px;">Welcome to Tetris! Please enter your name:</div>
                    <input type="text" id="tetris-name-input" maxlength="20" style="width: 100%; padding: 4px; border: 1px inset #808080; font-family: 'MS Sans Serif'; font-size: 11px;" />
                `;

                buttonsContainer.innerHTML = '';
                const okBtn = document.createElement('button');
                okBtn.className = 'dialog-button';
                okBtn.textContent = 'OK';
                okBtn.onclick = () => {
                    const input = document.getElementById('tetris-name-input');
                    const name = input.value.trim() || 'Player';
                    this.playerName = name;
                    localStorage.setItem('tetris_player_name', name);
                    window.closeDialog();
                    resolve();
                };

                buttonsContainer.appendChild(okBtn);
                overlay.style.display = 'flex';

                setTimeout(() => {
                    const input = document.getElementById('tetris-name-input');
                    if (input) {
                        input.focus();
                        input.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') okBtn.click();
                        });
                    }
                }, 100);
            } else {
                this.playerName = prompt('Enter your name:') || 'Player';
                localStorage.setItem('tetris_player_name', this.playerName);
                resolve();
            }
        });
    }

    render() {
        this.container.innerHTML = `
            <div style="background: #c0c0c0; padding: 8px; font-family: 'MS Sans Serif', sans-serif; height: 100%; display: flex; gap: 8px;">
                <!-- Game Area -->
                <div style="flex: 0 0 auto;">
                    <div style="margin-bottom: 8px; padding: 4px; background: #000080; color: white; text-align: center; font-weight: bold;">TETRIS</div>
                    <canvas id="tetris-canvas" width="${this.COLS * this.BLOCK_SIZE}" height="${this.ROWS * this.BLOCK_SIZE}" style="border: 2px inset #808080; background: #000; display: block;"></canvas>
                    <div style="margin-top: 8px; display: flex; gap: 4px; justify-content: center;">
                        <button id="tetris-start" onclick="tetris.togglePause()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 4px 12px; cursor: pointer; font-size: 11px;">Start</button>
                        <button onclick="tetris.resetGame()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 4px 12px; cursor: pointer; font-size: 11px;">New Game</button>
                    </div>
                </div>

                <!-- Side Panel -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 200px;">
                    <!-- Stats -->
                    <div style="border: 2px inset #808080; padding: 8px; background: #fff;">
                        <div style="font-weight: bold; margin-bottom: 4px; color: #000080;">Player: <span id="tetris-player"></span></div>
                        <div style="font-size: 11px; color: #000;">Score: <span id="tetris-score" style="font-weight: bold;">0</span></div>
                        <div style="font-size: 11px; color: #000;">Lines: <span id="tetris-lines" style="font-weight: bold;">0</span></div>
                        <div style="font-size: 11px; color: #000;">Level: <span id="tetris-level" style="font-weight: bold;">1</span></div>
                    </div>

                    <!-- Next Piece -->
                    <div style="border: 2px inset #808080; padding: 8px; background: #fff;">
                        <div style="font-weight: bold; margin-bottom: 4px; color: #000080;">Next:</div>
                        <canvas id="tetris-next" width="100" height="80" style="border: 1px solid #c0c0c0; background: #000; display: block;"></canvas>
                    </div>

                    <!-- Controls -->
                    <div style="border: 2px inset #808080; padding: 8px; background: #fff;">
                        <div style="font-weight: bold; margin-bottom: 4px; color: #000080;">Controls:</div>
                        <div style="font-size: 10px; line-height: 1.4; color: #000;">
                            ← → Move<br>
                            ↑ Rotate<br>
                            ↓ Soft Drop<br>
                            Space Hard Drop<br>
                            P Pause
                        </div>
                    </div>

                    <!-- Leaderboard -->
                    <div style="border: 2px inset #808080; padding: 8px; background: #fff; flex: 1; overflow: auto;">
                        <div style="font-weight: bold; margin-bottom: 4px; color: #000080;">Leaderboard:</div>
                        <div id="tetris-leaderboard" style="font-size: 10px; color: #000;"></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('tetris-player').textContent = this.playerName;
    }

    setupCanvas() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('tetris-next');
        this.nextCtx = this.nextCanvas.getContext('2d');

        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (this.gameOver || this.paused) {
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
            return;
        }

        switch(e.key) {
            case 'ArrowLeft':
                this.movePiece(-1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                this.movePiece(1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.dropPiece();
                e.preventDefault();
                break;
            case 'ArrowUp':
                this.rotatePiece();
                e.preventDefault();
                break;
            case ' ':
                this.hardDrop();
                e.preventDefault();
                break;
            case 'p':
            case 'P':
                this.togglePause();
                e.preventDefault();
                break;
        }
    }

    resetGame() {
        this.board = Array(this.ROWS).fill(null).map(() => Array(this.COLS).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.updateStats();
        this.drawNextPiece();
        this.draw();
        this.loadLeaderboard();

        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        document.getElementById('tetris-start').textContent = 'Pause';
        this.lastTime = performance.now();
        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    togglePause() {
        if (this.gameOver) {
            this.resetGame();
            return;
        }

        this.paused = !this.paused;
        document.getElementById('tetris-start').textContent = this.paused ? 'Resume' : 'Pause';

        if (!this.paused) {
            this.lastTime = performance.now();
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
        }
    }

    createPiece() {
        const shapeIndex = Math.floor(Math.random() * this.SHAPES.length);
        return {
            shape: this.SHAPES[shapeIndex],
            color: shapeIndex + 1,
            x: Math.floor(this.COLS / 2) - 1,
            y: 0
        };
    }

    update(time = 0) {
        if (this.paused || this.gameOver) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.dropPiece();
        }

        this.draw();
        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }

        // Draw grid
        this.ctx.strokeStyle = '#222';
        for (let y = 0; y <= this.ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.COLS * this.BLOCK_SIZE, y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        for (let x = 0; x <= this.COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(x * this.BLOCK_SIZE, this.ROWS * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = this.COLORS[color];
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);

        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, this.BLOCK_SIZE - 2, 4);
    }

    drawPiece(piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(piece.x + x, piece.y + y, piece.color);
                }
            });
        });
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * this.BLOCK_SIZE) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * this.BLOCK_SIZE) / 2;

        this.nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.nextCtx.fillStyle = this.COLORS[this.nextPiece.color];
                    this.nextCtx.fillRect(
                        offsetX + x * this.BLOCK_SIZE + 1,
                        offsetY + y * this.BLOCK_SIZE + 1,
                        this.BLOCK_SIZE - 2,
                        this.BLOCK_SIZE - 2
                    );
                }
            });
        });
    }

    movePiece(dir) {
        this.currentPiece.x += dir;
        if (this.checkCollision()) {
            this.currentPiece.x -= dir;
        }
    }

    rotatePiece() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        if (this.checkCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }

    dropPiece() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.mergePiece();
            this.clearLines();
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.createPiece();
            this.drawNextPiece();

            if (this.checkCollision()) {
                this.endGame();
            }
        }
        this.dropCounter = 0;
    }

    hardDrop() {
        while (!this.checkCollision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.mergePiece();
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.drawNextPiece();

        if (this.checkCollision()) {
            this.endGame();
        }
        this.dropCounter = 0;
    }

    checkCollision() {
        return this.currentPiece.shape.some((row, y) =>
            row.some((value, x) => {
                if (!value) return false;
                const newX = this.currentPiece.x + x;
                const newY = this.currentPiece.y + y;
                return (
                    newX < 0 ||
                    newX >= this.COLS ||
                    newY >= this.ROWS ||
                    (newY >= 0 && this.board[newY][newX])
                );
            })
        );
    }

    mergePiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0 && boardY < this.ROWS && boardX >= 0 && boardX < this.COLS) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.ROWS - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.COLS).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += [0, 40, 100, 300, 1200][linesCleared] * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateStats();
            if (window.playSound) window.playSound('click');
        }
    }

    updateStats() {
        document.getElementById('tetris-score').textContent = this.score;
        document.getElementById('tetris-lines').textContent = this.lines;
        document.getElementById('tetris-level').textContent = this.level;
    }

    async endGame() {
        this.gameOver = true;
        this.paused = true;
        document.getElementById('tetris-start').textContent = 'New Game';

        if (window.playSound) window.playSound('error');

        // Save to leaderboard
        await this.saveToLeaderboard();
        this.loadLeaderboard();

        // Show game over dialog
        setTimeout(() => {
            if (window.showWindowsDialog) {
                window.showWindowsDialog(
                    'Game Over',
                    `Game Over!\n\nScore: ${this.score}\nLines: ${this.lines}\nLevel: ${this.level}`,
                    '🎮'
                );
            }
        }, 500);
    }

    async saveToLeaderboard() {
        const leaderboardKey = 'tetris_leaderboard';
        let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');

        // Find existing entry for this player
        const existingIndex = leaderboard.findIndex(entry => entry.name === this.playerName);

        if (existingIndex >= 0) {
            // Update only if new score is higher
            if (this.score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = {
                    name: this.playerName,
                    score: this.score,
                    lines: this.lines,
                    level: this.level,
                    date: new Date().toISOString()
                };
            }
        } else {
            // Add new entry
            leaderboard.push({
                name: this.playerName,
                score: this.score,
                lines: this.lines,
                level: this.level,
                date: new Date().toISOString()
            });
        }

        // Sort by score descending and keep top 10
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    }

    loadLeaderboard() {
        const leaderboardKey = 'tetris_leaderboard';
        const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
        const container = document.getElementById('tetris-leaderboard');

        if (leaderboard.length === 0) {
            container.innerHTML = '<div style="color: #666; font-style: italic;">No scores yet!</div>';
            return;
        }

        container.innerHTML = leaderboard.map((entry, index) => `
            <div style="display: flex; justify-content: space-between; padding: 2px 0; ${entry.name === this.playerName ? 'background: #ffff00; font-weight: bold;' : ''}">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.score}</span>
            </div>
        `).join('');
    }
}

// Global instance
let tetris = null;