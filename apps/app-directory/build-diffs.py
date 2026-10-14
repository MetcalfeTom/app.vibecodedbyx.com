#!/usr/bin/env python3
# Bakes diffs/<slug>.json for Sloppy's Factory's crate labels (iamflax 2026-10-14: "Could you also show the code of this
# comits there to learn exactly what changed?"): for every commit on the busy board (busy.json, so run build-busy.py
# first), the changed lines of that app's files, a sample per commit, not the whole diff. Notes (.md) are left out like
# on the board, config files are listed without their lines, and any line that looks like a key or an address is
# hidden. Commits already baked are reused, so a re-bake only reads the new ones. rebake.sh runs it after build-busy.py.
import subprocess, json, re, os, datetime
ROOT = '/vibespace'
D = ROOT + '/apps/app-directory'
OUT = D + '/diffs'
PER_COMMIT, PER_FILE, WIDTH = 80, 40, 180
SECRET = re.compile(r'eyJ[A-Za-z0-9._-]{8,}|[a-z0-9-]{8,}\.supabase\.(co|in)|sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}'
                    r'|(pass(word)?|secret|api[_ -]?key|access[_ -]?token)\s*["\']?\s*[:=]', re.I)
HIDE_FILE = re.compile(r'(^|/)(\.env|.*config.*|.*secret.*|.*credential.*)$', re.I)
BINARY = re.compile(r'\.(png|jpe?g|gif|webp|avif|ico|mp3|wav|ogg|m4a|mp4|webm|woff2?|ttf|otf|zip|gz|pdf|glb|gltf|bin)$', re.I)
HUNK = re.compile(r'^@@ -\d+(?:,\d+)? \+(\d+)')


def git(*a):
    return subprocess.run(['git', '-C', ROOT] + list(a), capture_output=True, text=True, errors='replace').stdout


def counts(sha, slug):
    n = {}
    for ln in git('show', '--no-renames', '--format=', '--numstat', sha, '--', 'apps/%s/' % slug).split('\n'):
        p = ln.split('\t')
        if len(p) == 3:
            n[p[2]] = (int(p[0]) if p[0].isdigit() else -1, int(p[1]) if p[1].isdigit() else -1)
    return n


def bake(sha, slug):
    n = counts(sha, slug)
    files, cur, total = [], None, 0
    pr = subprocess.Popen(['git', '-C', ROOT, 'show', '--no-renames', '--no-color', '--format=', '-U1', sha, '--', 'apps/%s/' % slug],
                          stdout=subprocess.PIPE, text=True, errors='replace')
    try:
        for ln in pr.stdout:
            ln = ln.rstrip('\n')
            if ln.startswith('diff --git '):
                path = ln.split(' b/', 1)[-1]
                a, d = n.get(path, (0, 0))
                rel = path[len('apps/%s/' % slug):] if path.startswith('apps/%s/' % slug) else path
                cur = None
                if rel.endswith('.md'):
                    continue
                kind = 'bin' if (BINARY.search(rel) or a < 0) else 'hid' if HIDE_FILE.search(rel) else ''
                cur = {'f': rel, 'a': max(a, 0), 'd': max(d, 0), 'l': [], 'm': 0}
                if kind:
                    cur['k'] = kind
                files.append(cur)
                continue
            if cur is None or cur.get('k'):
                continue
            if ln.startswith(('+++', '---', 'index ', 'new file', 'deleted file', 'old mode', 'new mode', 'similarity', 'Binary files')):
                if ln.startswith('Binary files'):
                    cur['k'] = 'bin'
                continue
            m = HUNK.match(ln)
            if m:
                ln = '@' + m.group(1)
            elif not ln[:1] in ('+', '-', ' '):
                continue
            if len(cur['l']) >= PER_FILE or total >= PER_COMMIT:
                if ln[:1] in '+-':
                    cur['m'] = 1
                continue
            if ln[:1] != '@':
                body = ln[1:]
                if SECRET.search(body):
                    ln = ln[0] + '… (a line with a key or an address in it, hidden)'
                elif len(body) > WIDTH:
                    ln = ln[0] + body[:WIDTH].rstrip() + ' …'
            cur['l'].append(ln)
            total += 1
    finally:
        pr.stdout.close()
        pr.wait()
    for f in files:
        while f['l'] and f['l'][-1][:1] in ('@', ' '):
            f['l'].pop()
    return [[f['f'], f['a'], f['d'], f['l'], f['m'], f.get('k', '')] for f in files]


def main():
    busy = json.load(open(D + '/busy.json'))
    os.makedirs(OUT, exist_ok=True)
    keep = set()
    for app in busy.get('apps', []):
        slug = str(app.get('slug', ''))
        if not re.fullmatch(r'[a-z0-9][a-z0-9._-]*', slug):
            continue
        keep.add(slug + '.json')
        fn = '%s/%s.json' % (OUT, slug)
        try:
            old = json.load(open(fn)).get('c', {})
        except Exception:
            old = {}
        c, changed = {}, False
        for e in app.get('log', []):
            sha = str(e[4]) if isinstance(e, list) and len(e) > 4 else ''
            if not re.fullmatch(r'[0-9a-f]{6,40}', sha):
                continue
            if sha in old:
                c[sha] = old[sha]
            else:
                c[sha] = bake(sha, slug)
                changed = True
        if changed or set(c) != set(old) or not os.path.exists(fn):
            tmp = fn + '.tmp'
            json.dump({'asof': busy.get('asof', ''), 'slug': slug, 'c': c}, open(tmp, 'w'), separators=(',', ':'), ensure_ascii=False)
            os.replace(tmp, fn)
    for f in os.listdir(OUT):
        if f.endswith('.json') and f not in keep:
            os.remove(os.path.join(OUT, f))


if __name__ == '__main__':
    main()
