/* Sloppy's mini C++ (fannar22, 2026-10-06: "regardless if there is compiler or not just make C++ track").
   A small C++ for beginners, all in the browser: #include, using namespace std, cout/cin/getline, int/double/
   bool/char/string/auto/const, vector, plain arrays, if/else, switch, while, do, for and range-for, functions with
   references and recursion, rand/srand/time, to_string/stoi, <cmath> bits, fixed/setprecision.
   Three stages, like a real compiler: parse (syntax errors) → check (names and types, so nothing runs if the
   program doesn't compile) → run (a tree walker with a step budget, cin through a read() callback).
   CPP.run(src, { write(s), read() → line or null, maxSteps }) → { exit, error: { stage, line, msg, help } | null } */
(function(){
'use strict';

class CErr extends Error { constructor(stage, line, msg, help){ super(msg); this.stage = stage; this.line = line; this.help = help || ''; } }
const cerr = (line, msg, help) => { throw new CErr('compile', line, msg, help); };

// ── lexer ──────────────────────────────────────────────────────
const OPS = ['<<=', '>>=', '::', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '->',
  '+', '-', '*', '/', '%', '<', '>', '=', '!', '(', ')', '{', '}', '[', ']', ';', ',', '.', '?', ':', '&', '|', '^', '~'];
function lex(src){
  const T = [], inc = new Set(); let i = 0, line = 1;
  const n = src.length;
  while (i < n){
    const c = src[i];
    if (c === '\n'){ line++; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
    if (c === '/' && src[i + 1] === '/'){ while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*'){ const l0 = line; i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')){ if (src[i] === '\n') line++; i++; }
      if (i >= n) cerr(l0, 'unterminated comment', 'A comment that starts with /* needs a */ to end it.'); i += 2; continue; }
    if (c === '#'){
      let j = i; while (j < n && src[j] !== '\n') j++;
      const d = src.slice(i, j).trim(), m = d.match(/^#\s*include\s*[<"]\s*([\w.\/]+)\s*[>"]$/);
      if (m) inc.add(m[1].replace(/\.h$/, ''));
      else if (/^#\s*include/.test(d)) cerr(line, '#include expects <FILENAME>', 'Write it like  #include <iostream>');
      else if (/^#\s*pragma/.test(d)) {}
      else cerr(line, 'this mini C++ only understands #include lines', 'Lines that start with # are for the preprocessor. Here only #include <...> works.');
      i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)){ let j = i + 1; while (j < n && /\w/.test(src[j])) j++; T.push({ k: 'id', v: src.slice(i, j), line }); i = j; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))){
      const m = src.slice(i).match(/^(\d*\.\d+(?:[eE][+-]?\d+)?|\d+\.?(?:[eE][+-]?\d+)?)([fFlLuU]*)/);
      const s = m[1], isD = /[.eE]/.test(s) || /f/i.test(m[2]);
      T.push({ k: 'num', v: Number(s), d: isD, line }); i += m[0].length;
      if (/[A-Za-z_]/.test(src[i] || '')) cerr(line, 'invalid number "' + src.slice(i - m[0].length, i + 1) + '…"', 'A name cannot start with a digit.');
      continue;
    }
    if (c === '"' || c === "'"){
      let j = i + 1, s = '';
      while (j < n && src[j] !== c){
        if (src[j] === '\n') cerr(line, 'missing terminating ' + c + ' character', 'Every ' + (c === '"' ? 'text in "double quotes"' : "character in 'single quotes'") + ' has to be closed on the same line.');
        if (src[j] === '\\'){ const e = src[j + 1]; s += ({ n: '\n', t: '\t', '\\': '\\', '"': '"', "'": "'", '0': '\0', a: '', r: '' })[e] ?? e; j += 2; }
        else s += src[j++];
      }
      if (j >= n) cerr(line, 'missing terminating ' + c + ' character', 'Close the quotes.');
      if (c === "'"){
        if (s.length !== 1) cerr(line, s.length ? "a char holds one letter: '" + s + "' is too long" : "empty character constant ''", s.length > 1 ? 'Single quotes hold one character. For text, use "double quotes".' : '');
        T.push({ k: 'chr', v: s.charCodeAt(0), line });
      } else T.push({ k: 'str', v: s, line });
      i = j + 1; continue;
    }
    const op = OPS.find(o => src.startsWith(o, i));
    if (!op) cerr(line, 'stray \'' + c + '\' in program', 'That character isn\'t part of C++. Check for a typo or a fancy quote “ ” (use plain " instead).');
    T.push({ k: 'op', v: op, line }); i += op.length;
  }
  T.push({ k: 'eof', v: 'end of file', line });
  return { T, inc };
}

// ── parser ─────────────────────────────────────────────────────
const BASE = new Set(['int', 'long', 'short', 'double', 'float', 'bool', 'char', 'void', 'auto', 'string', 'vector', 'unsigned', 'signed', 'const']);
const KEYW = new Set(['if', 'else', 'while', 'for', 'do', 'return', 'break', 'continue', 'switch', 'case', 'default', 'true', 'false', 'using', 'namespace',
  'int', 'long', 'short', 'double', 'float', 'bool', 'char', 'void', 'auto', 'const', 'unsigned', 'signed', 'static_cast', 'struct', 'class', 'new', 'delete']);
const desc = t => t.k === 'eof' ? 'end of input' : t.k === 'str' ? 'string constant' : t.k === 'num' ? 'numeric constant' : "'" + (t.k === 'chr' ? String.fromCharCode(t.v) : t.v) + "'";

function parse(src){
  const { T, inc } = lex(src);
  let p = 0, usingStd = false;
  const usingNames = new Set();
  const pk = (o = 0) => T[p + o], nx = () => T[p++];
  const is = (v, o = 0) => { const t = T[p + o]; return (t.k === 'op' || t.k === 'id') && t.v === v; };
  const eat = v => { if (is(v)){ p++; return true; } return false; };
  function want(v, what){
    if (eat(v)) return T[p - 1];
    const t = pk(), prev = T[p - 1] || t;
    if (v === ';') cerr(prev.line, "expected ';' before " + desc(t), 'Every statement in C++ ends with a semicolon ;' + (t.line > prev.line ? ' Line ' + prev.line + ' is missing one at the end.' : ''));
    if (v === ')') cerr(t.line, "expected ')' before " + desc(t), 'A bracket ( was opened and never closed.');
    if (v === '}') cerr(t.line, "expected '}' at " + desc(t), 'A curly bracket { was opened and never closed. Every { needs its }.');
    cerr(t.line, "expected '" + v + "'" + (what ? ' ' + what : '') + ' before ' + desc(t));
  }
  function ident(what){
    const t = pk();
    if (t.k !== 'id' || (KEYW.has(t.v) && t.v !== 'string' && t.v !== 'vector')) cerr(t.line, 'expected ' + (what || 'a name') + ' before ' + desc(t));
    p++; return t.v;
  }
  // std:: prefixes: 'std::cout' and 'cout' both come out as { std: true|false, v: 'cout' }
  function qname(){ if (is('std') && is('::', 1)){ p += 2; return { q: true, v: pk().k === 'id' ? nx().v : cerr(pk().line, 'expected a name after std::') }; } return { q: false, v: nx().v }; }
  function isType(o = 0){
    const t = T[p + o]; if (!t || t.k !== 'id') return false;
    if (t.v === 'std' && T[p + o + 1].v === '::') return T[p + o + 2].v === 'string' || T[p + o + 2].v === 'vector';
    return BASE.has(t.v);
  }
  function type(){
    const line = pk().line; let cnst = false, ty = null, unsigned = false;
    while (is('const') || is('unsigned') || is('signed') || is('static')){ const w = nx().v; if (w === 'const') cnst = true; if (w === 'unsigned') unsigned = true; }
    const t = pk();
    if (isType()){
      const qn = qname();
      if (qn.v === 'string' || qn.v === 'vector') { if (!qn.q && !usingStd && !usingNames.has(qn.v)) cerr(line, "'" + qn.v + "' was not declared in this scope; did you mean 'std::" + qn.v + "'?", "Add  using namespace std;  under the #include lines, or write std::" + qn.v + '.'); }
      if (qn.v === 'vector'){
        if (!inc.has('vector')) cerr(line, "'vector' was not declared in this scope", "Did you forget  #include <vector>  at the top?");
        want('<', 'after vector'); const el = type(); if (el.ref) cerr(line, 'a vector cannot hold references');
        if (is('>>')){ T[p] = { k: 'op', v: '>', line: T[p].line }; T.splice(p, 0, { k: 'op', v: '>', line: T[p].line }); }
        want('>', 'to close vector<'); ty = 'vector<' + el.t + '>';
      } else if (qn.v === 'long'){ eat('long'); eat('int'); ty = 'long'; }
      else if (qn.v === 'short'){ eat('int'); ty = 'int'; }
      else if (qn.v === 'float') ty = 'double';
      else ty = qn.v;
    } else if (unsigned) ty = 'int';
    else cerr(t.line, 'expected a type before ' + desc(t));
    while (is('const')) { p++; cnst = true; }
    let ref = false; if (eat('&')) ref = true;
    if (is('*')) cerr(pk().line, 'pointers are not in this mini C++ (yet)', 'Use a reference (int &x) or a vector instead.');
    return { t: ty, ref, cnst, line };
  }

  // expressions, lowest to highest precedence
  const ASG = new Set(['=', '+=', '-=', '*=', '/=', '%=']);
  function expr(){ return assign(); }
  function assign(){
    const l = ternary();
    if (pk().k === 'op' && ASG.has(pk().v)){ const t = nx(); return { k: 'asg', op: t.v, l, r: assign(), line: t.line }; }
    return l;
  }
  function ternary(){
    const c = bin(0);
    if (is('?')){ const t = nx(); const a = assign(); want(':', 'in ?:'); const b = assign(); return { k: 'cond', c, a, b, line: t.line }; }
    return c;
  }
  const LV = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '<=', '>', '>='], ['<<', '>>'], ['+', '-'], ['*', '/', '%']];
  function bin(lv){
    if (lv === LV.length) return unary();
    let l = bin(lv + 1);
    while (pk().k === 'op' && LV[lv].includes(pk().v)){ const t = nx(); l = { k: 'bin', op: t.v, l, r: bin(lv + 1), line: t.line }; }
    return l;
  }
  function unary(){
    const t = pk();
    if (t.k === 'op' && ['!', '-', '+', '++', '--', '~'].includes(t.v)){ p++; return { k: 'un', op: t.v, e: unary(), line: t.line }; }
    if (t.k === 'op' && t.v === '(' && isType(1) && !is('(', 2)){ p++; const ty = type(); want(')'); return { k: 'cast', t: ty.t, e: unary(), line: t.line }; }
    if (t.k === 'id' && t.v === 'static_cast'){ p++; want('<'); const ty = type(); want('>'); want('('); const e = expr(); want(')'); return post({ k: 'cast', t: ty.t, e, line: t.line }); }
    return post(primary());
  }
  function args(){ const a = []; if (!is(')')) do a.push(expr()); while (eat(',')); want(')'); return a; }
  function post(e){
    for (;;){
      const t = pk();
      if (is('(')){ p++; e = { k: 'call', f: e, a: args(), line: t.line }; }
      else if (is('[')){ p++; const i = expr(); want(']'); e = { k: 'idx', e, i, line: t.line }; }
      else if (is('.')){ p++; const m = ident('a member name'); e = { k: 'mem', e, m, line: t.line }; }
      else if (is('++') || is('--')){ p++; e = { k: 'post', op: t.v, e, line: t.line }; }
      else if (is('->')) cerr(t.line, 'pointers (->) are not in this mini C++', 'Use a dot instead.');
      else return e;
    }
  }
  function primary(){
    const t = pk();
    if (t.k === 'num'){ p++; return { k: 'lit', v: t.v, t: t.d ? 'double' : (Math.abs(t.v) > 2147483647 ? 'long' : 'int'), line: t.line }; }
    if (t.k === 'str'){ p++; let v = t.v; while (pk().k === 'str') v += nx().v; return { k: 'lit', v, t: 'cstr', line: t.line }; }
    if (t.k === 'chr'){ p++; return { k: 'lit', v: t.v, t: 'char', line: t.line }; }
    if (t.k === 'op' && t.v === '('){ p++; const e = expr(); want(')'); return e; }
    if (t.k === 'op' && t.v === '{'){ p++; const a = []; if (!is('}')) do { if (is('}')) break; a.push(expr()); } while (eat(',')); want('}'); return { k: 'list', a, line: t.line }; }
    if (t.k === 'id'){
      if (t.v === 'true' || t.v === 'false'){ p++; return { k: 'lit', v: t.v === 'true', t: 'bool', line: t.line }; }
      if (KEYW.has(t.v) && !isType()) cerr(t.line, 'expected an expression before ' + desc(t), /^(else|case|default)$/.test(t.v) ? 'An ' + t.v + ' has to come right after the closing } of its ' + (t.v === 'else' ? 'if' : 'switch') + '.' : '');
      if ((is('string') && is('::', 1)) || (is('std') && is('string', 2) && is('::', 3))){ p += is('std') ? 4 : 2; if (!is('npos')) cerr(t.line, 'only string::npos is in this mini C++'); p++; return { k: 'lit', v: -1, t: 'long', line: t.line }; }
      if (isType()){ const ty = type(); if (is('(') || is('{')){ const open = nx().v; const a = []; if (!is(open === '(' ? ')' : '}')) do a.push(expr()); while (eat(',')); want(open === '(' ? ')' : '}'); return { k: 'ctor', t: ty.t, a, line: t.line }; }
        cerr(t.line, 'expected primary-expression before ' + desc(pk()), 'A type name like ' + ty.t + ' can\'t be used as a value here.'); }
      const qn = qname();
      return { k: 'name', v: qn.v, q: qn.q, line: t.line };
    }
    cerr(t.line, 'expected primary-expression before ' + desc(t), t.v === ')' ? 'Something is missing inside the brackets.' : t.v === ';' ? 'The line ends before the expression is finished.' : '');
  }

  // statements
  function block(){ const t = want('{'); const b = []; while (!is('}')){ if (pk().k === 'eof') cerr(t.line, "expected '}' at end of input", 'The { on line ' + t.line + ' was never closed. Every { needs a matching }.'); b.push(stmt()); } p++; return { k: 'block', b, line: t.line }; }
  function decl(ty, end = true){
    const ds = [];
    do {
      const line = pk().line; if (pk().k === 'id' && KEYW.has(pk().v)) cerr(line, "'" + pk().v + "' is a C++ keyword, it can't be a variable name");
      const name = ident('a variable name'); let n = null, init = null, ctor = null;
      if (is('(') && ty.t !== 'void'){ p++; ctor = is(')') ? [] : null; if (!ctor){ ctor = []; do ctor.push(expr()); while (eat(',')); } want(')'); }
      else {
        if (eat('[')){ n = is(']') ? null : expr(); want(']'); if (n === null && !is('=')) cerr(line, "array size missing in '" + name + "'"); n = n || { k: 'auto' }; }
        if (eat('=')) init = is('{') ? primary() : expr();
        else if (is('{')) init = primary();
      }
      ds.push({ name, n, init, ctor, line });
    } while (eat(','));
    if (end) want(';');
    return { k: 'decl', ty, ds, line: ty.line };
  }
  function stmt(){
    const t = pk();
    if (t.k === 'op' && t.v === '{') return block();
    if (t.k === 'op' && t.v === ';'){ p++; return { k: 'empty', line: t.line }; }
    if (t.k === 'id'){
      switch (t.v){
        case 'if': { p++; want('(', 'after if'); const c = expr(); want(')'); if (is(';')) {} const a = stmt(); let b = null; if (eat('else')) b = stmt(); return { k: 'if', c, a, b, line: t.line }; }
        case 'while': { p++; want('(', 'after while'); const c = expr(); want(')'); return { k: 'while', c, s: stmt(), line: t.line }; }
        case 'do': { p++; const s = stmt(); if (!is('while')) cerr(pk().line, "expected 'while' before " + desc(pk()), 'A do { ... } loop ends with  while (condition);'); p++; want('('); const c = expr(); want(')'); want(';'); return { k: 'do', c, s, line: t.line }; }
        case 'for': {
          p++; want('(', 'after for'); let init = null;
          if (isType()){ const ty = type(); const save = p; const name = ident('a variable name');
            if (eat(':')){ const e = expr(); want(')'); return { k: 'rfor', ty, name, e, s: stmt(), line: t.line }; }
            p = save; init = decl(ty, false); }
          else if (!is(';')) init = { k: 'expr', e: expr(), line: t.line };
          want(';'); const c = is(';') ? null : expr(); want(';'); const st = is(')') ? null : expr(); want(')');
          return { k: 'for', init, c, st, s: stmt(), line: t.line };
        }
        case 'switch': {
          p++; want('('); const e = expr(); want(')'); const ob = want('{'); const cases = [], body = [];
          while (!is('}')){
            if (pk().k === 'eof') cerr(ob.line, "expected '}' at end of input");
            if (is('case')){ const ct = nx(); const v = ternary(); want(':', 'after case'); cases.push({ v, at: body.length, line: ct.line }); }
            else if (is('default')){ p++; want(':', 'after default'); cases.push({ v: null, at: body.length, line: t.line }); }
            else body.push(stmt());
          }
          p++; return { k: 'switch', e, cases, body, line: t.line };
        }
        case 'break': case 'continue': p++; want(';'); return { k: t.v, line: t.line };
        case 'return': { p++; const e = is(';') ? null : expr(); want(';'); return { k: 'ret', e, line: t.line }; }
        case 'else': cerr(t.line, "'else' without a previous 'if'", 'An else has to come right after the if\'s block. Is there a ; after the if ( ... ) or a missing { } ?');
        case 'case': case 'default': cerr(t.line, "'" + t.v + "' not within a switch statement");
        case 'struct': case 'class': cerr(t.line, t.v + 'es are not in this mini C++ (yet)', 'Use separate variables or vectors for now.');
      }
      if (isType()) return decl(type());
    }
    const e = expr(); want(';'); return { k: 'expr', e, line: t.line };
  }

  // top level: using, functions, prototypes, globals
  const top = [];
  while (pk().k !== 'eof'){
    const t = pk();
    if (is('using')){ p++; if (eat('namespace')){ const ns = ident('a namespace name'); if (ns !== 'std') cerr(t.line, "'" + ns + "' is not a namespace-name", 'The one you want is  using namespace std;'); usingStd = true; }
      else { if (!(is('std') && is('::', 1))) cerr(t.line, 'expected nested-name-specifier'); p += 2; usingNames.add(ident()); } want(';'); continue; }
    if (is(';')){ p++; continue; }
    if (!isType()){
      if (t.k === 'id' && is('(', 1)) cerr(t.line, "'" + t.v + "' does not name a type", 'Statements like this belong inside a function, usually inside  int main() { ... }. A function needs a return type in front: int ' + t.v + '() or void ' + t.v + '().');
      if (t.k === 'id' && /^(cout|cin|if|for|while|return)$/.test(t.v)) cerr(t.line, (t.v === 'cout' || t.v === 'cin' ? "'" + t.v + "' does not name a type" : "expected unqualified-id before '" + t.v + "'"), 'This line is outside of every function. Put it inside  int main() { ... }');
      if (t.k === 'op' && t.v === '}') cerr(t.line, "expected declaration before '}' token", 'There is one } too many. Every } must close a { that came before it.');
      cerr(t.line, 'expected unqualified-id before ' + desc(t), 'At the top level only #include, using, functions and global variables can go.');
    }
    const ty = type(), nt = pk();
    if (nt.k === 'id' && is('(', 1)){
      const name = nx().v; p++; const ps = [];
      if (!is(')')) do { if (is('void') && is(')', 1)){ p++; break; } const pt = type(); if (pt.t === 'void') cerr(pt.line, "parameter can't be void"); const pn = pk().k === 'id' ? nx().v : null; let arr = false; if (eat('[')){ want(']'); arr = true; } ps.push({ t: arr ? 'array<' + pt.t + '>' : pt.t, ref: pt.ref || arr, cnst: pt.cnst, name: pn, line: pt.line }); } while (eat(','));
      want(')');
      if (eat(';')){ top.push({ k: 'fn', name, ret: ty.t, ps, body: null, line: nt.line }); continue; }
      if (!is('{')) cerr(pk().line, "expected '{' before " + desc(pk()), 'A function\'s body goes in { curly brackets }.' + (is(';') ? '' : ''));
      top.push({ k: 'fn', name, ret: ty.t, ps, body: block(), line: nt.line });
      continue;
    }
    top.push(decl(ty));
  }
  return { top, inc, usingStd, usingNames };
}

