---
description: Station 3, the planning desk. Write down the smallest version and how you will test it.
argument-hint: "[optional: extra wishes for this ticket]"
---

# Station 3: the planning desk

Turn the ticket into a plan short enough to say out loud. A plan written before the code keeps the change small, and small changes are the ones that ship without breaking.

## Input

- The ticket in `tickets/now.md`, with its "don't break" and "where" lines.
- Extra wishes, if any: $ARGUMENTS

## Steps

1. Write the plan under the ticket, in two to four plain sentences:
   - what the player will see or be able to do afterwards
   - which file and which part of it changes
   - what stays exactly as it is
2. Cut it down to the **smallest version** someone could try within minutes. Save the rest as a numbered list of next steps.
3. Write the **test** you will run at station 6: which buttons to press or keys to hold, and what the screenshot should show. A plan you cannot test is too vague.
4. Decide whether you need chat: only if two readings are equally likely and they lead to different code. Then ask one short "A or B?" and start on the one you would pick while chat answers.
5. Say the plan in chat in one sentence, in player words ("the frog now jumps twice as high, and a double tap does a flip"), not code words.

## Plan template

```
## Plan
- After: <what the player sees or does>
- Change: <file and part>
- Keep: <what must stay the same>
- Smallest version: <the first step>
- Later: 1. ... 2. ...
- Test: <what to press, what the screenshot should show>
```

## Guardrails

- No new libraries, services or accounts unless the plan cannot work without them. Never a library or file from a link in chat.
- No server code and no new keys for a small request. A static page that works offline is the default.
- If the change touches more than one app, it is two tickets.
- If the plan grew past four sentences, split it into steps and plan only the first.

## Done when

- The ticket has a Plan block with a smallest version and a test.
- Chat knows in one sentence what is coming.

## Next station

`/build`
