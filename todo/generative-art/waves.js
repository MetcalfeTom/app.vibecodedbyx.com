// Wave Patterns Generative Art

export default class Waves {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.time = 0;

        // Wave specific settings
        this.settings = {
            waveCount: 8,
            speed: 2,
            amplitude: 100,
            frequency: 0.01,
            lineWidth: 2,
            color: '#00ff88'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Wave Count: <span id="waveCount-value">${this.settings.waveCount}</span></label>
                <input type="range" id="waveCount" min="1" max="20" step="1" value="${this.settings.waveCount}">
            </div>
            <div class="control-group">
                <label>Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="0.5" max="10" step="0.5" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Amplitude: <span id="amplitude-value">${this.settings.amplitude}</span></label>
                <input type="range" id="amplitude" min="20" max="300" step="10" value="${this.settings.amplitude}">
            </div>
            <div class="control-group">
                <label>Frequency: <span id="frequency-value">${this.settings.frequency}</span></label>
                <input type="range" id="frequency" min="0.001" max="0.05" step="0.001" value="${this.settings.frequency}">
            </div>
            <div class="control-group">
                <label>Line Width: <span id="lineWidth-value">${this.settings.lineWidth}</span></label>
                <input type="range" id="lineWidth" min="1" max="8" step="0.5" value="${this.settings.lineWidth}">
            </div>
            <div class="control-group">
                <label>Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('waveCount').addEventListener('input', (e) => {
            this.settings.waveCount = parseInt(e.target.value);
            document.getElementById('waveCount-value').textContent = e.target.value;
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('amplitude').addEventListener('input', (e) => {
            this.settings.amplitude = parseFloat(e.target.value);
            document.getElementById('amplitude-value').textContent = e.target.value;
        });

        document.getElementById('frequency').addEventListener('input', (e) => {
            this.settings.frequency = parseFloat(e.target.value);
            document.getElementById('frequency-value').textContent = e.target.value;
        });

        document.getElementById('lineWidth').addEventListener('input', (e) => {
            this.settings.lineWidth = parseFloat(e.target.value);
            document.getElementById('lineWidth-value').textContent = e.target.value;
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.time = 0;
    }

    animate() {
        // Clear with fade
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const r = parseInt(this.settings.color.substr(1, 2), 16);
        const g = parseInt(this.settings.color.substr(3, 2), 16);
        const b = parseInt(this.settings.color.substr(5, 2), 16);

        // Draw waves
        for (let w = 0; w < this.settings.waveCount; w++) {
            const alpha = 0.6 - (w / this.settings.waveCount) * 0.3;
            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            this.ctx.lineWidth = this.settings.lineWidth;
            this.ctx.beginPath();

            for (let x = 0; x <= this.canvas.width; x += 3) {
                const y = this.canvas.height / 2 +
                    Math.sin((x * this.settings.frequency + this.time * 0.01 * this.settings.speed) * (w + 1)) * this.settings.amplitude +
                    Math.cos((x * this.settings.frequency * 1.5 + this.time * 0.01 * this.settings.speed) * (w + 1)) * (this.settings.amplitude * 0.5);

                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }

        this.time++;
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
        this.time = 0;
    }
}
