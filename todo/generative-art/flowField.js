// Flow Field Generative Art

export default class FlowField {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.animationId = null;

        // Flow Field specific settings
        this.settings = {
            particleCount: 500,
            speed: 1.5,
            noiseScale: 0.003,
            trailOpacity: 0.05,
            particleSize: 2,
            color: '#00ffff'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Particle Count: <span id="particleCount-value">${this.settings.particleCount}</span></label>
                <input type="range" id="particleCount" min="100" max="2000" step="100" value="${this.settings.particleCount}">
            </div>
            <div class="control-group">
                <label>Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="0.1" max="5" step="0.1" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Noise Scale: <span id="noiseScale-value">${this.settings.noiseScale}</span></label>
                <input type="range" id="noiseScale" min="0.001" max="0.01" step="0.001" value="${this.settings.noiseScale}">
            </div>
            <div class="control-group">
                <label>Trail Length</label>
                <input type="range" id="trailOpacity" min="0.01" max="0.3" step="0.01" value="${this.settings.trailOpacity}">
            </div>
            <div class="control-group">
                <label>Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('particleCount').addEventListener('input', (e) => {
            this.settings.particleCount = parseInt(e.target.value);
            document.getElementById('particleCount-value').textContent = e.target.value;
            this.init();
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('noiseScale').addEventListener('input', (e) => {
            this.settings.noiseScale = parseFloat(e.target.value);
            document.getElementById('noiseScale-value').textContent = e.target.value;
        });

        document.getElementById('trailOpacity').addEventListener('input', (e) => {
            this.settings.trailOpacity = parseFloat(e.target.value);
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push(new FlowFieldParticle(this.canvas.width, this.canvas.height));
        }
    }

    animate() {
        // Trail effect
        this.ctx.fillStyle = `rgba(10, 10, 10, ${this.settings.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.update(this.settings, this.canvas.width, this.canvas.height);
            p.draw(this.ctx, this.settings.color, this.settings.particleSize);
        });

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

class FlowFieldParticle {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
    }

    update(settings, width, height) {
        // Perlin-like noise using sine/cosine
        const angle = Math.cos(this.x * settings.noiseScale) *
                     Math.sin(this.y * settings.noiseScale) * Math.PI * 4;

        this.vx = Math.cos(angle) * settings.speed;
        this.vy = Math.sin(angle) * settings.speed;

        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset(width, height);
        }
    }

    draw(ctx, color, size) {
        const alpha = this.life / this.maxLife;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillRect(this.x, this.y, size, size);
    }
}
