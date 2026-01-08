// Bubbles Screensaver
class BubblesScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.bubbles = [];
        this.maxBubbles = 30;
        this.spawnRate = 0.3;
    }

    init() {
        this.bubbles = [];
    }

    start(options = {}) {
        this.maxBubbles = options.maxBubbles || 30;
        this.spawnRate = options.spawnRate || 0.3;
        this.ctx.fillStyle = '#001a33';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 26, 51, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Spawn new bubbles
        if (this.bubbles.length < this.maxBubbles && Math.random() < this.spawnRate) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 20,
                radius: Math.random() * 30 + 10,
                speed: Math.random() * 2 + 1,
                drift: (Math.random() - 0.5) * 2,
                hue: Math.random() * 60 + 180 // Blue-green range
            });
        }

        // Update and draw bubbles
        this.bubbles = this.bubbles.filter(bubble => {
            bubble.y -= bubble.speed;
            bubble.x += Math.sin(bubble.y * 0.01) * bubble.drift;

            if (bubble.y + bubble.radius < 0) {
                return false;
            }

            // Draw bubble
            const gradient = this.ctx.createRadialGradient(
                bubble.x - bubble.radius * 0.3,
                bubble.y - bubble.radius * 0.3,
                0,
                bubble.x,
                bubble.y,
                bubble.radius
            );
            gradient.addColorStop(0, `hsla(${bubble.hue}, 70%, 80%, 0.8)`);
            gradient.addColorStop(0.5, `hsla(${bubble.hue}, 70%, 50%, 0.4)`);
            gradient.addColorStop(1, `hsla(${bubble.hue}, 70%, 30%, 0.2)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();

            return true;
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
            maxBubbles: { type: 'range', label: 'Max Bubbles', min: 10, max: 50, default: 30 },
            spawnRate: { type: 'range', label: 'Spawn Rate', min: 0.1, max: 1, step: 0.1, default: 0.3 }
        };
    }
}

window.BubblesScreensaver = BubblesScreensaver;