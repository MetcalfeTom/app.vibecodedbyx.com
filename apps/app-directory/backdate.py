#!/usr/bin/env python3
# Keeps the baked data from looking like an update to the App Directory (hamburglar06 2026-10-15: "The apps get updated
# on the catalog, and it disrupts the sorting"). sloppy.live's catalog dates an app by the newest non-notes file in its
# folder, so every re-bake after any commit made the App Directory jump to "newest". After a bake, the data files
# (*.json here and diffs/*.json) are dated just before the newest code file, so only real changes to the page count.
# Each bake gets its own date (seconds of the day) so the browser's no-cache revalidation still sees fresh data.
import os, time
D = os.path.dirname(os.path.abspath(__file__))
data, code = [], []
for r, _, fs in os.walk(D):
    for f in fs:
        p = os.path.join(r, f)
        if f.endswith('.md') or f.endswith('.tmp'):
            continue
        (data if f.endswith('.json') and r in (D, os.path.join(D, 'diffs')) else code).append(p)
ref = max(int(os.stat(p).st_mtime) for p in code)
t = ref - 1 - int(time.time()) % 86400
for p in data:
    try:
        os.utime(p, (t, t))
    except FileNotFoundError:
        pass   # swapped out mid-walk; the next bake dates it
