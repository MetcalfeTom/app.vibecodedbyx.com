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


def _app_from_commit(h: str, subj: str) -> str:
    """Best-effort: derive the primary app name from a commit.
    First tries the conventional `appname: …` subject prefix, then falls
    back to `git show --name-only` to find the first `apps/<name>/` path
    in the changed files."""
    m = re.match(r'^([a-z0-9][a-z0-9_-]*)\s*[:|-]', subj or '')
    if m:
        return m.group(1)
    try:
        files = run([
            'git', '-C', str(ROOT), 'show', '--name-only',
            '--pretty=format:', h,
        ]).strip().split('\n')
        for f in files:
            if f.startswith('apps/'):
                parts = f.split('/')
                if len(parts) >= 2 and parts[1]:
                    return parts[1]
    except Exception:
        pass
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


def bake_chat_credits() -> tuple[list, int, float]:
    raw = run([
        'git', '-C', str(ROOT), 'log',
        '--pretty=format:%aI\t%s', '--since=120.days.ago', '--', 'apps/',
    ]).strip().split('\n')
    counts = Counter()
    last = {}
    attributed = 0
    total = 0
    pat_per = re.compile(
        r"\bper\s+([A-Za-z][A-Za-z0-9_]{2,19})\b(?=[\s,'\";:.!?\)\]]|$)"
    )
    pat_poss = re.compile(
        r"\b([A-Za-z][A-Za-z0-9_]{2,19})'s\s+"
        r"(bug|ask|request|idea|suggestion|comment|feedback|"
        r"nudge|prompt|complaint|fix|tweak|nit|note|callout|gripe)\b",
        re.IGNORECASE,
    )
    pat_chat = re.compile(
        r"\bchat\s*[:\-]\s*([A-Za-z][A-Za-z0-9_]{2,19})\b",
        re.IGNORECASE,
    )
    for line in raw:
        if not line:
            continue
        total += 1
        parts = line.split('\t', 1)
        if len(parts) < 2:
            continue
        iso, subj = parts
        handles: set[str] = set()
        for m in pat_per.finditer(subj):
            h = m.group(1).lower()
            if h not in STOP_WORDS:
                handles.add(h)
        for m in pat_poss.finditer(subj):
            h = m.group(1).lower()
            if h not in STOP_WORDS:
                handles.add(h)
        for m in pat_chat.finditer(subj):
            h = m.group(1).lower()
            if h not in STOP_WORDS:
                handles.add(h)
        if handles:
            attributed += 1
            for h in handles:
                counts[h] += 1
                if h not in last or last[h] < iso:
                    last[h] = iso
    out = []
    for u, n in counts.most_common(60):
        out.append({'username': u, 'mentions': n, 'last_seen': last[u]})
    cov = round(attributed / total * 100, 1) if total else 0
    return out, len(counts), cov


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

        cc, n_cc, cov = bake_chat_credits()
        data['chat_credits'] = cc
        data['chat_credits_total'] = n_cc
        data['chat_credits_coverage_pct'] = cov

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
