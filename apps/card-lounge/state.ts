// ─────────────────────────────────────────────────────────────────────
// card-lounge state.ts — pure logic, no DOM, no realtime (TypeScript)
//
// Canonical algorithm for the lounge's deck + table + hands. The
// browser runtime in index.html wraps these functions with side
// effects; the test-multiuser.mjs simulator mirrors them; the vitest
// suite exercises them directly.
// ─────────────────────────────────────────────────────────────────────

export type DeckKind = 'std' | 'uno' | 'ek' | 'uu' | 'tapple';

export interface StdCard    { id: number; kind: 'std'; suit: string; rank: string; }
export interface UnoCard    { id: number; kind: 'uno'; color: string; value: string; }
export interface EkCard     { id: number; kind: 'ek';  type: string; label: string; glyph: string; color: string; }
export interface UuCard     { id: number; kind: 'uu';  type: string; name: string; label: string; glyph: string; color: string; }
export interface TappleCard { id: number; kind: 'tapple'; category: string; }
export type Card = StdCard | UnoCard | EkCard | UuCard | TappleCard;

export type TableCard = Card & { x: number; y: number; drawnBy?: string };

export interface State {
  deckKind: DeckKind;
  deck: Card[];
  table: TableCard[];
  hands: Record<string, Card[]>;
  stateVersion: number;
}

export interface DrawPayload         { cardId: number; x: number; y: number; name?: string; }
export interface MovePayload         { cardId: number; x: number; y: number; }
export interface ShufflePayload      { deck: Card[]; }
export interface SwitchDeckPayload   { kind: DeckKind; }
export interface DrawToHandPayload   { cardId: number; ownerId: string; }
export interface PlayFromHandPayload { cardId: number; ownerId: string; x: number; y: number; name?: string; card?: Card; }
export interface DefusePayload       { kittenId: number; defuseId: number; ownerId: string; }

export type PendingMoves = Record<number, { x: number; y: number }>;
export interface ApplyOpts { pendingMoves?: PendingMoves; }

export interface AdoptStateArgs {
  localVersion: number;
  incomingVersion: number;
  isFirstHere: boolean;
  myId: string;
  senderId: string;
}

// ── Constants ────────────────────────────────────────────────────────
export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export const UNO_COLORS = ['red', 'yellow', 'green', 'blue'] as const;
export const UNO_VALUES = ['1','2','3','4','5','6','7','8','9','skip','reverse','+2'] as const;

interface EkTypeDef  { type: string; label: string; glyph: string; count: number; color: string; }
export const EK_CARDS: EkTypeDef[] = [
  { type:'kitten',  label:'EXPLODING KITTEN', glyph:'💥', count: 4, color:'#a02818' },
  { type:'defuse',  label:'DEFUSE',           glyph:'🧯', count: 6, color:'#3a6e4c' },
  { type:'attack',  label:'ATTACK',           glyph:'⚔',  count: 4, color:'#7a2d8a' },
  { type:'skip',    label:'SKIP',             glyph:'⏭',  count: 4, color:'#2c6db8' },
  { type:'favor',   label:'FAVOR',            glyph:'🙏', count: 4, color:'#b88c3c' },
  { type:'shuffle', label:'SHUFFLE',          glyph:'🔀', count: 4, color:'#5c5c8a' },
  { type:'see',     label:'SEE FUTURE',       glyph:'🔮', count: 5, color:'#6b4ba0' },
  { type:'nope',    label:'NOPE',             glyph:'🛑', count: 5, color:'#8a1f1c' },
  { type:'tacocat', label:'TACOCAT',          glyph:'🌮', count: 4, color:'#c87836' },
  { type:'hairy',   label:'HAIRY POTATO',     glyph:'🥔', count: 4, color:'#a08868' },
  { type:'rainbow', label:'RAINBOW CAT',      glyph:'🌈', count: 4, color:'#5a8f78' },
  { type:'beard',   label:'BEARD CAT',        glyph:'🧔', count: 4, color:'#7a5530' },
  { type:'melon',   label:'CATTERMELON',      glyph:'🍉', count: 4, color:'#c54e58' },
];

