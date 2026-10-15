#!/usr/bin/env python3
# Sloppy Monitor's queue (iamflax 2026-10-15: "see your current and upcoming requests, what you will do next, with a
# filter per user"). queue.json is what the page reads; this keeps it tidy. Public-level wording only: what a viewer
# would hear on stream, never internal notes.
#   mq.py ls
#   mq.py add <who[,who2]> <app-folder> "<what>" [now|next|ask|park]
#   mq.py now|next|park|ask|mayor <id>  move an item (mayor = Flax's desk: other viewers' Heidelberg/Mannheim asks wait for Flax's yes)
#   mq.py up <id>                       first in line among its state
#   mq.py done <id> [commit]            shipped (kept 3 days on the board)
#   mq.py drop <id>                     remove it
#   mq.py edit <id> "<what>"
#   mq.py call <who|-> <app> <yes|no|flip|rule> "<the call>" "<why>" [time] [commit]   my calls: what I decided and why (iamflax
#                                       2026-10-15 "the missing puzzle part"); rule = a standing house rule, no time
#   mq.py calls                         list them;  mq.py uncall <id>   remove one
import json, os, re, sys, datetime
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'queue.json')
ST = ('now', 'next', 'ask', 'park', 'mayor', 'done')   # mayor: a Heidelberg/Mannheim request waiting for Flax's yes (2026-10-15)


def now():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')


def load():
    try:
        return json.load(open(P))
    except FileNotFoundError:
        return {'asof': now(), 'n': 0, 'items': []}


def save(q):
    cut = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=3)).strftime('%Y-%m-%dT%H:%MZ')
    q['items'] = [i for i in q['items'] if i['st'] != 'done' or i.get('d', '') >= cut]
    q['asof'] = now()
    tmp = P + '.tmp'
    json.dump(q, open(tmp, 'w'), indent=1, ensure_ascii=False)
    open(tmp, 'a').write('\n')
    os.replace(tmp, P)


def find(q, i):
    for it in q['items']:
        if it['id'] == i:
            return it
    sys.exit('no item ' + i)


def main(a):
    q = load()
    if not a or a[0] == 'ls':
        for it in q['items']:
            print('%-4s %-5s %-22s %-18s %s' % (it['id'], it['st'], ','.join(it['who']), it['app'], it['what']))
        return
    cmd = a[0]
    if cmd == 'add':
        who = [w.strip() for w in a[1].split(',') if w.strip()]
        app, what = a[2], a[3]
        st = a[4] if len(a) > 4 else 'next'
        assert st in ST and re.fullmatch(r'[a-z0-9][a-z0-9-]*', app) and os.path.isdir('/vibespace/apps/' + app), 'bad state or app'
        q['n'] = q.get('n', 0) + 1
        it = {'id': 'q%d' % q['n'], 'who': who, 'app': app, 'what': what, 'st': st, 't': now()}
        if st == 'now':
            it['s'] = now()
        if st == 'done':
            it['d'] = now()
        q['items'].append(it)
        print('added', it['id'])
    elif cmd in ('now', 'next', 'park', 'ask', 'mayor'):
        it = find(q, a[1]); it['st'] = cmd
        if cmd == 'now':
            it['s'] = now()
    elif cmd == 'done':
        it = find(q, a[1]); it['st'] = 'done'; it['d'] = now()
        if len(a) > 2 and re.fullmatch(r'[0-9a-f]{6,40}', a[2]):
            it['h'] = a[2][:7]
    elif cmd == 'up':
        it = find(q, a[1]); q['items'].remove(it); q['items'].insert(0, it)
    elif cmd == 'drop':
        q['items'] = [i for i in q['items'] if i['id'] != a[1]]
    elif cmd == 'edit':
        find(q, a[1])['what'] = a[2]
    elif cmd == 'calls':
        for c in q.get('calls', []):
            print('%-4s %-4s %-17s %-18s %s | %s' % (c['id'], c['k'], ','.join(c['who']), c['app'], c['call'], c['why']))
        return
    elif cmd == 'call':
        who = [w.strip() for w in a[1].split(',') if w.strip() and w.strip() != '-']
        app, k, call, why = a[2], a[3], a[4], a[5]
        assert k in ('yes', 'no', 'flip', 'rule') and re.fullmatch(r'[a-z0-9][a-z0-9-]*', app) and os.path.isdir('/vibespace/apps/' + app), 'bad kind or app'
        q['cn'] = q.get('cn', 0) + 1
        c = {'id': 'c%d' % q['cn'], 'who': who, 'app': app, 'k': k, 'call': call, 'why': why}
        for x in a[6:]:   # optional: when (2026-10-15T07:20Z) and the commit it led to
            if re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\dZ', x):
                c['t'] = x
            elif re.fullmatch(r'[0-9a-f]{7,40}', x):
                c['h'] = x[:7]
        if k == 'rule':
            c.pop('t', None)
        elif 't' not in c:
            c['t'] = now()
        q.setdefault('calls', []).insert(0, c)
        q['calls'] = q['calls'][:60]
        print('added', c['id'])
    elif cmd == 'uncall':
        q['calls'] = [c for c in q.get('calls', []) if c['id'] != a[1]]
    else:
        sys.exit(__doc__ if False else 'commands: ls add now next park ask up done drop edit')
    save(q)


if __name__ == '__main__':
    main(sys.argv[1:])