// ── checker: names and types, before anything runs ─────────────
const NUMT = new Set(['int', 'long', 'double', 'char', 'bool']);
const isNum = t => NUMT.has(t), isStr = t => t === 'string' || t === 'cstr', isVec = t => /^vector</.test(t), isArr = t => /^array</.test(t);
const elemOf = t => t.slice(t.indexOf('<') + 1, -1);
const tn = t => t === 'string' ? 'std::string' : t === 'cstr' ? 'const char*' : isVec(t) ? 'std::vector<' + tn(elemOf(t)) + '>' : isArr(t) ? tn(elemOf(t)) + '[]' : t === 'ostream' ? 'std::ostream' : t === 'istream' ? 'std::istream' : t === 'long' ? 'long long' : t;
const promote = (a, b) => a === 'double' || b === 'double' ? 'double' : a === 'long' || b === 'long' ? 'long' : 'int';
function assignable(to, from){
  if (isNum(to)) return isNum(from);
  if (to === 'string') return isStr(from) || from === 'char';
  if (from === 'list') return isVec(to) || isArr(to);
  return to === from;
}
const STDV = { cout: 'ostream', cin: 'istream', endl: 'manip', fixed: 'manip', boolalpha: 'manip', noboolalpha: 'manip', flush: 'manip', left: 'manip', right: 'manip', ws: 'manip' };
const STDF = new Set(['to_string', 'stoi', 'stod', 'stol', 'max', 'min', 'swap', 'getline', 'sort', 'reverse', 'setprecision', 'setw', 'count', 'find']);
const CF = new Set(['rand', 'srand', 'time', 'abs', 'sqrt', 'pow', 'floor', 'ceil', 'round', 'toupper', 'tolower', 'isdigit', 'isalpha', 'isupper', 'islower', 'isspace', 'exit', 'system', 'fabs']);
const CV = { RAND_MAX: 'int', NULL: 'int', INT_MAX: 'int', INT_MIN: 'int' };

