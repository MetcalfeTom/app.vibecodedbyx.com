#!/usr/bin/env python3
"""Scan /vibespace/apps and emit apps-index.json for app-archive-navigator.

Reads each <app>/index.html head section, pulls <title> + meta description +
og:description, infers a category from title+description keywords, and records
file mtime + size for chronological sorting fallbacks.
"""
import json, os, re, time, sys

APPS = '/vibespace/apps'
OUT = '/vibespace/apps/app-archive-navigator/apps-index.json'
SKIP = {'app-archive-navigator', 'sloppy-ops', 'sloppy-header'}

TITLE_RE = re.compile(r'<title>([^<]+)</title>', re.I)
OG_DESC_RE = re.compile(r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']+)["\']', re.I)
DESC_RE = re.compile(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', re.I)
OG_IMG_RE = re.compile(r'<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']', re.I)

CATEGORIES = [
  ('game',    r'\b(game|play|puzzle|arcade|battle|defense|tower|roguelike|rpg|dungeon|maze|platformer|shooter|racer|racing|fight|fighter|survival|dodge|catch|invader|breakout|pong|tetris|snake|asteroids|sloppy.*pet|pet|adventure|quest|slot|gambling|casino|bingo|chess|poker|tic.tac|cards?|deck|score|level|win|enemy|boss)\b'),
  ('music',   r'\b(music|synth|sound|audio|beat|drum|piano|guitar|chord|melody|song|sing|sample|loop|808|808s|bass|tempo|metronome|midi|sequence|arpeggio|chime|tone)\b'),
  ('chat',    r'\b(chat|message|messenger|conversation|talk|reply|dialog|gpt|llm|assistant|bot|chatbot|roast|elize|eliza|therapist|companion)\b'),
  ('art',     r'\b(draw|paint|sketch|canvas|pixel|generative|art|color|palette|brush|doodle|emoji|kaleido|fractal|mandelbrot|aquarium|particle|ascii|glitch|visual|render|cube|pattern|abstract|aesthetic|wallpaper|gallery|design)\b'),
  ('text',    r'\b(text|word|writ|story|book|poem|haiku|note|markdown|read|library|literature|essay|journal|diary|caption|font|type)\b'),
  ('utility', r'\b(generator|calculator|converter|timer|stopwatch|clock|password|hash|encode|decode|format|qr|tool|util|optim|prompt|productivity|todo|task|list|tracker|focus|pomodoro|reminder|note|search|finder|find|index)\b'),
  ('sim',     r'\b(simulator|simulate|simulation|physics|cellular|life|conway|ecosystem|fluid|gravity|orbit|solar|planet|space|rocket|particle|sandbox|fishtank|terrarium|grow|garden|build|city|farm|civ)\b'),
  ('social',  r'\b(feed|post|share|social|community|leaderboard|profile|user|friend|follow|vote|comment|review|forum|board)\b'),
  ('weird',   r'\b(cursed|haunt|horror|spook|monster|alien|ghost|demon|vampire|zombie|nightmare|creep|liminal|backroom|trippy|absurd|fart|cursed|chaos|gross|broken|impossible|bizarre|weird|prank|troll|nonsense|surreal|dream)\b'),
]

NAME_HINTS = {
  'game': ['arena', 'survivors', 'craft', 'tron', 'mario', 'doom'],
  'music': ['radio', 'fm', 'beat', 'drum', 'jam'],
  'art': ['canvas', 'pixel', 'fractal', 'kaleido', 'visual'],
  'sim': ['planet', 'galaxy', 'space', 'sim', 'physics'],
}

def categorize(name, title, desc):
  text = (name + ' ' + title + ' ' + desc).lower()
  for cat, pat in CATEGORIES:
    if re.search(pat, text):
      return cat
  for cat, hints in NAME_HINTS.items():
    if any(h in name.lower() for h in hints):
      return cat
  return 'misc'

def read_head(path, max_bytes=8192):
  try:
    with open(path, 'rb') as f:
      raw = f.read(max_bytes)
    try:
      return raw.decode('utf-8', errors='replace')
    except Exception:
      return raw.decode('latin-1', errors='replace')
  except Exception:
    return ''

def first_match(*patterns_text):
  for pat, text in patterns_text:
    m = pat.search(text)
    if m:
      return m.group(1).strip()
  return ''

def clean(s, n=180):
  s = re.sub(r'\s+', ' ', s).strip()
  return s[:n]

def main():
  apps = []
  errors = 0
  for name in sorted(os.listdir(APPS)):
    if name in SKIP or name.startswith('.') or name.startswith('_'):
      continue
    app_dir = os.path.join(APPS, name)
    if not os.path.isdir(app_dir):
      continue
    idx = os.path.join(app_dir, 'index.html')
    if not os.path.isfile(idx):
      continue
    try:
      st = os.stat(idx)
    except OSError:
      errors += 1
      continue
    head = read_head(idx)
    title = first_match((TITLE_RE, head))
    desc = first_match((OG_DESC_RE, head), (DESC_RE, head))
    og_image = first_match((OG_IMG_RE, head))
    apps.append({
      'slug': name,
      'title': clean(title, 80) or name.replace('-', ' '),
      'desc': clean(desc, 220),
      'cat': categorize(name, title, desc),
      'mtime': int(st.st_mtime),
      'size': st.st_size,
      'has_og': bool(og_image),
    })
  out = {
    'generated': int(time.time()),
    'count': len(apps),
    'apps': apps,
  }
  os.makedirs(os.path.dirname(OUT), exist_ok=True)
  with open(OUT, 'w') as f:
    json.dump(out, f, separators=(',', ':'))
  print(f'wrote {len(apps)} apps to {OUT} ({os.path.getsize(OUT)} bytes), errors={errors}')

if __name__ == '__main__':
  main()
