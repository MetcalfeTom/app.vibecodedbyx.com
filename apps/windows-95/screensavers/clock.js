// Digital Clock Screensaver
class ClockScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.x = 0;
        this.y = 0;
        this.dx = 1;
        this.dy = 1;
        this.show24Hour = false;
        this.showSeconds = true;
        this.color = '#00ff00';
    }

    start(options = {}) {
        this.show24Hour = options.show24Hour || false;
        this.showSeconds = options.showSeconds !== false;
        this.color = options.color || '#00ff00';
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        let timeStr;
        if (this.show24Hour) {
            timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            timeStr = `${hours}:${minutes} ${ampm}`;
        }

        if (this.showSeconds) {
            timeStr = timeStr.replace(' ', `:${seconds} `);
            if (this.show24Hour) timeStr += `:${seconds}`;
        }

        this.ctx.font = 'bold 72px monospace';
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Shadow
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 20;
        this.ctx.fillText(timeStr, this.x, this.y);
        this.ctx.shadowBlur = 0;

        // Date
        const dateStr = now.toLocaleDateString();
        this.ctx.font = '24px sans-serif';
        this.ctx.fillText(dateStr, this.x, this.y + 60);

        // Move clock position
        this.x += this.dx;
        this.y += this.dy;

        const textWidth = this.ctx.measureText(timeStr).width;
        if (this.x - textWidth / 2 <= 0 || this.x + textWidth / 2 >= this.canvas.width) {
            this.dx = -this.dx;
        }
        if (this.y - 100 <= 0 || this.y + 100 >= this.canvas.height) {
            this.dy = -this.dy;
        }

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
            show24Hour: { type: 'checkbox', label: '24-Hour Format', default: false },
            showSeconds: { type: 'checkbox', label: 'Show Seconds', default: true },
            color: { type: 'color', label: 'Color', options: ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'], default: '#00ff00' }
        };
    }
}

window.ClockScreensaver = ClockScreensaver;