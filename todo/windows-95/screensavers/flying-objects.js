// Flying Objects Screensaver - Inspired by After Dark's Flying Toasters
class FlyingObjectsScreensaver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.objects = [];
        this.maxObjects = 8;
        this.objectType = 'toaster';
        this.speed = 1;
    }

    init() {
        this.objects = [];
        for (let i = 0; i < this.maxObjects; i++) {
            this.objects.push(this.createObject());
        }
    }

    createObject() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 200,
            z: Math.random() * 100 + 50,
            speed: (Math.random() * 0.5 + 0.5) * this.speed,
            wingAngle: Math.random() * Math.PI * 2,
            wingSpeed: (Math.random() * 0.05 + 0.05)
        };
    }

    start(options = {}) {
        this.maxObjects = options.maxObjects || 8;
        this.objectType = options.objectType || 'toaster';
        this.speed = options.speed || 1;
        this.ctx.fillStyle = '#87ceeb'; // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.init();
        this.animate();
    }

    drawToaster(x, y, size, wingAngle) {
        const ctx = this.ctx;

        // Body (chrome toaster)
        const gradient = ctx.createLinearGradient(x - size/2, y, x + size/2, y);
        gradient.addColorStop(0, '#b8b8b8');
        gradient.addColorStop(0.5, '#e8e8e8');
        gradient.addColorStop(1, '#a0a0a0');

        ctx.fillStyle = gradient;
        ctx.fillRect(x - size/2, y - size/3, size, size * 0.6);

        // Slots
        ctx.fillStyle = '#333';
        const slotWidth = size * 0.15;
        ctx.fillRect(x - size/3, y - size/3, slotWidth, size * 0.5);
        ctx.fillRect(x + size/6, y - size/3, slotWidth, size * 0.5);

        // Toast popping out
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x - size/3 + 2, y - size/2, slotWidth - 4, size * 0.2);
        ctx.fillRect(x + size/6 + 2, y - size/2, slotWidth - 4, size * 0.2);

        // Wings
        this.drawWing(x - size/2, y, size * 0.4, wingAngle);
        this.drawWing(x + size/2, y, size * 0.4, wingAngle + Math.PI);
    }

    drawFloppy(x, y, size, wingAngle) {
        const ctx = this.ctx;

        // Floppy disk body (3.5" style)
        ctx.fillStyle = '#000';
        ctx.fillRect(x - size/2, y - size/2, size, size);

        // Metal shutter
        ctx.fillStyle = '#888';
        ctx.fillRect(x - size/2 + size * 0.1, y - size/2 + size * 0.6, size * 0.8, size * 0.25);

        // Label area
        ctx.fillStyle = '#fff';
        ctx.fillRect(x - size/2 + size * 0.15, y - size/2 + size * 0.15, size * 0.7, size * 0.35);

        // Label lines
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const ly = y - size/2 + size * 0.2 + i * size * 0.08;
            ctx.beginPath();
            ctx.moveTo(x - size/2 + size * 0.2, ly);
            ctx.lineTo(x + size/2 - size * 0.2, ly);
            ctx.stroke();
        }

        // Wings
        this.drawWing(x - size/2, y, size * 0.4, wingAngle);
        this.drawWing(x + size/2, y, size * 0.4, wingAngle + Math.PI);
    }

    drawMonitor(x, y, size, wingAngle) {
        const ctx = this.ctx;

        // CRT Monitor bezel
        ctx.fillStyle = '#d4d0c8';
        ctx.fillRect(x - size/2, y - size/2, size, size * 0.8);

        // Screen (green phosphor)
        ctx.fillStyle = '#0a0';
        ctx.fillRect(x - size/2 + size * 0.1, y - size/2 + size * 0.08, size * 0.8, size * 0.6);

        // Scanlines
        ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const ly = y - size/2 + size * 0.1 + i * size * 0.06;
            ctx.beginPath();
            ctx.moveTo(x - size/2 + size * 0.1, ly);
            ctx.lineTo(x + size/2 - size * 0.1, ly);
            ctx.stroke();
        }

        // "Windows 95" text on screen
        ctx.fillStyle = '#0f0';
        ctx.font = `${size * 0.12}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('Win95', x, y - size/4);

        // Power button
        ctx.fillStyle = '#080';
        ctx.beginPath();
        ctx.arc(x, y + size * 0.25, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        this.drawWing(x - size/2, y, size * 0.4, wingAngle);
        this.drawWing(x + size/2, y, size * 0.4, wingAngle + Math.PI);
    }

    drawWing(x, y, size, angle) {
        const ctx = this.ctx;
        const wingFlap = Math.sin(angle) * size * 0.3;

        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + size, y + wingFlap, x + size * 0.8, y - size * 0.6);
        ctx.quadraticCurveTo(x + size * 0.4, y - size * 0.8, x, y - size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Feather lines
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + size * 0.2 * i, y - size * 0.1 * i);
            ctx.lineTo(x + size * 0.6, y + wingFlap - size * 0.2);
            ctx.stroke();
        }
    }

    animate() {
        // Sky gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4a90d9');
        gradient.addColorStop(1, '#87ceeb');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        this.drawClouds();

        this.objects.forEach(obj => {
            // Move upward (flying)
            obj.y -= obj.speed;
            obj.x += Math.sin(obj.y * 0.01) * 0.5; // Slight horizontal drift
            obj.wingAngle += obj.wingSpeed;

            // Reset when off screen
            if (obj.y < -100) {
                obj.y = this.canvas.height + Math.random() * 200;
                obj.x = Math.random() * this.canvas.width;
            }

            // Calculate size based on z-depth
            const scale = obj.z / 100;
            const size = 60 * scale;

            // Draw object based on type
            switch (this.objectType) {
                case 'toaster':
                    this.drawToaster(obj.x, obj.y, size, obj.wingAngle);
                    break;
                case 'floppy':
                    this.drawFloppy(obj.x, obj.y, size, obj.wingAngle);
                    break;
                case 'monitor':
                    this.drawMonitor(obj.x, obj.y, size, obj.wingAngle);
                    break;
                case 'mixed':
                    const types = ['toaster', 'floppy', 'monitor'];
                    const type = types[Math.floor((obj.x + obj.y) % 3)];
                    if (type === 'toaster') this.drawToaster(obj.x, obj.y, size, obj.wingAngle);
                    else if (type === 'floppy') this.drawFloppy(obj.x, obj.y, size, obj.wingAngle);
                    else this.drawMonitor(obj.x, obj.y, size, obj.wingAngle);
                    break;
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawClouds() {
        // Simple cloud decorations
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const time = Date.now() * 0.0001;

        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width * 0.2 * i + time * 20) % this.canvas.width;
            const y = 50 + Math.sin(i * 2) * 40;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
            this.ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    getSettings() {
        return {
            maxObjects: { type: 'range', label: 'Number of Objects', min: 3, max: 15, default: 8 },
            objectType: {
                type: 'color',
                label: 'Object Type',
                options: ['toaster', 'floppy', 'monitor', 'mixed'],
                default: 'toaster'
            },
            speed: { type: 'range', label: 'Speed', min: 0.5, max: 3, step: 0.5, default: 1 }
        };
    }
}

window.FlyingObjectsScreensaver = FlyingObjectsScreensaver;