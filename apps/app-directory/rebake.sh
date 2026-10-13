#!/bin/sh
# Re-bakes the App Directory's change logs (busy.json, changes.json, credits.json) after a commit on main, so a reload
# or the change log's refresh button shows commits minutes old (hamburglar06 2026-10-13). .git/hooks/post-commit and
# post-merge start it in the background; one bake at a time, and a commit that lands mid-bake gets one more pass.
D=/vibespace/apps/app-directory
L=/vibespace/.git/app-directory-rebake
touch "$L.pending"
exec 9>"$L.lock"
flock -n 9 || exit 0
while [ -e "$L.pending" ]; do
  rm -f "$L.pending"
  sleep 3
  nice -n 10 python3 "$D/build-busy.py" >/dev/null 2>&1
  nice -n 10 python3 "$D/build-changes.py" >/dev/null 2>&1
done
