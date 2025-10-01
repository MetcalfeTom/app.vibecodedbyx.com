// Circle Packing Generative Art

export default class CirclePacking {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.circles = [];
        this.animationId = null;

        // Circle packing specific settings
        this.settings = {
            maxCircles: 500,
            minRadius: 2,
            maxRadius: 80,
            growthRate: 0.5,
            strokeOnly: false,
            colorful: true,
            color: '#ff6b6b'
        };

        this.attemptCount = 0;
        this.maxAttempts = 5000;
    }

    getControls() {
        return `
            <div class="control-group">
                <label>Max Circles: <span id="maxCircles-value">${this.settings.maxCircles}</span></label>
                <input type="range" id="maxCircles" min="100" max="1000" step="50" value="${this.settings.maxCircles}">
            </div>
            <div class="control-group">
                <label>Min Radius: <span id="minRadius-value">${this.settings.minRadius}</span></label>
                <input type="range" id="minRadius" min="1" max="10" step="1" value="${this.settings.minRadius}">
            </div>
            <div class="control-group">
                <label>Max Radius: <span id="maxRadius-value">${this.settings.maxRadius}</span></label>
                <input type="range" id="maxRadius" min="20" max="200" step="10" value="${this.settings.maxRadius}">
            </div>
            <div class="control-group">
                <label>Growth Rate: <span id="growthRate-value">${this.settings.growthRate}</span></label>
                <input type="range" id="growthRate" min="0.1" max="2" step="0.1" value="${this.settings.growthRate}">
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="strokeOnly" ${this.settings.strokeOnly ? 'checked' : ''}>
                    Outline Only
                </label>
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="colorful" ${this.settings.colorful ? 'checked' : ''}>
                    Colorful
                </label>
            </div>
            <div class="control-group">
                <label>Base Color</label>
                <input type="color" id="color" value="${this.settings.color}">
            </div>
        `;
    }

    attachListeners() {
        document.getElementById('maxCircles').addEventListener('input', (e) => {
            this.settings.maxCircles = parseInt(e.target.value);
            document.getElementById('maxCircles-value').textContent = e.target.value;
        });

        document.getElementById('minRadius').addEventListener('input', (e) => {
            this.settings.minRadius = parseInt(e.target.value);
            document.getElementById('minRadius-value').textContent = e.target.value;
        });

        document.getElementById('maxRadius').addEventListener('input', (e) => {
            this.settings.maxRadius = parseInt(e.target.value);
            document.getElementById('maxRadius-value').textContent = e.target.value;
        });

        document.getElementById('growthRate').addEventListener('input', (e) => {
            this.settings.growthRate = parseFloat(e.target.value);
            document.getElementById('growthRate-value').textContent = e.target.value;
        });

        document.getElementById('strokeOnly').addEventListener('change', (e) => {
            this.settings.strokeOnly = e.target.checked;
        });

        document.getElementById('colorful').addEventListener('change', (e) => {
            this.settings.colorful = e.target.checked;
        });

        document.getElementById('color').addEventListener('input', (e) => {
            this.settings.color = e.target.value;
        });
    }

    init() {
        this.circles = [];
        this.attemptCount = 0;
    }

    tryAddCircle() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const newCircle = new Circle(x, y, this.settings.minRadius, this.settings);

        let valid = true;
        for (let circle of this.circles) {
            const dist = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (dist < circle.r + newCircle.r) {
                valid = false;
                break;
            }
        }

        if (valid) {
            this.circles.push(newCircle);
        }
    }

    animate() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Try to add new circles
        if (this.circles.length < this.settings.maxCircles && this.attemptCount < this.maxAttempts) {
            for (let i = 0; i < 10; i++) {
                this.tryAddCircle();
                this.attemptCount++;
            }
        }

        // Grow and draw circles
        for (let circle of this.circles) {
            circle.grow(this.circles);
            circle.draw(this.ctx);
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
        this.circles = [];
        this.attemptCount = 0;
    }
}

class Circle {
    constructor(x, y, r, settings) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.settings = settings;
        this.growing = true;

        if (settings.colorful) {
            this.hue = Math.random() * 360;
        }
    }

    grow(circles) {
        if (this.growing) {
            // Check if we can grow
            let canGrow = true;

            // Check boundaries
            if (this.x - this.r <= 0 || this.x + this.r >= circles[0]?.settings?.canvas?.width ||
                this.y - this.r <= 0 || this.y + this.r >= circles[0]?.settings?.canvas?.height) {
                canGrow = false;
            }

            // Check other circles
            for (let other of circles) {
                if (other !== this) {
                    const dist = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
                    if (dist < this.r + other.r + 2) {
                        canGrow = false;
                        break;
                    }
                }
            }

            // Check max radius
            if (this.r >= this.settings.maxRadius) {
                canGrow = false;
            }

            if (canGrow) {
                this.r += this.settings.growthRate;
            } else {
                this.growing = false;
            }
        }
    }

    draw(ctx) {
        if (this.settings.colorful) {
            const alpha = this.growing ? 0.8 : 0.6;
            ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
            if (!this.settings.strokeOnly) {
                ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha * 0.3})`;
            }
        } else {
            const r = parseInt(this.settings.color.substr(1, 2), 16);
            const g = parseInt(this.settings.color.substr(3, 2), 16);
            const b = parseInt(this.settings.color.substr(5, 2), 16);
            const alpha = this.growing ? 0.8 : 0.6;

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            if (!this.settings.strokeOnly) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
            }
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        if (!this.settings.strokeOnly) {
            ctx.fill();
        }
        ctx.stroke();
    }
}
