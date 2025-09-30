// Bouncing Logo Screensaver
class LogoScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.x = 0;
        this.y = 0;
        this.dx = 3;
        this.dy = 2;
        this.hue = 0;
        this.text = 'Windows 95';
        this.fontSize = 40;
    }

    start(options = {}) {
        this.text = options.text || 'Windows 95';
        this.fontSize = options.fontSize || 40;
        this.dx = options.speed || 3;
        this.dy = this.dx * 0.67;
        this.x = Math.random() * (this.canvas.width - 200);
        this.y = Math.random() * (this.canvas.height - 100);
        this.hue = Math.random() * 360;
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.x += this.dx;
        this.y += this.dy;

        const textWidth = this.ctx.measureText(this.text).width;
        const textHeight = this.fontSize;

        if (this.x <= 0 || this.x >= this.canvas.width - textWidth) {
            this.dx = -this.dx;
            this.hue = (this.hue + 60) % 360;
        }
        if (this.y <= 0 || this.y >= this.canvas.height - textHeight) {
            this.dy = -this.dy;
            this.hue = (this.hue + 60) % 360;
        }

        this.ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        this.ctx.font = `bold ${this.fontSize}px Arial`;
        this.ctx.fillText(this.text, this.x, this.y + this.fontSize);

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    getSettings() {
        return {
            text: { type: 'text', label: 'Text', default: 'Windows 95' },
            fontSize: { type: 'range', label: 'Font Size', min: 20, max: 80, default: 40 },
            speed: { type: 'range', label: 'Speed', min: 1, max: 8, default: 3 }
        };
    }
}

window.LogoScreensaver = LogoScreensaver;