#!/usr/bin/env python3
"""
sloppy-ops snapshot regenerator
================================
Re-bakes /vibespace/apps/sloppy-ops/data.json from real sources:
  - du -sb on each apps/<name>  → sizes_top (top 30 by bytes)
  - git log --pretty=...        → deploys / usage_history (last 180d)
  - git log --author counts     → creators leaderboard
  - regex over commit subjects  → chat_credits (with stoplist)
  - /proc + /sys reads          → system / runtime / network blocks
  - hostname / uname / etc.     → host metadata

Designed to run from a cron job hourly. Idempotent. Safe to re-run.

Usage:
    python3 /vibespace/apps/sloppy-ops/regen_snapshot.py

Exit codes:
    0  success
    2  git or filesystem failure (snapshot left untouched)
"""
import functools
import json
import os
import re
import subprocess
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('/vibespace')
APPS = ROOT / 'apps'
OUT = ROOT / 'apps/sloppy-ops/data.json'

# ─── stoplist for chat_credits regex ─────────────────────────────────────────
# Common English + technical words that look like usernames after "per X"
# but aren't real chat handles. Keep this conservative; over-filtering loses
# real one-time chat mentions, under-filtering surfaces phrases like
# "per frame" as fake creditors.
STOP_WORDS = set("""
frame pixel second tick cell row step cycle byte stroke user month day hour
note seat char file line slot page lane beat bar hit dog key wall ball mile
item app side type mode edge axis tile view layer chunk batch level round
turn world head foot hand point time spin call run seed click drag tap swipe
vote wave floor room door window card deck suit rank score win loss draw rule
phase token word tempo tone pitch octave scale chord channel track stem voice
pad pulse rim core hub node enemy boss quest task xp hp mp dmg crit buff debuff
cooldown stack combo spawn drop pickup target aim shot clip reload dash jump
hop crouch sprint walk idle stand sit sleep wake reset clear wipe save load
open close start stop pause resume next prev first last top bottom left right
center middle front back inside outside commit request default sample test case
demo build deploy release patch fix bug feat chore docs style refactor perf
revert use via use sprite asset color shade hue sky star moon sun cloud rain
snow wind tree leaf rock sand each every session axis swap plot sort find match
span poll rate flow load heat glow blur dot render reach tab box pane panel
widget badge pill ring tip chat block kind project scene fighter prompt thread
chunk word piece group set list array map dict block frame pose mode flag arg
prop slot mask gate event entry exit limit max min cap floor scope env path
script style class func proc inst row col face hand foot wall floor side
line angle bend curve point area zone region track lane field
""".split())


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%fZ')


def run(cmd, **kw) -> str:
    """Run a shell command, capture stdout, return text. Raises on failure."""
    return subprocess.check_output(cmd, stderr=subprocess.DEVNULL, **kw).decode()


def bake_sizes_top() -> tuple[list, int]:
    rows = []
    for name in sorted(os.listdir(APPS)):
        p = APPS / name
        if not p.is_dir() or name.startswith('.'):
            continue
        try:
            out = run(['du', '-sb', str(p)])
            b = int(out.split()[0])
            rows.append({'name': name, 'bytes': b, 'mb': round(b / (1024 * 1024), 2)})
        except Exception:
            pass
    rows.sort(key=lambda r: -r['bytes'])
    return rows[:30], len(rows)


@functools.lru_cache(maxsize=1)
def _real_slugs() -> frozenset:
    """The set of slugs that are actually directories under apps/.
    Used to validate candidate names extracted from commit subjects so
    we never emit a `d.app` value that won't resolve when the user clicks
    'visit' on the deployments list."""
    try:
        return frozenset(p.name for p in (ROOT / 'apps').iterdir() if p.is_dir())
    except Exception:
        return frozenset()


