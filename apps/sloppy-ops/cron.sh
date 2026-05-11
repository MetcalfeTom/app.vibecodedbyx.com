#!/bin/bash
# sloppy-ops hourly metric refresh
# ─────────────────────────────────
# Regenerates apps/sloppy-ops/data.json from real sources (du, git log,
# /proc) and commits the change only if something material actually moved
# — diff is computed while ignoring the always-changing `generated_iso` and
# `creators_generated` timestamp lines, so an idle hour produces zero noise
# in the git history.
#
# Designed to be invoked hourly by a cron-like trigger (system cron, systemd
# timer, Claude CronCreate, or a tmux `while true; sleep 3600; ...` loop).

set -u
cd /vibespace || { echo "[cron] /vibespace missing" >&2; exit 1; }

python3 apps/sloppy-ops/regen_snapshot.py
RC=$?
if [ $RC -ne 0 ]; then
    echo "[cron] regen failed (exit $RC) — leaving data.json untouched" >&2
    exit $RC
fi

# Ignore generated_iso / creators_generated when deciding whether to commit.
# These bump every run; if nothing else moved, there's no point committing.
if git diff --quiet -I 'generated_iso\|creators_generated' apps/sloppy-ops/data.json; then
    echo "[cron] no material changes — skipping commit"
    exit 0
fi

git add apps/sloppy-ops/data.json
NOW=$(date -u +%FT%TZ)
if git commit -m "sloppy-ops: hourly metric refresh ${NOW}"; then
    git push 2>&1 || echo "[cron] push failed — commit kept locally"
fi