function check(prog){
  const { inc, usingStd, usingNames } = prog;
  const fns = new Map(), scopes = [new Map()], warns = [];
  let fn = null, loops = 0, sws = 0; const used = new Set();
  const err = (n, msg, help) => cerr(n.line, msg, help);
  const look = v => { for (let i = scopes.length - 1; i >= 0; i--){ const x = scopes[i].get(v); if (x) return x; } return null; };
  const sig = f => tn(f.ret) + ' ' + f.name + '(' + f.ps.map(p => tn(p.t) + (p.ref ? '&' : '')).join(', ') + ')';
  function stdOk(n, name){
    if (n.q || usingStd || usingNames.has(name)) {
      if (/^(cout|cin|endl|getline)$/.test(name) && !inc.has('iostream')) err(n, "'" + name + "' was not declared in this scope", 'Did you forget  #include <iostream>  at the top? It brings in cout, cin and endl.');
      if (/^(setprecision|setw)$/.test(name) && !inc.has('iomanip')) err(n, "'" + name + "' was not declared in this scope", 'Did you forget  #include <iomanip>  at the top?');
      return;
    }
    err(n, "'" + name + "' was not declared in this scope; did you mean 'std::" + name + "'?", 'Add  using namespace std;  under the #include lines, or write std::' + name + '.');
  }
  const lval = n => n.k === 'name' ? !!n.var : n.k === 'idx' ? true : n.k === 'call' && n.f.k === 'mem' && /^(at|back|front)$/.test(n.f.m) && !isStr(n.f.e.t);
  const cnstOf = n => n.k === 'name' ? n.var && n.var.cnst : n.k === 'idx' || n.k === 'call' ? cnstOf(n.k === 'idx' ? n.e : n.f.e) : false;
  function needLv(n, what){
    if (!lval(n)) err(n, 'lvalue required as ' + what, n.k === 'lit' ? 'You can only put a value into a variable, not into a number or text.' : 'The left side has to be a variable.');
    if (cnstOf(n)) err(n, 'assignment of read-only variable' + (n.k === 'name' ? " '" + n.v + "'" : ''), 'It was declared const, so it can never change.');
  }
  const boolish = (n, where) => { if (!isNum(n.t) && n.t !== 'istream') err(n, "could not convert '" + tn(n.t) + "' to 'bool'", where ? 'The condition of ' + where + ' needs to be true or false, like  x > 5  or  name == "Sam"' : ''); };

  function ex(n){ n.t = exT(n); return n.t; }
  function exT(n){
    switch (n.k){
      case 'lit': return n.t;
      case 'list': n.a.forEach(ex); return 'list';
      case 'name': {
        const v = look(n.v);
        if (v && !n.q){ n.var = v; return v.t; }
        if (fns.has(n.v) && !n.q) err(n, "the function '" + n.v + "' needs brackets to be called", 'Write ' + n.v + '() with round brackets.');
        if (n.v in STDV){ stdOk(n, n.v); n.std = n.v; return STDV[n.v]; }
        if (n.v in CV){ n.cv = n.v; return CV[n.v]; }
        if (STDF.has(n.v) || CF.has(n.v)) err(n, "the function '" + n.v + "' needs brackets to be called", 'Write ' + n.v + '(...)');
        const near = [...scopes.flatMap(s => [...s.keys()]), ...fns.keys()].find(k => k.toLowerCase() === n.v.toLowerCase());
        err(n, "'" + n.v + "' was not declared in this scope" + (near ? "; did you mean '" + near + "'?" : ''), near ? 'C++ cares about capital letters: ' + near + ' and ' + n.v + ' are different names.' : 'Every variable has to be declared with its type first, like  int ' + n.v + ' = 0;  (and above the line that uses it).');
      }
      case 'cast': { const t = ex(n.e); if (!isNum(n.t) || !isNum(t)) err(n, "invalid cast from type '" + tn(t) + "' to type '" + tn(n.t) + "'", isStr(t) && isNum(n.t) ? 'To turn text into a number, use stoi(text) or stod(text).' : isNum(t) && n.t === 'string' ? 'To turn a number into text, use to_string(number).' : ''); return n.t; }
      case 'ctor': {
        const a = n.a.map(ex);
        if (isNum(n.t)){ if (a.length > 1 || (a.length && !isNum(a[0]))) err(n, 'invalid conversion to ' + tn(n.t)); return n.t; }
        if (n.t === 'string'){ if (!(a.length === 0 || (a.length === 1 && isStr(a[0])) || (a.length === 2 && isNum(a[0]) && a[1] === 'char'))) err(n, 'no matching constructor for std::string', "string(3, 'a') makes \"aaa\"."); return 'string'; }
        if (isVec(n.t)){ if (a.length > 2 || (a[0] && !isNum(a[0])) || (a[1] && !assignable(elemOf(n.t), a[1]))) err(n, 'no matching constructor for ' + tn(n.t), 'vector<int> v(5, 0) makes five zeros.'); return n.t; }
        err(n, 'cannot construct ' + tn(n.t));
      }
      case 'idx': {
        const t = ex(n.e), i = ex(n.i);
        if (!isVec(t) && !isArr(t) && !isStr(t)) err(n, "invalid types '" + tn(t) + "[" + tn(i) + "]' for array subscript", 'Only vectors, arrays and strings have [index].');
        if (!isNum(i) || i === 'double') err(n, 'array subscript is not an integer', 'An index must be a whole number, like v[0] or v[i].');
        return isStr(t) ? 'char' : elemOf(t);
      }
      case 'mem': err(n, "invalid use of member function '" + n.m + "' (did you forget the '()' ?)", 'Write .' + n.m + '() with round brackets.');
      case 'call': return call(n);
      case 'post': case 'un': {
        const t = ex(n.e);
        if (n.op === '++' || n.op === '--'){ needLv(n.e, n.op === '++' ? 'increment operand' : 'decrement operand'); if (!isNum(t) || t === 'bool') err(n, "no match for 'operator" + n.op + "' (operand type is '" + tn(t) + "')", n.op + ' adds or takes away 1 from a number.'); return t; }
        if (n.op === '!'){ boolish(n.e); return 'bool'; }
        if (!isNum(t)) err(n, "no match for 'operator" + n.op + "' (operand type is '" + tn(t) + "')");
        return n.op === '~' ? 'int' : promote(t, 'int');
      }
      case 'cond': { boolish(ex(n.c) && n.c); const a = ex(n.a), b = ex(n.b);
        if (isNum(a) && isNum(b)) return a === b ? a : promote(a, b);
        if (isStr(a) && isStr(b)) return a === 'cstr' && b === 'cstr' ? 'cstr' : 'string';
        if (a === b) return a;
        err(n, "operands to ?: have different types '" + tn(a) + "' and '" + tn(b) + "'", 'Both sides of the : need the same kind of value.'); }
      case 'asg': {
        const l = ex(n.l), r = ex(n.r); needLv(n.l, 'left operand of assignment');
        if (n.op === '='){
          if (!assignable(l, r)) err(n, "cannot convert '" + tn(r) + "' to '" + tn(l) + "' in assignment", isNum(l) && isStr(r) ? 'Text and numbers are different types in C++. stoi("42") turns text into a number.' : l === 'string' && isNum(r) ? 'to_string(42) turns a number into text.' : '');
          if (isArr(l)) err(n, 'invalid array assignment', 'An array can\'t be assigned all at once. Use a vector, or set each item.');
          if (l === 'int' && r === 'double' && n.r.k === 'lit') warns.push({ line: n.line, msg: 'the decimal part of ' + n.r.v + ' is cut off: an int only holds whole numbers' });
          return l;
        }
        if (l === 'string' && n.op === '+=' && (isStr(r) || r === 'char')) return l;
        if (!isNum(l) || !isNum(r)) err(n, "no match for 'operator" + n.op + "' (operand types are '" + tn(l) + "' and '" + tn(r) + "')", l === 'string' && isNum(r) ? 'To add a number to text, use to_string(number).' : '');
        if (n.op === '%=' && (l === 'double' || r === 'double')) err(n, "invalid operands of types '" + tn(l) + "' and '" + tn(r) + "' to binary 'operator%'", '% only works on whole numbers (int).');
        return l;
      }
      case 'bin': return bin(n);
    }
    err(n, 'this mini C++ does not understand this expression');
  }
  function bin(n){
    const l = ex(n.l), r = ex(n.r), op = n.op;
    if (/^iter</.test(l)){ if ((op === '+' || op === '-') && isNum(r) && r !== 'double'){ n.it = true; return l; } err(n, 'a position like v.begin() can only move by + or - a whole number'); }
    if (op === '<<' && l === 'ostream'){
      if (isVec(r) || isArr(r)) err(n, "no match for 'operator<<' (operand types are 'std::ostream' and '" + tn(r) + "')", 'cout can\'t print a whole vector at once. Loop over it and print each item.');
      if (r === 'istream' || r === 'ostream' || r === 'void') err(n, "no match for 'operator<<' (operand types are 'std::ostream' and '" + tn(r) + "')", r === 'void' ? 'That function returns nothing (void), so there is nothing to print.' : '');
      return 'ostream';
    }
    if (op === '>>' && l === 'istream'){
      if (!lval(n.r) || !(isNum(r) || r === 'string') || r === 'manip') { if (n.r.std === 'ws') return 'istream';
        err(n, "no match for 'operator>>' (operand types are 'std::istream' and '" + tn(r) + "')", n.r.k === 'lit' ? 'cin >> needs a variable to put the answer in.' : n.r.std === 'endl' ? 'endl is only for cout. For cin, just  cin >> x;' : ''); }
      if (cnstOf(n.r)) err(n, 'cannot read into a const variable');
      return 'istream';
    }
    if (l === 'istream' && op === '<<') err(n, "no match for 'operator<<' (operand types are 'std::istream' and '" + tn(r) + "')", 'cin reads with >> (arrows point into the variable). cout prints with <<.');
    if (l === 'ostream' && op === '>>') err(n, "no match for 'operator>>' (operand types are 'std::ostream' and '" + tn(r) + "')", 'cout prints with << (arrows point toward cout). cin reads with >>.');
    if (op === '&&' || op === '||'){ boolish(n.l); boolish(n.r); return 'bool'; }
    if (op === '+' && (isStr(l) || isStr(r))){
      if ((isStr(l) && (isStr(r) || r === 'char')) || (l === 'char' && isStr(r))){
        if (l === 'cstr' && (r === 'cstr' || r === 'char')) err(n, "invalid operands of types 'const char*' and '" + tn(r) + "' to binary 'operator+'", 'Two "quoted" texts can\'t be added in C++. Make the first one a string: string("Hi ") + "there", or just use << twice.');
        return 'string';
      }
      err(n, "no match for 'operator+' (operand types are '" + tn(l) + "' and '" + tn(r) + "')", 'C++ won\'t glue a number onto text. Use to_string(number), or print them with << one after the other.');
    }
    if (['==', '!=', '<', '<=', '>', '>='].includes(op)){
      if (isNum(l) && isNum(r)) return 'bool';
      if (isStr(l) && isStr(r)){ if (l === 'cstr' && r === 'cstr') err(n, 'comparing two quoted texts compares where they live in memory, not the letters', 'Put one of them in a string variable first.'); return 'bool'; }
      if ((isVec(l) && l === r)) return 'bool';
      err(n, "no match for 'operator" + op + "' (operand types are '" + tn(l) + "' and '" + tn(r) + "')", (isStr(l) && r === 'char') || (l === 'char' && isStr(r)) ? 'A char in \'single quotes\' and a string in "double quotes" are different types. Use "x" instead of \'x\'.' : isStr(l) || isStr(r) ? 'Text can only be compared with text.' : '');
    }
    if (!isNum(l) || !isNum(r)) err(n, "invalid operands of types '" + tn(l) + "' and '" + tn(r) + "' to binary 'operator" + op + "'", isVec(l) || isVec(r) ? 'Maths works on single numbers, like v[0], not on a whole vector.' : '');
    if ((op === '%' || op === '&' || op === '|' || op === '^' || op === '<<' || op === '>>') && (l === 'double' || r === 'double')) err(n, "invalid operands of types '" + tn(l) + "' and '" + tn(r) + "' to binary 'operator" + op + "'", op === '%' ? '% (remainder) only works on whole numbers (int).' : '');
    return op === '<<' || op === '>>' || op === '&' || op === '|' || op === '^' ? promote(l, 'int') : promote(l, r);
  }
  function args(n, want){
    n.a.forEach(ex);
    if (n.a.length !== want.length) err(n, 'wrong number of arguments: ' + n.a.length + ' given, ' + want.length + ' wanted');
  }
  function call(n){
    const f = n.f;
    if (f.k === 'mem') return method(n);
    if (f.k !== 'name') err(n, 'expression cannot be used as a function');
    const user = !f.q && fns.get(f.v), v = !f.q && look(f.v);
    if (v) err(n, "'" + f.v + "' cannot be used as a function", "It's a variable, not a function.");
    if (user){
      n.fn = user; used.add(user.name); const a = n.a.map(ex);
      if (a.length !== user.ps.length) err(n, 'too ' + (a.length < user.ps.length ? 'few' : 'many') + " arguments to function '" + sig(user) + "'", user.name + ' takes ' + (user.ps.length || 'no') + ' value' + (user.ps.length === 1 ? '' : 's') + ' in its brackets, and this call gives ' + a.length + '.');
      user.ps.forEach((p, i) => {
        if (!assignable(p.t.replace(/^array</, 'vector<'), a[i].replace(/^array</, 'vector<')) && !(isArr(p.t) && isArr(a[i]) && elemOf(p.t) === elemOf(a[i]))) err(n.a[i], "cannot convert '" + tn(a[i]) + "' to '" + tn(p.t) + "' for argument " + (i + 1) + " of '" + sig(user) + "'");
        if (p.ref && !p.cnst && !lval(n.a[i])) err(n.a[i], "cannot bind non-const lvalue reference of type '" + tn(p.t) + "&' to an rvalue", 'The parameter ' + (p.name || '') + ' is a reference (&), so the call has to pass a variable, not a value.');
        if (p.ref && !p.cnst && p.t !== a[i] && !isArr(p.t)) err(n.a[i], "cannot bind reference of type '" + tn(p.t) + "&' to a '" + tn(a[i]) + "'", 'A reference has to be the exact same type.');
      });
      return user.ret;
    }
    const b = f.v; n.bi = b;
    if (STDF.has(b) && !CF.has(b)) stdOk(f, b);
    else if (!CF.has(b)){
      const later = prog.top.find(d => d.k === 'fn' && d.name === b);
      err(n, "'" + b + "' was not declared in this scope", later ? 'C++ reads from top to bottom, and ' + b + ' is written further down (line ' + later.line + '). Move it above the function that calls it, or put a declaration line like  ' + tn(later.ret) + ' ' + b + '(' + later.ps.map(p => tn(p.t) + (p.ref ? '&' : '')).join(', ') + ');  near the top.' : 'C++ doesn\'t know a function called ' + b + '. Check the spelling, or write the function above where you use it.');
    }
    const a = n.a.map(ex), A = (k, msg) => { if (a.length !== k) err(n, (a.length < k ? 'too few' : 'too many') + " arguments to function '" + b + "'", msg); };
    const num = (i, what) => { if (!isNum(a[i])) err(n.a[i], "cannot convert '" + tn(a[i]) + "' to a number for '" + b + "'", what || ''); };
    switch (b){
      case 'to_string': A(1); num(0, 'to_string turns a number into text.'); return 'string';
      case 'stoi': case 'stol': case 'stod': A(1); if (!isStr(a[0])) err(n, "no matching function for call to '" + b + "(" + tn(a[0]) + ")'", b + ' turns text into a number. Give it a string.'); return b === 'stod' ? 'double' : b === 'stol' ? 'long' : 'int';
      case 'max': case 'min': A(2); num(0); num(1); if (a[0] !== a[1] && !(n.a[1].k === 'lit' && a[0] !== 'bool')) err(n, "no matching function for call to '" + b + "(" + tn(a[0]) + ", " + tn(a[1]) + ")'", b + ' needs two values of the same type. Write 2.0 instead of 2 for a double, or cast one of them.'); return a[0];
      case 'swap': A(2); needLv(n.a[0], 'swap argument'); needLv(n.a[1], 'swap argument'); if (a[0] !== a[1]) err(n, 'swap needs two variables of the same type'); return 'void';
      case 'getline': if (a.length < 2 || a.length > 3) A(2); if (a[0] !== 'istream') err(n, 'getline reads from cin: getline(cin, text)'); if (a[1] !== 'string' || !lval(n.a[1])) err(n.a[1], 'getline needs a string variable to put the line in', 'Like  string name;  getline(cin, name);'); if (a[2] && a[2] !== 'char') err(n, "getline's third value is the char to stop at, like ','"); return 'istream';
      case 'sort': case 'reverse': A(2); if (!/^iter</.test(a[0]) || a[0] !== a[1]) err(n, b + ' needs a range: ' + b + '(v.begin(), v.end())'); return 'void';
      case 'count': case 'find': A(3); if (!/^iter</.test(a[0]) || a[0] !== a[1]) err(n, b + ' needs a range first: ' + b + '(v.begin(), v.end(), value)'); if (!assignable(elemOf(a[0]), a[2])) err(n, b + ' looks for a value of the vector\'s own type'); return b === 'count' ? 'int' : a[0];
      case 'setprecision': case 'setw': A(1); num(0); return 'manip';
      case 'rand': A(0); return 'int';
      case 'srand': A(1); num(0); return 'void';
      case 'time': A(1); return 'long';
      case 'abs': case 'fabs': A(1); num(0); return b === 'fabs' ? 'double' : promote(a[0], 'int');
      case 'sqrt': case 'floor': case 'ceil': case 'round': A(1); num(0); return 'double';
      case 'pow': A(2); num(0); num(1); return 'double';
      case 'toupper': case 'tolower': A(1); num(0); return 'int';
      case 'isdigit': case 'isalpha': case 'isupper': case 'islower': case 'isspace': A(1); num(0); return 'bool';
      case 'exit': A(1); num(0); return 'void';
      case 'system': A(1); if (a[0] !== 'cstr') err(n, 'system needs a command in quotes'); return 'int';
    }
    err(n, "'" + b + "' was not declared in this scope");
  }
  function method(n){
    const f = n.f, t = ex(f.e), a = n.a.map(ex), m = f.m;
    const A = k => { if (a.length !== k) err(n, (a.length < k ? 'too few' : 'too many') + " arguments to '" + m + "'", k ? '.' + m + ' takes ' + k + ' value' + (k > 1 ? 's' : '') + ' in its brackets.' : '.' + m + '() takes nothing in its brackets.'); };
    const bad = () => err(n, "'" + tn(t) + "' has no member named '" + m + "'", isVec(t) && m === 'append' ? 'In C++ you add to a vector with .push_back(x).' : isVec(t) && m === 'length' ? 'A vector uses .size().' : isNum(t) ? 'A ' + tn(t) + ' is a plain value, it has no . methods.' : '');
    if (t === 'istream'){
      if (m === 'get'){ A(0); return 'int'; } if (m === 'ignore'){ if (a.length > 2) A(2); return 'istream'; }
      if (m === 'fail' || m === 'eof' || m === 'good'){ A(0); return 'bool'; } if (m === 'clear'){ A(0); return 'void'; }
      bad();
    }
    if (isStr(t)){
      if (t === 'cstr') err(n, "request for member '" + m + "' in a quoted text, which is not a string", 'Put the text in a string variable first.');
      switch (m){
        case 'size': case 'length': A(0); return 'int';
        case 'empty': A(0); return 'bool';
        case 'substr': if (a.length < 1 || a.length > 2) A(2); a.forEach((x, i) => { if (!isNum(x)) err(n.a[i], 'substr takes numbers: substr(start, howMany)'); }); return 'string';
        case 'find': if (a.length !== 1) A(1); if (!isStr(a[0]) && a[0] !== 'char') err(n, 'find looks for text or a char'); return 'long';
        case 'push_back': A(1); if (a[0] !== 'char') err(n, 'a string\'s push_back adds one char'); return 'void';
        case 'pop_back': case 'clear': A(0); needLv(f.e, 'object of ' + m); return 'void';
        case 'back': case 'front': A(0); return 'char';
        case 'at': A(1); num(0); return 'char';
        case 'append': A(1); if (!isStr(a[0])) err(n, 'append adds text'); return 'string';
      }
      bad();
    }
    if (isVec(t)){
      const el = elemOf(t);
      switch (m){
        case 'push_back': A(1); if (!assignable(el, a[0])) err(n, "no matching function for call to 'push_back(" + tn(a[0]) + ")'", 'This vector holds ' + tn(el) + ' values, so only a ' + tn(el) + ' fits in.'); if (!lval(f.e)) err(n, 'push_back on a temporary'); return 'void';
        case 'pop_back': case 'clear': A(0); return 'void';
        case 'size': A(0); return 'int';
        case 'empty': A(0); return 'bool';
        case 'back': case 'front': A(0); return el;
        case 'at': A(1); if (!isNum(a[0])) err(n, 'at needs a number'); return el;
        case 'begin': case 'end': A(0); if (!lval(f.e)) err(n, 'begin/end on a temporary'); return 'iter<' + el + '>';
        case 'erase': if (a.length !== 1 && a.length !== 2) A(1); a.forEach(x => { if (x !== 'iter<' + el + '>') err(n, 'erase takes a position like v.begin() + 2'); }); return 'void';
        case 'insert': A(2); if (a[0] !== 'iter<' + el + '>' || !assignable(el, a[1])) err(n, 'insert takes a position and a value: v.insert(v.begin() + 1, x)'); return 'void';
      }
      bad();
    }
    bad();
  }

  function decl(d){
    let base = d.ty.t; if (base === 'void') err(d, "variable or field declared void", 'void means "nothing": a variable needs a real type like int or string.');
    for (const x of d.ds){
      let t = base;
      if (x.n){ t = 'array<' + base + '>'; if (x.n.k !== 'auto' && (ex(x.n) === 'double' || !isNum(x.n.t))) err(x, "size of array '" + x.name + "' has non-integral type"); if (d.ty.ref) err(x, 'arrays of references are not allowed'); }
      if (x.init){
        const it = ex(x.init);
        if (t === 'auto'){ if (it === 'list' || it === 'void' || it === 'manip' || /stream/.test(it)) err(x, "unable to deduce 'auto' from this value"); t = it === 'cstr' ? 'cstr' : it; }
        else if (x.init.k === 'list'){
          if (isNum(t) || t === 'string'){ if (x.init.a.length !== 1 || !assignable(t, x.init.a[0].t)) err(x, "cannot convert a {list} to '" + tn(t) + "'"); }
          else if (!isVec(t) && !isArr(t)) err(x, "cannot convert a {list} to '" + tn(t) + "'");
          else { const el = elemOf(t); x.init.a.forEach(e => { if (!assignable(el, e.t) && !(e.k === 'list' && (isVec(el) || isArr(el)))) err(e, "cannot convert '" + tn(e.t) + "' to '" + tn(el) + "' in initialization", 'Every item in a ' + tn(t) + ' must be a ' + tn(el) + '.'); if (e.k === 'list' && isVec(el)) e.a.forEach(q => { if (!assignable(elemOf(el), q.t)) err(q, 'wrong type inside the inner list'); }); });
            if (isArr(t) && x.n.k !== 'auto' && x.n.k === 'lit' && x.init.a.length > x.n.v) err(x, 'too many initializers for ' + tn(base) + '[' + x.n.v + ']'); }
        } else if (isArr(t)) err(x, 'an array is filled with a {list} of values');
        else if (!assignable(t, it)) err(x, "cannot convert '" + tn(it) + "' to '" + tn(t) + "' in initialization", isNum(t) && isStr(it) ? 'Text in "quotes" can\'t go in a number variable. Did you mean  string ' + x.name + ' = ...?' : t === 'string' && isNum(it) ? 'A number can\'t go straight into a string. Use to_string(...), or make the variable an int.' : '');
        if (d.ty.ref){ if (!lval(x.init)) err(x, 'a reference has to point at a variable'); if (t !== it) err(x, 'a reference has to be the same type as its variable'); }
        if (t === 'int' && it === 'double' && x.init.k === 'lit') warns.push({ line: x.line, msg: 'the decimal part of ' + x.init.v + ' is cut off: an int only holds whole numbers' });
      } else if (x.ctor){
        const a = x.ctor.map(ex);
        if (isVec(t)){ if (a.length > 2 || (a[0] && !isNum(a[0])) || (a[1] && !assignable(elemOf(t), a[1]))) err(x, 'no matching constructor for ' + tn(t), 'vector<int> v(5, 0) makes five zeros.'); }
        else if (t === 'string'){ if (!(a.length === 2 && isNum(a[0]) && a[1] === 'char') && !(a.length === 1 && isStr(a[0]))) err(x, 'no matching constructor for std::string'); }
        else if (a.length !== 1 || !assignable(t, a[0])) err(x, 'cannot initialize ' + tn(t) + ' like that');
      } else {
        if (t === 'auto') err(x, "declaration of 'auto " + x.name + "' has no initializer", 'auto works out the type from the value, so it needs  = something.');
        if (d.ty.ref) err(x, "'" + x.name + "' declared as reference but not initialized");
        if (d.ty.cnst) err(x, "uninitialized 'const " + x.name + "'", 'A const needs its value right away, like  const int MAX = 10;');
        if (isArr(t) && x.n.k === 'auto') err(x, "array size missing in '" + x.name + "'");
      }
      const sc = scopes[scopes.length - 1];
      if (sc.has(x.name)) err(x, "redeclaration of '" + tn(sc.get(x.name).t) + ' ' + x.name + "'", x.name + ' already exists. Leave out the type to change it:  ' + x.name + ' = ...;');
      if (scopes.length === 1 && fns.has(x.name)) err(x, "'" + x.name + "' redeclared as a different kind of thing");
      x.t = t; sc.set(x.name, { t, cnst: d.ty.cnst, ref: d.ty.ref });
    }
  }
  function st(s){
    switch (s.k){
      case 'block': scopes.push(new Map()); s.b.forEach(st); scopes.pop(); return;
      case 'empty': return;
      case 'decl': decl(s); return;
      case 'expr': ex(s.e);
        if (s.e.k === 'bin' && ['==', '<', '>', '!=', '<=', '>='].includes(s.e.op)) warns.push({ line: s.line, msg: 'this line compares (' + s.e.op + ') but does nothing with the answer' + (s.e.op === '==' ? '. To put a value in, use one = sign' : '') });
        if (s.e.k === 'name' || s.e.k === 'lit') warns.push({ line: s.line, msg: 'this line does nothing' });
        return;
      case 'if': ex(s.c); boolish(s.c, 'if');
        if (s.c.k === 'asg' && s.c.op === '=') warns.push({ line: s.line, msg: 'suggest parentheses around assignment used as truth value. Did you mean == ? One = puts a value in, == compares' });
        if (s.a.k === 'empty') warns.push({ line: s.line, msg: 'there is a ; right after if ( ... ), so the if controls nothing and the next lines always run' });
        scopes.push(new Map()); st(s.a); scopes.pop(); if (s.b){ scopes.push(new Map()); st(s.b); scopes.pop(); } return;
      case 'while': case 'do': ex(s.c); boolish(s.c, s.k === 'do' ? 'do-while' : 'while');
        if (s.c.k === 'asg' && s.c.op === '=') warns.push({ line: s.line, msg: 'suggest parentheses around assignment used as truth value. Did you mean == ?' });
        if (s.k === 'while' && s.s.k === 'empty') warns.push({ line: s.line, msg: 'there is a ; right after while ( ... ), so the loop body is empty' });
        loops++; scopes.push(new Map()); st(s.s); scopes.pop(); loops--; return;
      case 'for': scopes.push(new Map()); if (s.init) st(s.init); if (s.c){ ex(s.c); boolish(s.c, 'for'); } if (s.st) ex(s.st);
        if (s.s.k === 'empty') warns.push({ line: s.line, msg: 'there is a ; right after for ( ... ), so the loop body is empty' });
        loops++; scopes.push(new Map()); st(s.s); scopes.pop(); loops--; scopes.pop(); return;
      case 'rfor': {
        const t = ex(s.e); if (!isVec(t) && !isArr(t) && !isStr(t)) err(s, "'" + tn(t) + "' can't be looped over with a range for", 'A range for goes through a vector, an array or a string.');
        const el = isStr(t) ? 'char' : elemOf(t); let vt = s.ty.t === 'auto' ? el : s.ty.t;
        if (!assignable(vt, el)) err(s, "cannot convert '" + tn(el) + "' to '" + tn(vt) + "'", 'The loop variable needs the same type as the items.');
        if (s.ty.ref && vt !== el) err(s, 'a reference loop variable has to be the exact item type');
        s.vt = vt; loops++; scopes.push(new Map([[s.name, { t: vt, cnst: s.ty.cnst, ref: s.ty.ref }]])); st(s.s); scopes.pop(); loops--; return;
      }
      case 'switch': {
        const t = ex(s.e); if (!isNum(t) || t === 'double') err(s, 'switch quantity not an integer', isStr(t) ? 'switch can\'t check strings in C++. Use if / else if with == instead.' : '');
        const seen = new Set();
        for (const c of s.cases){ if (!c.v) continue; ex(c.v); if (c.v.k !== 'lit' && !(c.v.k === 'un' && c.v.e.k === 'lit')) err(c, 'case label is not a constant', 'A case needs a fixed value like  case 1:  or  case \'a\':'); if (!isNum(c.v.t) || c.v.t === 'double') err(c, 'case label does not reduce to an integer constant', isStr(c.v.t) ? 'switch can\'t check text. Use if / else if instead.' : '');
          const v = c.v.k === 'lit' ? +c.v.v : -c.v.e.v; if (seen.has(v)) err(c, 'duplicate case value'); seen.add(v); }
        sws++; scopes.push(new Map()); s.body.forEach(st); scopes.pop(); sws--; return;
      }
      case 'break': if (!loops && !sws) err(s, 'break statement not within loop or switch'); return;
      case 'continue': if (!loops) err(s, 'continue statement not within a loop'); return;
      case 'ret': {
        if (!fn) return;
        if (fn.ret === 'void'){ if (s.e && ex(s.e) !== 'void') err(s, "return-statement with a value, in function returning 'void'", 'A void function gives nothing back. Write just  return;  or make it return a type like int.'); return; }
        if (!s.e) err(s, "return-statement with no value, in function returning '" + tn(fn.ret) + "'");
        const t = ex(s.e); if (!assignable(fn.ret, t)) err(s, "could not convert '" + tn(t) + "' to '" + tn(fn.ret) + "' in return", 'The function says it returns ' + tn(fn.ret) + '.');
        s.rt = fn.ret; return;
      }
    }
  }
  const retsAlways = s => !s ? false : s.k === 'ret' ? true : s.k === 'block' ? s.b.some(retsAlways) : s.k === 'if' ? retsAlways(s.a) && retsAlways(s.b) : (s.k === 'expr' && s.e.k === 'call' && s.e.bi === 'exit');
  for (const d of prog.top){
    if (d.k === 'decl'){ decl(d); continue; }
    const old = fns.get(d.name);
    if (old && (old.body && d.body)) err(d, "redefinition of '" + sig(d) + "'", 'There are two functions called ' + d.name + '. Give one of them another name.');
    if (old && (old.ps.length !== d.ps.length || old.ret !== d.ret)) err(d, "two different versions of '" + d.name + "' (overloading is not in this mini C++)", 'Give each function its own name.');
    if (scopes[0].has(d.name)) err(d, "'" + d.name + "' is already a global variable");
    if (d.name === 'main' && d.ret !== 'int') err(d, "'::main' must return 'int'", 'Write  int main()  and end it with  return 0;');
    if (old && !old.body){ old.body = d.body; old.ps = d.ps; } else fns.set(d.name, d);
    if (!d.body) continue;
    const real = fns.get(d.name);
    fn = d; scopes.push(new Map()); for (const p of d.ps){ if (!p.name) continue; if (scopes[1].has(p.name)) err(p, "redefinition of parameter '" + p.name + "'"); scopes[1].set(p.name, { t: p.t, cnst: p.cnst, ref: p.ref }); }
    d.body.b.forEach(st); scopes.pop(); fn = null; real.body = d.body; real.ps = d.ps;
    if (d.ret !== 'void' && d.name !== 'main' && !retsAlways(d.body)) warns.push({ line: d.line, msg: "control reaches end of non-void function '" + d.name + "': it can finish without a return" });
  }
  const main = fns.get('main');
  if (!main || !main.body) cerr(prog.top.length ? prog.top[prog.top.length - 1].line : 1, "undefined reference to `main'", 'Every C++ program starts in  int main() { ... }  and there isn\'t one.');
  for (const f of fns.values()) if (!f.body && used.has(f.name)) cerr(f.line, "undefined reference to `" + sig(f) + "'", 'This function was declared but its body { ... } was never written.');
  return { fns, warns };
}

