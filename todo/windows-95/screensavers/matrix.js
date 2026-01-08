// Matrix Rain Screensaver
class MatrixScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.columns = [];
        this.fontSize = 16;
        this.chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890'.split('');
        this.speed = 50;
    }

    init() {
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        this.columns = [];
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 0.5 + 0.5
            });
        }
    }

    start(options = {}) {
        this.fontSize = options.fontSize || 16;
        this.speed = options.speed || 50;
        this.init();
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0f0';
        this.ctx.font = `${this.fontSize}px monospace`;

        this.columns.forEach((column, i) => {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;

            this.ctx.fillText(char, x, column.y);

            column.y += this.fontSize * column.speed;

            if (column.y > this.canvas.height && Math.random() > 0.975) {
                column.y = 0;
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
            fontSize: { type: 'range', label: 'Font Size', min: 10, max: 24, default: 16 },
            speed: { type: 'range', label: 'Speed', min: 20, max: 100, default: 50 }
        };
    }
}

window.MatrixScreensaver = MatrixScreensaver;