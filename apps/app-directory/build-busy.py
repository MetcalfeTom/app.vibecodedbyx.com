#!/usr/bin/env python3
# Bakes busy.json for the directory's "busiest" board (hamburglar06 2026-10-13: "a git explorer utility. We could browse
# the commits of apps, and see how many lines were changed. Projects would be sorted by recent activity"): the 60 apps
# changed most recently in the last 30 days, each with its change count, lines added/removed, a 30-day sparkline and its
# latest 20 commits with their own line counts and short hash (hamburglar06 18:15: "a small commit hash next to the line change graph"). Same filters as build-changes.py: commits that only touch notes, sweeps over
# more than 6 apps and subjects that look like secrets are left out; notes (.md) don't count as lines. Not on a cron.
import subprocess, json, re, os, datetime
ROOT = '/vibespace'
DAYS, TOP, N = 30, 60, 20
UTC = datetime.timezone.utc
now = datetime.datetime.now(UTC)
raw = subprocess.run(['git', '-C', ROOT, 'log', '--since=%d.days' % DAYS, '--no-renames', '--format=%x01%ad%x02%h%x02%s',
                      '--date=format-local:%Y-%m-%dT%H:%MZ', '--numstat', '--', 'apps/'],
                     capture_output=True, text=True, check=True, env=dict(os.environ, TZ='UTC')).stdout
apps = {d for d in os.listdir(ROOT + '/apps') if os.path.isdir(ROOT + '/apps/' + d)}
skip = re.compile(r'eyJ[A-Za-z0-9._-]{8,}|supabase\.co|password|passw|secret|api[_ -]?key|token|demo login', re.I)
out = {}
for block in raw.split('\x01')[1:]:
    head, _, files = block.partition('\n')
    date, _, rest = head.partition('\x02')
    sha, _, subj = rest.partition('\x02')
    per = {}
    for ln in files.split('\n'):
        parts = ln.split('\t')
        if len(parts) != 3:
            continue
        a, d, f = parts
        p = f.split('/')
        if len(p) > 2 and p[0] == 'apps' and p[1] in apps:
            e = per.setdefault(p[1], [0, 0, True])
            if not f.endswith('.md'):
                e[2] = False
                e[0] += int(a) if a.isdigit() else 0
                e[1] += int(d) if d.isdigit() else 0
    if not per or len(per) > 6 or skip.search(subj):
        continue
    when = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%MZ').replace(tzinfo=UTC)
    age = (now - when).days
    for slug, (a, d, md) in per.items():
        if md:
            continue
        t = re.sub(r'^' + re.escape(slug) + r'\s*[:,-]?\s*', '', subj.strip())
        if len(t) > 160:
            t = t[:157].rsplit(' ', 1)[0] + '…'
        r = out.setdefault(slug, {'last': date, 'n': 0, 'a': 0, 'd': 0, 'spark': [0] * DAYS, 'log': []})
        r['n'] += 1; r['a'] += a; r['d'] += d
        if 0 <= age < DAYS:
            r['spark'][DAYS - 1 - age] += 1
        if len(r['log']) < N:
            r['log'].append([date, t, a, d, sha[:7]])
top = sorted(out.items(), key=lambda kv: kv[1]['last'], reverse=True)[:TOP]
doc = {'asof': now.strftime('%Y-%m-%dT%H:%MZ'), 'days': DAYS, 'apps': [dict(slug=s, **r) for s, r in top]}
path = ROOT + '/apps/app-directory/busy.json'
with open(path + '.tmp', 'w') as fh:   # written aside and swapped in, so a page reading it mid-bake never gets half a file
    json.dump(doc, fh, ensure_ascii=False, separators=(',', ':'))
os.replace(path + '.tmp', path)
print(len(out), 'apps changed in', DAYS, 'days;', len(top), 'on the board;', os.path.getsize(path), 'bytes')

# busy-msgs.json: the full commit message of every commit on the board, by short hash, fetched only when someone taps an
# entry in the change log (hamburglar06 19:05: "clicking an entry in the change log focus it and show its full commit
# message"). Attribution trailers are dropped; a message that looks like it holds a secret keeps only its subject.
want = {c[4] for _, r in top for c in r['log']}
rawb = subprocess.run(['git', '-C', ROOT, 'log', '--since=%d.days' % DAYS, '--format=%x01%h%x02%B', '--', 'apps/'],
                      capture_output=True, text=True, check=True).stdout
msgs = {}
for block in rawb.split('\x01')[1:]:
    sha, _, body = block.partition('\x02')
    sha = sha.strip()[:7]
    if sha not in want or sha in msgs:
        continue
    lines = [ln.rstrip() for ln in body.strip().split('\n') if not re.match(r'\s*(Co-Authored-By|Signed-off-by):', ln, re.I)]
    full = re.sub(r'\n{3,}', '\n\n', '\n'.join(lines)).strip()
    if skip.search(full):
        full = lines[0] if lines and not skip.search(lines[0]) else ''
    if full:
        msgs[sha] = full
mpath = ROOT + '/apps/app-directory/busy-msgs.json'
with open(mpath + '.tmp', 'w') as fh:
    json.dump({'asof': doc['asof'], 'm': msgs}, fh, ensure_ascii=False, separators=(',', ':'))
os.replace(mpath + '.tmp', mpath)
print(len(msgs), 'full messages,', os.path.getsize(mpath), 'bytes')