interface UuCatMeta { label: string; glyph: string; color: string; }
// UU base set + Dragons + Apocalypse + NSFW expansions. New `dragon` and
// `apocalypse` categories add their own coloured cards on top of the
// base set; magical/baby/upgrade pools were extended with expansion-set
// named unicorns.
export const UU_CATS: Record<string, UuCatMeta> = {
  basic:      { label:'BASIC UNICORN',   glyph:'🦄', color:'#f0e8ff' },
  magical:    { label:'MAGICAL UNICORN', glyph:'✨', color:'#c9a4ff' },
  baby:       { label:'BABY UNICORN',    glyph:'🐴', color:'#ffd6e8' },
  upgrade:    { label:'UPGRADE',         glyph:'⬆',  color:'#a4d8ff' },
  downgrade:  { label:'DOWNGRADE',       glyph:'⬇',  color:'#3a2540' },
  magic:      { label:'MAGIC',           glyph:'🔮', color:'#ffa4dc' },
  instant:    { label:'INSTANT',         glyph:'⚡', color:'#fff094' },
  dragon:     { label:'DRAGON',          glyph:'🐉', color:'#5a1818' },
  apocalypse: { label:'APOCALYPSE',      glyph:'☢',  color:'#604030' },
};
export const UU_NAMES: Record<string, string[]> = {
  basic:      ['Basic Unicorn','Basic Unicorn','Basic Unicorn','Basic Unicorn','Basic Unicorn','Basic Unicorn','Basic Unicorn','Basic Unicorn'],
  // 18 base + 8 from Dragons/NSFW expansions = 26 magical
  magical:    ['Rainbow','Glitter','Narwhal','Pegasus','Llamacorn','Shark-Horn','Stabby','Americorn',
               'Twindle','Destructive','Greedy Flying','Black Knight','Kittencorn','Puppicorn',
               'Annoying Flying','Honeybee','Seductive','Unicorn Mike',
               // expansion magicals
               'Greasebag','Magical Llama','Unicorn Phoenix','Smolder',
               'Drazlana','Drachma','Dracosaur','Magical Cookie'],
  // 10 base + 2 expansion = 12 baby
  baby:       ['Buttercup','Daisy','Sparkle','Spitfire','Mustache','Hazel','Frankenstein','Bonkers','Hammer','Coconut',
               'Marshmallow','Wishbone'],
  // 8 base + 2 expansion = 10 upgrade
  upgrade:    ['Magical Boots','Extra Tail','Pretty Pretty Mane','Magical Squad','Sweet Ride','Stardust','Glittery Hooves','Bedazzled',
               'Ginormous Sword','Magic Mirror'],
  downgrade:  ['Broken Stable','Tiny Stable','Black Hole','Burning Stable','Mud Spirit','Nanny Cam'],
  // 8 base + 2 expansion = 10 magic
  magic:      ['Neigh!','Glitter Tornado','Unicorn Lasso','Yay!','Re-Target','Rainbow Mane','Glitter Bomb','Summoning Ritual',
               'Dragon Pact','Mass Hypnosis'],
  instant:    ['Neigh!','Super Neigh!','Stab','Mystical Vortex'],
  // expansion: 6 dragons
  dragon:     ['Drakkar','Smoldrax','Magma Wyrm','Crystal Drake','Stormscale','Hatchling'],
  // expansion: 4 apocalypse
  apocalypse: ['Apocalypse Unicorn','Brick Unicorn','Tactical Unicorn','Pegacorn'],
};

// ── Tapple — category prompt deck (40 cards) ─────────────────────────
// Pairs with the letter-randomizer panel: spin a letter, draw a category
// → name something matching both.
export const TAPPLE_CATEGORIES: string[] = [
  'Things at the beach',
  'Famous movies',
  'Foods that are yellow',
  'Things in a kitchen',
  'Animals in the jungle',
  'Things that are round',
  'Famous athletes',
  'Cars and trucks',
  'Things in a hospital',
  'Board games',
  'Cartoon characters',
  'Things that fly',
  'Words for "happy"',
  'Famous singers',
  'Things in space',
  'Words ending in -ing',
  'Things at a wedding',
  'Famous painters',
  'Things that are blue',
  'Sports',
  'Capital cities',
  'Disney movies',
  'Things you wear',
  'Famous scientists',
  'Types of cheese',
  'Things in a forest',
  'Famous bands',
  'Things that bounce',
  'Things in your bedroom',
  'Words that mean "fast"',
  'Types of trees',
  'Famous brands',
  'Things in a school',
  'Mythical creatures',
  'Cooking utensils',
  'TV shows',
  'Famous video games',
  'Things in a museum',
  'Famous superheroes',
  'Things that are soft',
];

