export function initTranslator({ inputEl, buttonEl, outputEl, beep }) {
  if (!inputEl || !buttonEl || !outputEl) return;
  function toAbsurdAlien(str){ return str
    .replace(/[aeiou]/gi, m => ({a:'æ', e:'ξ', i:'¡', o:'ø', u:'µ', A:'Æ', E:'Ξ', I:'Ǐ', O:'Ø', U:'Ū'}[m]||m))
    .split('').map((c,i)=> (i%5===0?'¤':'') + c).join(''); }
  buttonEl.addEventListener('click', ()=>{
    const src = inputEl.value.trim();
    if(!src){ outputEl.textContent = '…'; return; }
    outputEl.textContent = toAbsurdAlien(src) + ' ∷ ✅';
    if (beep) beep(660,.06,'triangle');
  });
}

