// Icy Tower Game for Windows 95 Emulator
class IcyTower {
    constructor(container) {
        this.container = container;
        this.width = 300;
        this.height = 400;

        // Game state
        this.player = { x: 150, y: 300, vx: 0, vy: 0, w: 20, h: 28, grounded: false };
        this.platforms = [];
        this.cameraY = 0;
        this.floor = 0;
        this.best = parseInt(localStorage.getItem('win95-icytower-best') || '0');
        this.combo = 1;
        this.gameOver = false;
        this.paused = false;
        this.running = false;
        this.lastTime = 0;

        // Physics
        this.gravity = 0.4;
        this.jumpForce = -10;
        this.moveSpeed = 4;
        this.friction = 0.85;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #c0c0c0; font-family: 'MS Sans Serif', sans-serif;">
                <div style="padding: 4px 8px; border-bottom: 2px inset #808080; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 16px; font-size: 11px;">
                        <span>Floor: <b id="icy-floor">0</b></span>
                        <span>Best: <b id="icy-best">${this.best}</b></span>
                        <span style="color: #008000;">Combo: <b id="icy-combo">x1</b></span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button id="icy-pause" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 2px 8px; cursor: pointer; font-size: 11px;">Pause</button>
                        <button id="icy-restart" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 2px 8px; cursor: pointer; font-size: 11px;">New</button>
                    </div>
                </div>
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #808080; padding: 4px;">
                    <canvas id="icy-canvas" width="${this.width}" height="${this.height}"
                        style="border: 2px inset #808080; background: #000080; image-rendering: pixelated;"></canvas>
                </div>
                <div style="padding: 4px 8px; border-top: 2px inset #808080; font-size: 10px; color: #000;">
                    Arrow Keys/WASD: Move • Space: Jump
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('#icy-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.floorEl = this.container.querySelector('#icy-floor');
        this.bestEl = this.container.querySelector('#icy-best');
        this.comboEl = this.container.querySelector('#icy-combo');

        // Input
        this.keys = { left: false, right: false, jump: false };
        this.keyHandler = this.handleKey.bind(this);
        this.keyUpHandler = this.handleKeyUp.bind(this);
        document.addEventListener('keydown', this.keyHandler);
        document.addEventListener('keyup', this.keyUpHandler);

        // Buttons
        this.container.querySelector('#icy-pause').addEventListener('click', () => this.togglePause());
        this.container.querySelector('#icy-restart').addEventListener('click', () => this.restart());

        this.resetGame();
        this.showStart();
    }

    handleKey(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === ' ' || e.key === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            if (!this.running && !this.gameOver) {
                this.start();
            } else {
                this.keys.jump = true;
            }
        }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
        if (e.key === 'p' || e.key === 'P') this.togglePause();
    }

    handleKeyUp(e) {
        if (e.key === ' ' || e.key === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.jump = false;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
    }

    resetGame() {
        this.player = { x: this.width / 2 - 10, y: this.height * 0.7, vx: 0, vy: 0, w: 20, h: 28, grounded: false, facingRight: true };
        this.platforms = [];
        this.cameraY = 0;
        this.floor = 0;
        this.combo = 1;
        this.gameOver = false;

        // Ground platform
        this.platforms.push({ x: 0, y: this.height * 0.85, w: this.width, h: 12, type: 'ground' });

        // Generate platforms
        let y = this.height * 0.7;
        for (let i = 0; i < 30; i++) {
            y -= 40 + Math.random() * 25;
            this.addPlatform(y);
        }

        this.updateUI();
    }

    addPlatform(y) {
        const w = 50 + Math.random() * 40;
        const x = Math.random() * (this.width - w);
        const type = Math.random() < 0.1 ? 'gold' : 'normal';
        this.platforms.push({ x, y, w, h: 10, type });
    }

    showStart() {
        this.draw();
        this.ctx.fillStyle = 'rgba(0, 0, 128, 0.9)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Win95 style dialog
        this.drawWin95Box(50, 120, 200, 120);

        this.ctx.fillStyle = '#000080';
        this.ctx.fillRect(52, 122, 196, 16);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px MS Sans Serif, sans-serif';
        this.ctx.fillText('Icy Tower', 56, 133);

        this.ctx.fillStyle = '#000';
        this.ctx.font = '11px MS Sans Serif, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Climb as high as you can!', this.width / 2, 160);
        this.ctx.fillText('Don\'t fall off the screen.', this.width / 2, 175);

        // Start button
        this.drawWin95Button(100, 195, 100, 24, 'Press SPACE');
        this.ctx.textAlign = 'left';
    }