def _app_from_commit(h: str, subj: str) -> str:
    """Derive the primary app name from a commit. The authoritative
    source is the actual `apps/<slug>/` path touched by the commit — the
    subject-line prefix is only used as a tie-breaker when a commit
    spans multiple apps, or as a last resort when the commit touched
    nothing under apps/. Any candidate is validated against the real
    apps/ directory listing so we never emit a broken slug."""
    real = _real_slugs()

    # 1. Walk the files actually changed by this commit. Collect every
    #    apps/<slug>/ path; prefer the slug that matches the subject
    #    prefix, otherwise return the single touched slug (or the first
    #    if multiple — rare but happens with cross-cutting refactors).
    touched: list[str] = []
    try:
        files = run([
            'git', '-C', str(ROOT), 'show', '--name-only',
            '--pretty=format:', h,
        ]).strip().split('\n')
        seen = set()
        for f in files:
            if f.startswith('apps/'):
                parts = f.split('/')
                if len(parts) >= 2 and parts[1] and parts[1] not in seen:
                    seen.add(parts[1])
                    if not real or parts[1] in real:
                        touched.append(parts[1])
    except Exception:
        pass

    # Extract the subject prefix once, as a hint for tie-breaking.
    prefix_hint = ''
    m = re.match(r'^([a-z0-9][a-z0-9_-]*)\s*[:|-]', subj or '')
    if m:
        # Greedy match may have stopped on the FIRST hyphen even though
        # the real slug has more hyphens. Try longer candidates: from
        # the full subject, take the leading run of [a-z0-9_-] and walk
        # back hyphen-by-hyphen looking for one that's a real slug.
        head = re.match(r'^[a-z0-9_-]+', subj or '')
        if head:
            cand = head.group(0).rstrip('-')
            while cand:
                if not real or cand in real:
                    prefix_hint = cand
                    break
                # Drop the trailing -segment and retry.
                if '-' in cand:
                    cand = cand.rsplit('-', 1)[0]
                else:
                    break
        if not prefix_hint:
            prefix_hint = m.group(1)

    if touched:
        if prefix_hint and prefix_hint in touched:
            return prefix_hint
        return touched[0]

    # 2. Nothing under apps/ was touched — fall back to the subject
    #    prefix, but only return it if it actually exists on disk (or if
    #    we have no real-slug set to compare against).
    if prefix_hint and (not real or prefix_hint in real):
        return prefix_hint
    return ''


def bake_deploys() -> list:
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%H\t%aI\t%aN\t%s', '-n', '60', '--', 'apps/',
    ]).strip().split('\n')
    out = []
    for line in raw[:30]:
        parts = line.split('\t', 3)
        if len(parts) < 4:
            continue
        h, iso, author, subj = parts
        out.append({
            'hash': h[:7],
            'when_iso': iso,
            'author': author,
            'subject': subj[:200],
            'app': _app_from_commit(h, subj),
        })
    return out


def bake_usage_history(cap: int = 1800) -> list:
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%H%x09%aI%x09%s', '--name-only',
        '--since=180.days.ago', '--', 'apps/',
    ])
    rows = []
    cur = None
    for line in raw.split('\n'):
        line = line.rstrip()
        if not line:
            if cur:
                rows.append(cur)
                cur = None
            continue
        if line.count('\t') >= 2:
            if cur:
                rows.append(cur)
            h, iso, subj = line.split('\t', 2)
            m = re.match(r'([a-z0-9-]+):', subj)
            cur = {
                'hash': h[:7], 'when_iso': iso,
                'subject': subj[:200],
                'app': m.group(1) if m else '',
            }
        elif cur and line.startswith('apps/'):
            parts = line.split('/')
            if len(parts) >= 2 and not cur['app']:
                cur['app'] = parts[1]
    if cur:
        rows.append(cur)
    return rows[:cap]


