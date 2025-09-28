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
                    <div class="paint-tool active" onclick="selectPaintTool('brush')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px inset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Brush">🖌️</div>
                    <div class="paint-tool" onclick="selectPaintTool('eraser')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Eraser">🧽</div>
                    <div class="paint-tool" onclick="clearPaintCanvas()" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Clear">🗑️</div>
                </div>
                <div style="flex: 1; padding: 4px;">
                    <canvas class="paint-canvas" id="paintCanvas" width="580" height="380" style="border: 1px inset #c0c0c0; cursor: crosshair; background: white; display: block;"></canvas>
                </div>
            </div>
        `;

        this.initCanvas();
    }

    initCanvas() {
        const canvas = document.getElementById('paintCanvas');
        const ctx = canvas.getContext('2d');

        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        document.querySelectorAll('.paint-tool').forEach(t => {
            t.style.border = '1px outset #c0c0c0';
            t.classList.remove('active');
        });
        event.target.style.border = '1px inset #c0c0c0';
        event.target.classList.add('active');
    }

    startPaint(e) {
        this.painting = true;
        this.paint(e);
    }

    paint(e) {
        if (!this.painting) return;

        const canvas = e.target;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = this.currentTool === 'eraser' ? 10 : 2;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = '#000000';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    stopPaint() {
        this.painting = false;
        const canvas = document.getElementById('paintCanvas');
        if (canvas) {
            canvas.getContext('2d').beginPath();
        }
    }

    clearCanvas() {
        const canvas = document.getElementById('paintCanvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Global paint instance (scoped to avoid collisions)
let windows95Paint;

// Global functions
function selectPaintTool(tool) {
    if (windows95Paint) windows95Paint.selectTool(tool);
}

function clearPaintCanvas() {
    if (windows95Paint) windows95Paint.clearCanvas();
}
