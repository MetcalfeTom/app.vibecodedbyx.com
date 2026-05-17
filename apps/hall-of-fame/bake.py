#!/usr/bin/env python3
"""hall-of-fame · per-user leaderboard bake
   ─────────────────────────────────────────
One pass over `git log --since=365d -- apps/`. For each commit:
  • Increment the git author's bucket (skipping bot accounts).
  • Run the same chat-handle regex pipeline as sloppy-ops/regen_snapshot
    (whitelist + auto-discovery on '(handle)' / 'per X' / "X's bug" /
    'chat: X' / 'requested by X') and bump each detected handle.
  • Track the set of apps each user touched + their last-active iso.

Output (apps/hall-of-fame/data.json):
  {
    generated_iso: ...,
    half_life_days: 21,
    week_buckets: 26,        // ~6 months of weekly resolution
    users: [
      {
        name, source: 'chat'|'git'|'both',
        lifetime: int,       // total commits/mentions
        current: float,      // decayed score (lifetime * exp(-lambda*days_since_last))
        decay_pct: float,    // 100 * (1 - current/lifetime)
        weeks: [int x 26],   // newest-first
        apps: [slug, ...],
        apps_count: int,
        last_active_iso: str
      }, ...
    ]
  }

Designed to be invoked by sloppy-ops/cron.sh alongside the existing
metric refresh, so the hall stays fresh hourly."""

import json
import math
import re
import subprocess
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path('/vibespace')
OUT = ROOT / 'apps' / 'hall-of-fame' / 'data.json'

HALF_LIFE_DAYS = 21
WEEK_BUCKETS = 52      # ~1 year of weekly resolution for the sparkline
LAMBDA = math.log(2) / HALF_LIFE_DAYS

BOT_HANDLES = {'sloppy_ai', 'sloppy', 'root', 'bot', 'system', 'admin',
               'github', 'noreply', 'dependabot', 'renovate', 'fela',
               'attribution'}   # meta-handle from the whitelist, not a person


def import_handle_lists():
    """Reuse the curated whitelist + blocklist from regen_snapshot so the
    two systems agree on which handles count as people."""
    sys.path.insert(0, str(ROOT / 'apps' / 'sloppy-ops'))
    try:
        from regen_snapshot import KNOWN_CHAT_HANDLES, TECH_BLOCKLIST
        return set(KNOWN_CHAT_HANDLES), set(TECH_BLOCKLIST)
    except Exception as e:
        print(f'[bake] regen import failed: {e} — falling back to empty lists',
              file=sys.stderr)
        return set(), set()


KNOWN_CHAT_HANDLES, TECH_BLOCKLIST = import_handle_lists()


def run(cmd):
    return subprocess.check_output(cmd, cwd=str(ROOT), text=True)


def now_utc():
    return datetime.now(timezone.utc)


def parse_iso(s):
    try:
        return datetime.fromisoformat(s)
    except Exception:
        return None


