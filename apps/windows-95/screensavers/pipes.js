// 3D Pipes Screensaver
class PipesScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.pipes = [];
        this.maxPipes = 3;
        this.pipeWidth = 20;
        this.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    }

    init() {
        this.pipes = [];
        for (let i = 0; i < this.maxPipes; i++) {
            this.pipes.push(this.createPipe());
        }
    }

    createPipe() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            direction: Math.floor(Math.random() * 4), // 0=up, 1=right, 2=down, 3=left
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            segments: []
        };
    }

    start(options = {}) {
        this.maxPipes = options.numPipes || 3;
        this.pipeWidth = options.pipeWidth || 20;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
        this.animate();
    }

    animate() {
        this.pipes.forEach(pipe => {
            if (Math.random() < 0.05) {
                pipe.direction = Math.floor(Math.random() * 4);
            }

            const segmentLength = 10;
            let newX = pipe.x;
            let newY = pipe.y;

            switch (pipe.direction) {
                case 0: newY -= segmentLength; break;
                case 1: newX += segmentLength; break;
                case 2: newY += segmentLength; break;
                case 3: newX -= segmentLength; break;
            }

            if (newX < 0 || newX > this.canvas.width || newY < 0 || newY > this.canvas.height) {
                Object.assign(pipe, this.createPipe());
                return;
            }

            this.ctx.strokeStyle = pipe.color;
            this.ctx.lineWidth = this.pipeWidth;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(pipe.x, pipe.y);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();

            // Draw joint
            this.ctx.fillStyle = pipe.color;
            this.ctx.beginPath();
            this.ctx.arc(pipe.x, pipe.y, this.pipeWidth / 2, 0, Math.PI * 2);
            this.ctx.fill();

            pipe.x = newX;
            pipe.y = newY;
            pipe.segments.push({ x: newX, y: newY });

            if (pipe.segments.length > 100) {
                pipe.segments.shift();
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
            numPipes: { type: 'range', label: 'Number of Pipes', min: 1, max: 5, default: 3 },
            pipeWidth: { type: 'range', label: 'Pipe Width', min: 10, max: 40, default: 20 }
        };
    }
}

window.PipesScreensaver = PipesScreensaver;