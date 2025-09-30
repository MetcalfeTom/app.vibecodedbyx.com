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
        this.nextNextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.gameLoop = null;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.playerName = null;
        this.supabase = null;
        this.currentUser = null;

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
        // Initialize Supabase (get from window if available)
        if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
        } else {
            // Import from CDN if not available
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';
            this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = this.supabase;
        }

        // Get or create user session
        await this.ensureSession();

        this.render();
        this.setupCanvas();
        this.resetGame();
    }

    async ensureSession() {
        const { data: { session } } = await this.supabase.auth.getSession();
        if (!session) {
            const { data } = await this.supabase.auth.signInAnonymously();
            this.currentUser = data.user;
        } else {
            this.currentUser = session.user;
        }
    }

    async askPlayerName() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('dialogOverlay');
            const titleElement = document.getElementById('dialogTitle');
            const iconElement = document.getElementById('dialogIcon');
            const messageElement = document.getElementById('dialogMessage');
            const buttonsContainer = document.getElementById('dialogButtons');

            if (overlay && titleElement && iconElement && messageElement && buttonsContainer) {
                titleElement.textContent = 'High Score!';
                iconElement.textContent = '🏆';
                messageElement.innerHTML = `
                    <div style="margin-bottom: 10px;">Congratulations! You made it to the leaderboard!</div>
                    <div style="margin-bottom: 10px;">Enter your name:</div>
                    <input type="text" id="tetris-name-input" maxlength="20" value="" style="width: 100%; padding: 4px; border: 1px inset #808080; font-family: 'MS Sans Serif'; font-size: 11px;" />
                `;

                buttonsContainer.innerHTML = '';
                const okBtn = document.createElement('button');
                okBtn.className = 'dialog-button';
                okBtn.textContent = 'OK';
                okBtn.onclick = () => {
                    const input = document.getElementById('tetris-name-input');
                    const name = input.value.trim() || 'Anonymous';
                    this.playerName = name;
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
                this.playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
                resolve();
            }
        });
    }

    render() {
        this.container.innerHTML = `
            <div style="background: #c0c0c0; padding: 12px; font-family: 'MS Sans Serif', sans-serif; height: 100%; display: flex; flex-direction: column; gap: 12px;">
                <!-- Top Bar: Title and Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="padding: 6px 12px; background: linear-gradient(90deg, #000080, #0000ff); color: white; font-weight: bold; font-size: 14px; border: 2px outset #c0c0c0;">TETRIS</div>
                    <div style="display: flex; gap: 6px;">
                        <button id="tetris-start" onclick="tetris.togglePause()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 6px 16px; cursor: pointer; font-size: 11px; font-weight: bold;">Start</button>
                        <button onclick="tetris.resetGame()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 6px 16px; cursor: pointer; font-size: 11px;">New Game</button>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div style="display: flex; gap: 12px; flex: 1; min-height: 0;">
                    <!-- Left: Game Canvas -->
                    <div style="display: flex; flex-direction: column; position: relative;">
                        <canvas id="tetris-canvas" width="${this.COLS * this.BLOCK_SIZE}" height="${this.ROWS * this.BLOCK_SIZE}" style="border: 3px inset #808080; background: #000; display: block; box-shadow: inset 0 0 8px rgba(0,0,0,0.5);"></canvas>
                        <div id="tetris-game-over" style="display: none; position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: #c0c0c0; border: 3px outset #c0c0c0; padding: 20px; text-align: center; cursor: pointer; box-shadow: 4px 4px 8px rgba(0,0,0,0.5);" onclick="tetris.resetGame()">
                            <div style="font-weight: bold; font-size: 16px; color: #c00; margin-bottom: 10px;">GAME OVER</div>
                            <div style="font-size: 11px; margin-bottom: 8px;">Score: <span id="tetris-final-score" style="font-weight: bold;">0</span></div>
                            <div style="font-size: 11px; margin-bottom: 8px;">Lines: <span id="tetris-final-lines" style="font-weight: bold;">0</span></div>
                            <div style="font-size: 11px; margin-bottom: 12px;">Level: <span id="tetris-final-level" style="font-weight: bold;">0</span></div>
                            <div style="font-size: 10px; color: #000080;">Click to restart</div>
                        </div>
                    </div>

                    <!-- Right: Info Panel -->
                    <div style="display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 180px; height: ${this.ROWS * this.BLOCK_SIZE}px; overflow: hidden;">
                        <!-- Stats -->
                        <div style="border: 2px groove #808080; padding: 10px; background: #d4d0c8;">
                            <div style="font-weight: bold; margin-bottom: 8px; color: #000080; font-size: 12px;">📊 Stats</div>
                            <table style="width: 100%; font-size: 11px; color: #000; border-spacing: 4px 2px;">
                                <tr><td>Score:</td><td style="text-align: right; font-weight: bold;"><span id="tetris-score">0</span></td></tr>
                                <tr><td>Lines:</td><td style="text-align: right; font-weight: bold;"><span id="tetris-lines">0</span></td></tr>
                                <tr><td>Level:</td><td style="text-align: right; font-weight: bold;"><span id="tetris-level">1</span></td></tr>
                            </table>
                        </div>

                        <!-- Next Pieces -->
                        <div style="border: 2px groove #808080; padding: 10px; background: #d4d0c8;">
                            <div style="font-weight: bold; margin-bottom: 6px; color: #000080; font-size: 11px;">Next Pieces</div>
                            <div style="display: flex; gap: 4px; justify-content: center;">
                                <canvas id="tetris-next" width="70" height="70" style="border: 2px inset #808080; background: #000; display: block;"></canvas>
                                <canvas id="tetris-next-next" width="70" height="70" style="border: 2px inset #808080; background: #000; display: block;"></canvas>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div style="border: 2px groove #808080; padding: 10px; background: #d4d0c8;">
                            <div style="font-weight: bold; margin-bottom: 6px; color: #000080; font-size: 11px;">⌨️ Controls</div>
                            <div style="font-size: 10px; line-height: 1.6; color: #000;">
                                <div><kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">← →</kbd> or <kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">A D</kbd> Move</div>
                                <div><kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">↑</kbd> or <kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">W</kbd> Rotate</div>
                                <div><kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">↓</kbd> or <kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">S</kbd> Soft Drop</div>
                                <div><kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">Space</kbd> Hard Drop</div>
                                <div><kbd style="background: #fff; border: 1px solid #888; padding: 1px 4px; border-radius: 2px;">P</kbd> Pause</div>
                            </div>
                        </div>

                        <!-- Leaderboard -->
                        <div style="border: 2px groove #808080; padding: 10px; background: #d4d0c8; flex: 1; display: flex; flex-direction: column; min-height: 0;">
                            <div style="font-weight: bold; margin-bottom: 6px; color: #000080; font-size: 11px;">🏆 Top 10</div>
                            <div id="tetris-leaderboard" style="font-size: 10px; color: #000; overflow-y: auto; flex: 1;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCanvas() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('tetris-next');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.nextNextCanvas = document.getElementById('tetris-next-next');
        this.nextNextCtx = this.nextNextCanvas.getContext('2d');

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
            case 'a':
            case 'A':
                this.movePiece(-1);
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movePiece(1);
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.dropPiece();
                e.preventDefault();
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
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
        // Hide game over overlay
        const gameOverDiv = document.getElementById('tetris-game-over');
        if (gameOverDiv) {
            gameOverDiv.style.display = 'none';
        }

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
        this.nextNextPiece = this.createPiece();
        this.updateStats();
        this.drawNextPieces();
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

    drawNextPieces() {
        const smallBlockSize = 18; // Smaller blocks for next pieces

        // Draw first next piece
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * smallBlockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * smallBlockSize) / 2;

        this.nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.nextCtx.fillStyle = this.COLORS[this.nextPiece.color];
                    this.nextCtx.fillRect(
                        offsetX + x * smallBlockSize + 1,
                        offsetY + y * smallBlockSize + 1,
                        smallBlockSize - 2,
                        smallBlockSize - 2
                    );
                }
            });
        });

        // Draw second next piece
        this.nextNextCtx.fillStyle = '#000';
        this.nextNextCtx.fillRect(0, 0, this.nextNextCanvas.width, this.nextNextCanvas.height);

        const offsetX2 = (this.nextNextCanvas.width - this.nextNextPiece.shape[0].length * smallBlockSize) / 2;
        const offsetY2 = (this.nextNextCanvas.height - this.nextNextPiece.shape.length * smallBlockSize) / 2;

        this.nextNextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.nextNextCtx.fillStyle = this.COLORS[this.nextNextPiece.color];
                    this.nextNextCtx.fillRect(
                        offsetX2 + x * smallBlockSize + 1,
                        offsetY2 + y * smallBlockSize + 1,
                        smallBlockSize - 2,
                        smallBlockSize - 2
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
            this.nextPiece = this.nextNextPiece;
            this.nextNextPiece = this.createPiece();
            this.drawNextPieces();

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
        this.nextPiece = this.nextNextPiece;
        this.nextNextPiece = this.createPiece();
        this.drawNextPieces();

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

        // Show game over overlay on canvas
        const gameOverDiv = document.getElementById('tetris-game-over');
        if (gameOverDiv) {
            document.getElementById('tetris-final-score').textContent = this.score;
            document.getElementById('tetris-final-lines').textContent = this.lines;
            document.getElementById('tetris-final-level').textContent = this.level;
            gameOverDiv.style.display = 'block';
        }

        // Save to leaderboard
        await this.saveToLeaderboard();
        this.loadLeaderboard();
    }

    async saveToLeaderboard() {
        if (!this.supabase || this.score === 0) return;

        try {
            // Get top 10 scores to check if this qualifies
            const { data: topScores, error: fetchError } = await this.supabase
                .from('tetris_leaderboard')
                .select('score')
                .order('score', { ascending: false })
                .limit(10);

            if (fetchError) throw fetchError;

            // Check if this score qualifies for the leaderboard
            const isHighScore = !topScores || topScores.length < 10 || this.score > topScores[topScores.length - 1].score;

            if (!isHighScore) {
                // Score doesn't qualify for top 10
                return;
            }

            // Ask for name only if it's a high score
            await this.askPlayerName();

            // Check if this user already has an entry
            const { data: existingScores, error: existError } = await this.supabase
                .from('tetris_leaderboard')
                .select('id, name, score, lines, level')
                .eq('user_id', this.currentUser.id);

            if (existError) throw existError;

            if (existingScores && existingScores.length > 0) {
                // User has existing score(s) - update only if this score is higher
                const bestExisting = existingScores.reduce((best, curr) => curr.score > best.score ? curr : best);

                if (this.score > bestExisting.score) {
                    // Update the existing entry
                    const { error: updateError } = await this.supabase
                        .from('tetris_leaderboard')
                        .update({
                            name: this.playerName,
                            score: this.score,
                            lines: this.lines,
                            level: this.level,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', bestExisting.id);

                    if (updateError) throw updateError;
                }
            } else {
                // Insert new entry
                const { error: insertError } = await this.supabase
                    .from('tetris_leaderboard')
                    .insert({
                        user_id: this.currentUser.id,
                        name: this.playerName,
                        score: this.score,
                        lines: this.lines,
                        level: this.level
                    });

                if (insertError) throw insertError;
            }
        } catch (error) {
            console.error('Error saving to leaderboard:', error);
            // Fallback to showing error to user
            if (window.showWindowsDialog) {
                window.showWindowsDialog('Error', 'Failed to save score to leaderboard.', '⚠️');
            }
        }
    }

    async loadLeaderboard() {
        const container = document.getElementById('tetris-leaderboard');

        if (!this.supabase) {
            container.innerHTML = '<div style="color: #666; font-style: italic;">Loading...</div>';
            return;
        }

        try {
            const { data: leaderboard, error } = await this.supabase
                .from('tetris_leaderboard')
                .select('name, score, lines, level, created_at')
                .order('score', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!leaderboard || leaderboard.length === 0) {
                container.innerHTML = '<div style="color: #666; font-style: italic;">No scores yet!</div>';
                return;
            }

            container.innerHTML = leaderboard.map((entry, index) => `
                <div style="display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid #e0e0e0;">
                    <span>${index + 1}. ${entry.name || 'Anonymous'}</span>
                    <span style="font-weight: bold;">${entry.score}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            container.innerHTML = '<div style="color: #c00; font-style: italic;">Error loading scores</div>';
        }
    }
}

// Global instance
let tetris = null;