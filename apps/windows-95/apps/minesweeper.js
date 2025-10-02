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
        this.touchTimer = null;
        this.longPressDelay = 300; // 300ms for long press

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="background: #c0c0c0; padding: 8px; height: 100%; width: 100%; font-family: 'MS Sans Serif', sans-serif; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 6px; border: 2px inset #c0c0c0;">
                    <div id="mine-display" style="display:flex; align-items:center; gap:2px; padding: 2px 4px; background: #000; border: 1px inset #c0c0c0;"></div>
                    <button id="smiley-btn" style="width: 32px; height: 32px; font-size: 20px; border: 2px outset #c0c0c0; background: #c0c0c0; cursor: pointer; line-height: 1; display:flex; align-items:center; justify-content:center;" onclick="minesweeper.resetGame()">🙂</button>
                    <div id="timer-display" style="display:flex; align-items:center; gap:2px; padding: 2px 4px; background: #000; border: 1px inset #c0c0c0;"></div>
                </div>
                <div id="minefield-wrap" style="flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <div id="minefield" style="border: 3px inset #c0c0c0; background: #c0c0c0;"></div>
                </div>
            </div>
        `;

        this.createBoard();
        this.renderBoard();
        this.setupDisplays();
        this.startTimer();

        // Re-render on window resize to keep it filling the window
        window.addEventListener('resize', () => this.renderBoard());
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
        const wrap = document.getElementById('minefield-wrap');
        if (!minefield || !wrap) return;
        minefield.innerHTML = '';
        minefield.style.display = 'grid';
        minefield.style.gap = '0';

        // Compute largest square cell size that fits the available area
        const availableWidth = wrap.clientWidth - 8; // padding allowance
        const availableHeight = wrap.clientHeight - 8;
        const cellSize = Math.max(12, Math.floor(Math.min(availableWidth / this.width, availableHeight / this.height)));
        const gridWidth = cellSize * this.width;
        const gridHeight = cellSize * this.height;

        minefield.style.width = gridWidth + 'px';
        minefield.style.height = gridHeight + 'px';
        minefield.style.gridTemplateColumns = `repeat(${this.width}, ${cellSize}px)`;
        minefield.style.gridTemplateRows = `repeat(${this.height}, ${cellSize}px)`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: ${cellSize}px;
                    height: ${cellSize}px;
                    border: 2px outset #efefef;
                    background: #e6e6e6; /* covered state */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${Math.max(10, Math.floor(cellSize * 0.6))}px;
                    font-weight: bold;
                    cursor: pointer;
                    user-select: none;
                    font-family: 'MS Sans Serif', sans-serif;
                    color: #000;
                `;

                cell.addEventListener('click', (e) => this.handleClick(x, y, e));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(x, y, e));

                // Touch event handlers for long-press flag on mobile
                cell.addEventListener('touchstart', (e) => this.handleTouchStart(x, y, e));
                cell.addEventListener('touchend', (e) => this.handleTouchEnd(x, y, e));
                cell.addEventListener('touchcancel', (e) => this.handleTouchCancel());
                cell.addEventListener('touchmove', (e) => this.handleTouchCancel());

                if (this.revealed[y][x]) {
                    cell.style.border = '2px inset #9c9c9c';
                    cell.style.background = '#d4d0c8'; /* revealed state */

                    if (this.board[y][x] === -1) {
                        cell.textContent = '💣';
                        cell.style.background = this.gameOver ? '#ffcccc' : '#d4d0c8';
                    } else if (this.board[y][x] > 0) {
                        cell.textContent = this.board[y][x];
                        const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
                        cell.style.color = colors[this.board[y][x]] || '#000';
                    }
                } else if (this.flagged[y][x]) {
                    cell.textContent = '🚩';
                    cell.style.background = '#fff2cc';
                }

                minefield.appendChild(cell);
            }
        }
    }

    setupDisplays() {
        // Build 3-digit seven-seg displays for mines and timer
        this.mineDigits = this.createSevenSeg('mine-display', 3);
        this.timerDigits = this.createSevenSeg('timer-display', 3);
        this.updateMineDisplay();
        this.updateTimerDisplay(0);
    }

    createSevenSeg(containerId, digits) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const list = [];
        for (let i = 0; i < digits; i++) {
            const d = document.createElement('div');
            d.style.cssText = 'position:relative;width:22px;height:36px;margin:0 1px;';
            const mk = (name, css) => {
                const s = document.createElement('div');
                s.dataset.seg = name;
                s.style.cssText = css + ';background:#2a0000;';
                d.appendChild(s);
                return s;
            };
            // Horizontal segments (a,g,d)
            mk('a', 'position:absolute;left:4px;top:2px;width:14px;height:3px');
            mk('g', 'position:absolute;left:4px;top:16px;width:14px;height:3px');
            mk('d', 'position:absolute;left:4px;bottom:2px;width:14px;height:3px');
            // Vertical segments (b,c,f,e)
            mk('b', 'position:absolute;right:2px;top:5px;width:3px;height:12px');
            mk('c', 'position:absolute;right:2px;bottom:5px;width:3px;height:12px');
            mk('f', 'position:absolute;left:2px;top:5px;width:3px;height:12px');
            mk('e', 'position:absolute;left:2px;bottom:5px;width:3px;height:12px');

            container.appendChild(d);
            list.push(d);
        }
        return list;
    }

    setDigit(el, n) {
        const onColor = '#ff2a2a';
        const offColor = '#2a0000';
        const map = {
            0: ['a','b','c','d','e','f'],
            1: ['b','c'],
            2: ['a','b','g','e','d'],
            3: ['a','b','g','c','d'],
            4: ['f','g','b','c'],
            5: ['a','f','g','c','d'],
            6: ['a','f','g','e','c','d'],
            7: ['a','b','c'],
            8: ['a','b','c','d','e','f','g'],
            9: ['a','b','c','d','f','g']
        };
        const active = new Set(map[n] || []);
        el.querySelectorAll('[data-seg]').forEach(seg => {
            seg.style.background = active.has(seg.dataset.seg) ? onColor : offColor;
        });
    }

    renderDigits(digits, value) {
        const s = String(Math.max(0, Math.min(999, value))).padStart(digits.length, '0');
        for (let i = 0; i < digits.length; i++) {
            const n = Number(s[i]);
            this.setDigit(digits[i], n);
        }
    }

    updateMineDisplay() {
        this.renderDigits(this.mineDigits, this.mineCount);
    }

    updateTimerDisplay(seconds) {
        this.renderDigits(this.timerDigits, seconds);
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
        this.updateMineDisplay();
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
            this.mineCount = 0;
            this.updateMineDisplay();
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
            this.updateTimerDisplay(Math.min(elapsed, 999));
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
        this.updateMineDisplay();
        this.updateTimerDisplay(0);
        this.updateSmiley();
    }

    handleTouchStart(x, y, e) {
        // Start timer for long press
        this.touchTimer = setTimeout(() => {
            // Long press detected - place/remove flag
            this.handleRightClick(x, y, e);
            this.touchTimer = null;
        }, this.longPressDelay);
    }

    handleTouchEnd(x, y, e) {
        // If timer still exists, it was a quick tap (not long press)
        if (this.touchTimer !== null) {
            clearTimeout(this.touchTimer);
            this.touchTimer = null;
            // Treat as regular click
            this.handleClick(x, y, e);
        }
        // If timer is null, long press already triggered
    }

    handleTouchCancel() {
        // Cancel the long press if touch is cancelled or moved
        if (this.touchTimer !== null) {
            clearTimeout(this.touchTimer);
            this.touchTimer = null;
        }
    }
}

// Global instance for the button onclick
let minesweeper;