def week_index(when, ref):
    """Bucket index: 0 = the week containing `ref` (most recent),
    higher = older. Returns None if outside the window."""
    if not when:
        return None
    delta = ref - when
    days = delta.total_seconds() / 86400
    if days < 0:
        return 0
    i = int(days // 7)
    if i >= WEEK_BUCKETS:
        return None
    return i


def main():
    now = now_utc()

    # Pass 1: harvest commits with author, iso, subject, and touched
    # apps/<slug>/ paths in one log walk. NO --since cap — per chat ask
    # ('walk the entire git history since day one'), we want every point
    # ever earned. The 21-day exponential decay still makes ancient
    # entries fade to near-zero current scores, but their LIFETIME stays
    # honest. Earliest commit drives window_days in the output.
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%H%x09%aI%x09%aN%x09%s', '--name-only',
        '--', 'apps/',
    ])

    commits = []   # [(when, author, subj, [slug, ...])]
    cur = None
    for line in raw.split('\n'):
        if not line:
            if cur:
                commits.append(cur)
                cur = None
            continue
        if line.count('\t') >= 3:
            if cur:
                commits.append(cur)
            _h, iso, author, subj = line.split('\t', 3)
            cur = (parse_iso(iso), author, subj, [])
        elif cur is not None and line.startswith('apps/'):
            parts = line.split('/')
            if len(parts) >= 2 and parts[1] and parts[1] not in cur[3]:
                cur[3].append(parts[1])
    if cur:
        commits.append(cur)

    earliest = min((w for w, *_ in commits if w), default=None)
    window_days = int((now - earliest).total_seconds() / 86400) if earliest else 0
    print(f'[bake] walked {len(commits)} commits · earliest {earliest.date() if earliest else "?"} '
          f'· window {window_days}d', file=sys.stderr)

    # Pass 2: auto-discover handles from explicit attribution patterns.
    H = r"[a-z][a-z0-9_]{2,19}"
    PUNCT = r"[\s,'\";:.!?\)\]]|$"
    ATTRIB_NOUNS = (r"bug|ask|request|idea|suggestion|comment|feedback|"
                    r"nudge|prompt|complaint|fix|tweak|nit|note|callout|gripe|hunch")
    strong_patterns = [
        re.compile(rf"\(({H})\)", re.IGNORECASE),
        re.compile(rf"\bper\s+({H})\b(?={PUNCT})", re.IGNORECASE),
        re.compile(rf"\b({H})'s\s+(?:{ATTRIB_NOUNS})\b", re.IGNORECASE),
        re.compile(rf"\bchat\s*[:\-]\s*({H})\b", re.IGNORECASE),
        re.compile(
            r"\b(?:asked|requested|wanted|reported|noticed|spotted|caught|"
            r"flagged|raised|filed|nudged|complained|suggested|described)\s+by\s+"
            rf"({H})\b",
            re.IGNORECASE,
        ),
    ]
    auto = set()
    for _w, _a, subj, _apps in commits:
        for pat in strong_patterns:
            for m in pat.finditer(subj):
                h = m.group(1).lower()
                if h in BOT_HANDLES or h in TECH_BLOCKLIST:
                    continue
                # auto-accept only when shape is unambiguous
                if any(c.isdigit() or c == '_' for c in h):
                    auto.add(h)
    confirmed = (KNOWN_CHAT_HANDLES | auto) - BOT_HANDLES
    handle_pats = {h: re.compile(rf"\b{re.escape(h)}\b", re.IGNORECASE)
                   for h in confirmed}

    # Pass 3: per-user accumulators.
    # users[name] = {
    #   sources: set,        # {'git', 'chat'}
    #   total: int,           # lifetime score (commit/mention count, deduped per commit)
    #   weeks: [int * 26],    # commits-per-week-bucket
    #   apps: set,            # slugs touched
    #   last: datetime|None
    # }
    def fresh():
        return {'sources': set(), 'total': 0,
                'weeks': [0] * WEEK_BUCKETS, 'apps': set(), 'last': None}

    users = defaultdict(fresh)

    for when, author, subj, app_slugs in commits:
        wk = week_index(when, now)

        # Git author credit (skip bots).
        if author and author.lower() not in BOT_HANDLES:
            u = users[author]
            u['sources'].add('git')
            u['total'] += 1
            if wk is not None:
                u['weeks'][wk] += 1
            for s in app_slugs:
                u['apps'].add(s)
            if when and (u['last'] is None or when > u['last']):
                u['last'] = when

        # Chat-handle attributions. Score once per (handle, commit) so
        # mentioning the same name twice in a subject doesn't double-count.
        hits = set()
        for h, p in handle_pats.items():
            if p.search(subj):
                hits.add(h)
        for h in hits:
            u = users[h]
            u['sources'].add('chat')
            u['total'] += 1
            if wk is not None:
                u['weeks'][wk] += 1
            for s in app_slugs:
                u['apps'].add(s)
            if when and (u['last'] is None or when > u['last']):
                u['last'] = when

    # Pass 4: shape output records, score the decay, sort by current.
    out_users = []
    for name, u in users.items():
        if u['total'] <= 0:
            continue
        if u['last']:
            days = max(0.0, (now - u['last']).total_seconds() / 86400)
            decay_factor = math.exp(-LAMBDA * days)
        else:
            days = None
            decay_factor = 0.0
        current = round(u['total'] * decay_factor, 2)
        decay_pct = round((1 - decay_factor) * 100, 1) if u['last'] else 100.0
        src = (sorted(u['sources']))
        source = 'both' if len(src) == 2 else (src[0] if src else 'unknown')
        out_users.append({
            'name': name,
            'source': source,
            'lifetime': u['total'],
            'current': current,
            'decay_pct': decay_pct,
            'days_since_last': round(days, 1) if days is not None else None,
            'weeks': u['weeks'],         # index 0 = this week, 25 = ~6 months ago
            'apps': sorted(u['apps']),
            'apps_count': len(u['apps']),
            'last_active_iso': u['last'].isoformat() if u['last'] else '',
        })

    # Default sort: lifetime desc (the "hall of fame" ordering — legends
    # are legends even if they're cold). Front-end can re-sort live.
    out_users.sort(key=lambda r: (-r['lifetime'], -r['current'], r['name'].lower()))

    payload = {
        'generated_iso': now.isoformat(),
        'half_life_days': HALF_LIFE_DAYS,
        'week_buckets': WEEK_BUCKETS,
        'window_days': window_days,
        'earliest_commit_iso': earliest.isoformat() if earliest else '',
        'total_commits_scanned': len(commits),
        'total_users': len(out_users),
        'total_commits': sum(u['lifetime'] for u in out_users),
        'users': out_users,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(',', ':')))
    print(f'[bake] wrote {OUT.name} · {len(out_users)} honorees · '
          f'{payload["total_commits"]} attributed points · {OUT.stat().st_size} bytes',
          file=sys.stderr)


if __name__ == '__main__':
    main()