// ── runtime: a tree walker ─────────────────────────────────────
class RErr extends Error { constructor(kind, line, msg, help){ super(msg); this.stage = kind; this.line = line; this.help = help || ''; } }
class Cell { constructor(v){ this.v = v; } get(){ return this.v; } set(v){ this.v = v; } }
class El { constructor(a, i){ this.a = a; this.i = i; } get(){ return this.a[this.i]; } set(v){ this.a[this.i] = v; } }
class Ch { constructor(r, i){ this.r = r; this.i = i; } get(){ return this.r.get().charCodeAt(this.i); } set(v){ const s = this.r.get(); this.r.set(s.slice(0, this.i) + String.fromCharCode(v) + s.slice(this.i + 1)); } }
const BRK = { b: 1 }, CNT = { c: 1 };
class Ret { constructor(v){ this.v = v; } }
class Exit { constructor(c){ this.code = c; } }
function conv(t, v){
  switch (t){
    case 'int': return typeof v === 'boolean' ? +v : (Math.trunc(v) | 0);
    case 'long': return typeof v === 'boolean' ? +v : (isFinite(v) ? Math.trunc(v) : 0);
    case 'double': return +v;
    case 'char': { const c = Math.trunc(+v) & 255; return c; }
    case 'bool': return !!v;
    case 'string': return typeof v === 'number' ? String.fromCharCode(v) : v;
  }
  return copy(t, v);
}
const copy = (t, v) => (isVec(t) || isArr(t)) && Array.isArray(v) ? v.map(x => copy(elemOf(t), x)) : v;
const zero = t => isNum(t) ? (t === 'bool' ? false : 0) : t === 'string' ? '' : isVec(t) ? [] : null;
function fmtG(x, prec){   /* how cout prints a double by default: like printf %g with 6 significant digits */
  if (isNaN(x)) return x < 0 ? '-nan' : 'nan'; if (!isFinite(x)) return x < 0 ? '-inf' : 'inf'; if (x === 0) return Object.is(x, -0) ? '-0' : '0';
  const p = Math.max(1, prec), e = x.toExponential(p - 1), X = +e.slice(e.indexOf('e') + 1);
  const strip = s => s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, '');
  if (X < -4 || X >= p){ const m = strip(e.slice(0, e.indexOf('e'))); return m + 'e' + (X < 0 ? '-' : '+') + String(Math.abs(X)).padStart(2, '0'); }
  return strip(x.toFixed(Math.max(0, p - 1 - X)));
}
function glibcRand(seed){   /* rand() as glibc does it, so a program that forgets srand prints 1804289383 first, like on Linux */
  const r = []; let w = (seed >>> 0) || 1; r.push(w | 0);
  for (let i = 1; i < 31; i++){ const hi = Math.trunc(w / 127773), lo = w % 127773; w = 16807 * lo - 2836 * hi; if (w < 0) w += 2147483647; r.push(w | 0); }
  for (let i = 31; i < 34; i++) r.push(r[i - 31]);
  for (let i = 34; i < 344; i++) r.push((r[i - 31] + r[i - 3]) | 0);
  let k = 344;
  return () => { const v = (r[k - 31] + r[k - 3]) | 0; r.push(v); k++; if (r.length > 4000){ r.splice(0, r.length - 64); k = r.length; } return (v >>> 1); };
}

