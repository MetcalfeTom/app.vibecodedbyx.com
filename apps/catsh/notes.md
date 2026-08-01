# catsh

## log
- 2026-08-01 v1: chat asked for a browser terminal with simulated filesystem, command history, exit codes — then refined with "persistent ASCII cat that reacts to commands", which named the app. **Shell**: ~27 commands (ls -a/-l, cd, pwd, cat, tree, mkdir, touch, rm -r, mv, cp, echo, head/tail -n, wc -l, grep -i, history -c, clear, true/false, which, env, date, whoami, hostname, uname -a, fortune, cowsay, sl, pet). Real semantics: **pipes** (stdin threading through cat|grep|wc), **redirection** > >>, **operators** ; && || with short-circuit on exit codes, **$? / $HOME / $USER / $PWD expansion at EXECUTION time** (tokenizer keeps words raw + single-quote literal flag; expansion per pipeline segment — the parse-time version failed `false; echo $?`, caught by test), exit codes 0/1/2/127 with the prompt showing ✗N powerlevel-style. **VFS**: JSON tree in localStorage (persists!), ~ expansion, .. normalization, seeded /etc/motd, /home/guest files, /bin auto-mirrors the command registry (ls /bin lists every command; which resolves there). **History**: ↑↓ with draft preservation, persisted 200 entries, Ctrl+C/Ctrl+L. **Tab completion**: first token → commands, else path completion with longest-common-prefix + candidate listing. **The cat**: perched top-right in the window (Tokyo-Night amber on glass), 8 states with frames — purrs on `cat`, hisses at nonzero exits ("*hiss* exit 1"), goes ⊙.⊙ hunting on grep, O_O on rm, plays for sl/cowsay, o_O "never heard of it" on 127, blinks idle, sleeps after 25s. `pet cat` counts total pets persistently. Fira Code, macOS traffic lights. 13+25 checks green across two suites (exec-time $?, 127 error printing, quoting semantics, redirect-target expansion, full VFS/pipeline/completion regression).

## issues
- Bug fixed pre-ship: $? expanded at tokenize time → `false; echo $?` printed the PREVIOUS code; now expansion is per-segment at exec. Also 127 broke out of the loop before printing its error.
- No globbing, no directories in cp, no env var assignment — say so honestly if asked; add if chat wants.
- rm on / is refused ("the cat lives here").

## todos
- `nano`/`edit` mini editor overlay if chat asks for file editing beyond echo >.
- More cat moods (grumpy after 3 errors in a row).
- `theme` command (catppuccin/gruvbox palettes).
