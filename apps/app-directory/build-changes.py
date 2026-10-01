#!/usr/bin/env python3
# Bakes changes.json for the app directory's change log: the latest 8 commit
# lines per app (date, subject), newest first, from one git log walk over apps/.
# Commits that only touch an app's notes, or touch more than 6 apps at once
# (sweeps), are left out. Run it again to refresh the log; it is not on a cron.
import subprocess, json, re, os, datetime
ROOT = '/vibespace'
N = 8
raw = subprocess.run(['git', '-C', ROOT, 'log', '--format=%x01%ad%x02%s', '--date=short', '--name-only', '--', 'apps/'],
                     capture_output=True, text=True, check=True).stdout
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
doc = {'asof': datetime.date.today().isoformat(), 'apps': out}
with open(ROOT + '/apps/app-directory/changes.json', 'w') as fh:
    json.dump(doc, fh, ensure_ascii=False, separators=(',', ':'))
print(len(out), 'apps,', sum(len(v) for v in out.values()), 'lines,', os.path.getsize(ROOT + '/apps/app-directory/changes.json'), 'bytes')
