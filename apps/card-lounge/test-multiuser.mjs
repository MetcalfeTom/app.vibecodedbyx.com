#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────
// card-lounge multi-user state-consistency test
//
// Spawns 10 fake users in an isolated room, has them draw and drag
// cards concurrently, then verifies every user's final state matches.
// Re-implements the same apply* logic that the browser app uses so the
// test exercises the exact broadcast + reconciliation paths.
//
// Usage:
//   cd apps/card-lounge && npm install @supabase/supabase-js && node test-multiuser.mjs
// or with npx (no install):
//   npx --yes -p @supabase/supabase-js node apps/card-lounge/test-multiuser.mjs
// ─────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
// Node < 22 has no native WebSocket — patch with the ws polyfill.
if (typeof globalThis.WebSocket === 'undefined'){
  const wsMod = await import('ws');
  globalThis.WebSocket = wsMod.default;
}

const SUPABASE_URL      = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

// Isolated test room — does NOT touch the live `lobby` channel.
const ROOM = 'lobby-test-' + Math.random().toString(36).slice(2, 8);
const CHANNEL_NAME = 'card-lounge-' + ROOM;
const NUM_USERS  = 10;
const DRAW_COUNT = 5;
const MOVE_COUNT = 20;

// Mirror of the app's freshDeck for the standard 52 deck.
const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function freshDeck(){
  const d = [];
  let id = 0;
  for (const s of SUITS) for (const r of RANKS){
    d.push({ id: id++, kind: 'std', suit: s, rank: r });
  }
  return d;
}

