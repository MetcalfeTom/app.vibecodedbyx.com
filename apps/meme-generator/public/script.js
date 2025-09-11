/* ARRR! CLIENT-SIDE MEME FORGE */
(function(){
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d');
  const imgInput = document.getElementById('imageInput');
  const topText = document.getElementById('topText');
  const bottomText = document.getElementById('bottomText');
  const fontSize = document.getElementById('fontSize');
  const strokeWidth = document.getElementById('strokeWidth');
  const downloadBtn = document.getElementById('downloadBtn');

  let img = new Image();
  let imgLoaded = false;

  function fitCanvasToImage(image) {
    const maxSide = 1000;
    let w = image.width;
    let h = image.height;
    const ratio = Math.min(maxSide / w, maxSide / h, 1);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
  }

  function drawMeme() {
    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imgLoaded) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    const size = parseInt(fontSize.value, 10) || 48;
    const stroke = parseInt(strokeWidth.value, 10) || 6;
    const pad = Math.max(12, Math.round(size * 0.35));

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = stroke;

    const face = 'Impact, Haettenschweiler, \"Arial Black\", sans-serif';
    ctx.font = `bold ${size}px ${face}`;
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 2;

    // Draw top text
    if (topText.value.trim()) {
      wrapAndDrawText(topText.value.toUpperCase(), canvas.width/2, pad, 'top');
    }
    // Draw bottom text
    if (bottomText.value.trim()) {
      wrapAndDrawText(bottomText.value.toUpperCase(), canvas.width/2, canvas.height - pad, 'bottom');
    }
  }

  function wrapAndDrawText(text, x, y, vertical) {
    const maxWidth = canvas.width * 0.9;
    const lines = [];
    const words = text.split(/\s+/);
    let line = '';
    for (let i=0;i<words.length;i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      const w = ctx.measureText(test).width;
      if (w > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const metrics = ctx.measureText('M');
    const lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 6;

    if (vertical === 'bottom') {
      y -= (lines.length - 1) * lineHeight;
      ctx.textBaseline = 'alphabetic';
    } else {
      ctx.textBaseline = 'top';
    }

    for (let i = 0; i < lines.length; i++) {
      const yy = vertical === 'bottom' ? y + i * lineHeight : y + i * lineHeight;
      ctx.strokeText(lines[i], x, yy);
      ctx.fillText(lines[i], x, yy);
    }
  }

  imgInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newImg = new Image();
    newImg.onload = () => {
      img = newImg;
      imgLoaded = true;
      fitCanvasToImage(img);
      drawMeme();
      URL.revokeObjectURL(url);
    };
    newImg.onerror = () => {
      imgLoaded = false;
      drawMeme();
    };
    newImg.src = url;
  });

  [topText, bottomText, fontSize, strokeWidth].forEach(el => {
    el.addEventListener('input', drawMeme);
  });

  downloadBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = 'pirate-meme.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  });

  // Initial render
  drawMeme();
})();