    drawWin95Box(x, y, w, h) {
        // Main fill
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.fillRect(x, y, w, h);
        // Highlight
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, w, 2);
        this.ctx.fillRect(x, y, 2, h);
        // Shadow
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(x, y + h - 2, w, 2);
        this.ctx.fillRect(x + w - 2, y, 2, h);
        // Dark shadow
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + 1, y + h - 1, w - 1, 1);
        this.ctx.fillRect(x + w - 1, y + 1, 1, h - 1);
    }

    drawWin95Button(x, y, w, h, text) {
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, w, 2);
        this.ctx.fillRect(x, y, 2, h);
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(x, y + h - 2, w, 2);
        this.ctx.fillRect(x + w - 2, y, 2, h);

        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 11px MS Sans Serif, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + w / 2, y + h / 2 + 4);
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    togglePause() {
        if (this.gameOver || !this.running) return;
        this.paused = !this.paused;
        this.container.querySelector('#icy-pause').textContent = this.paused ? 'Resume' : 'Pause';

        if (!this.paused) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }

    restart() {
        this.running = false;
        this.paused = false;
        this.container.querySelector('#icy-pause').textContent = 'Pause';
        this.resetGame();
        this.showStart();
    }

    update(dt) {
        const p = this.player;

        // Input
        if (this.keys.left) {
            p.vx = -this.moveSpeed;
            p.facingRight = false;
        } else if (this.keys.right) {
            p.vx = this.moveSpeed;
            p.facingRight = true;
        } else {
            p.vx *= this.friction;
        }

        // Jump
        if (this.keys.jump && p.grounded) {
            p.vy = this.jumpForce;
            p.grounded = false;
            this.keys.jump = false;
            if (window.playSound) window.playSound('click');
        }

        // Physics
        p.vy += this.gravity;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap horizontally
        if (p.x < -p.w) p.x = this.width;
        if (p.x > this.width) p.x = -p.w;

        // Platform collisions
        p.grounded = false;
        for (const plat of this.platforms) {
            if (p.vy >= 0 &&
                p.x + p.w > plat.x && p.x < plat.x + plat.w &&
                p.y + p.h >= plat.y && p.y + p.h <= plat.y + plat.h + p.vy + 2) {

                p.y = plat.y - p.h;
                p.vy = 0;
                p.grounded = true;

                // Score on new platforms
                const screenY = plat.y - this.cameraY;
                if (screenY < this.height * 0.5 && plat.type !== 'ground') {
                    this.floor++;
                    this.combo = Math.min(10, this.combo + 1);
                    this.updateUI();
                }
                break;
            }
        }

        // Camera follows player
        const targetCam = Math.min(this.cameraY, p.y - this.height * 0.4);
        this.cameraY += (targetCam - this.cameraY) * 0.1;

        // Remove old platforms and generate new ones
        this.platforms = this.platforms.filter(plat => plat.y < this.cameraY + this.height + 50);
        while (this.platforms.length < 25) {
            const topY = Math.min(...this.platforms.map(p => p.y));
            this.addPlatform(topY - (40 + Math.random() * 25));
        }

        // Death check
        if (p.y - this.cameraY > this.height + 30) {
            this.endGame();
        }
    }

    draw() {
        const ctx = this.ctx;
        const cam = this.cameraY;

        // Background - dark blue like Win95
        ctx.fillStyle = '#000080';
        ctx.fillRect(0, 0, this.width, this.height);

        // Grid pattern
        ctx.fillStyle = '#000060';
        for (let y = 0; y < this.height; y += 8) {
            ctx.fillRect(0, y, this.width, 1);
        }
        for (let x = 0; x < this.width; x += 8) {
            ctx.fillRect(x, 0, 1, this.height);
        }

        // Draw platforms - Win95 3D style
        for (const plat of this.platforms) {
            const py = plat.y - cam;
            if (py < -20 || py > this.height + 20) continue;

            // Platform colors
            let mainColor = '#c0c0c0';
            if (plat.type === 'gold') mainColor = '#ffff00';
            else if (plat.type === 'ground') mainColor = '#808080';

            // Main body
            ctx.fillStyle = mainColor;
            ctx.fillRect(plat.x, py, plat.w, plat.h);

            // 3D beveled edges
            ctx.fillStyle = '#fff';
            ctx.fillRect(plat.x, py, plat.w, 2);
            ctx.fillRect(plat.x, py, 2, plat.h);

            ctx.fillStyle = '#808080';
            ctx.fillRect(plat.x, py + plat.h - 2, plat.w, 2);
            ctx.fillRect(plat.x + plat.w - 2, py, 2, plat.h);
        }

        // Draw player - chunky pixelated Win95 style
        const p = this.player;
        const px = Math.floor(p.x);
        const py = Math.floor(p.y - cam);

        // Body (gray box)
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(px, py, p.w, p.h);

        // 3D effect
        ctx.fillStyle = '#fff';
        ctx.fillRect(px, py, p.w, 2);
        ctx.fillRect(px, py, 2, p.h);
        ctx.fillStyle = '#808080';
        ctx.fillRect(px, py + p.h - 2, p.w, 2);
        ctx.fillRect(px + p.w - 2, py, 2, p.h);

        // Face
        ctx.fillStyle = '#000';
        const eyeOff = p.facingRight ? 2 : -2;
        ctx.fillRect(px + 4 + eyeOff, py + 6, 3, 3);
        ctx.fillRect(px + 12 + eyeOff, py + 6, 3, 3);
        ctx.fillRect(px + 6 + eyeOff, py + 14, 8, 2);

        // Scarf (blue)
        ctx.fillStyle = '#000080';
        ctx.fillRect(px + 2, py + 4, p.w - 4, 4);
    }

    endGame() {
        this.gameOver = true;
        this.running = false;

        if (this.floor > this.best) {
            this.best = this.floor;
            localStorage.setItem('win95-icytower-best', this.best);
            this.bestEl.textContent = this.best;
        }

        if (window.playSound) window.playSound('error');

        // Draw game over
        this.draw();
        this.ctx.fillStyle = 'rgba(0, 0, 128, 0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawWin95Box(50, 130, 200, 100);

        this.ctx.fillStyle = '#000080';
        this.ctx.fillRect(52, 132, 196, 16);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px MS Sans Serif, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Game Over', 56, 143);

        this.ctx.fillStyle = '#000';
        this.ctx.font = '11px MS Sans Serif, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`You reached floor ${this.floor}!`, this.width / 2, 170);
        this.ctx.fillText(`Best: ${this.best}`, this.width / 2, 185);

        this.drawWin95Button(100, 200, 100, 20, 'New Game');
        this.ctx.textAlign = 'left';
    }

    updateUI() {
        this.floorEl.textContent = this.floor;
        this.comboEl.textContent = 'x' + this.combo;
    }

    gameLoop() {
        if (!this.running || this.paused || this.gameOver) return;

        const now = performance.now();
        const dt = Math.min(32, now - this.lastTime) / 16.67;
        this.lastTime = now;

        this.update(dt);
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    destroy() {
        this.running = false;
        document.removeEventListener('keydown', this.keyHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
    }
}

// Make available globally
window.IcyTower = IcyTower;
