// Fractal Tree Generative Art

export default class FractalTree {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.time = 0;

        // Fractal tree specific settings
        this.settings = {
            depth: 10,
            branchAngle: 25,
            branchLength: 100,
            branchRatio: 0.7,
            thickness: 8,
            windStrength: 0,
            colorful: false,
            color: '#8b4513'
        };
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Depth: <span id="depth-value">${this.settings.depth}</span></label>
                <input type="range" id="depth" min="3" max="15" step="1" value="${this.settings.depth}">
            </div>
            <div class="control-group">
                <label>Branch Angle: <span id="branchAngle-value">${this.settings.branchAngle}°</span></label>
                <input type="range" id="branchAngle" min="10" max="60" step="1" value="${this.settings.branchAngle}">
            </div>
            <div class="control-group">
                <label>Branch Length: <span id="branchLength-value">${this.settings.branchLength}</span></label>
                <input type="range" id="branchLength" min="50" max="200" step="10" value="${this.settings.branchLength}">
            </div>
            <div class="control-group">
                <label>Branch Ratio: <span id="branchRatio-value">${this.settings.branchRatio}</span></label>
                <input type="range" id="branchRatio" min="0.5" max="0.9" step="0.05" value="${this.settings.branchRatio}">
            </div>
            <div class="control-group">
                <label>Thickness: <span id="thickness-value">${this.settings.thickness}</span></label>
                <input type="range" id="thickness" min="1" max="15" step="1" value="${this.settings.thickness}">
            </div>
            <div class="control-group">
                <label>Wind: <span id="windStrength-value">${this.settings.windStrength}</span></label>
                <input type="range" id="windStrength" min="0" max="10" step="0.5" value="${this.settings.windStrength}">
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="colorful" ${this.settings.colorful ? 'checked' : ''}>
                    Colorful Branches
                </label>
            </div>
            <div class="control-group">
                <label>Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('depth').addEventListener('input', (e) => {
            this.settings.depth = parseInt(e.target.value);
            document.getElementById('depth-value').textContent = e.target.value;
        });

        document.getElementById('branchAngle').addEventListener('input', (e) => {
            this.settings.branchAngle = parseInt(e.target.value);
            document.getElementById('branchAngle-value').textContent = e.target.value + '°';
        });

        document.getElementById('branchLength').addEventListener('input', (e) => {
            this.settings.branchLength = parseInt(e.target.value);
            document.getElementById('branchLength-value').textContent = e.target.value;
        });

        document.getElementById('branchRatio').addEventListener('input', (e) => {
            this.settings.branchRatio = parseFloat(e.target.value);
            document.getElementById('branchRatio-value').textContent = e.target.value;
        });

        document.getElementById('thickness').addEventListener('input', (e) => {
            this.settings.thickness = parseInt(e.target.value);
            document.getElementById('thickness-value').textContent = e.target.value;
        });

        document.getElementById('windStrength').addEventListener('input', (e) => {
            this.settings.windStrength = parseFloat(e.target.value);
            document.getElementById('windStrength-value').textContent = e.target.value;
        });

        document.getElementById('colorful').addEventListener('change', (e) => {
            this.settings.colorful = e.target.checked;
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.time = 0;
    }

    drawBranch(x, y, length, angle, depth) {
        if (depth === 0) return;

        // Add wind effect
        const windEffect = Math.sin(this.time * 0.01 + angle) * this.settings.windStrength * 0.01;
        const actualAngle = angle + windEffect;

        // Calculate end point
        const x2 = x + length * Math.cos(actualAngle);
        const y2 = y + length * Math.sin(actualAngle);

        // Set color based on depth
        if (this.settings.colorful) {
            const hue = (depth / this.settings.depth) * 120 + 100; // From yellow/green to brown
            this.ctx.strokeStyle = `hsl(${hue}, 60%, 50%)`;
        } else {
            const r = parseInt(this.settings.color.substr(1, 2), 16);
            const g = parseInt(this.settings.color.substr(3, 2), 16);
            const b = parseInt(this.settings.color.substr(5, 2), 16);
            const alpha = 0.5 + (depth / this.settings.depth) * 0.5;
            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // Set line width based on depth
        this.ctx.lineWidth = (depth / this.settings.depth) * this.settings.thickness;
        this.ctx.lineCap = 'round';

        // Draw branch
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Recursively draw child branches
        const newLength = length * this.settings.branchRatio;
        const angleRad = this.settings.branchAngle * (Math.PI / 180);

        this.drawBranch(x2, y2, newLength, actualAngle - angleRad, depth - 1);
        this.drawBranch(x2, y2, newLength, actualAngle + angleRad, depth - 1);
    }

    animate() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw tree from bottom center
        const startX = this.canvas.width / 2;
        const startY = this.canvas.height - 50;
        const startAngle = -Math.PI / 2; // Point upward

        this.drawBranch(
            startX,
            startY,
            this.settings.branchLength,
            startAngle,
            this.settings.depth
        );

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
