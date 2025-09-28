// Paint App for Windows 95 Simulator

class Paint {
    constructor(container) {
        this.container = container;
        this.painting = false;
        this.currentTool = 'brush';
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="background: #c0c0c0; height: 100%; font-family: 'MS Sans Serif', sans-serif; display: flex; flex-direction: column;">
                <div class="paint-toolbar" style="background: #c0c0c0; border-bottom: 1px solid #808080; padding: 4px; display: flex; gap: 4px;">
                    <div class="paint-tool active" data-tool="brush" onclick="selectPaintTool('brush')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px inset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Brush">🖌️</div>
                    <div class="paint-tool" data-tool="eraser" onclick="selectPaintTool('eraser')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Eraser">🧽</div>
                    <div class="paint-tool" data-tool="clear" onclick="clearPaintCanvas()" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Clear">🗑️</div>
                </div>
                <div class="paint-workarea" style="flex: 1; padding: 4px;">
                    <canvas class="paint-canvas" id="paintCanvas" style="border: 1px inset #c0c0c0; cursor: crosshair; background: white; display: block; width: 100%; height: 100%;"></canvas>
                </div>
            </div>
        `;

        this.initCanvas();
    }

    initCanvas() {
        const canvas = this.container.querySelector('#paintCanvas');
        const ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.ctx = ctx;

        const resizeCanvas = () => {
            const parent = this.container.querySelector('.paint-workarea');
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(100, Math.floor(parent.clientWidth));
            const height = Math.max(100, Math.floor(parent.clientHeight));
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // White background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.beginPath();
        };

        // Initial size and on resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousedown', (e) => this.startPaint(e));
        canvas.addEventListener('mousemove', (e) => this.paint(e));
        canvas.addEventListener('mouseup', () => this.stopPaint());
        canvas.addEventListener('mouseout', () => this.stopPaint());

        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    selectTool(tool) {
        this.currentTool = tool;
        // Update toolbar state within this app container
        this.container.querySelectorAll('.paint-tool').forEach(t => {
            t.style.border = '1px outset #c0c0c0';
            t.classList.remove('active');
            if (t.dataset.tool === tool) {
                t.style.border = '1px inset #c0c0c0';
                t.classList.add('active');
            }
        });
    }

    startPaint(e) {
        this.painting = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    paint(e) {
        if (!this.painting) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineWidth = this.currentTool === 'eraser' ? 12 : 2;
        this.ctx.lineCap = 'round';
        this.ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.strokeStyle = '#000000';

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopPaint() {
        this.painting = false;
        if (this.ctx) {
            this.ctx.closePath();
            this.ctx.beginPath();
        }
    }

    clearCanvas() {
        if (!this.canvas || !this.ctx) return;
        // Clear to white and reset path
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = 'white';
        // Use CSS pixel size (style width/height)
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.fillRect(0, 0, rect.width, rect.height);
        this.ctx.restore();
        this.ctx.beginPath();
    }
}

// Global paint instance
let paint;

// Global functions
function selectPaintTool(tool) {
    if (paint) paint.selectTool(tool);
}

function clearPaintCanvas() {
    if (paint) paint.clearCanvas();
}
