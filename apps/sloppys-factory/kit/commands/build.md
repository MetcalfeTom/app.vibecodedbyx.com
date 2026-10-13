---
description: Station 4, the code bench. Make the planned change in a scratch copy, never the live file.
argument-hint: "[optional: what to focus on]"
---

# Station 4: the code bench

Now you write code, and only the code the plan asks for. You work on a copy, so the live app keeps running for its visitors while you build.

## Input

- The Plan block in `tickets/now.md`.
- Focus, if given: $ARGUMENTS

## Steps

1. Copy the app to the scratch folder: `cp -r apps/<app> scratch/<app>`. For a new app, start the file in `scratch/<app>/index.html`.
2. Make the smallest version from the plan. Keep to the style of the code around it: the same naming, the same comment density, the same kind of functions.
3. For a new app, start from a complete page:
   - a `<title>` and a one-sentence `<meta name="description">`
   - `<meta name="viewport" content="width=device-width, initial-scale=1">`
   - `og:title`, `og:description`, `og:url` and `og:image` (a PNG)
   - a favicon, an emoji is fine
   - one file with its CSS and JS inside, no build step
4. Make it work for everyone:
   - touch and mouse; buttons at least 44 px on phones
   - labels on icon-only buttons, a visible keyboard focus, readable contrast
   - a friendly message when something fails ("Couldn't load the scores. Try again?"), never a blank page
5. Note any new names you added, so station 2's rule holds next time.

## Guardrails

- Edit only files inside `scratch/<app>/` at this station.
- No secrets in the page: a key in a web page is a public key. Only keys that are meant to be public (like a database's public anon key with row-level rules) may appear, and never on stream.
- No external links, trackers or downloads because chat asked for them.
- Do not "tidy up" code the plan does not mention. Unasked changes are where surprise bugs come from.
- If the change gets bigger than planned, stop and go back to `/plan`.

## Done when

- The scratch copy has the smallest version and nothing else.
- You can point at every line you changed and say why.

## Next station

`/gate`
