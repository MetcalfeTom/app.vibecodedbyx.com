# deb-foundry · notes

## log
- 2026-07-11: v1 (chat ask, after a feasibility question the day before: HTML5 tool — Python script + requirements.txt in, downloadable .deb out, 100% client-side with native ar/tar/gzip). **Pure core (all hand-rolled in-page, exposed via `__foundry` for tests)**: `md5()` RFC-1321 (needed for md5sums; verified against node crypto on 9 edge sizes incl. 55/56/63/64/65), `tarEntry/tarBuild` ustar (512b headers, octal fields, space-chksum-then-write trick, dir entries type '5', 2 zero-block terminator), `arBuild` (`!<arch>\n` + 60-byte member headers + 2-byte alignment pads), `buildDeb(meta, gzipFn, log)` — gzipFn injected: browser uses native `CompressionStream('gzip')`, node tests use zlib. **Package layout**: `/usr/bin/<pkg>` sh launcher (execs venv python if present, else python3) + `/usr/lib/<pkg>/<pkg>.py` + optional requirements.txt; control.tar has control + md5sums (+ postinst/postrm 755 when requirements present). **PEP-668-proof deps**: requirements → postinst creates `/usr/lib/<pkg>/.venv` + pip installs into it on `configure`; postrm removes it on remove/purge; Depends: python3, python3-venv, python3-pip. No requirements → Depends: python3 only. **UI**: 3-step foundry (program upload/paste + demo button, requirements upload/paste, nameplate name/version/maintainer/desc), package-name slugified to Debian rules, forge log w/ per-stage lines, blob download `<pkg>_<ver>_all.deb` + copyable `sudo apt install ./…` line. Alfa Slab One + IBM Plex Mono, molten ember-on-iron. Pollinations OG (flux seed 1414). **Validated with the real toolchain in-sandbox**: `ar t` = 3 members; `dpkg-deb -I` parses control + flags postinst/postrm executable; `dpkg-deb -c` shows correct modes (755 launcher/dirs, 644 files); `dpkg-deb -R` + `md5sum -c DEBIAN/md5sums` all OK; packaged script executes. It makes REAL debs.

## issues
- CompressionStream required (Chrome 80+/FF 113+/Safari 16.4+) — friendly error otherwise.
- Multi-file projects unsupported (single script by design v1) — most-likely next ask.
- Version string is lightly sanitized, not fully policy-checked (epoch/revision edge cases).

## todos
- Multi-file support (zip upload → whole tree into /usr/lib/<pkg>).
- Optional .desktop entry + icon for GUI programs.
- xz via WASM if anyone demands smaller archives (gzip is fine for dpkg).
