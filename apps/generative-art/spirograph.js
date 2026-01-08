// Spirograph Generative Art

export default class Spirograph {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.time = 0;

        // Spirograph specific settings
        this.settings = {
            outerRadius: 150,
            innerRadius: 75,
            offset: 50,
            speed: 1,
            lineWidth: 1.5,
            rotations: 10,
            color: '#ffff00'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Outer Radius: <span id="outerRadius-value">${this.settings.outerRadius}</span></label>
                <input type="range" id="outerRadius" min="50" max="300" step="10" value="${this.settings.outerRadius}">
            </div>
            <div class="control-group">
                <label>Inner Radius: <span id="innerRadius-value">${this.settings.innerRadius}</span></label>
                <input type="range" id="innerRadius" min="20" max="200" step="5" value="${this.settings.innerRadius}">
            </div>
            <div class="control-group">
                <label>Offset: <span id="offset-value">${this.settings.offset}</span></label>
                <input type="range" id="offset" min="10" max="150" step="5" value="${this.settings.offset}">
            </div>
            <div class="control-group">
                <label>Rotation Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="0.1" max="5" step="0.1" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Complexity: <span id="rotations-value">${this.settings.rotations}</span></label>
                <input type="range" id="rotations" min="1" max="30" step="1" value="${this.settings.rotations}">
            </div>
            <div class="control-group">
                <label>Line Width: <span id="lineWidth-value">${this.settings.lineWidth}</span></label>
                <input type="range" id="lineWidth" min="0.5" max="5" step="0.5" value="${this.settings.lineWidth}">
            </div>
            <div class="control-group">
                <label>Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('outerRadius').addEventListener('input', (e) => {
            this.settings.outerRadius = parseInt(e.target.value);
            document.getElementById('outerRadius-value').textContent = e.target.value;
        });

        document.getElementById('innerRadius').addEventListener('input', (e) => {
            this.settings.innerRadius = parseInt(e.target.value);
            document.getElementById('innerRadius-value').textContent = e.target.value;
        });

        document.getElementById('offset').addEventListener('input', (e) => {
            this.settings.offset = parseInt(e.target.value);
            document.getElementById('offset-value').textContent = e.target.value;
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('rotations').addEventListener('input', (e) => {
            this.settings.rotations = parseInt(e.target.value);
            document.getElementById('rotations-value').textContent = e.target.value;
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

    drawSpirograph() {
        const R = this.settings.outerRadius;
        const r = this.settings.innerRadius;
        const O = this.settings.offset;

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        const r_val = parseInt(this.settings.color.substr(1, 2), 16);
        const g = parseInt(this.settings.color.substr(3, 2), 16);
        const b = parseInt(this.settings.color.substr(5, 2), 16);

        this.ctx.strokeStyle = `rgba(${r_val}, ${g}, ${b}, 0.6)`;
        this.ctx.lineWidth = this.settings.lineWidth;
        this.ctx.beginPath();

        const step = 0.01;
        const maxT = Math.PI * 2 * this.settings.rotations;

        for (let t = 0; t <= maxT; t += step) {
            const x = (R - r) * Math.cos(t + this.time * 0.001 * this.settings.speed) +
                      O * Math.cos(((R - r) / r) * t);
            const y = (R - r) * Math.sin(t + this.time * 0.001 * this.settings.speed) +
                      O * Math.sin(((R - r) / r) * t);

            if (t === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    animate() {
        // Clear with fade
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawSpirograph();

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
