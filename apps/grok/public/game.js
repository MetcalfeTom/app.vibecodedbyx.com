const input = document.getElementById('prompt');
const btn = document.getElementById('grokBtn');
const out = document.getElementById('output');
const saveBtn = document.getElementById('saveBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const list = document.getElementById('savedList');
const undoEl = document.getElementById('undo');

function grok(text) {
  // Simple but slightly richer GROK:
  // - trims
  // - reports length and word count
  // - echoes upper/lower/title variants
  // - counts special keywords seen in pirate chat: WHAT'S, THIS, LOL, GO, MAKE, ADD, CAN, GROK
  const t = (text || '').trim();
  const words = t.length ? t.split(/\s+/).length : 0;
  const title = t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());

  const specials = ["WHAT'S", 'THIS', 'LOL', 'GO', 'MAKE', 'ADD', 'CAN', 'GROK'];
  const counts = Object.fromEntries(specials.map(s => [s, 0]));
  if (t) {
    const tokens = t.toUpperCase().match(/[^\s]+/g) || [];
    for (const tok of tokens) {
      if (counts.hasOwnProperty(tok)) counts[tok]++;
    }
  }
  const countsLine = specials.map(s => `${s}:${counts[s]}`).join(' ');

  return [
    `LEN:${t.length} WORDS:${words}`,
    `COUNTS => ${countsLine}`,
    `UPPER => ${t.toUpperCase()}`,
    `LOWER => ${t.toLowerCase()}`,
    `TITLE => ${title}`
  ].join('\n');
}

btn.addEventListener('click', () => {
  out.textContent = grok(input.value);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    btn.click();
  }
});

// Saved items (localStorage)
const KEY = 'grok:saved';
function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200))); // cap
}
// Undo state
let lastAction = null; // { type: 'single'|'all', items: string[]|string, index?: number }

function showUndo(message, onUndo) {
  undoEl.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = message;
  const btn = document.createElement('button');
  btn.textContent = 'Undo';
  btn.addEventListener('click', () => {
    onUndo();
    hideUndo();
  });
  undoEl.appendChild(span);
  undoEl.appendChild(btn);
  undoEl.hidden = false;
}
function hideUndo() {
  undoEl.hidden = true;
  undoEl.innerHTML = '';
}
function render() {
  const items = load();
  list.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = '(no saved items)';
    li.style.opacity = '0.7';
    list.appendChild(li);
    return;
  }
  items.forEach((txt, idx) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'txt';
    span.textContent = txt;
    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      const next = load();
      const removed = next.splice(idx, 1)[0];
      save(next);
      lastAction = { type: 'single', items: removed, index: idx };
      render();
      showUndo('Deleted 1 item.', () => {
        const cur = load();
        const at = Math.min(lastAction.index ?? 0, cur.length);
        cur.splice(at, 0, lastAction.items);
        save(cur);
        render();
      });
    });
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => {
      const curVal = txt;
      const nextVal = prompt('Edit item:', curVal);
      if (nextVal == null) return;
      const t = nextVal.trim();
      if (!t) return; // ignore empty edits
      const arr = load();
      arr[idx] = t;
      save(arr);
      render();
    });
    const grokBtnInline = document.createElement('button');
    grokBtnInline.textContent = 'Grok';
    grokBtnInline.addEventListener('click', () => {
      input.value = txt;
      btn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    li.appendChild(span);
    const right = document.createElement('span');
    right.appendChild(edit);
    right.appendChild(grokBtnInline);
    right.appendChild(del);
    li.appendChild(right);
    list.appendChild(li);
  });
}

saveBtn.addEventListener('click', () => {
  const t = (input.value || '').trim();
  if (!t) return;
  const items = load();
  items.unshift(t);
  save(items);
  render();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Delete all saved items?')) {
    const prev = load();
    save([]);
    render();
    lastAction = { type: 'all', items: prev };
    showUndo(`Deleted ${prev.length} item(s).`, () => {
      if (Array.isArray(lastAction.items)) {
        save(lastAction.items);
        render();
      }
    });
  }
});

render();

// Keyboard shortcuts: Ctrl+Enter (Grok), Ctrl+S (Add), Ctrl+Shift+D (Delete All)
document.addEventListener('keydown', (e) => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 'Enter') {
    e.preventDefault();
    btn.click();
  } else if (ctrl && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    saveBtn.click();
  } else if (ctrl && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
    e.preventDefault();
    clearAllBtn.click();
  }
});

// Prefill with a playful sample inspired by the harbor chatter
if (!input.value) {
  input.value = "WHAT'S THIS LOL GO MAKE ADD CAN GROK";
  out.textContent = grok(input.value);
}
