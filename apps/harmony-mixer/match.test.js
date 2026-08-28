// node apps/harmony-mixer/match.test.js
var HM = require('./match.js');
var pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; } else { fail++; console.log('FAIL: ' + msg); } }
function has(res, rule) { return (res.reasons || []).some(function (r) { return r.rule === rule; }); }
function text(res) { return HM.explain(res).join(' | '); }

// parseCamelot
ok(HM.parseCamelot('8A').name === 'A minor', '8A = A minor');
ok(HM.parseCamelot('8B').name === 'C major', '8B = C major');
ok(HM.parseCamelot('1B').name === 'B major', '1B = B major');
ok(HM.parseCamelot('12a').id === '12A' && HM.parseCamelot('12a').name === 'Db minor', '12a → 12A Db minor');
ok(HM.parseCamelot({ camelot: '9A', n: 9, letter: 'A', name: 'E minor', conf: .4 }).id === '9A', 'peer key object shape');
ok(HM.parseCamelot({ key: { camelot: '5B' } }).id === '5B', 'track with nested key object');
ok(HM.parseCamelot('13A') === null && HM.parseCamelot('0B') === null && HM.parseCamelot('x') === null && HM.parseCamelot(null) === null, 'invalid keys → null');

// camelot rule table
var c;
c = HM.camelotScore('8A', '8A'); ok(c.score === 100 && c.relation === 'same' && c.shared === 7, 'same key 100');
c = HM.camelotScore('8A', '8B'); ok(c.score === 90 && c.relation === 'relative' && c.shared === 7, 'relative 90 shares 7 notes');
c = HM.camelotScore('8A', '9A'); ok(c.score === 85 && c.relation === 'up-fifth' && c.steps === 1 && c.shared === 6, '+1 same letter 85, 6 shared');
c = HM.camelotScore('8A', '7A'); ok(c.score === 85 && c.relation === 'down-fifth' && c.steps === -1, '-1 same letter 85');
c = HM.camelotScore('12A', '1A'); ok(c.score === 85 && c.steps === 1, '12 → 1 wraps as +1');
c = HM.camelotScore('1A', '12A'); ok(c.score === 85 && c.steps === -1, '1 → 12 wraps as -1');
c = HM.camelotScore('8A', '9B'); ok(c.score === 75 && c.relation === 'diagonal', 'diagonal 75');
c = HM.camelotScore('8A', '10A'); ok(c.score === 65 && c.relation === 'energy-boost' && c.shared === 5, '+2 energy boost 65');
c = HM.camelotScore('8A', '6A'); ok(c.score === 65 && c.relation === 'energy-drop', '-2 energy drop 65');
c = HM.camelotScore('8A', '2A'); ok(c.score === 5 && c.relation === 'far' && c.shared === 2, 'tritone 5, 2 shared');
c = HM.camelotScore('8A', '2B'); ok(c.score === 5 && /mode switch/.test(text(c)), 'tritone + switch 5');
c = HM.camelotScore('8A', null); ok(c.score === null && has(c, 'key-unknown'), 'unknown candidate key');
ok(HM.camelotScore('8A', '9A').reasons.every(function (r) { return typeof r.text === 'string' && r.text.length > 8; }), 'every reason has text');
// symmetry of scores (not of direction)
ok(HM.camelotScore('3B', '4A').score === HM.camelotScore('4A', '3B').score, 'score symmetric');

// bpm
var b;
b = HM.bpmScore(128, 128); ok(b.score === 100 && has(b, 'identical') && b.diffPct === 0, 'identical 100');
b = HM.bpmScore(128, 129); ok(b.score === 100 && b.diffPct === 0.8 && /faster/.test(text(b)), '<1% still 100, says faster');
b = HM.bpmScore(128, 124); ok(b.score >= 80 && b.score < 100 && /slower/.test(text(b)) && /\+3\.2% pitch/.test(text(b)) && b.pitch === 3.2, '3.1% slower → needs +3.2% pitch on the candidate');
b = HM.bpmScore(128, 136); ok(b.score === 68 && b.pitch === -5.9 && b.mult === 1 && /inside a ±8%/.test(text(b)) && has(b, 'key-drift'), '6.25% → 68, pitch -5.9, in range, key-drift noted');
b = HM.bpmScore(128, 140); ok(b.score < 50 && /outside a ±8%/.test(text(b)), '9.4% → outside fader');
b = HM.bpmScore(128, 140, { maxPitch: 16 }); ok(/inside a ±16%/.test(text(b)), 'maxPitch option');
b = HM.bpmScore(128, 170); ok(b.score === 0 && b.label === 'too far', '33% → 0');
b = HM.bpmScore(87, 174); ok(b.halfDouble === -1 && b.mult === 0.5 && b.pitch === 0 && b.score === 85 && has(b, 'half-double') && b.effective === 87, 'half-time 174 vs 87 → 85, mult .5');
b = HM.bpmScore(174, 87); ok(b.halfDouble === 1 && b.score === 85, 'double-time 87 vs 174 → 85');
b = HM.bpmScore(174, 87, { halfDouble: false }); ok(b.score === 0, 'half/double disabled → 0');
b = HM.bpmScore({ bpm: 120 }, { bpm: 121.2 }); ok(b.score === 100, 'accepts track objects');
b = HM.bpmScore(128, null); ok(b.score === null && b.pitch === null && b.mult === 1 && has(b, 'bpm-unknown'), 'unknown bpm');
m = HM.matchScore({ bpm: 128, camelot: '' }, { bpm: null, camelot: '8A' }); ok(m.score === 0 && m.mode === 'unknown' && m.pitch === null, "'' key + null bpm tolerated");
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 130, camelot: '' }); ok(m.mode === 'bpm-only' && m.score === 97 && m.pitch === -1.5, "'' candidate key → bpm-only w/ pitch");
b = HM.bpmScore(128, 0); ok(b.score === null, 'zero bpm is unknown');
ok(HM._curve(1) === 100 && HM._curve(3) === 90 && HM._curve(6) === 70 && HM._curve(8) === 50 && HM._curve(16) === 10 && HM._curve(25) === 0 && HM._curve(40) === 0, 'curve knots');
ok(HM._curve(4.5) === 80 && HM._curve(7) === 60, 'curve interpolates');
// monotone
(function () { var last = 101, mono = true; for (var p = 0; p <= 30; p += 0.25) { var v = HM._curve(p); if (v > last) mono = false; last = v; } ok(mono, 'curve monotone'); })();

