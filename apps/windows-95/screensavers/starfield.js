// Starfield Screensaver
class StarfieldScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.stars = [];
        this.numStars = 200;
        this.speed = 2;
    }

    init() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width - this.canvas.width / 2,
                y: Math.random() * this.canvas.height - this.canvas.height / 2,
                z: Math.random() * this.canvas.width
            });
        }
    }

    start(options = {}) {
        this.speed = options.speed || 2;
        this.numStars = options.numStars || 200;
        this.init();
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.stars.forEach(star => {
            star.z -= this.speed;
            if (star.z <= 0) {
                star.z = this.canvas.width;
                star.x = Math.random() * this.canvas.width - cx;
                star.y = Math.random() * this.canvas.height - cy;
            }

            const k = 128 / star.z;
            const px = star.x * k + cx;
            const py = star.y * k + cy;

            if (px >= 0 && px <= this.canvas.width && py >= 0 && py <= this.canvas.height) {
                const size = (1 - star.z / this.canvas.width) * 3;
                const brightness = (1 - star.z / this.canvas.width) * 255;
                this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                this.ctx.fillRect(px, py, size, size);
            }
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
            speed: { type: 'range', label: 'Speed', min: 1, max: 5, default: 2 },
            numStars: { type: 'range', label: 'Number of Stars', min: 50, max: 500, step: 50, default: 200 }
        };
    }
}

window.StarfieldScreensaver = StarfieldScreensaver;