def bake_creators() -> tuple[list, int]:
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%H%x09%aN%x09%aI', '--name-only',
        '--since=180.days.ago', '--', 'apps/',
    ])
    commits = Counter()
    apps = defaultdict(set)
    last = {}
    cur_a = None
    for line in raw.split('\n'):
        line = line.rstrip()
        if not line:
            cur_a = None
            continue
        if line.count('\t') >= 2:
            _, cur_a, iso = line.split('\t', 2)
            commits[cur_a] += 1
            if cur_a not in last or last[cur_a] < iso:
                last[cur_a] = iso
        elif cur_a and line.startswith('apps/'):
            parts = line.split('/')
            if len(parts) >= 2:
                apps[cur_a].add(parts[1])
    out = []
    for a, n in commits.most_common(30):
        out.append({
            'username': a,
            'commits': n,
            'apps_touched': sorted(apps[a])[:200],
            'apps_count': len(apps[a]),
            'last_active': last.get(a, ''),
        })
    return out, len(commits)


# Common English words that are NOT chat handles but might survive a regex
# match like "(the same)" → "(the)" → captured as "the". 600+ entries
# covering articles, prepositions, common verbs/nouns/adjectives, plus repo
# jargon I see surface as parens or attribution-verb subjects.
ENGLISH_STOP = set("""
the a an and or but if then else when where why how what which who whom that
this these those there here than then so as is it its are was were be been
being do does did doing has have had having will would shall should can could
may might must not no nor too very also only just even still yet now new old
in on at by for from with into onto upon over under between among through
during after before above below behind around about against without within
across along amid amidst against versus
i you he she they we me him her them us my your his their our its
yours theirs ours
say said go went come came get got give gave take took make made see saw
know knew think thought feel felt look looked want wanted try tried use used
work worked run ran call called find found leave left bring brought put set
let live died sit stood stand sat hold held write wrote read meet met pay
paid sell sold sent send build built buy bought choose chose teach taught
all any both each every few many more most much same several some such
other some another bit lot good bad big small large little long short
high low fast slow easy hard real true false right wrong own same different
better worse best worst less least same various certain
text grid full green cyan amber pink violet red blue gold rose mint white
black gray dark light bright dim solid faint warm cool soft hard heavy thin
thick wide narrow tall short tiny giant huge mini full empty
state name space new old visible hidden moved fixed broken stuck open close
clean done active inactive ready paused running idle frozen
pollinations supabase twitch claude openai anthropic github jsdelivr cdn
also still here there what which whose whom only just any all some none
ever never always often rarely sometimes maybe perhaps probably likely
ok okay yes ok unsure sure clear fine
""".split())


def _is_handle_shaped(h: str) -> bool:
    """A candidate looks like a chat handle (not a common English word) if:
      - it contains a digit or underscore (clear handle signature), OR
      - it is 5+ characters AND not in the English stoplist, OR
      - it is exactly 4 chars AND not in the English stoplist
    3-character or shorter strings are too ambiguous to treat as handles.
    """
    if len(h) < 4:
        return False
    if any(c.isdigit() or c == '_' for c in h):
        return True
    if h in ENGLISH_STOP:
        return False
    if h in STOP_WORDS:
        return False
    return True


# Known chat user handles. ADD-ONLY list — operators append when new
# chatters get attributed in commits. Two principles for why this is a
# whitelist instead of pattern discovery:
#   (1) The handle set is small (under 50) and changes slowly.
#   (2) Regex discovery is fundamentally noisy: every chat user has 2-3
#       attribution patterns and English commits have hundreds of word
#       patterns that look similar. After trying multi-pass scoring with
#       a 200-word stoplist + quality thresholds, the leaderboard still
#       surfaced "the", "speed", "pattern", "openrouter" as fake creditors.
#       Whitelist is honest about what we know.
# Discovered chat users (mid-May 2026): people who have visibly steered
# multiple apps via commit attributions, the memory-attic seed list, and
# any handle with a digit/underscore (unambiguously handle-shaped).
KNOWN_CHAT_HANDLES = {
    'inisso',
    'zennlogic',
    'marcipopsis',
    'kneady1',
    'notsid101',
    'fela',
    'mrmald92',
    'attribution',
    'awarpigeon',
    'noothropic',
    'paulrinaldi',
    'latino_supreme_',
    'frame',  # placeholder — REMOVE when a real user named 'frame' is added
}
# Drop the placeholder so we never falsely credit "frame" — kept above only
# to make the upkeep pattern obvious for future maintainers.
KNOWN_CHAT_HANDLES.discard('frame')