function run(src, opt = {}){
  const write = opt.write || (() => {}), read = opt.read || (() => null), maxSteps = opt.maxSteps || 400000;
  let prog, info;
  try { prog = parse(src); info = check(prog); }
  catch (e){ if (e instanceof CErr) return { error: { stage: 'compile', line: e.line, msg: e.message, help: e.help }, warns: [] }; throw e; }
  const warns = info.warns.sort((a, b) => a.line - b.line);
  if (opt.compiled) opt.compiled(warns);
  let steps = 0, depth = 0, line = 0, inb = '', fail = false, eof = false, rnd = glibcRand(1), out = '';
  const fmt = { fixed: false, prec: 6, alpha: false, w: 0, left: false };
  const rerr = (n, msg, help) => { throw new RErr('runtime', n ? n.line : line, msg, help); };
  const tick = n => { if (++steps > maxSteps) throw new RErr('loop', n.line, 'your program kept going and never stopped', fail ? 'cin was given something that isn\'t a number. After that, cin stops reading, so the loop spun forever. Type a number next time.' : 'A loop needs a line inside it that changes something, so the loop can end.'); line = n.line; };
  const flush = () => { if (out){ write(out); out = ''; } };
  const put = s => { out += s; if (out.length > 4096) flush(); };
  const show = (t, v) => {
    let s;
    if (t === 'bool') s = fmt.alpha ? (v ? 'true' : 'false') : (v ? '1' : '0');
    else if (t === 'char') s = String.fromCharCode(v);
    else if (t === 'double') s = fmt.fixed ? v.toFixed(Math.min(100, fmt.prec)) : fmtG(v, fmt.prec);
    else s = String(v);
    if (fmt.w){ s = fmt.left ? s.padEnd(fmt.w) : s.padStart(fmt.w); fmt.w = 0; }
    put(s);
  };
  // cin: one buffer of typed text, filled a line at a time through read()
  function more(){ if (eof) return false; flush(); const l = read(); if (l === null || l === undefined){ eof = true; throw new RErr('input', line, 'the input box was cancelled, so the program stopped'); } inb += l + '\n'; return true; }
  function readInto(t, ref){
    if (fail) return;
    for (;;){ inb = inb.replace(/^\s+/, ''); if (inb) break; if (!more()) { fail = true; return; } }
    let m;
    if (t === 'char'){ ref.set(inb.charCodeAt(0)); inb = inb.slice(1); return; }
    if (t === 'string'){ m = inb.match(/^\S+/); ref.set(m[0]); inb = inb.slice(m[0].length); return; }
    if (t === 'double') m = inb.match(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/);
    else m = inb.match(/^[+-]?\d+/);
    if (!m){ fail = true; ref.set(conv(t, 0)); return; }
    inb = inb.slice(m[0].length); let v = +m[0];
    if (t === 'int' && (v > 2147483647 || v < -2147483648)){ fail = true; v = v > 0 ? 2147483647 : -2147483648; }
    if (t === 'bool'){ if (v !== 0 && v !== 1) fail = true; ref.set(v === 1); return; }
    ref.set(conv(t, v));
  }
  function getline(ref, stop){
    if (fail) return;
    if (!inb && !more()) { fail = true; return; }
    const ch = stop === undefined ? '\n' : String.fromCharCode(stop); let i = inb.indexOf(ch);
    while (i < 0 && ch !== '\n'){ if (!more()) break; i = inb.indexOf(ch); }
    if (i < 0) i = inb.indexOf('\n');
    ref.set(inb.slice(0, i)); inb = inb.slice(i + 1);
  }

  const globals = new Map();
  // environments: { vars: Map, up }
  const lookup = (env, name) => { for (let e = env; e; e = e.up){ const c = e.vars.get(name); if (c) return c; } return globals.get(name); };

  function lv(n, env){
    switch (n.k){
      case 'name': return lookup(env, n.v);
      case 'idx': {
        const i = ev(n.i, env);
        if (isStr(n.e.t)){ const r = lv(n.e, env), s = r.get(); if (i < 0 || i >= s.length) { if (i === s.length) return { get: () => 0, set(){ rerr(n, 'string index ' + i + ' is past the end'); } }; rerr(n, 'string index ' + i + ' is outside the text, which has ' + s.length + ' characters (0 to ' + (s.length - 1) + ')', 'Real C++ wouldn\'t warn you here: it would quietly read or break some other memory.'); } return new Ch(r, i); }
        const a = n.e.k === 'name' || n.e.k === 'idx' ? lv(n.e, env).get() : ev(n.e, env);
        if (i < 0 || i >= a.length) rerr(n, 'index ' + i + ' is outside the ' + (isArr(n.e.t) ? 'array' : 'vector') + ', which has ' + a.length + ' item' + (a.length === 1 ? '' : 's') + (a.length ? ' (0 to ' + (a.length - 1) + ')' : ''), 'Counting starts at 0, so the last item is size - 1. Real C++ wouldn\'t stop you here: it would quietly read or break some other memory.');
        return new El(a, i);
      }
      case 'call': {   // v.at(i), v.back(), v.front() as places you can assign to
        const a = lv(n.f.e, env).get(), m = n.f.m;
        if (!a.length) rerr(n, m + '() on an empty vector', 'There is nothing in it yet.');
        const i = m === 'at' ? ev(n.a[0], env) : m === 'back' ? a.length - 1 : 0;
        if (i < 0 || i >= a.length) rerr(n, "vector::at: index " + i + " is out of range (size is " + a.length + ')', 'at() checks the index for you, which is why it stopped here.');
        return new El(a, i);
      }
    }
    rerr(n, 'not a variable');
  }
  const arith = (t, op, a, b, n) => {
    if (t === 'double'){ switch (op){ case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; } }
    if ((op === '/' || op === '%') && b == 0) rerr(n, 'Floating point exception: division by zero', 'Dividing a whole number by 0 crashes a C++ program. Check the number before you divide.');
    a = +a; b = +b;
    switch (op){
      case '+': return conv(t, a + b);
      case '-': return conv(t, a - b);
      case '*': return t === 'int' ? Math.imul(a, b) : conv(t, a * b);
      case '/': return conv(t, Math.trunc(a / b));
      case '%': return conv(t, a % b);
      case '<<': return t === 'int' ? a << b : conv(t, a * 2 ** b);
      case '>>': return t === 'int' ? a >> b : conv(t, Math.floor(a / 2 ** b));
      case '&': return a & b; case '|': return a | b; case '^': return a ^ b;
    }
  };
  function ev(n, env){
    switch (n.k){
      case 'lit': return n.v;
      case 'list': return n.a.map(e => ev(e, env));
      case 'name':
        if (n.var) return lookup(env, n.v).get();
        if (n.std) return n.std;
        if (n.cv) return n.cv === 'RAND_MAX' ? 2147483647 : n.cv === 'INT_MAX' ? 2147483647 : n.cv === 'INT_MIN' ? -2147483648 : 0;
        return lookup(env, n.v).get();
      case 'cast': return conv(n.t, ev(n.e, env));
      case 'ctor': {
        const a = n.a.map(e => ev(e, env));
        if (isNum(n.t)) return conv(n.t, a.length ? a[0] : 0);
        if (n.t === 'string') return a.length === 2 ? String.fromCharCode(a[1]).repeat(Math.max(0, a[0])) : a.length ? a[0] : '';
        return mkVec(n.t, a, n);
      }
      case 'idx': return lv(n, env).get();
      case 'call': return call(n, env);
      case 'un': {
        if (n.op === '++' || n.op === '--'){ const r = lv(n.e, env), v = conv(n.t, r.get() + (n.op === '++' ? 1 : -1)); r.set(v); return v; }
        const v = ev(n.e, env);
        switch (n.op){ case '!': return !truthy(n.e.t, v); case '-': return n.t === 'double' ? -v : conv(n.t, -v); case '+': return n.t === 'double' ? +v : conv(n.t, +v); case '~': return ~v; }
      }
      case 'post': { const r = lv(n.e, env), v = r.get(); r.set(conv(n.t, v + (n.op === '++' ? 1 : -1))); return v; }
      case 'cond': { const v = truthy(n.c.t, ev(n.c, env)) ? ev(n.a, env) : ev(n.b, env); return n.t === 'double' ? +v : n.t === 'string' && typeof v === 'number' ? String.fromCharCode(v) : v; }
      case 'asg': {
        const r = lv(n.l, env), t = n.l.t;
        if (n.op === '='){ const v = conv(t, ev(n.r, env)); r.set(isVec(t) && n.r.k === 'list' ? v : v); return v; }
        const b = ev(n.r, env), a = r.get();
        if (t === 'string'){ const v = a + (typeof b === 'number' ? String.fromCharCode(b) : b); r.set(v); return v; }
        const pt = promote(t, n.r.t), v = conv(t, arith(pt, n.op[0], a, b, n)); r.set(v); return v;
      }
      case 'bin': return bin(n, env);
    }
    rerr(n, 'cannot run this expression');
  }
  const truthy = (t, v) => t === 'istream' ? !fail : !!v;
  function bin(n, env){
    const op = n.op;
    if (n.t === 'ostream' && op === '<<'){ ev(n.l, env); const v = ev(n.r, env), t = n.r.t; if (t === 'manip') manip(v); else show(t, v); return 'cout'; }
    if (n.t === 'istream' && op === '>>'){ ev(n.l, env); if (n.r.std === 'ws'){ for (;;){ inb = inb.replace(/^\s+/, ''); if (inb || !more()) break; } return 'cin'; } readInto(n.r.t, lv(n.r, env)); return 'cin'; }
    if (n.it){ const it = ev(n.l, env), k = ev(n.r, env); return { a: it.a, i: it.i + (op === '+' ? k : -k) }; }
    if (op === '&&') return truthy(n.l.t, ev(n.l, env)) && truthy(n.r.t, ev(n.r, env));
    if (op === '||') return truthy(n.l.t, ev(n.l, env)) || truthy(n.r.t, ev(n.r, env));
    let a = ev(n.l, env), b = ev(n.r, env);
    const lt = n.l.t, rt = n.r.t;
    if (n.t === 'string'){ if (lt === 'char') a = String.fromCharCode(a); if (rt === 'char') b = String.fromCharCode(b); return a + b; }
    if (n.t === 'bool' && op !== '&' && op !== '|' && op !== '^'){
      if (isVec(lt)){ const s = JSON.stringify(a) === JSON.stringify(b); return op === '==' ? s : op === '!=' ? !s : rerr(n, 'vectors can only be compared with == here'); }
      if (!isStr(lt)){ a = +a; b = +b; }
      switch (op){ case '==': return a === b; case '!=': return a !== b; case '<': return a < b; case '<=': return a <= b; case '>': return a > b; case '>=': return a >= b; }
    }
    return arith(n.t, op, a, b, n);
  }
  function manip(v){
    if (typeof v === 'object'){ if (v.prec !== undefined) fmt.prec = v.prec; if (v.w !== undefined) fmt.w = v.w; return; }
    switch (v){ case 'endl': put('\n'); flush(); break; case 'fixed': fmt.fixed = true; break; case 'boolalpha': fmt.alpha = true; break; case 'noboolalpha': fmt.alpha = false; break; case 'left': fmt.left = true; break; case 'right': fmt.left = false; break; case 'flush': flush(); }
  }
  function mkVec(t, a, n){
    const el = elemOf(t);
    if (a.length && Array.isArray(a[0]) && n.k !== 'ctor') return a.map(x => conv(el, x));
    const k = a.length ? a[0] : 0; if (k < 0 || k > 1e6) rerr(n, 'cannot make a vector with ' + k + ' items');
    return Array.from({ length: k }, () => a.length > 1 ? copy(el, conv(el, a[1])) : zero(el));
  }
  function call(n, env){
    if (n.f.k === 'mem') return method(n, env);
    if (n.fn) return callUser(n, env);
    const a = () => n.a.map(e => ev(e, env));
    switch (n.bi){
      case 'to_string': { const [v] = a(); return n.a[0].t === 'double' ? v.toFixed(6) : n.a[0].t === 'bool' ? (v ? '1' : '0') : String(v); }
      case 'stoi': case 'stol': case 'stod': { const [s] = a(), m = (n.bi === 'stod' ? /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/ : /^\s*[+-]?\d+/).exec(s);
        if (!m) rerr(n, "terminate called after throwing an instance of 'std::invalid_argument': " + n.bi + '("' + s + '") has no number at the start', 'The text has to start with digits, like "42".');
        return n.bi === 'stod' ? +m[0] : (n.bi === 'stoi' && Math.abs(+m[0]) > 2147483647 ? rerr(n, 'stoi: out of range') : Math.trunc(+m[0])); }
      case 'max': case 'min': { const [x, y] = a(); return n.bi === 'max' ? (y > x ? y : x) : (y < x ? y : x); }
      case 'swap': { const r1 = lv(n.a[0], env), r2 = lv(n.a[1], env), t = r1.get(); r1.set(r2.get()); r2.set(t); return; }
      case 'getline': { ev(n.a[0], env); getline(lv(n.a[1], env), n.a[2] ? ev(n.a[2], env) : undefined); return 'cin'; }
      case 'sort': case 'reverse': { const [x, y] = a(); const part = x.a.slice(x.i, y.i); if (n.bi === 'sort') part.sort((p, q) => p < q ? -1 : p > q ? 1 : 0); else part.reverse(); x.a.splice(x.i, part.length, ...part); return; }
      case 'count': { const [x, y, v] = a(); let c = 0; for (let i = x.i; i < y.i; i++) if (x.a[i] === v) c++; return c; }
      case 'find': { const [x, y, v] = a(); let i = x.i; while (i < y.i && x.a[i] !== v) i++; return { a: x.a, i }; }
      case 'setprecision': return { prec: a()[0] };
      case 'setw': return { w: a()[0] };
      case 'rand': return rnd();
      case 'srand': rnd = glibcRand(a()[0]); return;
      case 'time': return Math.floor(Date.now() / 1000);
      case 'abs': case 'fabs': return Math.abs(a()[0]);
      case 'sqrt': { const v = a()[0]; return Math.sqrt(v); }
      case 'floor': return Math.floor(a()[0]); case 'ceil': return Math.ceil(a()[0]); case 'round': return Math.round(Math.abs(a()[0])) * Math.sign(a()[0]);
      case 'pow': { const [x, y] = a(); return Math.pow(x, y); }
      case 'toupper': { const c = a()[0]; return c >= 97 && c <= 122 ? c - 32 : c; }
      case 'tolower': { const c = a()[0]; return c >= 65 && c <= 90 ? c + 32 : c; }
      case 'isdigit': { const c = a()[0]; return c >= 48 && c <= 57; }
      case 'isalpha': { const c = a()[0]; return (c >= 65 && c <= 90) || (c >= 97 && c <= 122); }
      case 'isupper': { const c = a()[0]; return c >= 65 && c <= 90; }
      case 'islower': { const c = a()[0]; return c >= 97 && c <= 122; }
      case 'isspace': { const c = a()[0]; return c === 32 || (c >= 9 && c <= 13); }
      case 'exit': throw new Exit(a()[0]);
      case 'system': { const [c] = a(); if (/^pause$/i.test(c.trim())){ put('Press any key to continue . . . '); flush(); more(); inb = ''; put('\n'); return 0; } if (/^cls|clear$/i.test(c.trim())) { put('\n'); return 0; } put('sh: 1: ' + c.split(' ')[0] + ': not found\n'); return 127; }
    }
    rerr(n, 'unknown function');
  }
  function method(n, env){
    const f = n.f, t = f.e.t, m = f.m, a = () => n.a.map(e => ev(e, env));
    if (t === 'istream'){
      switch (m){ case 'get': { if (!inb && !more()) return -1; const c = inb.charCodeAt(0); inb = inb.slice(1); return c; }
        case 'ignore': { const [k, d] = a(); if (k === undefined){ inb = inb.slice(1); return 'cin'; } const ch = d === undefined ? null : String.fromCharCode(d); let i = 0; while (i < Math.min(k, inb.length) && inb[i] !== ch) i++; inb = inb.slice(Math.min(inb.length, i + (i < inb.length && inb[i] === ch ? 1 : 0))); return 'cin'; }
        case 'fail': return fail; case 'eof': return eof; case 'good': return !fail && !eof; case 'clear': fail = false; return; }
    }
    if (t === 'string'){
      const ref = n.f.e.k === 'name' || n.f.e.k === 'idx' ? lv(f.e, env) : null, s = ref ? ref.get() : ev(f.e, env);
      switch (m){
        case 'size': case 'length': return s.length;
        case 'empty': return s.length === 0;
        case 'substr': { const [i, k] = a(); if (i > s.length) rerr(n, "basic_string::substr: start " + i + ' is past the end (size ' + s.length + ')'); return k === undefined ? s.slice(i) : s.substr(i, Math.max(0, k)); }
        case 'find': { const [x] = a(), i = s.indexOf(typeof x === 'number' ? String.fromCharCode(x) : x); return i; }
        case 'push_back': ref.set(s + String.fromCharCode(a()[0])); return;
        case 'append': { const v = s + a()[0]; ref.set(v); return v; }
        case 'pop_back': if (!s.length) rerr(n, 'pop_back on an empty string'); ref.set(s.slice(0, -1)); return;
        case 'clear': ref.set(''); return;
        case 'back': case 'front': if (!s.length) rerr(n, m + '() on an empty string'); return s.charCodeAt(m === 'back' ? s.length - 1 : 0);
        case 'at': { const [i] = a(); if (i < 0 || i >= s.length) rerr(n, 'basic_string::at: index ' + i + ' is out of range (size ' + s.length + ')'); return s.charCodeAt(i); }
      }
    }
    if (isVec(t)){
      const v = f.e.k === 'name' || f.e.k === 'idx' || (f.e.k === 'call' && f.e.f.k === 'mem') ? lv(f.e, env).get() : ev(f.e, env), el = elemOf(t);
      switch (m){
        case 'push_back': { const [x] = a(); v.push(copy(el, conv(el, x))); if (v.length > 1e6) rerr(n, 'the vector grew past a million items'); return; }
        case 'pop_back': if (!v.length) rerr(n, 'pop_back() on an empty vector', 'Real C++ would quietly break here. Check .empty() first.'); v.pop(); return;
        case 'clear': v.length = 0; return;
        case 'size': return v.length;
        case 'empty': return v.length === 0;
        case 'back': case 'front': case 'at': return lv(n, env).get();
        case 'begin': return { a: v, i: 0 };
        case 'end': return { a: v, i: v.length };
        case 'erase': { const [x, y] = a(); if (x.i < 0 || x.i >= v.length) rerr(n, 'erase position ' + x.i + ' is outside the vector (size ' + v.length + ')'); v.splice(x.i, y ? y.i - x.i : 1); return; }
        case 'insert': { const [x, val] = a(); if (x.i < 0 || x.i > v.length) rerr(n, 'insert position ' + x.i + ' is outside the vector'); v.splice(x.i, 0, copy(el, conv(el, val))); return; }
      }
    }
    rerr(n, 'unknown member ' + m);
  }
  function callUser(n, env){
    const f = n.fn;
    if (++depth > 2500) rerr(n, 'Segmentation fault (stack overflow): ' + f.name + ' kept calling itself and never stopped', 'A function that calls itself needs a case where it stops, like  if (n == 0) return 1;');
    const vars = new Map();
    f.ps.forEach((p, i) => {
      if (!p.name) return;
      if (p.ref && !(p.cnst && !lval(n.a[i]))) vars.set(p.name, lv(n.a[i], env));
      else vars.set(p.name, new Cell(copy(p.t, conv(p.t, ev(n.a[i], env)))));
    });
    const r = exec(f.body, { vars, up: null });
    depth--;
    if (r instanceof Ret) return r.v;
    if (f.ret !== 'void') return zero(f.ret);
  }
  const lval = n => n.k === 'name' ? !!n.var : n.k === 'idx' ? true : n.k === 'call' && n.f.k === 'mem' && /^(at|back|front)$/.test(n.f.m) && !isStr(n.f.e.t);
  function declare(d, env){
    for (const x of d.ds){
      const t = x.t;
      let c;
      if (d.ty.ref) c = lv(x.init, env);
      else if (isArr(t)){
        const k = x.n.k === 'auto' ? x.init.a.length : ev(x.n, env);
        if (k < 0 || k > 1e6) rerr(x, 'array size ' + k + ' is not allowed');
        const v = Array.from({ length: k }, () => zero(elemOf(t)) ?? 0);
        if (x.init){ const a = ev(x.init, env); a.forEach((y, i) => { v[i] = conv(elemOf(t), y); }); }
        c = new Cell(v);
      } else if (x.ctor){ const a = x.ctor.map(e => ev(e, env)); c = new Cell(isVec(t) ? mkVec(t, a, x) : t === 'string' ? (a.length === 2 ? String.fromCharCode(a[1]).repeat(Math.max(0, a[0])) : a[0]) : conv(t, a[0])); }
      else if (x.init){ let v = ev(x.init, env); if (x.init.k === 'list' && !isVec(t)) v = v[0]; c = new Cell(t === 'cstr' ? v : copy(t, conv(t, v))); }
      else c = new Cell(isNum(t) ? (env === null ? zero(t) : zero(t)) : zero(t));
      (env ? env.vars : globals).set(x.name, c);
    }
  }
  function exec(s, env){
    tick(s);
    switch (s.k){
      case 'block': { const e = { vars: new Map(), up: env }; for (const x of s.b){ const r = exec(x, e); if (r) return r; } return; }
      case 'empty': return;
      case 'decl': declare(s, env); return;
      case 'expr': ev(s.e, env); return;
      case 'if': return truthy(s.c.t, ev(s.c, env)) ? exec(s.a, { vars: new Map(), up: env }) : s.b ? exec(s.b, { vars: new Map(), up: env }) : undefined;
      case 'while': while (truthy(s.c.t, ev(s.c, env))){ const r = exec(s.s, { vars: new Map(), up: env }); if (r === BRK) break; if (r && r !== CNT) return r; tick(s); } return;
      case 'do': do { const r = exec(s.s, { vars: new Map(), up: env }); if (r === BRK) break; if (r && r !== CNT) return r; tick(s); } while (truthy(s.c.t, ev(s.c, env))); return;
      case 'for': { const e = { vars: new Map(), up: env }; if (s.init) exec(s.init, e);
        for (; !s.c || truthy(s.c.t, ev(s.c, e)); s.st && ev(s.st, e)){ const r = exec(s.s, { vars: new Map(), up: e }); if (r === BRK) break; if (r && r !== CNT) return r; tick(s); } return; }
      case 'rfor': {
        const isS = isStr(s.e.t), src = isS ? null : (s.e.k === 'name' || s.e.k === 'idx' ? lv(s.e, env).get() : ev(s.e, env)), str = isS ? (s.ty.ref ? lv(s.e, env) : null) : null;
        const sv = isS ? (str ? str.get() : ev(s.e, env)) : null, len = isS ? sv.length : src.length;
        for (let i = 0; i < (isS ? len : src.length); i++){
          const vars = new Map();
          vars.set(s.name, s.ty.ref ? (isS ? new Ch(str, i) : new El(src, i)) : new Cell(isS ? conv(s.vt, sv.charCodeAt(i)) : copy(s.vt, conv(s.vt, src[i]))));
          const r = exec(s.s, { vars, up: env }); if (r === BRK) break; if (r && r !== CNT) return r; tick(s);
        }
        return;
      }
      case 'switch': {
        const v = +ev(s.e, env); let at = s.cases.findIndex(c => c.v && +(c.v.k === 'lit' ? c.v.v : -c.v.e.v) === v);
        if (at < 0) at = s.cases.findIndex(c => !c.v); if (at < 0) return;
        const e = { vars: new Map(), up: env };
        for (let i = s.cases[at].at; i < s.body.length; i++){ const r = exec(s.body[i], e); if (r === BRK) break; if (r) return r; }
        return;
      }
      case 'break': return BRK;
      case 'continue': return CNT;
      case 'ret': return new Ret(s.e ? (s.rt ? copy(s.rt, conv(s.rt, ev(s.e, env))) : ev(s.e, env)) : undefined);
    }
  }

  let exit = 0, error = null;
  try {
    for (const d of prog.top) if (d.k === 'decl') declare(d, null);
    const main = info.fns.get('main');
    depth = 1; const r = exec(main.body, { vars: new Map(), up: null });
    exit = r instanceof Ret ? r.v : 0;
  } catch (e){
    if (e instanceof Exit) exit = e.code;
    else if (e instanceof RErr) error = { stage: e.stage, line: e.line, msg: e.message, help: e.help };
    else if (e instanceof RangeError) error = { stage: 'runtime', line, msg: 'Segmentation fault (stack overflow)', help: 'A function kept calling itself too deep.' };
    else throw e;
  }
  flush();
  return { exit, error, warns, steps };
}

const CPP = { parse, check, run, fmtG, CErr };
if (typeof module !== 'undefined') module.exports = CPP; else window.CPP = CPP;
})();
