# which 15-letter words could a team actually build along an edge? (Tatum: aim for particularly buildable ones)
from collections import Counter
W = set(open('words.txt').read().split()); AI = set(open('ai.txt').read().split())
BAG = dict(a=9,b=2,c=2,d=4,e=12,f=2,g=3,h=2,i=9,j=1,k=1,l=4,m=2,n=6,o=8,p=2,q=1,r=6,s=4,t=6,u=4,v=2,w=2,x=1,y=2,z=1)
SEGS = [(1, 7), (8, 14)]
def best(w, V):
    # per segment: fewest edge plays to lay its letters, as stretches that are words (laid along the edge in one move)
    # or single letters hooked from inside; runs next to each other merge, so chosen stretches keep a gap
    tot = []
    for a, b in SEGS:
        n = b - a
        # dp over positions: f[i] = list of (moves, covered) options; we want for each "leave" count the fewest moves
        INF = 99
        # cost to cover all but up to `leave` cells: brute force over subsets of stretches is small (6 cells)
        st = [(i, j) for i in range(a, b) for j in range(i + 2, b + 1) if w[i:j] in V]
        opts = {}
        def go(k, used, moves, cov):
            key = cov
            if opts.get(key, INF) > moves: opts[key] = moves
            for (i, j) in st:
                if i < k: continue
                # keep a gap to the previous stretch so runs don't merge
                go(j + 1, used + [(i, j)], moves + 1, cov + (j - i))
        go(a, [], 0, 0)
        tot.append(opts)
    return tot
rows = []
for w in (x for x in W if len(x) == 15):
    c = Counter(w)
    if any(c[l] > BAG.get(l, 0) for l in c): continue
    A, B = best(w, AI)
    # cells not laid as stretches are hooks (one letter per Two move) or left for you (at most 4 besides the golds)
    bestc = None
    for ca, ma in A.items():
        for cb, mb in B.items():
            left = 12 - ca - cb
            hooks = max(0, left - 4)
            cost = ma + mb + hooks
            if bestc is None or cost < bestc[0]: bestc = (cost, ma + mb, hooks, left - hooks)
    rare = sum(1 / BAG[l] for l in w)
    rows.append((bestc[0], round(rare, 2), w, bestc))
rows.sort()
print(len(rows), 'possible with the bag (no blanks)')
from collections import Counter as C2
print('by cost:', sorted(C2(r[0] for r in rows).items())[:10])
for r in rows[:30]: print(r)
open('t15.txt', 'w').write('\n'.join(r[2] for r in rows if r[0] <= 5))
print('kept', sum(1 for r in rows if r[0] <= 5))
