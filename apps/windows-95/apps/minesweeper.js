// Minesweeper App for Windows 95 Simulator

class Minesweeper {
    constructor(container) {
        this.container = container;
        this.width = 9;
        this.height = 9;
        this.mines = 10;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.mineCount = this.mines;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="background: #c0c0c0; padding: 8px; height: 100%; font-family: 'MS Sans Serif', sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 4px; border: 2px inset #c0c0c0;">
                    <div style="background: #000; color: #ff0000; font-weight: bold; font-family: 'Courier New', monospace; padding: 2px 4px; border: 1px inset #c0c0c0;">
                        <span id="mine-count">${this.mines.toString().padStart(3, '0')}</span>
                    </div>
                    <button id="smiley-btn" style="width: 24px; height: 24px; font-size: 14px; border: 2px outset #c0c0c0; background: #c0c0c0; cursor: pointer;" onclick="minesweeper.resetGame()">
                        🙂
                    </button>
                    <div style="background: #000; color: #ff0000; font-weight: bold; font-family: 'Courier New', monospace; padding: 2px 4px; border: 1px inset #c0c0c0;">
                        <span id="timer">000</span>
                    </div>
                </div>
                <div id="minefield" style="border: 3px inset #c0c0c0; display: inline-block; background: #c0c0c0;">
                </div>
            </div>
        `;

        this.createBoard();
        this.renderBoard();
        this.startTimer();
    }

    createBoard() {
        // Initialize empty board
        this.board = [];
        this.revealed = [];
        this.flagged = [];

        for (let y = 0; y < this.height; y++) {
            this.board[y] = [];
            this.revealed[y] = [];
            this.flagged[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.board[y][x] = 0;
                this.revealed[y][x] = false;
                this.flagged[y][x] = false;
            }
        }
    }

    placeMines(firstClickX, firstClickY) {
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);

            // Don't place mine on first click or if already a mine
            if ((x === firstClickX && y === firstClickY) || this.board[y][x] === -1) {
                continue;
            }

            this.board[y][x] = -1; // -1 represents a mine
            minesPlaced++;
        }

        // Calculate numbers for each cell
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] !== -1) {
                    this.board[y][x] = this.countAdjacentMines(x, y);
                }
            }
        }
    }

    countAdjacentMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    if (this.board[ny][nx] === -1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    renderBoard() {
        const minefield = document.getElementById('minefield');
        minefield.innerHTML = '';
        minefield.style.display = 'grid';
        minefield.style.gridTemplateColumns = `repeat(${this.width}, 16px)`;
        minefield.style.gridTemplateRows = `repeat(${this.height}, 16px)`;
        minefield.style.gap = '0';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: 16px;
                    height: 16px;
                    border: 1px outset #c0c0c0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    user-select: none;
                    font-family: 'MS Sans Serif', sans-serif;
                `;

                cell.addEventListener('click', (e) => this.handleClick(x, y, e));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(x, y, e));

                if (this.revealed[y][x]) {
                    cell.style.border = '1px inset #c0c0c0';
                    cell.style.background = '#c0c0c0';

                    if (this.board[y][x] === -1) {
                        cell.textContent = '💣';
                        cell.style.background = this.gameOver ? '#ff0000' : '#c0c0c0';
                    } else if (this.board[y][x] > 0) {
                        cell.textContent = this.board[y][x];
                        const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
                        cell.style.color = colors[this.board[y][x]] || '#000';
                    }
                } else if (this.flagged[y][x]) {
                    cell.textContent = '🚩';
                }

                minefield.appendChild(cell);
            }
        }
    }

    handleClick(x, y, e) {
        e.preventDefault();
        if (this.gameOver || this.gameWon || this.flagged[y][x]) return;

        if (this.firstClick) {
            this.placeMines(x, y);
            this.firstClick = false;
        }

        this.revealCell(x, y);
        this.checkWinCondition();
        this.renderBoard();
        this.updateSmiley();
    }

    handleRightClick(x, y, e) {
        e.preventDefault();
        if (this.gameOver || this.gameWon || this.revealed[y][x]) return;

        this.flagged[y][x] = !this.flagged[y][x];
        this.mineCount += this.flagged[y][x] ? -1 : 1;
        document.getElementById('mine-count').textContent = this.mineCount.toString().padStart(3, '0');
        this.renderBoard();
    }

    revealCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height || this.revealed[y][x] || this.flagged[y][x]) {
            return;
        }

        this.revealed[y][x] = true;

        if (this.board[y][x] === -1) {
            // Hit a mine
            this.gameOver = true;
            // Reveal all mines
            for (let my = 0; my < this.height; my++) {
                for (let mx = 0; mx < this.width; mx++) {
                    if (this.board[my][mx] === -1) {
                        this.revealed[my][mx] = true;
                    }
                }
            }
            return;
        }

        // If empty cell, reveal all adjacent cells
        if (this.board[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    this.revealCell(x + dx, y + dy);
                }
            }
        }
    }

    checkWinCondition() {
        let revealedCount = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.revealed[y][x] && this.board[y][x] !== -1) {
                    revealedCount++;
                }
            }
        }

        if (revealedCount === (this.width * this.height - this.mines)) {
            this.gameWon = true;
            // Flag all remaining mines
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.board[y][x] === -1 && !this.flagged[y][x]) {
                        this.flagged[y][x] = true;
                        this.mineCount--;
                    }
                }
            }
            document.getElementById('mine-count').textContent = '000';
        }
    }

    updateSmiley() {
        const smiley = document.getElementById('smiley-btn');
        if (this.gameOver) {
            smiley.textContent = '😵';
        } else if (this.gameWon) {
            smiley.textContent = '😎';
        } else {
            smiley.textContent = '🙂';
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (this.gameOver || this.gameWon) {
                clearInterval(this.timerInterval);
                return;
            }

            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent = Math.min(elapsed, 999).toString().padStart(3, '0');
        }, 1000);
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.mineCount = this.mines;
        this.createBoard();
        this.renderBoard();
        this.startTimer();
        document.getElementById('mine-count').textContent = this.mines.toString().padStart(3, '0');
        document.getElementById('timer').textContent = '000';
        this.updateSmiley();
    }
}

// Global instance for the button onclick
let minesweeper;