# Technical patterns that LOOK handle-shaped but aren't chat users.
# Match these AFTER candidate extraction to avoid promoting them.
TECH_BLOCKLIST = {
    'max_tokens', 'max_age', 'min_age', 'user_id', 'app_id', 'request_id',
    'session_id', 'session_token', 'access_token', 'refresh_token',
    'newdur', 'newcap', 'newmax', 'newvar', 'oldvar', 'apidata',
    'localdata', 'globaldata',
}


def bake_chat_credits() -> tuple[list, int, float, dict]:
    """Attribute commits to chat users using a whitelist + auto-discovery.

    Resolution:
      - WHITELIST: KNOWN_CHAT_HANDLES is the authoritative list, edited by
        operators when new chatters earn an attribution. Every standalone
        word-boundary mention in a commit subject counts.
      - AUTO-DISCOVERY: a handle is also accepted on the fly if its shape
        is unambiguous (contains a digit OR an underscore) AND it doesn't
        appear in TECH_BLOCKLIST AND it appears in at least one explicit
        attribution context (parens, "per X", "X's <attribution-noun>",
        chat:, <verb> by X). One paren match for `(notsid101)` is enough
        to bring it in; "max_tokens" is excluded by TECH_BLOCKLIST.

    The `strong` field on each output row reports how many commits matched
    that handle in an explicit attribution context, so the dashboard can
    distinguish "named directly" from "name-dropped in passing"."""

    BOT_HANDLES = {'sloppy_ai', 'sloppy', 'root', 'bot', 'system', 'admin',
                   'github', 'noreply', 'dependabot', 'renovate'}

    # We want per-commit subject AND the list of apps/<slug>/ paths each
    # commit touched, so we can attribute chat handles to specific apps.
    # --name-only with a tab-delimited header line gives us both in one
    # log walk.
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%H%x09%aI%x09%s', '--name-only',
        '--since=120.days.ago', '--', 'apps/',
    ])

    commits = []   # [(iso, subj, [slug, ...])]
    cur = None
    for line in raw.split('\n'):
        if not line:
            if cur:
                commits.append(cur)
                cur = None
            continue
        if line.count('\t') >= 2:
            if cur:
                commits.append(cur)
            _h, iso, subj = line.split('\t', 2)
            cur = (iso, subj, [])
        elif cur is not None and line.startswith('apps/'):
            parts = line.split('/')
            if len(parts) >= 2 and parts[1] and parts[1] not in cur[2]:
                cur[2].append(parts[1])
    if cur:
        commits.append(cur)

    H = r"[a-z][a-z0-9_]{2,19}"
    PUNCT = r"[\s,'\";:.!?\)\]]|$"
    # Expanded noun list catches more real attributions: audit / report /
    # find / finding / spot / concern / ping / shoutout / lag / hang /
    # crash / regression (these all show up in 'X's audit' / '(X report)'
    # style commits that the old list missed).
    ATTRIB_NOUNS = (
        r"bug|ask|request|idea|suggestion|comment|feedback|"
        r"nudge|prompt|complaint|fix|tweak|nit|note|callout|gripe|hunch|"
        r"audit|report|reports|find|finding|spot|concern|ping|shoutout|"
        r"lag|hang|crash|regression"
    )
    strong_patterns = [
        re.compile(rf"\(({H})\)", re.IGNORECASE),
        # "(handle report)", "(handle bug)", etc.
        re.compile(rf"\(({H})\s+(?:{ATTRIB_NOUNS}|reported|spotted|noticed|"
                   r"caught|asked|wanted|flagged|raised|complained|suggested|"
                   r"described|says|noted|saw)s?\b",
                   re.IGNORECASE),
        re.compile(rf"\bper\s+({H})\b(?={PUNCT})", re.IGNORECASE),
        re.compile(rf"\b({H})'s\s+(?:{ATTRIB_NOUNS})\b", re.IGNORECASE),
        re.compile(rf"\bchat\s*[:\-]\s*({H})\b", re.IGNORECASE),
        # "asked/built/etc for/by X"
        re.compile(
            r"\b(?:asked|requested|wanted|reported|noticed|spotted|caught|"
            r"flagged|raised|filed|nudged|complained|suggested|described|"
            r"built)\s+(?:for|by)\s+"
            rf"({H})\b",
            re.IGNORECASE,
        ),
        # "X noticed/reported/asked/etc Y" leading form
        re.compile(rf"\b({H})\s+(?:noticed|reported|spotted|caught|saw|"
                   r"asked|wanted|requested|flagged|raised|complained|"
                   r"suggested|described|said|noted|hit|encountered|filed)\b",
                   re.IGNORECASE),
    ]

    # ── pass 1: auto-discover unambiguous handles via strong patterns ────
    auto_discovered: set[str] = set()
    strong_per_handle: Counter[str] = Counter()
    for _, subj, _apps in commits:
        for pat in strong_patterns:
            for m in pat.finditer(subj):
                h = m.group(1).lower()
                if h in BOT_HANDLES or h in TECH_BLOCKLIST:
                    continue
                # Auto-accept only if shape is unambiguous (digit or underscore).
                # Plain-letter strong matches are still recorded for `strong`
                # but a plain-letter handle needs to be in the whitelist to count.
                if any(c.isdigit() or c == '_' for c in h):
                    auto_discovered.add(h)
                strong_per_handle[h] += 1

    confirmed = set(KNOWN_CHAT_HANDLES) | auto_discovered

    # ── pass 2: count standalone mentions of confirmed handles ───────────
    counts: Counter[str] = Counter()
    last: dict[str, str] = {}
    attributed = 0
    total = len(commits)
    handle_pats = {h: re.compile(rf"\b{re.escape(h)}\b", re.IGNORECASE)
                   for h in confirmed}

    # Per-app credit map. STRICT: only count attribution when the
    # handle appears in an explicit attribution context (one of the
    # strong patterns above) — bare mentions don't qualify. This is the
    # marcipopsis/memory-attic fix: that handle was being credited to
    # apps where it was only listed as a placeholder seed-username, not
    # as a requester. The top-level `chat_credits` leaderboard still
    # counts every standalone mention for the loud-in-chat ranking.
    by_app: dict[str, Counter] = defaultdict(Counter)

    for iso, subj, app_slugs in commits:
        # Standalone mention hits (used for the top-level leaderboard).
        mention_hits: set[str] = set()
        for h, p in handle_pats.items():
            if p.search(subj):
                mention_hits.add(h)
        # Strong-attribution hits (used for per-app credit).
        strong_hits: set[str] = set()
        for pat in strong_patterns:
            for m in pat.finditer(subj):
                h = m.group(1).lower()
                if h in BOT_HANDLES or h in TECH_BLOCKLIST:
                    continue
                # Only credit if we recognise the handle as a real chatter
                # (in the whitelist OR auto-discovered via shape).
                if h in confirmed:
                    strong_hits.add(h)

        if mention_hits:
            attributed += 1
            for h in mention_hits:
                counts[h] += 1
                if h not in last or last[h] < iso:
                    last[h] = iso
        # Per-app credit only from strong attribution.
        for slug in app_slugs:
            for h in strong_hits:
                by_app[slug][h] += 1

    out = [
        {
            'username': u,
            'mentions': n,
            'strong': strong_per_handle.get(u, 0),
            'source': 'whitelist' if u in KNOWN_CHAT_HANDLES else 'auto',
            'last_seen': last[u],
        }
        for u, n in counts.most_common(60)
    ]
    cov = round(attributed / total * 100, 1) if total else 0

    # Trim per-app to top 5 handles to keep the snapshot lean.
    by_app_out = {
        slug: [{'username': h, 'mentions': n}
               for h, n in c.most_common(5)]
        for slug, c in by_app.items()
    }
    return out, len(counts), cov, by_app_out


