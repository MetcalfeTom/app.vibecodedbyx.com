/* ── Triple Cubed engine: board, scoring, move finder (no DOM) ── */
var TC = (function () {
  var N = 15, MID = 7, RACK = 7, BINGO = 50;
  var VAL = { a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10 };
  /* T triple word · D double word · t triple letter · d double letter · * start (double word): the classic board.
     Each edge has three triples, at both corners and the middle: one 15-letter word along an edge covers all three = ×27 */
  var LAYOUT = [
    'T..d...T...d..T',
    '.D...t...t...D.',
    '..D...d.d...D..',
    'd..D...d...D..d',
    '....D.....D....',
    '.t...t...t...t.',
    '..d...d.d...d..',
    'T..d...*...d..T',
    '..d...d.d...d..',
    '.t...t...t...t.',
    '....D.....D....',
    'd..D...d...D..d',
    '..D...d.d...D..',
    '.D...t...t...D.',
    'T..d...T...d..T'];
  var BAG = { a: 9, b: 2, c: 2, d: 4, e: 12, f: 2, g: 3, h: 2, i: 9, j: 1, k: 1, l: 4, m: 2, n: 6, o: 8, p: 2, q: 1, r: 6, s: 4, t: 6, u: 4, v: 2, w: 2, x: 1, y: 2, z: 1 };
  var ALL = (1 << 26) - 1, A = 97;
  function prem(i) { return LAYOUT[(i / N) | 0][i % N]; }
  function wm(i) { var p = prem(i); return p === 'T' ? 3 : p === 'D' || p === '*' ? 2 : 1; }
  function lm(i) { var p = prem(i); return p === 't' ? 3 : p === 'd' ? 2 : 1; }

  /* ── a compact trie (first child / next sibling) built from a sorted word list ── */
  function Trie(words) {
    var cap = 1 << 16, fc = new Int32Array(cap).fill(-1), ns = new Int32Array(cap).fill(-1), lc = new Int32Array(cap).fill(-1), lt = new Uint8Array(cap), tm = new Uint8Array(cap), n = 1;
    function grow() { cap *= 2; var f = new Int32Array(cap).fill(-1), s = new Int32Array(cap).fill(-1), l = new Int32Array(cap).fill(-1), t = new Uint8Array(cap), m = new Uint8Array(cap); f.set(fc); s.set(ns); l.set(lc); t.set(lt); m.set(tm); fc = f; ns = s; lc = l; lt = t; tm = m; }
    var stack = [0], prev = '';
    for (var w = 0; w < words.length; w++) {
      var word = words[w], p = 0;
      while (p < word.length && p < prev.length && word[p] === prev[p]) p++;
      stack.length = p + 1;
      for (var k = p; k < word.length; k++) {
        if (n >= cap) grow();
        var par = stack[k], id = n++; lt[id] = word.charCodeAt(k) - A;
        if (lc[par] < 0) fc[par] = id; else ns[lc[par]] = id;
        lc[par] = id; stack.push(id);
      }
      tm[stack[word.length]] = 1; prev = word;
    }
    this.fc = fc; this.ns = ns; this.lt = lt; this.tm = tm; this.size = n;
  }
  Trie.prototype.child = function (n, L) { for (var k = this.fc[n]; k >= 0; k = this.ns[k]) if (this.lt[k] === L) return k; return -1; };

  /* ── checking and scoring a set of placed tiles: [{i, l}] ── */
  function lineOf(board, i, step) {   /* the full run of tiles through square i (step 1 = across, N = down) */
    var r = (i / N) | 0, c = i % N, s = i, e = i;
    if (step === 1) { while (s % N > 0 && board[s - 1]) s--; while (e % N < N - 1 && board[e + 1]) e++; }
    else { while (s - N >= 0 && board[s - N]) s -= N; while (e + N < N * N && board[e + N]) e += N; }
    var cells = []; for (var k = s; k <= e; k += step) cells.push(k); return cells;
  }
  function wordScore(board, cells, fresh) {
    var sum = 0, mult = 1, w = '';
    for (var k = 0; k < cells.length; k++) {
      var i = cells[k], L = board[i]; w += L;
      if (fresh[i]) { sum += VAL[L] * lm(i); mult *= wm(i); } else sum += VAL[L];
    }
    return { w: w, s: sum * mult, mult: mult, cells: cells };
  }
  function evaluate(board0, placed, isWord) {
    if (!placed.length) return { ok: false, err: 'place some tiles first' };
    var first = !board0.some(Boolean), board = board0.slice(), fresh = {};
    for (var k = 0; k < placed.length; k++) { var p = placed[k]; if (board[p.i] || fresh[p.i]) return { ok: false, err: 'that square is taken' }; board[p.i] = p.l; fresh[p.i] = 1; }
    var rows = {}, cols = {};
    placed.forEach(function (p) { rows[(p.i / N) | 0] = 1; cols[p.i % N] = 1; });
    var across = Object.keys(rows).length === 1, down = Object.keys(cols).length === 1;
    if (!across && !down) return { ok: false, err: 'tiles must sit in one row or one column' };
    var step = across && (!down || lineOf(board, placed[0].i, 1).length > 1) ? 1 : N;
    var main = lineOf(board, placed[0].i, step);
    for (k = 0; k < placed.length; k++) if (main.indexOf(placed[k].i) < 0) return { ok: false, err: 'leave no gaps between your tiles' };
    if (first) { if (!fresh[MID * N + MID]) return { ok: false, err: 'the first word covers the star in the middle' }; if (main.length < 2) return { ok: false, err: 'the first word needs at least two letters' }; }
    else {
      var touches = main.some(function (i) { return !fresh[i]; }) || placed.some(function (p) { return lineOf(board, p.i, step === 1 ? N : 1).length > 1; });
      if (!touches) return { ok: false, err: 'connect to the tiles already on the board' };
    }
    var words = [];
    if (main.length > 1) words.push(wordScore(board, main, fresh));
    placed.forEach(function (p) { var x = lineOf(board, p.i, step === 1 ? N : 1); if (x.length > 1) words.push(wordScore(board, x, fresh)); });
    var bad = words.filter(function (w) { return !isWord(w.w); }).map(function (w) { return w.w; });
    if (bad.length) return { ok: false, err: bad.map(function (w) { return w.toUpperCase(); }).join(', ') + (bad.length > 1 ? ' aren\'t' : ' isn\'t') + ' in the dictionary', bad: bad, words: words };
    var score = words.reduce(function (a, w) { return a + w.s; }, 0), bingo = placed.length === RACK;
    if (bingo) score += BINGO;
    return { ok: true, words: words, score: score, bingo: bingo, mult: words[0] ? words[0].mult : 1, main: words[0] };
  }

  /* ── every legal move for a rack (Appel & Jacobson's anchor method) ── */
  function moves(board, rack, trie, isWord) {
    var cnt = new Array(26).fill(0), out = [], seen = {}, first = !board.some(Boolean);
    rack.forEach(function (l) { cnt[l.charCodeAt(0) - A]++; });
    for (var dir = 0; dir < 2; dir++) {
      var idx = dir ? function (r, c) { return c * N + r; } : function (r, c) { return r * N + c; };
      for (var r = 0; r < N; r++) {
        var at = function (c) { return board[idx(r, c)]; }, cross = [], anc = [];
        for (var c = 0; c < N; c++) {
          if (at(c)) { cross[c] = 0; anc[c] = false; continue; }
          var up = '', dn = '', k;
          for (k = r - 1; k >= 0 && board[idx(k, c)]; k--) up = board[idx(k, c)] + up;
          for (k = r + 1; k < N && board[idx(k, c)]; k++) dn += board[idx(k, c)];
          if (!up && !dn) cross[c] = ALL;
          else { var m = 0; for (var L = 0; L < 26; L++) if (isWord(up + String.fromCharCode(A + L) + dn)) m |= 1 << L; cross[c] = m; }
          anc[c] = first ? (r === MID && c === MID) : !!(up || dn || (c > 0 && at(c - 1)) || (c < N - 1 && at(c + 1)));
        }
        var rec = function (start, placed) {
          /* the cell and letter of every tile (v1.9.2: was column + letter code summed, so TIL at the left edge clashed
             with some other move's sum anywhere on the board and silently went missing) */
          var key = placed.map(function (p) { return idx(r, p[0]) + String.fromCharCode(A + p[1]); }).sort().join(',');
          if (seen[key]) return; seen[key] = 1;
          out.push(placed.map(function (p) { return { i: idx(r, p[0]), l: String.fromCharCode(A + p[1]) }; }));
        };
        var extend = function (sq, node, start, placed, anchor) {
          if (sq < N && at(sq)) { var ch = trie.child(node, at(sq).charCodeAt(0) - A); if (ch >= 0) extend(sq + 1, ch, start, placed, anchor); return; }
          if (sq > anchor && trie.tm[node] && placed.length && sq - start > 1) rec(start, placed.slice());
          if (sq >= N) return;
          for (var k2 = trie.fc[node]; k2 >= 0; k2 = trie.ns[k2]) {
            var L2 = trie.lt[k2];
            if (cnt[L2] && (cross[sq] >> L2 & 1)) { cnt[L2]--; placed.push([sq, L2]); extend(sq + 1, k2, start, placed, anchor); placed.pop(); cnt[L2]++; }
          }
        };
        var left = function (node, letters, lim, anchor) {
          var start = anchor - letters.length;
          extend(anchor, node, start, letters.map(function (L, j) { return [start + j, L]; }), anchor);
          if (lim <= 0) return;
          for (var k3 = trie.fc[node]; k3 >= 0; k3 = trie.ns[k3]) {
            var L3 = trie.lt[k3];
            if (cnt[L3]) { cnt[L3]--; letters.push(L3); left(k3, letters, lim - 1, anchor); letters.pop(); cnt[L3]++; }
          }
        };
        for (c = 0; c < N; c++) {
          if (!anc[c]) continue;
          if (c > 0 && at(c - 1)) {
            var s = c - 1; while (s > 0 && at(s - 1)) s--;
            var node = 0; for (k = s; k < c && node >= 0; k++) node = trie.child(node, at(k).charCodeAt(0) - A);
            if (node >= 0) extend(c, node, s, [], c);
          } else {
            var lim = 0; for (k = c - 1; k >= 0 && !at(k) && !anc[k] && lim < RACK - 1; k--) lim++;
            left(0, [], lim, c);
          }
        }
      }
    }
    return out;
  }

  /* ── the four edges: each one is a 27× waiting to happen while its three triples are empty ── */
  function run(a, step) { var o = []; for (var k = 0; k < N; k++) o.push(a + k * step); return o; }
  var EDGES = [
    { name: 'top edge', cells: run(0, 1), inward: N },
    { name: 'bottom edge', cells: run(N * (N - 1), 1), inward: -N },
    { name: 'left edge', cells: run(0, N), inward: 1 },
    { name: 'right edge', cells: run(N - 1, N), inward: -1 }];
  /* which edge-long words still fit an edge: its letters, and every empty square's crossing word */
  function edgeFits(board, e, nine, isWord, limit) {
    var cs = e.cells, pat = [], masks = [], fixed = 0, empty = 0;
        for (var k = 0; k < N; k++) {
      var i = cs[k];
      if (board[i]) { pat.push(board[i]); masks.push(0); fixed++; continue; }
      pat.push(''); empty++;
      var inner = i + e.inward;
      if (!board[inner]) { masks.push(ALL); continue; }
      var cells = [], j = inner, d = inner - i; while (j >= 0 && j < N * N && board[j] && (d === 1 || d === -1 ? ((j / N) | 0) === ((i / N) | 0) : true)) { cells.push(j); j += d; }
      var tail = cells.map(function (x) { return board[x]; }).join(''), m = 0;
      for (var L = 0; L < 26; L++) { var ch = String.fromCharCode(A + L); if (isWord(d > 0 ? ch + tail : tail.split('').reverse().join('') + ch)) m |= 1 << L; }
      masks.push(m);
    }
    var hits = [], n = 0;
    if (!fixed && masks.every(function (m) { return m === ALL; })) return { fixed: 0, empty: empty, n: -1, hits: hits };
    for (var w = 0; w < nine.length; w++) {
      var word = nine[w], ok = true;
      for (k = 0; k < N && ok; k++) ok = pat[k] ? word[k] === pat[k] : (masks[k] >> (word.charCodeAt(k) - A) & 1) === 1;
      if (ok) { n++; if (hits.length < (limit || 0)) hits.push(word); }
    }
    return { fixed: fixed, empty: empty, n: n, hits: hits, pat: pat };
  }
  function edgeOpen(board, e) { return !board[e.cells[0]] && !board[e.cells[MID]] && !board[e.cells[N - 1]]; }

  return { N: N, MID: MID, RACK: RACK, BINGO: BINGO, VAL: VAL, LAYOUT: LAYOUT, BAG: BAG, EDGES: EDGES, prem: prem, Trie: Trie, evaluate: evaluate, moves: moves, edgeFits: edgeFits, edgeOpen: edgeOpen };
})();
if (typeof module !== 'undefined') module.exports = TC;