// ── Pure helpers ─────────────────────────────────────────────────────
export function freshDeck(kind: DeckKind | string): Card[] {
  const d: Card[] = [];
  let id = 0;
  if (kind === 'uno'){
    for (const c of UNO_COLORS){
      d.push({ id: id++, kind:'uno', color: c, value: '0' });
      for (const v of UNO_VALUES){
        d.push({ id: id++, kind:'uno', color: c, value: v });
        d.push({ id: id++, kind:'uno', color: c, value: v });
      }
    }
    for (let i = 0; i < 4; i++) d.push({ id: id++, kind:'uno', color:'wild', value:'wild' });
    for (let i = 0; i < 4; i++) d.push({ id: id++, kind:'uno', color:'wild', value:'+4' });
    return d;
  }
  if (kind === 'ek'){
    for (const t of EK_CARDS){
      for (let i = 0; i < t.count; i++){
        d.push({ id: id++, kind:'ek', type: t.type, label: t.label, glyph: t.glyph, color: t.color });
      }
    }
    return d;
  }
  if (kind === 'uu'){
    for (const cat of Object.keys(UU_CATS)){
      const meta = UU_CATS[cat];
      for (const name of UU_NAMES[cat]){
        d.push({ id: id++, kind:'uu', type: cat, name, label: meta.label, glyph: meta.glyph, color: meta.color });
      }
    }
    return d;
  }
  if (kind === 'tapple'){
    for (const cat of TAPPLE_CATEGORIES){
      d.push({ id: id++, kind:'tapple', category: cat });
    }
    return d;
  }
  for (const s of SUITS) for (const r of RANKS){
    d.push({ id: id++, kind:'std', suit: s, rank: r });
  }
  return d;
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isRed(suit: string): boolean {
  return suit === '♥' || suit === '♦';
}

export function makeFreshState(): State {
  return {
    deckKind: 'std',
    deck: freshDeck('std'),
    table: [],
    hands: {},
    stateVersion: 0,
  };
}

// ── Apply functions ─────────────────────────────────────────────────
export function applyDraw(state: State, payload: DrawPayload, opts: ApplyOpts = {}): Card | false {
  const pending = opts.pendingMoves || {};
  let idx = state.deck.findIndex(c => c.id === payload.cardId);
  if (idx === -1){
    if (!state.deck.length) return false;
    idx = 0;
  }
  const card = state.deck.splice(idx, 1)[0];
  const tableCard: TableCard = { ...card, x: payload.x, y: payload.y, drawnBy: payload.name || 'someone' };
  state.table.push(tableCard);
  state.stateVersion += 1;
  const pm = pending[card.id];
  if (pm){
    tableCard.x = pm.x;
    tableCard.y = pm.y;
    delete pending[card.id];
  }
  return card;
}

export function applyMove(state: State, payload: MovePayload, opts: ApplyOpts = {}): boolean {
  const pending = opts.pendingMoves || {};
  const c = state.table.find(c => c.id === payload.cardId);
  if (!c){
    pending[payload.cardId] = { x: payload.x, y: payload.y };
    return false;
  }
  c.x = payload.x;
  c.y = payload.y;
  return true;
}

export function applyClear(state: State): void {
  for (const c of state.table){
    let restored: Card;
    if      (c.kind === 'uno')    restored = { id: c.id, kind: 'uno', color: c.color, value: c.value };
    else if (c.kind === 'ek')     restored = { id: c.id, kind: 'ek', type: c.type, label: c.label, glyph: c.glyph, color: c.color };
    else if (c.kind === 'uu')     restored = { id: c.id, kind: 'uu', type: c.type, name: c.name, label: c.label, glyph: c.glyph, color: c.color };
    else if (c.kind === 'tapple') restored = { id: c.id, kind: 'tapple', category: c.category };
    else                          restored = { id: c.id, kind: 'std', suit: c.suit, rank: c.rank };
    state.deck.push(restored);
  }
  state.table = [];
  state.stateVersion += 1;
}

export function applyShuffle(state: State, payload: ShufflePayload): void {
  state.deck = payload.deck;
  state.table = [];
  state.stateVersion += 1;
}

export function applySwitchDeck(state: State, payload: SwitchDeckPayload): void {
  state.deckKind = payload.kind;
  state.deck = shuffle(freshDeck(payload.kind));
  state.table = [];
  state.hands = {};
  state.stateVersion += 1;
}

export function applyDrawToHand(state: State, payload: DrawToHandPayload): Card | null {
  let idx = state.deck.findIndex(c => c.id === payload.cardId);
  if (idx === -1){
    if (!state.deck.length) return null;
    idx = 0;
  }
  const card = state.deck.splice(idx, 1)[0];
  if (!state.hands[payload.ownerId]) state.hands[payload.ownerId] = [];
  state.hands[payload.ownerId].push(card);
  state.stateVersion += 1;
  return card;
}

export function applyPlayFromHand(state: State, payload: PlayFromHandPayload): Card | null {
  const hand = state.hands[payload.ownerId] || [];
  const idx = hand.findIndex(c => c.id === payload.cardId);
  let card: Card | undefined;
  if (idx !== -1){
    card = hand.splice(idx, 1)[0];
  } else if (payload.card){
    card = payload.card;
  } else {
    return null;
  }
  state.table.push({ ...card, x: payload.x, y: payload.y, drawnBy: payload.name || 'someone' } as TableCard);
  state.stateVersion += 1;
  return card;
}

export function applyDefuse(state: State, payload: DefusePayload): boolean {
  const hand = state.hands[payload.ownerId] || [];
  let i = hand.findIndex(c => c.id === payload.defuseId);
  if (i !== -1) hand.splice(i, 1);
  i = hand.findIndex(c => c.id === payload.kittenId);
  let kittenCard: Card | null = null;
  if (i !== -1) kittenCard = hand.splice(i, 1)[0];
  if (kittenCard){
    const pos = Math.floor(Math.random() * (state.deck.length + 1));
    state.deck.splice(pos, 0, kittenCard);
  }
  state.stateVersion += 1;
  return !!kittenCard;
}

export function applyExplode(state: State): void {
  state.stateVersion += 1;
}

// ── State-conflict resolution ───────────────────────────────────────
export function shouldAdoptState(args: AdoptStateArgs): boolean {
  if (args.isFirstHere) return true;
  if (args.incomingVersion > args.localVersion) return true;
  if (args.incomingVersion === args.localVersion && args.senderId > args.myId) return true;
  return false;
}
