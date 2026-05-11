import { describe, it, expect } from 'vitest';
import {
  freshDeck, shuffle, isRed, makeFreshState,
  applyDraw, applyMove, applyClear, applyShuffle, applySwitchDeck,
  applyDrawToHand, applyPlayFromHand, applyDefuse, applyExplode,
  shouldAdoptState,
  type Card, type State, type PendingMoves, type EkCard, type StdCard,
} from './state.ts';

// ─────────────────────────────────────────────────────────────────────
// deck constructors
// ─────────────────────────────────────────────────────────────────────
describe('freshDeck', () => {
  it('returns 52 cards for standard', () => {
    expect(freshDeck('std')).toHaveLength(52);
  });
  it('returns 108 cards for UNO', () => {
    expect(freshDeck('uno')).toHaveLength(108);
  });
  it('returns 56 cards for Exploding Kittens', () => {
    expect(freshDeck('ek')).toHaveLength(56);
  });
  it('returns 86 cards for Unstable Unicorns + expansions', () => {
    expect(freshDeck('uu')).toHaveLength(86);
  });
  it('returns 40 cards for Tapple categories', () => {
    expect(freshDeck('tapple')).toHaveLength(40);
  });
  it('every standard card has a unique id', () => {
    const ids = new Set(freshDeck('std').map(c => c.id));
    expect(ids.size).toBe(52);
  });
  it('every UNO card has a unique id', () => {
    const ids = new Set(freshDeck('uno').map(c => c.id));
    expect(ids.size).toBe(108);
  });
  it('EK deck contains exactly 4 kittens and 6 defuses', () => {
    const d = freshDeck('ek');
    expect(d.filter((c): c is EkCard => c.kind === 'ek' && c.type === 'kitten')).toHaveLength(4);
    expect(d.filter((c): c is EkCard => c.kind === 'ek' && c.type === 'defuse')).toHaveLength(6);
  });
  it('UU deck has 26 magical unicorns (18 base + 8 expansion)', () => {
    const d = freshDeck('uu');
    expect(d.filter(c => c.kind === 'uu' && c.type === 'magical')).toHaveLength(26);
  });
  it('UU deck includes the Dragons expansion category (6 dragons)', () => {
    const d = freshDeck('uu');
    expect(d.filter(c => c.kind === 'uu' && c.type === 'dragon')).toHaveLength(6);
  });
  it('UU deck includes the Apocalypse expansion category (4 cards)', () => {
    const d = freshDeck('uu');
    expect(d.filter(c => c.kind === 'uu' && c.type === 'apocalypse')).toHaveLength(4);
  });
  it('Tapple cards each carry a category string', () => {
    const d = freshDeck('tapple');
    expect(d.every(c => c.kind === 'tapple' && typeof c.category === 'string' && c.category.length > 0)).toBe(true);
  });
  it('unknown kind falls back to standard 52', () => {
    expect(freshDeck('???')).toHaveLength(52);
  });
});

// ─────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────
describe('shuffle', () => {
  it('preserves length', () => {
    expect(shuffle(freshDeck('std'))).toHaveLength(52);
  });
  it('preserves all card ids', () => {
    const d = freshDeck('std');
    const originalIds = new Set(d.map(c => c.id));
    const shuffledIds = new Set(shuffle(d).map(c => c.id));
    expect(shuffledIds).toEqual(originalIds);
  });
  it('does not mutate its input', () => {
    const d = freshDeck('std');
    const before = d[0];
    shuffle(d);
    expect(d[0]).toBe(before);
  });
});