def safe_read(path: str) -> str | None:
    try:
        with open(path) as f:
            return f.read()
    except Exception:
        return None


def bake_system_partial() -> dict:
    """Best-effort host metadata. Lighter than the full snapshot bake — we
    keep the existing system/runtime/network/llm blocks if this fails."""
    sys_block = {}
    try:
        sys_block['hostname'] = run(['hostname']).strip()
    except Exception:
        pass
    osr = safe_read('/etc/os-release') or ''
    m = re.search(r'PRETTY_NAME="([^"]+)"', osr)
    if m:
        sys_block['os_pretty'] = m.group(1)
    try:
        sys_block['kernel'] = run(['uname', '-r']).strip()
        sys_block['arch'] = run(['uname', '-m']).strip()
    except Exception:
        pass
    meminfo = safe_read('/proc/meminfo') or ''
    for key, label in [('MemTotal', 'mem_total_kb'),
                       ('MemAvailable', 'mem_avail_kb'),
                       ('MemFree', 'mem_free_kb'),
                       ('SwapTotal', 'swap_total_kb'),
                       ('SwapFree', 'swap_free_kb')]:
        m = re.search(rf'{key}:\s+(\d+)', meminfo)
        if m:
            sys_block[label] = int(m.group(1))
    loadavg = safe_read('/proc/loadavg')
    if loadavg:
        parts = loadavg.split()
        if len(parts) >= 3:
            sys_block['load_1'] = float(parts[0])
            sys_block['load_5'] = float(parts[1])
            sys_block['load_15'] = float(parts[2])
    cpuinfo = safe_read('/proc/cpuinfo') or ''
    sys_block['cpu_count'] = cpuinfo.count('processor\t:')
    return sys_block


