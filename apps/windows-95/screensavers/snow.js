// Snow Screensaver
class SnowScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.flakes = [];
        this.numFlakes = 200;
        this.wind = 0;
    }

    init() {
        this.flakes = [];
        for (let i = 0; i < this.numFlakes; i++) {
            this.flakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 0.5,
                drift: Math.random() * 2 - 1
            });
        }
    }

    start(options = {}) {
        this.numFlakes = options.numFlakes || 200;
        this.wind = options.wind || 0;
        this.ctx.fillStyle = '#001133';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 17, 51, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.flakes.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift + this.wind;

            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }

            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

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
            numFlakes: { type: 'range', label: 'Number of Flakes', min: 50, max: 500, step: 50, default: 200 },
            wind: { type: 'range', label: 'Wind', min: -3, max: 3, step: 0.5, default: 0 }
        };
    }
}

window.SnowScreensaver = SnowScreensaver;