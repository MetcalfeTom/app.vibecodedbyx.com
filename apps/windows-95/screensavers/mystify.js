// Mystify (Polygon Lines) Screensaver
class MystifyScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.polygons = [];
        this.numPolygons = 2;
        this.numPoints = 4;
        this.speed = 2;
    }

    init() {
        this.polygons = [];
        for (let i = 0; i < this.numPolygons; i++) {
            const polygon = {
                points: [],
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                hue: Math.random() * 360
            };

            for (let j = 0; j < this.numPoints; j++) {
                polygon.points.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    dx: (Math.random() - 0.5) * this.speed * 2,
                    dy: (Math.random() - 0.5) * this.speed * 2
                });
            }

            this.polygons.push(polygon);
        }
    }

    start(options = {}) {
        this.numPolygons = options.numPolygons || 2;
        this.numPoints = options.numPoints || 4;
        this.speed = options.speed || 2;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
        this.animate();
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.polygons.forEach(polygon => {
            polygon.points.forEach(point => {
                point.x += point.dx;
                point.y += point.dy;

                if (point.x <= 0 || point.x >= this.canvas.width) {
                    point.dx = -point.dx;
                    polygon.hue = (polygon.hue + 30) % 360;
                }
                if (point.y <= 0 || point.y >= this.canvas.height) {
                    point.dy = -point.dy;
                    polygon.hue = (polygon.hue + 30) % 360;
                }
            });

            this.ctx.strokeStyle = `hsl(${polygon.hue}, 100%, 50%)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
            for (let i = 1; i < polygon.points.length; i++) {
                this.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
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
            numPolygons: { type: 'range', label: 'Number of Shapes', min: 1, max: 5, default: 2 },
            numPoints: { type: 'range', label: 'Points per Shape', min: 3, max: 8, default: 4 },
            speed: { type: 'range', label: 'Speed', min: 1, max: 5, default: 2 }
        };
    }
}

window.MystifyScreensaver = MystifyScreensaver;