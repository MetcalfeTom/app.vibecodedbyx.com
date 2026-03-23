# Market of Desire

Watch agents trade traits in a matching market. Supply, demand, and chemistry.

## log
- 2026-03-23: Initial build. Agent-based matching market with 5 traits (Wit, Charm, Depth, Drive, Spark). Each agent has an "offer" profile (what they bring) and "seek" profile (what they want). Compatibility = mutual match between offer/seek weighted by live market prices. Agents wander, attract toward compatible partners, pair up when mutual score exceeds selectiveness threshold. Market prices fluctuate based on supply/demand of matched traits + random chaos. Matched pairs orbit each other, some break up over time. Live price ticker with delta arrows. Match log with IDs and scores. Controls: agent count, selectiveness threshold, market chaos. 1x/2x/4x speed. Newsreader + JetBrains Mono typography, dark exchange-floor aesthetic.

## issues
- None yet

## todos
- Click agent to inspect full trait profile
- Price history sparkline charts
- Market events (trait crashes, bubbles)
- Agent personality archetypes

## notes
- No database — pure frontend
- 5 traits: Wit, Charm, Depth, Drive, Spark — all gender-neutral
- Each agent has offer[5] and seek[5] arrays (0.1-1.0)
- Compatibility: sum of (1 - |seek[i] - offer[i]|) * price[i], mutual minimum
- Prices adjust on match: demand/supply delta * 0.02, clamped 0.2-3.0
- Market chaos: random price perturbation every 10 rounds
- Matches break after ~200 ticks with 5% chance per tick
- Agent color = dominant offered trait, dashed ring = dominant sought trait
- Population maintained at slider target
- 3 match attempts per tick
