// Constellation Generative Art

export default class Constellation {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.stars = [];
        this.animationId = null;

        // Constellation specific settings
        this.settings = {
            starCount: 150,
            connectionDistance: 150,
            speed: 0.3,
            starSize: 2,
            twinkle: true,
            showConnections: true,
            color: '#ffffff'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Star Count: <span id="starCount-value">${this.settings.starCount}</span></label>
                <input type="range" id="starCount" min="50" max="500" step="10" value="${this.settings.starCount}">
            </div>
            <div class="control-group">
                <label>Connection Distance: <span id="connectionDistance-value">${this.settings.connectionDistance}</span></label>
                <input type="range" id="connectionDistance" min="50" max="300" step="10" value="${this.settings.connectionDistance}">
            </div>
            <div class="control-group">
                <label>Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="0" max="2" step="0.1" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Star Size: <span id="starSize-value">${this.settings.starSize}</span></label>
                <input type="range" id="starSize" min="1" max="5" step="0.5" value="${this.settings.starSize}">
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="twinkle" ${this.settings.twinkle ? 'checked' : ''}>
                    Twinkle Effect
                </label>
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="showConnections" ${this.settings.showConnections ? 'checked' : ''}>
                    Show Connections
                </label>
            </div>
            <div class="control-group">
                <label>Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('starCount').addEventListener('input', (e) => {
            this.settings.starCount = parseInt(e.target.value);
            document.getElementById('starCount-value').textContent = e.target.value;
            this.init();
        });

        document.getElementById('connectionDistance').addEventListener('input', (e) => {
            this.settings.connectionDistance = parseInt(e.target.value);
            document.getElementById('connectionDistance-value').textContent = e.target.value;
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('starSize').addEventListener('input', (e) => {
            this.settings.starSize = parseFloat(e.target.value);
            document.getElementById('starSize-value').textContent = e.target.value;
        });

        document.getElementById('twinkle').addEventListener('change', (e) => {
            this.settings.twinkle = e.target.checked;
        });

        document.getElementById('showConnections').addEventListener('change', (e) => {
            this.settings.showConnections = e.target.checked;
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.stars = [];
        for (let i = 0; i < this.settings.starCount; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height, this.settings));
        }
    }

    animate() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw stars
        for (let star of this.stars) {
            star.update(this.canvas.width, this.canvas.height);
            star.draw(this.ctx);
        }

        // Draw connections
        if (this.settings.showConnections) {
            for (let i = 0; i < this.stars.length; i++) {
                for (let j = i + 1; j < this.stars.length; j++) {
                    const dist = Math.sqrt(
                        (this.stars[i].x - this.stars[j].x) ** 2 +
                        (this.stars[i].y - this.stars[j].y) ** 2
                    );

                    if (dist < this.settings.connectionDistance) {
                        const alpha = 1 - (dist / this.settings.connectionDistance);

                        const r = parseInt(this.settings.color.substr(1, 2), 16);
                        const g = parseInt(this.settings.color.substr(3, 2), 16);
                        const b = parseInt(this.settings.color.substr(5, 2), 16);

                        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
                        this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clear() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
    }
}

class Star {
    constructor(width, height, settings) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * settings.speed;
        this.vy = (Math.random() - 0.5) * settings.speed;
        this.size = Math.random() * settings.starSize + 1;
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.settings = settings;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Twinkle effect
        if (this.settings.twinkle) {
            this.brightness += this.twinkleSpeed;
            if (this.brightness > 1 || this.brightness < 0.3) {
                this.twinkleSpeed *= -1;
            }
        } else {
            this.brightness = 1;
        }
    }

    draw(ctx) {
        const r = parseInt(this.settings.color.substr(1, 2), 16);
        const g = parseInt(this.settings.color.substr(3, 2), 16);
        const b = parseInt(this.settings.color.substr(5, 2), 16);

        // Draw star with glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.brightness})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw star center
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
