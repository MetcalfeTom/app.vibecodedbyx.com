/* Harmony — explainable BPM + Camelot match scoring seam
 *
 * Pure functions, no I/O, no DOM, no network: crate metadata stays local-only.
 * Every result carries a 0–100 score, a short label, and a list of reasons
 * {rule, points, text} so the UI can show WHY two tracks do or don't match.
 *
 * Load in the page:   <script src="match.js"></script>   → window.HarmonyMatch
 * Load in node:       var HM = require('./match.js')      (for tests)
 *
 * API
 *   parseCamelot(x)               '8A' | '8a' | {n,letter} | {camelot} | {key:{camelot}} → {n, letter, id, name} | null
 *   camelotScore(a, b)            → {score, label, relation, steps, shared, reasons[]}
 *   bpmScore(a, b, opts)          → {score, label, diffPct, pitch, mult, halfDouble, semitones, reasons[]}
 *                                    pitch = % to apply to the candidate to meet the reference; mult = 1|2|0.5 (half/double time)
 *   matchScore(ref, cand, opts)   → {score, label, mode, pitch, mult, camelot, bpm, reasons[]}   (ref/cand: {bpm, camelot|key}; missing data tolerated)
 *   rankCandidates(ref, list, o)  → [{track, match}] best first
 *   explain(result)               → array of plain-text lines (for tooltips / aria)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HarmonyMatch = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var PC_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']; // Camelot spellings (12A Db minor, 11A F# minor)
  var MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];

  // ---------- Camelot ----------
  function majorTonic(n) { return (7 * (n + 4)) % 12; }          // 8B → C(0), 9B → G(7), 1B → B(11)
  function tonicOf(c) { var t = majorTonic(c.n); return c.letter === 'A' ? (t + 9) % 12 : t; }
  function keyName(c) { return PC_NAMES[tonicOf(c)] + (c.letter === 'A' ? ' minor' : ' major'); }
  function pitchSet(c) { // natural-minor keys share their relative major's notes
    var t = majorTonic(c.n), s = {};
    for (var i = 0; i < 7; i++) s[(t + MAJOR_STEPS[i]) % 12] = true;
    return s;
  }

  function parseCamelot(x) {
    if (x == null) return null;
    if (typeof x === 'object') {
      if (typeof x.camelot === 'string') return parseCamelot(x.camelot);
      if (x.key != null) return parseCamelot(x.key);
      if (x.n != null && x.letter) return parseCamelot(String(x.n) + String(x.letter));
      return null;
    }
    var m = /^\s*(1[0-2]|[1-9])\s*([abAB])\s*$/.exec(String(x));
    if (!m) return null;
    var c = { n: +m[1], letter: m[2].toUpperCase() };
    c.id = c.n + c.letter;
    c.name = keyName(c);
    return c;
  }

  function camelotLabel(score) {
    return score >= 95 ? 'perfect' : score >= 80 ? 'harmonic' : score >= 60 ? 'workable' : score >= 40 ? 'risky' : 'clash';
  }

  // Score table by wheel distance (0..6) — same letter vs letter switch.
  var SAME = [100, 85, 65, 40, 25, 15, 5];
  var SWITCH = [90, 75, 50, 30, 18, 10, 5];

  function camelotScore(a, b) {
    var A = parseCamelot(a), B = parseCamelot(b);
    if (!A || !B) return { score: null, label: 'unknown', relation: 'unknown', steps: null, shared: null, reasons: [
      { rule: 'key-unknown', points: 0, text: !A && !B ? 'neither key is known' : !A ? 'reference key unknown' : 'candidate key unknown' }
    ] };
    var raw = ((B.n - A.n) % 12 + 12) % 12;      // 0..11 clockwise
    var steps = raw > 6 ? raw - 12 : raw;         // -5..+6, + = clockwise
    var d = Math.abs(steps);
    var same = A.letter === B.letter;
    var score = same ? SAME[d] : SWITCH[d];
    var sa = pitchSet(A), sb = pitchSet(B), shared = 0;
    for (var pc in sa) if (sb[pc]) shared++;
    var reasons = [], relation;
    var head = A.name + ' (' + A.id + ') → ' + B.name + ' (' + B.id + ')';

    if (d === 0 && same) { relation = 'same'; reasons.push({ rule: 'same-key', points: score, text: 'same key — ' + head }); }
    else if (d === 0) { relation = 'relative'; reasons.push({ rule: 'relative', points: score, text: 'relative ' + (B.letter === 'A' ? 'minor' : 'major') + ' — same seven notes, mood shifts ' + (B.letter === 'A' ? 'darker' : 'brighter') + ' (' + head + ')' }); }
    else if (d === 1 && same) { relation = steps > 0 ? 'up-fifth' : 'down-fifth';
      reasons.push({ rule: 'adjacent', points: score, text: 'one step ' + (steps > 0 ? 'clockwise (up a fifth) — lifts energy' : 'counter-clockwise (down a fifth) — settles') + ' (' + head + ')' }); }
    else if (d === 1) { relation = 'diagonal';
      reasons.push({ rule: 'diagonal', points: score, text: 'diagonal mix — one step ' + (steps > 0 ? 'clockwise' : 'counter-clockwise') + ' AND ' + (B.letter === 'A' ? 'major → minor' : 'minor → major') + ' (' + head + ')' }); }
    else if (d === 2 && same) { relation = steps > 0 ? 'energy-boost' : 'energy-drop';
      reasons.push({ rule: 'two-steps', points: score, text: 'two steps ' + (steps > 0 ? 'clockwise — energy boost, ' : 'counter-clockwise — energy drop, ') + 'only works over a break or drums (' + head + ')' }); }
    else { relation = 'far';
      reasons.push({ rule: 'distant', points: score, text: d + ' steps apart on the wheel' + (same ? '' : ' plus a mode switch') + ' — melodies will clash (' + head + ')' }); }

    reasons.push({ rule: 'shared-notes', points: 0, text: shared + ' of 7 scale notes in common' });
    return { score: score, label: camelotLabel(score), relation: relation, steps: steps, shared: shared, a: A, b: B, reasons: reasons };
  }

  // ---------- BPM ----------
  // piecewise-linear score over |tempo difference| in percent
  var BPM_KNOTS = [[0, 100], [1, 100], [3, 90], [6, 70], [8, 50], [16, 10], [25, 0]];
  function bpmCurve(p) {
    if (p <= 0) return 100;
    for (var i = 1; i < BPM_KNOTS.length; i++) {
      var x0 = BPM_KNOTS[i - 1][0], y0 = BPM_KNOTS[i - 1][1], x1 = BPM_KNOTS[i][0], y1 = BPM_KNOTS[i][1];
      if (p <= x1) return Math.round(y0 + (y1 - y0) * (p - x0) / (x1 - x0));
    }
    return 0;
  }
  function bpmLabel(score) {
    return score >= 95 ? 'locked' : score >= 80 ? 'easy' : score >= 60 ? 'pitchable' : score >= 30 ? 'stretch' : 'too far';
  }
  function num(x) { var v = typeof x === 'object' && x ? x.bpm : x; v = +v; return isFinite(v) && v > 0 ? v : null; }
  function r1(v) { return Math.round(v * 10) / 10; }

  function bpmScore(a, b, opts) {
    opts = opts || {};
    var maxPitch = opts.maxPitch != null ? +opts.maxPitch : 8;          // ± fader range in %
    var allowHD = opts.halfDouble !== false;
    var A = num(a), B = num(b);
    if (!A || !B) return { score: null, label: 'unknown', diffPct: null, pitch: null, mult: 1, ratio: null, halfDouble: 0, semitones: null, reasons: [
      { rule: 'bpm-unknown', points: 0, text: !A && !B ? 'neither tempo is known' : !A ? 'reference tempo unknown' : 'candidate tempo unknown' }
    ] };
    // candidate as-is, or heard at half / double time
    var options = [{ mult: 1, hd: 0 }];
    if (allowHD) options.push({ mult: 2, hd: 1 }, { mult: 0.5, hd: -1 });
    var best = null;
    for (var i = 0; i < options.length; i++) {
      var eff = B * options[i].mult, diff = (eff - A) / A * 100, sc = bpmCurve(Math.abs(diff));
      if (options[i].hd) sc = Math.max(0, sc - 15);
      if (!best || sc > best.score) best = { score: sc, diff: diff, eff: eff, hd: options[i].hd };
    }
    var reasons = [], ad = Math.abs(best.diff);
    var pitch = (A - best.eff) / best.eff * 100, ap = Math.abs(pitch); // % applied to the candidate's own tempo
    if (best.hd) reasons.push({ rule: 'half-double', points: -15, text: 'candidate heard at ' + (best.hd > 0 ? 'double' : 'half') + ' time (' + r1(B) + ' ≈ ' + r1(best.eff) + ') — the feel changes, so 15 points off' });
    if (ad < 0.05) reasons.push({ rule: 'identical', points: best.score, text: 'identical tempo — ' + r1(A) + ' BPM both' });
    else reasons.push({ rule: 'tempo-diff', points: best.score, text: r1(A) + ' → ' + r1(best.eff) + ' BPM: candidate is ' + r1(ad) + '% ' + (best.diff > 0 ? 'faster' : 'slower') });
    if (ad >= 0.05) {
      if (ap <= maxPitch) reasons.push({ rule: 'pitch-range', points: 0, text: 'needs ' + (pitch > 0 ? '+' : '−') + r1(ap) + '% pitch on the candidate — inside a ±' + maxPitch + '% fader' });
      else reasons.push({ rule: 'pitch-range', points: 0, text: 'would need ' + (pitch > 0 ? '+' : '−') + r1(ap) + '% pitch — outside a ±' + maxPitch + '% fader, sync/stretch only' });
    }
    var semis = 12 * Math.log(A / best.eff) / Math.LN2; // pitch drift on the candidate once tempo-matched without key-lock
    if (Math.abs(semis) >= 0.5) reasons.push({ rule: 'key-drift', points: 0, text: 'without key-lock that pitch change moves the candidate ~' + r1(Math.abs(semis)) + ' semitone' + (Math.abs(semis) >= 1.5 ? 's' : '') + ' ' + (semis > 0 ? 'up' : 'down') });
    return { score: best.score, label: bpmLabel(best.score), diffPct: r1(best.diff), pitch: r1(pitch), mult: best.hd > 0 ? 2 : best.hd < 0 ? 0.5 : 1, ratio: best.eff / A, halfDouble: best.hd, semitones: r1(semis), a: A, b: B, effective: r1(best.eff), reasons: reasons };
  }

  // ---------- combined ----------
  function matchLabel(score) {
    return score >= 95 ? 'perfect' : score >= 75 ? 'great' : score >= 60 ? 'good' : score >= 40 ? 'risky' : 'clash';
  }

  function matchScore(ref, cand, opts) {
    opts = opts || {};
    var wK = opts.keyWeight != null ? +opts.keyWeight : 0.55;
    var wB = opts.bpmWeight != null ? +opts.bpmWeight : 0.45;
    var k = camelotScore(ref, cand), b = bpmScore(ref, cand, opts);
    var reasons = [], score, tag;
    if (k.score == null && b.score == null) { score = 0; tag = 'unknown'; }
    else if (k.score == null) { score = b.score; tag = 'bpm-only'; }
    else if (b.score == null) { score = k.score; tag = 'key-only'; }
    else { score = Math.round((k.score * wK + b.score * wB) / (wK + wB)); tag = 'blend'; }
    var i;
    for (i = 0; i < k.reasons.length; i++) reasons.push(withPart(k.reasons[i], 'key'));
    for (i = 0; i < b.reasons.length; i++) reasons.push(withPart(b.reasons[i], 'bpm'));
    if (tag === 'blend') reasons.push({ part: 'total', rule: 'weights', points: score, text: 'key ' + k.score + ' × ' + pct(wK, wK + wB) + ' + tempo ' + b.score + ' × ' + pct(wB, wK + wB) + ' = ' + score });
    else if (tag !== 'unknown') reasons.push({ part: 'total', rule: 'partial', points: score, text: (tag === 'bpm-only' ? 'key unknown — tempo only' : 'tempo unknown — key only') + ' = ' + score });
    if (tag === 'blend' && b.score === 0 && score > 30) { reasons.push({ part: 'total', rule: 'tempo-gate', points: 30 - score, text: 'tempo out of reach — capped at 30 no matter how well the keys fit' }); score = 30; }
    if (tag === 'blend' && k.score <= 15 && score > 45) { reasons.push({ part: 'total', rule: 'key-gate', points: 45 - score, text: 'keys clash — capped at 45 even with matching tempo' }); score = 45; }
    return { score: score, label: matchLabel(score), mode: tag, pitch: b.pitch, mult: b.mult, camelot: k, bpm: b, reasons: reasons };
  }
  function withPart(r, part) { return { part: part, rule: r.rule, points: r.points, text: r.text }; }
  function pct(a, t) { return Math.round(a / t * 100) + '%'; }

  function rankCandidates(ref, list, opts) {
    var out = [];
    for (var i = 0; i < (list || []).length; i++) out.push({ track: list[i], match: matchScore(ref, list[i], opts) });
    out.sort(function (x, y) { return y.match.score - x.match.score || ((y.match.bpm.score || 0) - (x.match.bpm.score || 0)); });
    return out;
  }

  function explain(res) {
    if (!res) return [];
    var lines = [];
    var rs = res.reasons || [];
    for (var i = 0; i < rs.length; i++) {
      var r = rs[i], p = r.points;
      lines.push((r.part ? r.part.toUpperCase() + ' · ' : '') + (p ? (p > 0 ? '+' : '') + p + ' · ' : '') + r.text);
    }
    return lines;
  }

  return {
    parseCamelot: parseCamelot, keyName: keyName, camelotScore: camelotScore, bpmScore: bpmScore,
    matchScore: matchScore, rankCandidates: rankCandidates, explain: explain,
    _curve: bpmCurve, _tables: { same: SAME, switch: SWITCH, knots: BPM_KNOTS }
  };
});