// combined
var m;
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 128, camelot: '8A' }); ok(m.score === 100 && m.label === 'perfect' && m.mode === 'blend', 'perfect 100');
m = HM.matchScore({ bpm: 128, key: { camelot: '8A' } }, { bpm: 130, key: { camelot: '9A' } });
ok(m.bpm.score === 97 && m.score === Math.round(85 * .55 + 97 * .45) && m.score === 90 && m.label === 'great', 'blend weights 55/45 → ' + m.score);
ok(has(m, 'weights') && /key 85 × 55% \+ tempo 97 × 45% = 90/.test(text(m)), 'weights line explains arithmetic');
ok(m.pitch === -1.5 && m.mult === 1, 'top-level pitch/mult for the fader');
ok(m.reasons.filter(function (r) { return r.part === 'key'; }).length >= 2 && m.reasons.filter(function (r) { return r.part === 'bpm'; }).length >= 2, 'reasons tagged by part');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 128, camelot: '8A' }, { keyWeight: 1, bpmWeight: 0 }); ok(m.score === 100, 'custom weights');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 170, camelot: '8A' }); ok(m.score === 30 && has(m, 'tempo-gate'), 'tempo gate caps at 30 (was ' + Math.round(100 * .55) + ')');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 128, camelot: '2A' }); ok(m.score === 45 && has(m, 'key-gate') && m.label === 'risky', 'key gate caps at 45');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 129 }); ok(m.score === 100 && m.mode === 'bpm-only' && has(m, 'partial'), 'no key → tempo only');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { camelot: '8B' }); ok(m.score === 90 && m.mode === 'key-only', 'no bpm → key only');
m = HM.matchScore({}, {}); ok(m.score === 0 && m.mode === 'unknown' && m.label === 'clash', 'nothing known → 0');
m = HM.matchScore({ bpm: 128, camelot: '8A' }, { bpm: 128, camelot: '8A' }); ok(HM.explain(m).length === m.reasons.length && HM.explain(m)[0].indexOf('KEY · +100 · same key') === 0, 'explain lines');
ok(HM.explain(null).length === 0, 'explain(null) safe');

// ranking
var ref = { title: 'ref', bpm: 128, camelot: '8A' };
var crate = [
  { title: 'far', bpm: 128, camelot: '2A' },
  { title: 'relative-ish', bpm: 131, camelot: '8B' },
  { title: 'same', bpm: 128, camelot: '8A' },
  { title: 'unknown', bpm: null, camelot: null },
  { title: 'halftime', bpm: 64, camelot: '9A' },
  { title: 'tempo-out', bpm: 160, camelot: '8A' }
];
var ranked = HM.rankCandidates(ref, crate);
ok(ranked.length === 6 && ranked[0].track.title === 'same' && ranked[1].track.title === 'relative-ish', 'ranking best first: ' + ranked.map(function (r) { return r.track.title + ':' + r.match.score; }).join(','));
ok(ranked[ranked.length - 1].track.title === 'unknown', 'unknown last');
ok(ranked.every(function (r, i) { return i === 0 || r.match.score <= ranked[i - 1].match.score; }), 'monotone ranking');
ok(HM.rankCandidates(ref, []).length === 0 && HM.rankCandidates(ref, null).length === 0, 'empty crate');

// purity: no globals leaked, inputs untouched
var inp = { bpm: 128, camelot: '8A', extra: 1 }; var snap = JSON.stringify(inp); HM.matchScore(inp, inp); ok(JSON.stringify(inp) === snap, 'inputs untouched');
ok(typeof HM.matchScore === 'function' && typeof HM.parseCamelot === 'function' && typeof HM.rankCandidates === 'function', 'api surface');

console.log(pass + '/' + (pass + fail) + ' passed');
if (fail) process.exit(1);
