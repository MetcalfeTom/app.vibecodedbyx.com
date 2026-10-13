// Chat in: a read-only Twitch chat reader. From the Sloppy's Factory kit.
//
// usage:  node chat/bot-twitch.mjs yourchannel
//         node chat/bot-twitch.mjs --selftest      (checks the parser, no network)
//
// Needs Node 22 or newer (it uses Node's built-in WebSocket). No token, no account:
// it logs in anonymously, the way a logged-out viewer watches chat, so it can only
// read. It never sends a message. Each chat message becomes one JSON line in
// chat/inbox.jsonl:
//   {"t":"2026-01-01T12:00:00.000Z","id":"<message id>","user":"login","name":"Display Name","text":"..."}
// When your moderators remove something, it adds a line so /intake can skip it:
//   {"t":"...","removed":"<message id>"}   one message was deleted
//   {"t":"...","removed":"<login>"}        that user's messages (a timeout or a ban)
//   {"t":"...","removed":"*"}              the whole chat was cleared
// Stop it with Ctrl+C.
import { appendFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const INBOX = join(dirname(fileURLToPath(import.meta.url)), 'inbox.jsonl');
const MAX = 300; // characters kept per message

// Remove control characters and invisible direction marks, keep the rest.
export function cleanText(s) {
  return String(s)
    .replace(/^\u0001ACTION (.*)\u0001$/s, '$1') // "/me waves" arrives wrapped in \u0001ACTION ... \u0001
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function cut(s) { const a = Array.from(s); return a.length > MAX ? a.slice(0, MAX).join('') + '…' : s; }
function unescapeTag(v) {
  return v.replace(/\\(.)/g, (m, c) => ({ s: ' ', ':': ';', '\\': '\\', r: '', n: '' })[c] ?? c);
}

// Parse one raw IRC line into { tags, prefix, command, params } (the last param may hold spaces).
export function parseIrc(raw) {
  let rest = raw.replace(/\r?\n$/, '');
  const msg = { tags: {}, prefix: '', command: '', params: [] };
  if (rest.startsWith('@')) {
    const sp = rest.indexOf(' ');
    for (const kv of rest.slice(1, sp).split(';')) {
      const eq = kv.indexOf('=');
      if (eq < 0) msg.tags[kv] = '';
      else msg.tags[kv.slice(0, eq)] = unescapeTag(kv.slice(eq + 1));
    }
    rest = rest.slice(sp + 1);
  }
  if (rest.startsWith(':')) { const sp = rest.indexOf(' '); msg.prefix = rest.slice(1, sp); rest = rest.slice(sp + 1); }
  const trail = rest.indexOf(' :');
  const head = trail >= 0 ? rest.slice(0, trail) : rest;
  const parts = head.split(' ').filter(Boolean);
  msg.command = parts.shift() || '';
  msg.params = parts;
  if (trail >= 0) msg.params.push(rest.slice(trail + 2));
  return msg;
}

// Turn a parsed line into the JSON line for the inbox, or null if it is not chat.
export function toInbox(msg, now = new Date()) {
  const t = now.toISOString();
  if (msg.command === 'PRIVMSG' && msg.params.length >= 2) {
    const user = (msg.prefix.split('!')[0] || msg.tags['display-name'] || '').toLowerCase();
    const text = cut(cleanText(msg.params[1]));
    if (!user || !text) return null;
    const line = { t, id: msg.tags.id || undefined, user, name: cleanText(msg.tags['display-name'] || '') || undefined, text };
    return JSON.parse(JSON.stringify(line)); // drops the empty fields
  }
  if (msg.command === 'CLEARMSG' && msg.tags['target-msg-id']) return { t, removed: msg.tags['target-msg-id'] };
  if (msg.command === 'CLEARCHAT') return { t, removed: msg.params[1] ? msg.params[1].toLowerCase() : '*' };
  return null;
}

function selftest() {
  const samples = [
    '@badge-info=;badges=;color=#1E90FF;display-name=Froggo;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;tmi-sent-ts=1700000000000 :froggo!froggo@froggo.tmi.twitch.tv PRIVMSG #yourchannel :a page where a frog jumps when you tap it',
    '@display-name=Mia\\sB;id=aa-1 :mia_b!mia_b@mia_b.tmi.twitch.tv PRIVMSG #yourchannel :\u0001ACTION waves\u0001',
    ':x!x@x.tmi.twitch.tv PRIVMSG #yourchannel :bad\u0007bell \u202eflip\u202c and ' + 'long '.repeat(80),
    '@login=froggo;target-msg-id=b34ccfc7-4977-403a-8a94-33c6bac34fb8 :tmi.twitch.tv CLEARMSG #yourchannel :a page where a frog jumps when you tap it',
    '@ban-duration=600;target-user-id=1 :tmi.twitch.tv CLEARCHAT #yourchannel :Spammer42',
    ':tmi.twitch.tv CLEARCHAT #yourchannel',
    'PING :tmi.twitch.tv',
    ':tmi.twitch.tv 001 justinfan12345 :Welcome, GLHF!',
  ];
  const now = new Date('2026-01-01T12:00:00Z');
  const got = samples.map(s => toInbox(parseIrc(s), now));
  const checks = [
    ['message', got[0]?.user === 'froggo' && got[0]?.name === 'Froggo' && got[0]?.text === 'a page where a frog jumps when you tap it' && got[0]?.id === 'b34ccfc7-4977-403a-8a94-33c6bac34fb8' && got[0]?.t === '2026-01-01T12:00:00.000Z'],
    ['escaped display name', got[1]?.name === 'Mia B'],
    ['/me message', got[1]?.text === 'waves'],
    ['control characters gone', got[2] && !/[\u0000-\u001f\u202a-\u202e]/.test(got[2].text) && got[2].text.startsWith('bad bell flip and')],
    ['cut to 300 characters', got[2] && Array.from(got[2].text).length === MAX + 1 && got[2].text.endsWith('…')],
    ['no name tag: name left out', got[2] && !('name' in got[2])],
    ['deleted message', got[3]?.removed === 'b34ccfc7-4977-403a-8a94-33c6bac34fb8'],
    ['timeout or ban', got[4]?.removed === 'spammer42'],
    ['chat cleared', got[5]?.removed === '*'],
    ['PING is not chat', got[6] === null && parseIrc(samples[6]).command === 'PING' && parseIrc(samples[6]).params[0] === 'tmi.twitch.tv'],
    ['welcome is not chat', got[7] === null],
    ['one JSON line each', got.filter(Boolean).every(o => !JSON.stringify(o).includes('\n'))],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? '✔' : '✘'} ${name}`);
  const bad = checks.filter(c => !c[1]).length;
  console.log(bad ? `FAIL: ${bad} of ${checks.length}` : `OK: ${checks.length} checks, nothing was sent anywhere`);
  process.exit(bad ? 1 : 0);
}

function run(channel) {
  if (typeof WebSocket !== 'function') { console.log('This bot needs Node 22 or newer (built-in WebSocket).'); process.exit(1); }
  mkdirSync(dirname(INBOX), { recursive: true });
  let wait = 1000, ws = null, quiet = null, saved = 0;
  const connect = () => {
    ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    const send = s => { if (ws.readyState === 1) ws.send(s + '\r\n'); };
    const watchdog = () => { clearTimeout(quiet); quiet = setTimeout(() => { console.log('No word from Twitch for 6 minutes, reconnecting.'); ws.close(); }, 6 * 60 * 1000); };
    ws.addEventListener('open', () => {
      send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      send('PASS SCHMOOPIIE'); // the anonymous login: read-only
      send('NICK justinfan' + Math.floor(10000 + Math.random() * 89999));
      send('JOIN #' + channel);
      watchdog();
    });
    ws.addEventListener('message', ev => {
      watchdog();
      for (const raw of String(ev.data).split('\r\n')) {
        if (!raw) continue;
        const msg = parseIrc(raw);
        if (msg.command === 'PING') { send('PONG :' + (msg.params[0] || 'tmi.twitch.tv')); continue; }
        if (msg.command === 'RECONNECT') { ws.close(); continue; }
        if (msg.command === 'JOIN') { console.log(`Reading #${channel}. New messages go to chat/inbox.jsonl.`); wait = 1000; continue; }
        if (msg.command === 'NOTICE') { console.log('Twitch says: ' + cleanText(msg.params[1] || '')); continue; }
        const line = toInbox(msg);
        if (line) { appendFileSync(INBOX, JSON.stringify(line) + '\n'); if (!line.removed) saved++; }
      }
    });
    ws.addEventListener('close', () => {
      clearTimeout(quiet);
      console.log(`Connection closed (${saved} messages saved so far). Trying again in ${wait / 1000} s.`);
      setTimeout(connect, wait);
      wait = Math.min(wait * 2, 60000); // back off: 1, 2, 4 ... 60 seconds
    });
    ws.addEventListener('error', () => { /* a close event follows and reconnects */ });
  };
  connect();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (process.argv[2] || '').trim();
  if (arg === '--selftest') selftest();
  else {
    const channel = arg.replace(/^#/, '').toLowerCase();
    if (!/^[a-z0-9_]{3,25}$/.test(channel)) { console.log('usage: node chat/bot-twitch.mjs yourchannel   (or --selftest)'); process.exit(2); }
    run(channel);
  }
}
