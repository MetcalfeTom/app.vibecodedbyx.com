---
description: Station 5, the syntax gate. Check that every script parses and nothing secret slipped in.
argument-hint: "[app folder name]"
---

# Station 5: the syntax gate

One missing bracket turns a whole app into a blank page. This gate takes seconds and catches it before anyone sees it. Run it after the last edit, every time, one-line edits included.

## Input

- The scratch copy: `scratch/<app>/index.html`, for the app on the ticket or $ARGUMENTS.

## Steps

1. Run the syntax check: `node scripts/check.mjs scratch/<app>/index.html`
2. Read what it printed. It must say `OK`, with the number of scripts you expect. A failure prints the line and the problem: go back to `/build`, fix it, and run the gate again.
3. Check the HTML by eye in the parts you changed: every tag you opened is closed, and quotes match.
4. Inside an inline `<script>`, the text `</script` and `<!--` must never appear, not even in a string or a comment: the browser ends the script there. Write them split (`'<' + '/script>'`) if you need them.
5. Search the scratch copy for secrets before it can go anywhere: long random strings, `sk-`, `token`, `password`, `Bearer`, private keys. Anything that should not be public stops the line here.
6. If the app has other files you changed (a separate `.js` or `.json`), check those too: `node --check file.js`, or parse the JSON.

## Guardrails

- Never skip the gate because "it's only a tiny change". The tiny changes are the ones nobody tests.
- Read the output, not only the exit code: a script that was never checked (a wrong path, zero scripts found) also exits quietly.
- The gate checks that code parses, not that it works. That is the next station's job.

## Done when

- The check prints `OK` for every script in the file.
- No secret-looking strings in anything that will be published.

## Next station

`/test`
