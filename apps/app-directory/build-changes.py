#!/usr/bin/env python3
# Bakes changes.json for the app directory's change log: the latest 8 commit
# lines per app (UTC time as 2026-10-01T22:44Z, subject), newest first, from one git log walk over apps/.
# Commits that only touch an app's notes, or touch more than 6 apps at once
# (sweeps), are left out. Run it again to refresh the log; it is not on a cron.
import subprocess, json, re, os, datetime
ROOT = '/vibespace'
N = 8
raw = subprocess.run(['git', '-C', ROOT, 'log', '--format=%x01%ad%x02%s', '--date=format-local:%Y-%m-%dT%H:%MZ', '--name-only', '--', 'apps/'],
                     capture_output=True, text=True, check=True, env=dict(os.environ, TZ='UTC')).stdout
apps = {d for d in os.listdir(ROOT + '/apps') if os.path.isdir(ROOT + '/apps/' + d)}
skip = re.compile(r'eyJ[A-Za-z0-9._-]{8,}|supabase\.co|password|passw|secret|api[_ -]?key|token|demo login', re.I)
out = {}
for block in raw.split('\x01')[1:]:
    head, _, files = block.partition('\n')
    date, _, subj = head.partition('\x02')
    per = {}
    for f in files.split('\n'):
        p = f.split('/')
        if len(p) > 2 and p[0] == 'apps' and p[1] in apps:
            per.setdefault(p[1], []).append(p[-1])
    if not per or len(per) > 6 or skip.search(subj):
        continue
    for slug, names in per.items():
        if all(n.endswith('.md') for n in names):
            continue
        t = re.sub(r'^' + re.escape(slug) + r'\s*[:,-]?\s*', '', subj.strip())
        if len(t) > 220:
            t = t[:217].rsplit(' ', 1)[0] + '…'
        L = out.setdefault(slug, [])
        if len(L) < N:
            L.append([date, t])
# Credits for the creator search (Tatum 2026-10-01 23:33: "you can search by creator name, but only twitch usernames count"):
# a name counts for an app when a commit on it names them in an attribution spot: "(Tatum)", "(fannar22 23:33 ...", "per X",
# "from X's", "X's idea/request/...", "X asks/asked/...". The name must be someone who chatted on stream (Twitch or the
# website, from the stream's chat log) or look like a handle (a digit or underscore) and be credited in two commits or more.
from collections import Counter
BOTS = {'sloppy', 'sloppy_ai', 'root', 'bot', 'system', 'admin', 'github', 'noreply'}
seen_case = Counter()
try:
    with open('/home/sloppy/stream/chat.jsonl') as fh:
        for line in fh:
            try:
                u = (json.loads(line).get('user') or '').strip()
            except Exception:
                continue
            if 3 <= len(u) <= 25 and re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*', u):
                seen_case[u] += 1
except OSError:
    pass
tally = Counter(u.lower() for u in seen_case.elements())
disp = {}
for u, n in seen_case.most_common():
    disp.setdefault(u.lower(), u)
chatters = {k for k, n in tally.items() if n >= 2 and k not in BOTS}
H = r'([A-Za-z][A-Za-z0-9_]{2,24})'
CTX = [re.compile(r'\(' + H + r'\b'), re.compile(r'\bper ' + H + r'\b', re.I), re.compile(r'\bfrom ' + H + r"'s\b", re.I),
       re.compile(r'\b' + H + r"'s (?:idea|ask|request|suggestion|report|bug|wish|list|design|spec|feedback|catch|find|note|plan)", re.I),
       re.compile(r'\b' + H + r' (?:asks|asked|wants|wanted|reports|reported|noticed|suggested|suggests|spotted|says|said|found|requested)\b', re.I)]
TECH = re.compile(r'(?:r|v|es|h|x|mp|utf|sha|md|ipv|base|html|css|webgl|oauth|p|t|c|l|w|s|lv|win|gen|ch|ep|wk)\d+[a-z]?|[0-9a-f]{7,40}|user_id|max_[a-z]+', re.I)
per_app, strong = {}, Counter()
for block in raw.split('\x01')[1:]:
    head, _, files = block.partition('\n')
    subj = head.partition('\x02')[2]
    slugs = {f.split('/')[1] for f in files.split('\n') if f.startswith('apps/') and len(f.split('/')) > 2 and f.split('/')[1] in apps}
    if not slugs or len(slugs) > 6:
        continue
    names = set()
    for pat in CTX:
        for m in pat.finditer(subj):
            k = m.group(1).lower()
            if k in BOTS or TECH.fullmatch(k):
                continue
            names.add(k)
    for k in names:
        strong[k] += 1
        for sl in slugs:
            per_app.setdefault(sl, Counter())[k] += 1
STOP = {'test', 'user', 'guest', 'anon', 'chat', 'everyone', 'someone'}
SLUGBITS = {b for a in apps for b in a.lower().split('-')}
ok = lambda k: k not in STOP and (k in chatters or (re.search(r'[0-9]', k) and strong[k] >= 2 and k not in SLUGBITS))
cred = {}
for sl, c in per_app.items():
    L = [[disp.get(k, k), n] for k, n in c.most_common() if ok(k)][:6]
    if L:
        cred[sl] = L
with open(ROOT + '/apps/app-directory/credits.json', 'w') as fh:
    json.dump({'asof': datetime.date.today().isoformat(), 'apps': cred}, fh, ensure_ascii=False, separators=(',', ':'))
print(len(cred), 'apps with credits,', len({n for L in cred.values() for n, _ in L}), 'names')
doc = {'asof': datetime.date.today().isoformat(), 'apps': out}
with open(ROOT + '/apps/app-directory/changes.json', 'w') as fh:
    json.dump(doc, fh, ensure_ascii=False, separators=(',', ':'))
print(len(out), 'apps,', sum(len(v) for v in out.values()), 'lines,', os.path.getsize(ROOT + '/apps/app-directory/changes.json'), 'bytes')
