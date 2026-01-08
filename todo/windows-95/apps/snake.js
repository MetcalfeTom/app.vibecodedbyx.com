// Snake Game for Windows 95 Emulator
class Snake {
    constructor(container) {
        this.container = container;
        this.gridSize = 20;
        this.tileSize = 20;
        this.width = 20;
        this.height = 20;

        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = null;
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.speed = 150; // milliseconds per move
        this.gameLoop = null;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #c0c0c0; font-family: 'MS Sans Serif', sans-serif;">
                <div style="padding: 8px; border-bottom: 2px inset #808080; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 12px; font-weight: bold;">Score: <span id="snake-score">0</span></div>
                    <div style="display: flex; gap: 4px;">
                        <button id="snake-pause-btn" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 4px 12px; cursor: pointer; font-size: 11px;">Pause</button>
                        <button id="snake-restart-btn" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 4px 12px; cursor: pointer; font-size: 11px;">New Game</button>
                    </div>
                </div>
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #008080;">
                    <canvas id="snake-canvas" width="${this.width * this.tileSize}" height="${this.height * this.tileSize}"
                        style="border: 3px outset #c0c0c0; background: #000; image-rendering: pixelated; cursor: crosshair;"></canvas>
                </div>
                <div id="snake-gameover" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #c0c0c0; border: 3px outset #c0c0c0; padding: 20px; text-align: center; box-shadow: 4px 4px 8px rgba(0,0,0,0.5);">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #c00;">Game Over!</div>
                    <div style="font-size: 14px; margin-bottom: 16px;">Final Score: <span id="snake-final-score">0</span></div>
                    <button onclick="location.reload()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 6px 16px; cursor: pointer; font-size: 11px;">Play Again</button>
                </div>
                <div style="padding: 8px; border-top: 2px inset #808080; font-size: 10px; text-align: center; color: #000;">
                    Use Arrow Keys or WASD to move • Space to Pause
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('#snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = this.container.querySelector('#snake-score');
        this.gameOverElement = this.container.querySelector('#snake-gameover');
        this.finalScoreElement = this.container.querySelector('#snake-final-score');

        // Set up event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.container.querySelector('#snake-pause-btn').addEventListener('click', () => this.togglePause());
        this.container.querySelector('#snake-restart-btn').addEventListener('click', () => this.restart());

        // Start game
        this.spawnFood();
        this.start();
    }

    handleKeyPress(e) {
        // Prevent default scrolling behavior for arrow keys and space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (this.gameOver) return;

        // Pause with space
        if (e.key === ' ' || e.key === 'Space') {
            this.togglePause();
            return;
        }

        if (this.paused) return;

        // Direction controls
        let newDirection = { ...this.nextDirection };

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y === 0) newDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y === 0) newDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x === 0) newDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x === 0) newDirection = { x: 1, y: 0 };
                break;
        }

        this.nextDirection = newDirection;
    }

    togglePause() {
        if (this.gameOver) return;

        this.paused = !this.paused;
        const pauseBtn = this.container.querySelector('#snake-pause-btn');

        if (this.paused) {
            pauseBtn.textContent = 'Resume';
            this.stop();

            // Draw pause overlay
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px MS Sans Serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        } else {
            pauseBtn.textContent = 'Pause';
            this.start();
        }
    }

    restart() {
        this.stop();
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.speed = 150;
        this.scoreElement.textContent = '0';
        this.gameOverElement.style.display = 'none';
        this.container.querySelector('#snake-pause-btn').textContent = 'Pause';
        this.spawnFood();
        this.start();
    }

    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        this.food = newFood;
    }

    update() {
        if (this.paused || this.gameOver) return;

        // Update direction
        this.direction = { ...this.nextDirection };

        // Calculate new head position
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) {
            this.endGame();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;

            // Increase speed slightly
            if (this.speed > 80) {
                this.speed -= 2;
                this.stop();
                this.start();
            }

            this.spawnFood();

            // Play sound if available
            if (window.playSound) window.playSound('click');
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#111';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.tileSize, 0);
            this.ctx.lineTo(x * this.tileSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.tileSize);
            this.ctx.lineTo(this.canvas.width, y * this.tileSize);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            // Head is brighter
            const brightness = index === 0 ? 255 : 200;
            this.ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
            this.ctx.fillRect(
                segment.x * this.tileSize + 1,
                segment.y * this.tileSize + 1,
                this.tileSize - 2,
                this.tileSize - 2
            );

            // Draw eyes on head
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                const eyeSize = 3;
                const eyeOffset = 6;

                if (this.direction.x === 1) { // Right
                    this.ctx.fillRect(segment.x * this.tileSize + eyeOffset + 4, segment.y * this.tileSize + 5, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.tileSize + eyeOffset + 4, segment.y * this.tileSize + 12, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Left
                    this.ctx.fillRect(segment.x * this.tileSize + eyeOffset - 2, segment.y * this.tileSize + 5, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.tileSize + eyeOffset - 2, segment.y * this.tileSize + 12, eyeSize, eyeSize);
                } else if (this.direction.y === -1) { // Up
                    this.ctx.fillRect(segment.x * this.tileSize + 5, segment.y * this.tileSize + eyeOffset - 2, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.tileSize + 12, segment.y * this.tileSize + eyeOffset - 2, eyeSize, eyeSize);
                } else { // Down
                    this.ctx.fillRect(segment.x * this.tileSize + 5, segment.y * this.tileSize + eyeOffset + 4, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.tileSize + 12, segment.y * this.tileSize + eyeOffset + 4, eyeSize, eyeSize);
                }
            }
        });

        // Draw food (pulsing apple)
        if (this.food) {
            const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
            this.ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * this.tileSize + this.tileSize / 2,
                this.food.y * this.tileSize + this.tileSize / 2,
                this.tileSize / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();

            // Apple leaf
            this.ctx.fillStyle = '#0a0';
            this.ctx.fillRect(
                this.food.x * this.tileSize + this.tileSize / 2 - 1,
                this.food.y * this.tileSize + 3,
                2,
                4
            );
        }
    }

    endGame() {
        this.gameOver = true;
        this.stop();

        // Play error sound if available
        if (window.playSound) window.playSound('error');

        // Show game over
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';

        // Draw game over overlay on canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#f00';
        this.ctx.font = 'bold 24px MS Sans Serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px MS Sans Serif';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 15);
    }

    start() {
        if (this.gameLoop) return;

        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);

        // Initial draw
        this.draw();
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    destroy() {
        this.stop();
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}

// Make available globally
window.Snake = Snake;