describe('isRed', () => {
  it('returns true for hearts and diamonds', () => {
    expect(isRed('♥')).toBe(true);
    expect(isRed('♦')).toBe(true);
  });
  it('returns false for spades and clubs', () => {
    expect(isRed('♠')).toBe(false);
    expect(isRed('♣')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// applyDraw
// ─────────────────────────────────────────────────────────────────────
describe('applyDraw', () => {
  it('moves a card from deck to table with the requested position', () => {
    const s: State = makeFreshState();
    applyDraw(s, { cardId: 0, x: 100, y: 200, name: 'Alice' });
    expect(s.deck.length).toBe(51);
    expect(s.table.length).toBe(1);
    expect(s.table[0].x).toBe(100);
    expect(s.table[0].y).toBe(200);
    expect(s.table[0].drawnBy).toBe('Alice');
  });

  it('bumps stateVersion exactly once', () => {
    const s = makeFreshState();
    const v0 = s.stateVersion;
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    expect(s.stateVersion).toBe(v0 + 1);
  });

  it('falls back to the deck top when cardId is already drawn (concurrent-draw race)', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    applyDraw(s, { cardId: 0, x: 50, y: 50 });
    expect(s.table.length).toBe(2);
    expect(s.table[1].id).toBe(1);
    expect(s.deck.length).toBe(50);
  });

  it('returns false when the deck is empty', () => {
    const s = makeFreshState();
    s.deck = [];
    expect(applyDraw(s, { cardId: 0, x: 0, y: 0 })).toBe(false);
  });

  it('drains a pending move when the matching card arrives', () => {
    const s = makeFreshState();
    const pendingMoves: PendingMoves = { 0: { x: 300, y: 400 } };
    applyDraw(s, { cardId: 0, x: 0, y: 0 }, { pendingMoves });
    expect(s.table[0].x).toBe(300);
    expect(s.table[0].y).toBe(400);
    expect(pendingMoves[0]).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────
// applyMove
// ─────────────────────────────────────────────────────────────────────
describe('applyMove', () => {
  it('updates card position when card is on table', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    applyMove(s, { cardId: 0, x: 333, y: 444 });
    expect(s.table[0].x).toBe(333);
    expect(s.table[0].y).toBe(444);
  });

  it('buffers move into pendingMoves when card is missing', () => {
    const s = makeFreshState();
    const pendingMoves: PendingMoves = {};
    applyMove(s, { cardId: 42, x: 100, y: 200 }, { pendingMoves });
    expect(pendingMoves[42]).toEqual({ x: 100, y: 200 });
  });

  it('returns false when buffering, true when applied', () => {
    const s = makeFreshState();
    expect(applyMove(s, { cardId: 99, x: 0, y: 0 }, { pendingMoves: {} })).toBe(false);
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    expect(applyMove(s, { cardId: 0, x: 10, y: 10 })).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────
// applyClear
// ─────────────────────────────────────────────────────────────────────
describe('applyClear', () => {
  it('returns table cards to the bottom of the deck', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    applyDraw(s, { cardId: 1, x: 0, y: 0 });
    applyClear(s);
    expect(s.deck.length).toBe(52);
    expect(s.table.length).toBe(0);
  });

  it('strips position metadata from restored cards', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 100, y: 200, name: 'A' });
    applyClear(s);
    const restored = s.deck[s.deck.length - 1] as StdCard;
    expect((restored as any).x).toBeUndefined();
    expect((restored as any).y).toBeUndefined();
    expect((restored as any).drawnBy).toBeUndefined();
  });

  it('handles UNO cards correctly on restore', () => {
    const s = makeFreshState();
    s.deckKind = 'uno';
    s.deck = freshDeck('uno');
    applyDraw(s, { cardId: 0, x: 50, y: 50 });
    applyClear(s);
    const restored = s.deck[s.deck.length - 1];
    expect(restored.kind).toBe('uno');
  });
});

// ─────────────────────────────────────────────────────────────────────
// applyShuffle + applySwitchDeck
// ─────────────────────────────────────────────────────────────────────
describe('applyShuffle', () => {
  it('replaces deck and clears table', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    const newDeck: Card[] = shuffle(freshDeck('std'));
    applyShuffle(s, { deck: newDeck });
    expect(s.deck).toBe(newDeck);
    expect(s.table.length).toBe(0);
  });
});

describe('applySwitchDeck', () => {
  it('switches to UNO and clears everything', () => {
    const s = makeFreshState();
    applyDraw(s, { cardId: 0, x: 0, y: 0 });
    s.hands.alice = [{ id: 100, kind: 'std', suit: '♠', rank: 'A' }];
    applySwitchDeck(s, { kind: 'uno' });
    expect(s.deckKind).toBe('uno');
    expect(s.deck.length).toBe(108);
    expect(s.table.length).toBe(0);
    expect(Object.keys(s.hands).length).toBe(0);
  });
  it('switches to EK with 56 cards', () => {
    const s = makeFreshState();
    applySwitchDeck(s, { kind: 'ek' });
    expect(s.deckKind).toBe('ek');
    expect(s.deck.length).toBe(56);
  });
  it('switches to UU with 86 cards (base + expansions)', () => {
    const s = makeFreshState();
    applySwitchDeck(s, { kind: 'uu' });
    expect(s.deckKind).toBe('uu');
    expect(s.deck.length).toBe(86);
  });
  it('switches to Tapple with 40 category cards', () => {
    const s = makeFreshState();
    applySwitchDeck(s, { kind: 'tapple' });
    expect(s.deckKind).toBe('tapple');
    expect(s.deck.length).toBe(40);
  });
});

// ─────────────────────────────────────────────────────────────────────
// hand actions
// ─────────────────────────────────────────────────────────────────────
describe('applyDrawToHand', () => {
  it('moves card from deck to owner hand', () => {
    const s = makeFreshState();
    applyDrawToHand(s, { cardId: 0, ownerId: 'alice' });
    expect(s.hands.alice).toHaveLength(1);
    expect(s.deck.length).toBe(51);
  });
  it('creates the hand array when owner is new', () => {
    const s = makeFreshState();
    expect(s.hands.bob).toBeUndefined();
    applyDrawToHand(s, { cardId: 0, ownerId: 'bob' });
    expect(s.hands.bob).toBeDefined();
  });
  it('falls back to deck top on cardId race', () => {
    const s = makeFreshState();
    applyDrawToHand(s, { cardId: 0, ownerId: 'alice' });
    applyDrawToHand(s, { cardId: 0, ownerId: 'bob' });
    expect(s.hands.alice[0].id).toBe(0);
    expect(s.hands.bob[0].id).toBe(1);
  });
});

describe('applyPlayFromHand', () => {
  it('moves card from hand to table', () => {
    const s = makeFreshState();
    applyDrawToHand(s, { cardId: 0, ownerId: 'alice' });
    applyPlayFromHand(s, { cardId: 0, ownerId: 'alice', x: 100, y: 200, name: 'Alice' });
    expect(s.hands.alice).toHaveLength(0);
    expect(s.table).toHaveLength(1);
    expect(s.table[0].x).toBe(100);
  });
  it('falls back to payload.card when hand is stale', () => {
    const s = makeFreshState();
    const card: StdCard = { id: 999, kind: 'std', suit: '♠', rank: 'A' };
    applyPlayFromHand(s, { cardId: 999, ownerId: 'alice', x: 0, y: 0, card });
    expect(s.table).toHaveLength(1);
    expect(s.table[0].id).toBe(999);
  });
  it('returns null when no card found and no fallback provided', () => {
    const s = makeFreshState();
    expect(applyPlayFromHand(s, { cardId: 999, ownerId: 'alice', x: 0, y: 0 })).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Exploding Kittens specific
// ─────────────────────────────────────────────────────────────────────
describe('applyDefuse', () => {
  it('removes defuse + kitten from hand and re-inserts kitten into deck', () => {
    const s = makeFreshState();
    s.deckKind = 'ek';
    s.deck = freshDeck('ek');
    s.hands.alice = [
      { id: 1000, kind:'ek', type:'kitten', label:'EXPLODING KITTEN', glyph:'💥', color:'#a02818' },
      { id: 2000, kind:'ek', type:'defuse', label:'DEFUSE',           glyph:'🧯', color:'#3a6e4c' },
    ];
    const before = s.deck.length;
    applyDefuse(s, { kittenId: 1000, defuseId: 2000, ownerId: 'alice' });
    expect(s.hands.alice).toHaveLength(0);
    expect(s.deck.length).toBe(before + 1);
    expect(s.deck.some(c => c.id === 1000)).toBe(true);
  });

  it('still bumps version even when hand is empty', () => {
    const s = makeFreshState();
    const v0 = s.stateVersion;
    applyDefuse(s, { kittenId: 1, defuseId: 2, ownerId: 'ghost' });
    expect(s.stateVersion).toBe(v0 + 1);
  });
});

describe('applyExplode', () => {
  it('bumps version only (pure mutation)', () => {
    const s = makeFreshState();
    const v0 = s.stateVersion;
    const before = { deck: s.deck.length, table: s.table.length };
    applyExplode(s);
    expect(s.stateVersion).toBe(v0 + 1);
    expect(s.deck.length).toBe(before.deck);
    expect(s.table.length).toBe(before.table);
  });
});

// ─────────────────────────────────────────────────────────────────────
// state-conflict resolution
// ─────────────────────────────────────────────────────────────────────
describe('shouldAdoptState', () => {
  it('adopts on first-here regardless of version', () => {
    expect(shouldAdoptState({ localVersion: 999, incomingVersion: 1, isFirstHere: true, myId: 'a', senderId: 'b' })).toBe(true);
  });
  it('adopts when incoming version is strictly higher', () => {
    expect(shouldAdoptState({ localVersion: 5, incomingVersion: 6, isFirstHere: false, myId: 'a', senderId: 'b' })).toBe(true);
  });
  it('rejects when incoming version is lower', () => {
    expect(shouldAdoptState({ localVersion: 5, incomingVersion: 4, isFirstHere: false, myId: 'a', senderId: 'b' })).toBe(false);
  });
  it('rejects when versions match and sender id sorts before mine', () => {
    expect(shouldAdoptState({ localVersion: 5, incomingVersion: 5, isFirstHere: false, myId: 'zzz', senderId: 'aaa' })).toBe(false);
  });
  it('adopts when versions match and sender id sorts after mine (deterministic tiebreak)', () => {
    expect(shouldAdoptState({ localVersion: 5, incomingVersion: 5, isFirstHere: false, myId: 'aaa', senderId: 'zzz' })).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────
// integration: a concurrent-draw scenario between two simulated peers
// ─────────────────────────────────────────────────────────────────────
describe('integration · concurrent draws converge', () => {
  it('two peers each drawing once and exchanging broadcasts end up with the same deck + table', () => {
    const a = makeFreshState();
    const b = makeFreshState();

    const cardA = applyDraw(a, { cardId: 0, x: 10, y: 10, name: 'A' });
    const cardB = applyDraw(b, { cardId: 0, x: 20, y: 20, name: 'B' });
    if (cardA && cardB){
      expect(cardA.id).toBe(0);
      expect(cardB.id).toBe(0);
    }

    applyDraw(a, { cardId: 0, x: 20, y: 20, name: 'B' });
    applyDraw(b, { cardId: 0, x: 10, y: 10, name: 'A' });

    expect(a.deck.length).toBe(50);
    expect(b.deck.length).toBe(50);
    expect(a.table.length).toBe(2);
    expect(b.table.length).toBe(2);

    const aTableIds = new Set(a.table.map(c => c.id));
    const bTableIds = new Set(b.table.map(c => c.id));
    expect(aTableIds).toEqual(bTableIds);
    expect(aTableIds.has(0)).toBe(true);
    expect(aTableIds.has(1)).toBe(true);
  });
});