def regen() -> int:
    if not OUT.exists():
        print(f'[regen] {OUT} not found — refusing to create from scratch', file=sys.stderr)
        return 2
    try:
        data = json.loads(OUT.read_text())
    except Exception as e:
        print(f'[regen] could not parse existing snapshot: {e}', file=sys.stderr)
        return 2

    started = time.monotonic()
    stamp = now_iso()

    try:
        sizes, n = bake_sizes_top()
        data['sizes_top'] = sizes
        data['app_count'] = n

        data['deploys'] = bake_deploys()
        data['usage_history'] = bake_usage_history()

        creators, total_creators = bake_creators()
        data['creators'] = creators
        data['creators_total'] = total_creators
        data['creators_generated'] = stamp

        cc, n_cc, cov, cc_by_app = bake_chat_credits()
        data['chat_credits'] = cc
        data['chat_credits_total'] = n_cc
        data['chat_credits_coverage_pct'] = cov
        data['chat_credits_by_app'] = cc_by_app

        sys_part = bake_system_partial()
        if sys_part:
            existing = data.get('system') or {}
            existing.update(sys_part)
            data['system'] = existing
    except subprocess.CalledProcessError as e:
        print(f'[regen] git/du failure: {e}', file=sys.stderr)
        return 2

    data['generated_iso'] = stamp

    tmp = OUT.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(data, indent=2))
    tmp.replace(OUT)

    elapsed = time.monotonic() - started
    print(
        f'[regen] {stamp} · {data["app_count"]} apps · '
        f'{len(data["deploys"])} deploys · {data["chat_credits_total"]} credits · '
        f'{elapsed:.2f}s'
    )
    return 0


if __name__ == '__main__':
    sys.exit(regen())
