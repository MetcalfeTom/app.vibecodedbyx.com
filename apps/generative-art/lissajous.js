// Lissajous Curves Generative Art

export default class Lissajous {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.time = 0;
        this.points = [];

        // Lissajous specific settings
        this.settings = {
            a: 3,
            b: 4,
            delta: 90,
            speed: 1,
            scale: 200,
            lineWidth: 2,
            trailLength: 500,
            colorShift: true,
            color: '#00ffff'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Frequency A: <span id="a-value">${this.settings.a}</span></label>
                <input type="range" id="a" min="1" max="10" step="1" value="${this.settings.a}">
            </div>
            <div class="control-group">
                <label>Frequency B: <span id="b-value">${this.settings.b}</span></label>
                <input type="range" id="b" min="1" max="10" step="1" value="${this.settings.b}">
            </div>
            <div class="control-group">
                <label>Phase Shift: <span id="delta-value">${this.settings.delta}°</span></label>
                <input type="range" id="delta" min="0" max="360" step="1" value="${this.settings.delta}">
            </div>
            <div class="control-group">
                <label>Speed: <span id="speed-value">${this.settings.speed}</span></label>
                <input type="range" id="speed" min="0.1" max="5" step="0.1" value="${this.settings.speed}">
            </div>
            <div class="control-group">
                <label>Scale: <span id="scale-value">${this.settings.scale}</span></label>
                <input type="range" id="scale" min="50" max="400" step="10" value="${this.settings.scale}">
            </div>
            <div class="control-group">
                <label>Line Width: <span id="lineWidth-value">${this.settings.lineWidth}</span></label>
                <input type="range" id="lineWidth" min="1" max="8" step="0.5" value="${this.settings.lineWidth}">
            </div>
            <div class="control-group">
                <label>Trail Length: <span id="trailLength-value">${this.settings.trailLength}</span></label>
                <input type="range" id="trailLength" min="50" max="2000" step="50" value="${this.settings.trailLength}">
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="colorShift" ${this.settings.colorShift ? 'checked' : ''}>
                    Rainbow Trail
                </label>
            </div>
            <div class="control-group">
                <label>Base Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('a').addEventListener('input', (e) => {
            this.settings.a = parseInt(e.target.value);
            document.getElementById('a-value').textContent = e.target.value;
        });

        document.getElementById('b').addEventListener('input', (e) => {
            this.settings.b = parseInt(e.target.value);
            document.getElementById('b-value').textContent = e.target.value;
        });

        document.getElementById('delta').addEventListener('input', (e) => {
            this.settings.delta = parseInt(e.target.value);
            document.getElementById('delta-value').textContent = e.target.value + '°';
        });

        document.getElementById('speed').addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('scale').addEventListener('input', (e) => {
            this.settings.scale = parseInt(e.target.value);
            document.getElementById('scale-value').textContent = e.target.value;
        });

        document.getElementById('lineWidth').addEventListener('input', (e) => {
            this.settings.lineWidth = parseFloat(e.target.value);
            document.getElementById('lineWidth-value').textContent = e.target.value;
        });

        document.getElementById('trailLength').addEventListener('input', (e) => {
            this.settings.trailLength = parseInt(e.target.value);
            document.getElementById('trailLength-value').textContent = e.target.value;
        });

        document.getElementById('colorShift').addEventListener('change', (e) => {
            this.settings.colorShift = e.target.checked;
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.time = 0;
        this.points = [];
    }

    animate() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate Lissajous curve point
        const t = this.time * 0.01 * this.settings.speed;
        const deltaRad = this.settings.delta * (Math.PI / 180);

        const x = this.canvas.width / 2 +
                  this.settings.scale * Math.sin(this.settings.a * t + deltaRad);
        const y = this.canvas.height / 2 +
                  this.settings.scale * Math.sin(this.settings.b * t);

        // Add point to trail
        this.points.push({ x, y, time: this.time });

        // Remove old points
        if (this.points.length > this.settings.trailLength) {
            this.points.shift();
        }

        // Draw the curve
        if (this.points.length > 1) {
            for (let i = 1; i < this.points.length; i++) {
                const alpha = i / this.points.length;

                if (this.settings.colorShift) {
                    const hue = (this.time + i) % 360;
                    this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
                } else {
                    const r = parseInt(this.settings.color.substr(1, 2), 16);
                    const g = parseInt(this.settings.color.substr(3, 2), 16);
                    const b = parseInt(this.settings.color.substr(5, 2), 16);
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                }

                this.ctx.lineWidth = this.settings.lineWidth * alpha;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
                this.ctx.lineTo(this.points[i].x, this.points[i].y);
                this.ctx.stroke();
            }
        }

        // Draw current point
        if (this.settings.colorShift) {
            const hue = this.time % 360;
            this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        } else {
            this.ctx.fillStyle = this.settings.color;
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.settings.lineWidth * 2, 0, Math.PI * 2);
        this.ctx.fill();

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
        this.points = [];
        this.time = 0;
    }
}
