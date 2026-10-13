---
description: Station 6, the test booth. Screenshots at phone and desktop size, zero console errors, and the feature actually tried.
argument-hint: "[app folder name]"
---

# Station 6: the test booth

"It parses" is not "it works". Here you open the app in a real browser, at phone and desktop size, try the new feature the way a player would, and look at the pictures yourself.

## Input

- The scratch copy that passed `/gate`.
- The Test line in the ticket's plan.
- The app: $ARGUMENTS (or the app on the ticket).

## Steps

1. Run the screenshot script: `node scripts/shot.mjs scratch/<app>/index.html <app>`
2. It must print `OK: no errors`. Any page error or console error is a failure: go back to `/build`.
3. **Look at both screenshots.** No errors is not enough. Check:
   - the new thing is visible and where the plan said
   - nothing overlaps, nothing is cut off on the phone, no sideways scrolling
   - text is readable against its background
4. Try the feature itself. Extend the script (or write a small one next to it) to do what the Test line says: click the button, press the keys, wait, and take one more screenshot of the result. Example lines for Playwright:

   ```js
   await page.click('#jump');            // press the new button
   await page.keyboard.press('Space');   // or a key
   await page.waitForTimeout(500);       // let the animation play
   await page.screenshot({ path: 'screenshots/after.png' });
   ```

5. Check the "don't break" list from the ticket: open the features next to your change and make sure they still work.
6. If the app saves anything (local storage, a database), test it on a fake or empty store, never on real players' data.
7. Write one line under the ticket: what you tested and what the screenshots showed.

## Guardrails

- Never ship on "should work". If you could not test something (a real phone, a real login), say so in the ticket and in chat.
- Tests never write to real databases or send real messages.
- If a fix takes more than two rounds and the app is getting worse, stop: go back to the last version that worked and plan a smaller step.

## Done when

- Zero errors at both sizes.
- You looked at the pictures, and they show the planned change.
- The "don't break" features still work.

## Next station

`/ship`
