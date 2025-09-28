// Paint App for Windows 95 Simulator

class Paint {
    constructor(container) {
        this.container = container;
        this.painting = false;
        this.currentTool = 'brush';
        this.init();
    }

    init() {
        // Defaults
        this.color = '#000000';
        this.brushSize = 2;
        this.hardEdges = true; // prefer crisp edges

        this.container.innerHTML = `
            <div style="background: #c0c0c0; height: 100%; font-family: 'MS Sans Serif', sans-serif; display: flex; flex-direction: column;">
                <div class="paint-toolbar" style="background: #c0c0c0; border-bottom: 1px solid #808080; padding: 4px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                    <div class="paint-tool active" data-tool="brush" onclick="selectPaintTool('brush')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px inset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Brush">🖌️</div>
                    <div class="paint-tool" data-tool="eraser" onclick="selectPaintTool('eraser')" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Eraser">🧽</div>
                    <div class="paint-tool" data-tool="clear" onclick="clearPaintCanvas()" style="width: 24px; height: 24px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none;" title="Clear">🗑️</div>

                    <div style="width:1px; height:20px; background:#808080; margin: 0 4px;"></div>

                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="font-size:11px;">Color:</div>
                        <div class="paint-color" data-color="#000000" onclick="selectPaintColor('#000000')" title="#000000" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#000000;"></div>
                        <div class="paint-color" data-color="#ffffff" onclick="selectPaintColor('#ffffff')" title="#ffffff" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#ffffff;"></div>
                        <div class="paint-color" data-color="#ff0000" onclick="selectPaintColor('#ff0000')" title="#ff0000" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#ff0000;"></div>
                        <div class="paint-color" data-color="#ffa500" onclick="selectPaintColor('#ffa500')" title="#ffa500" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#ffa500;"></div>
                        <div class="paint-color" data-color="#ffff00" onclick="selectPaintColor('#ffff00')" title="#ffff00" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#ffff00;"></div>
                        <div class="paint-color" data-color="#00ff00" onclick="selectPaintColor('#00ff00')" title="#00ff00" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#00ff00;"></div>
                        <div class="paint-color" data-color="#00ffff" onclick="selectPaintColor('#00ffff')" title="#00ffff" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#00ffff;"></div>
                        <div class="paint-color" data-color="#0000ff" onclick="selectPaintColor('#0000ff')" title="#0000ff" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#0000ff;"></div>
                        <div class="paint-color" data-color="#ff00ff" onclick="selectPaintColor('#ff00ff')" title="#ff00ff" style="width:16px; height:16px; border:1px inset #c0c0c0; background:#ff00ff;"></div>
                        <div style="width:1px; height:16px; background:#808080;"></div>
                        <div id="paint-current-color" style="width:18px; height:18px; border:2px inset #c0c0c0; background:#000000;" title="Current Color"></div>
                    </div>

                    <div style="width:1px; height:20px; background:#808080; margin: 0 4px;"></div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="font-size:11px;">Brush:</div>
                        <button class="paint-size" data-size="1" onclick="selectBrushSize(1)" style="width:24px; height:20px; border:2px outset #c0c0c0; background:#c0c0c0; cursor:pointer; font-size:10px;">1</button>
                        <button class="paint-size" data-size="3" onclick="selectBrushSize(3)" style="width:24px; height:20px; border:2px outset #c0c0c0; background:#c0c0c0; cursor:pointer; font-size:10px;">3</button>
                        <button class="paint-size" data-size="6" onclick="selectBrushSize(6)" style="width:24px; height:20px; border:2px outset #c0c0c0; background:#c0c0c0; cursor:pointer; font-size:10px;">6</button>
                        <button class="paint-size" data-size="10" onclick="selectBrushSize(10)" style="width:28px; height:20px; border:2px outset #c0c0c0; background:#c0c0c0; cursor:pointer; font-size:10px;">10</button>
                    </div>
                </div>
                <div class="paint-workarea" style="flex: 1; padding: 4px;">
                    <canvas class="paint-canvas" id="paintCanvas" style="border: 1px inset #c0c0c0; cursor: crosshair; background: white; display: block; width: 100%; height: 100%; image-rendering: pixelated;"></canvas>
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
        // Prefer crisp rendering
        ctx.imageSmoothingEnabled = false;

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
        // Snap to whole pixels for crisp edges
        const px = this.hardEdges ? Math.round(x) + 0.5 : x;
        const py = this.hardEdges ? Math.round(y) + 0.5 : y;
        this.ctx.moveTo(px, py);
    }

    paint(e) {
        if (!this.painting) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineWidth = this.currentTool === 'eraser' ? Math.max(8, this.brushSize * 2) : this.brushSize;
        this.ctx.lineCap = this.hardEdges ? 'butt' : 'round';
        this.ctx.lineJoin = this.hardEdges ? 'miter' : 'round';
        this.ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.strokeStyle = this.color;

        const px = this.hardEdges ? Math.round(x) + 0.5 : x;
        const py = this.hardEdges ? Math.round(y) + 0.5 : y;
        this.ctx.lineTo(px, py);
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

// Global helpers for color and size
function selectPaintColor(color) {
    if (!paint) return;
    paint.color = color;
    const swatch = paint.container.querySelector('#paint-current-color');
    if (swatch) swatch.style.background = color;
}

function selectBrushSize(size) {
    if (!paint) return;
    paint.brushSize = Number(size) || 2;
    // Update button visual
    paint.container.querySelectorAll('.paint-size').forEach(btn => {
        if (Number(btn.dataset.size) === paint.brushSize) {
            btn.style.border = '2px inset #c0c0c0';
        } else {
            btn.style.border = '2px outset #c0c0c0';
        }
    });
}
