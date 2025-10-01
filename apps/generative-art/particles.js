// Particle Explosion Generative Art

export default class ParticleExplosion {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.animationId = null;

        // Particle specific settings
        this.settings = {
            particleCount: 300,
            speed: 3,
            gravity: 0.05,
            explosionFrequency: 60,
            particleLife: 150,
            color: '#ff00ff'
        };

        this.frameCount = 0;
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Particle Count: <span id="particleCount-value">${this.settings.particleCount}</span></label>
                <input type="range" id="particleCount" min="50" max="1000" step="50" value="${this.settings.particleCount}">
            </div>
            <div class="control-group">
                <label>Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="1" max="10" step="0.5" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Gravity: <span id="gravity-value">${this.settings.gravity}</span></label>
                <input type="range" id="gravity" min="0" max="0.3" step="0.01" value="${this.settings.gravity}">
            </div>
            <div class="control-group">
                <label>Explosion Rate</label>
                <input type="range" id="explosionFrequency" min="20" max="200" step="10" value="${this.settings.explosionFrequency}">
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
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('gravity').addEventListener('input', (e) => {
            this.settings.gravity = parseFloat(e.target.value);
            document.getElementById('gravity-value').textContent = e.target.value;
        });

        document.getElementById('explosionFrequency').addEventListener('input', (e) => {
            this.settings.explosionFrequency = parseInt(e.target.value);
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.particles = [];
        this.createExplosion();
    }

    createExplosion() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;

        for (let i = 0; i < this.settings.particleCount / 5; i++) {
            this.particles.push(new Particle(x, y, this.settings));
        }
    }

    animate() {
        // Trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Create new explosions periodically
        this.frameCount++;
        if (this.frameCount % this.settings.explosionFrequency === 0) {
            this.createExplosion();
        }

        // Update and draw particles
        this.particles = this.particles.filter(p => {
            p.update(this.settings);
            p.draw(this.ctx, this.settings.color);
            return p.life > 0;
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
        this.particles = [];
        this.frameCount = 0;
        this.createExplosion();
    }
}

class Particle {
    constructor(x, y, settings) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * settings.speed + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = settings.particleLife;
        this.maxLife = this.life;
        this.size = Math.random() * 3 + 1;
    }

    update(settings) {
        this.vy += settings.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx, color) {
        const alpha = this.life / this.maxLife;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    }
}