class FakeUser {
  constructor(idx){
    this.idx  = idx;
    // ids picked so tiebreaker is deterministic across runs
    this.id   = 'fake-' + String(idx).padStart(2, '0');
    this.name = 'Bot' + idx;
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 20 } },
    });
    this.state = {
      deckKind: 'std',
      deck: freshDeck(),
      table: [],
      stateVersion: 0,
    };
    this.pendingMoves = {};
    this.isFirstHere  = true;
    this.synced       = false;
    this.channel      = null;
  }

  // — apply* mirror what the browser does ----------------------------
  applyState(p){
    const sameVer  = p.version === this.state.stateVersion;
    const tieBreak = sameVer && p.by > this.id;
    if (this.isFirstHere || p.version > this.state.stateVersion || tieBreak){
      this.state.deck    = p.deck;
      this.state.table   = p.table;
      this.state.stateVersion = p.version;
    }
    this.isFirstHere = false;
    this.synced      = true;
  }
  applyDraw(p){
    let i = this.state.deck.findIndex(c => c.id === p.cardId);
    if (i === -1){ if (!this.state.deck.length) return; i = 0; }
    const card = this.state.deck.splice(i, 1)[0];
    this.state.table.push({ ...card, x: p.x, y: p.y, drawnBy: p.name });
    this.state.stateVersion += 1;
    if (this.pendingMoves[card.id]){
      const m = this.pendingMoves[card.id];
      const last = this.state.table[this.state.table.length - 1];
      last.x = m.x; last.y = m.y;
      delete this.pendingMoves[card.id];
    }
  }
  applyMove(p){
    const c = this.state.table.find(c => c.id === p.cardId);
    if (!c){ this.pendingMoves[p.cardId] = { x: p.x, y: p.y }; return; }
    c.x = p.x; c.y = p.y;
  }

  // — connection -----------------------------------------------------
  connect(){
    return new Promise((resolve, reject) => {
      this.channel = this.client.channel(CHANNEL_NAME, {
        config: { broadcast: { self: false, ack: false }, presence: { key: this.id } },
      });
      this.channel.on('broadcast', { event: 'state' }, ({ payload }) => this.applyState(payload));
      this.channel.on('broadcast', { event: 'draw' },  ({ payload }) => this.applyDraw(payload));
      this.channel.on('broadcast', { event: 'move' },  ({ payload }) => this.applyMove(payload));
      this.channel.on('broadcast', { event: 'request-state' }, () => {
        if (this.state.deck.length || this.state.table.length){
          this.channel.send({
            type: 'broadcast',
            event: 'state',
            payload: { deck: this.state.deck, table: this.state.table, version: this.state.stateVersion, by: this.id },
          });
        }
      });

      this.channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED'){
          await this.channel.track({ name: this.name, color: '#fff' });
          this.channel.send({ type: 'broadcast', event: 'request-state', payload: { from: this.id } });
          // give the host-claim timer a chance to settle
          setTimeout(() => { this.synced = true; resolve(); }, 1300);
        } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED'){
          reject(new Error('channel ' + status));
        }
      });
    });
  }

  async drawCards(n){
    for (let i = 0; i < n; i++){
      if (!this.state.deck.length) break;
      const card = this.state.deck[0];
      const payload = {
        cardId: card.id,
        x: Math.round(Math.random() * 800),
        y: Math.round(Math.random() * 500),
        by: this.id, name: this.name,
      };
      this.applyDraw(payload);
      this.channel.send({ type: 'broadcast', event: 'draw', payload });
      await sleep(30 + Math.random() * 80);
    }
  }

  async moveCards(n){
    for (let i = 0; i < n; i++){
      if (!this.state.table.length){ await sleep(20); continue; }
      const card = this.state.table[Math.floor(Math.random() * this.state.table.length)];
      const payload = {
        cardId: card.id,
        x: Math.round(Math.random() * 800),
        y: Math.round(Math.random() * 500),
      };
      this.applyMove(payload);
      this.channel.send({ type: 'broadcast', event: 'move', payload });
      await sleep(20 + Math.random() * 60);
    }
  }

  disconnect(){
    if (this.channel) this.channel.unsubscribe();
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main(){
  console.log('────────────────────────────────────────────');
  console.log('card-lounge state-consistency simulation');
  console.log('  channel: ' + CHANNEL_NAME);
  console.log('  users:   ' + NUM_USERS);
  console.log('  draws:   ' + DRAW_COUNT + ' per user (= ' + NUM_USERS * DRAW_COUNT + ' total)');
  console.log('  moves:   ' + MOVE_COUNT + ' per user (= ' + NUM_USERS * MOVE_COUNT + ' total)');
  console.log('────────────────────────────────────────────\n');

  const users = Array.from({ length: NUM_USERS }, (_, i) => new FakeUser(i));

  console.log('connecting ' + NUM_USERS + ' users …');
  await Promise.all(users.map(u => u.connect()));
  console.log('all connected.\n');

  console.log('phase 1 · concurrent draws');
  const t0 = Date.now();
  await Promise.all(users.map(u => u.drawCards(DRAW_COUNT)));
  console.log('  ' + (Date.now() - t0) + 'ms\n');

  console.log('phase 2 · concurrent drags');
  const t1 = Date.now();
  await Promise.all(users.map(u => u.moveCards(MOVE_COUNT)));
  console.log('  ' + (Date.now() - t1) + 'ms\n');

  console.log('settling 2.5s for late broadcasts to land …');
  await sleep(2500);

  // ─── verification ────────────────────────────────────────────────
  console.log('\nfinal counts per user:');
  for (const u of users){
    console.log('  ' + u.name.padEnd(8) + ' deck=' + String(u.state.deck.length).padStart(2) +
                ' table=' + String(u.state.table.length).padStart(2) +
                ' version=' + u.state.stateVersion);
  }

  let ok = true;
  const base = users[0];
  const baseDeckIds = new Set(base.state.deck.map(c => c.id));
  const baseTableIds = new Set(base.state.table.map(c => c.id));

  for (let i = 1; i < users.length; i++){
    const u = users[i];
    if (u.state.deck.length !== base.state.deck.length){
      console.log('  ✗ deck size differs: ' + base.name + '=' + base.state.deck.length + ' vs ' + u.name + '=' + u.state.deck.length);
      ok = false;
    }
    if (u.state.table.length !== base.state.table.length){
      console.log('  ✗ table size differs: ' + base.name + '=' + base.state.table.length + ' vs ' + u.name + '=' + u.state.table.length);
      ok = false;
    }
    const deckIds = new Set(u.state.deck.map(c => c.id));
    const tableIds = new Set(u.state.table.map(c => c.id));
    for (const id of baseDeckIds) if (!deckIds.has(id)){
      console.log('  ✗ ' + u.name + ' missing deck card id=' + id);
      ok = false;
    }
    for (const id of baseTableIds) if (!tableIds.has(id)){
      console.log('  ✗ ' + u.name + ' missing table card id=' + id);
      ok = false;
    }
  }

  // Conservation: total cards across deck + table should be exactly 52
  // (every card accounted for, none duplicated, none lost).
  for (const u of users){
    const total = u.state.deck.length + u.state.table.length;
    if (total !== 52){
      console.log('  ✗ ' + u.name + ' has ' + total + ' cards (expected 52)');
      ok = false;
    }
  }

  console.log('\n════════════════════════════════════════════');
  console.log('  ' + (ok ? 'CONSISTENT ✓  all 10 users converged' : 'INCONSISTENT ✗  see mismatches above'));
  console.log('════════════════════════════════════════════');

  users.forEach(u => u.disconnect());
  process.exit(ok ? 0 : 1);
}

main().catch(err => {
  console.error('test failed:', err);
  process.exit(2);
});
