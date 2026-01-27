# Genealogist - DNA Heritage Archive

Visualize the genetic lineage of forked content across the Archive of Synthesis.

## log
- 2026-01-27: Initial creation
  - SVG tree visualization of manifesto lineages
  - DNA signature display (nucleotide colors, generation, marker)
  - Detail panel with full DNA breakdown
  - Pan/zoom controls for navigation
  - Search by DNA code, title, or author
  - Click node to select, highlights lineage path
  - Links to view manifesto in Sloppygram

## features
- **Manifesto Tree**: Hierarchical view of parent→child fork relationships
- **DNA Signatures**: Full genetic identifiers with colored nucleotides (A/T/C/G)
- **Detail Panel**: Shows selected node's complete DNA, author, dates, lineage
- **Pan & Zoom**: Mouse drag to pan, scroll to zoom, buttons for control
- **Search**: Filter nodes by DNA code, title, or username
- **Lineage Highlighting**: Click a node to highlight its ancestry and descendants
- **Responsive**: Mobile layout with stacked panels

## data sources
- `sloppygram_manifestos`: Core manifesto data (id, title, content, username)
- `sloppygram_manifesto_lineage`: Parent-child fork relationships

## DNA system (ported from Sloppygram)
- `generateContentDNA()`: Universal DNA for any entity type (M/D/P/X prefix)
- `generateDNASignature()`: Enhanced manifesto DNA with lineage code, generation, marker
- Nucleotide colors: A=#0f0 (green), T=#f80 (orange), C=#08f (blue), G=#f0f (magenta)

## todos
- Add cross-type view (parse [fork:CODE] tags from messages/posts)
- Add stats tab (most forked, deepest lineage, etc.)
- Persist zoom/pan state
- Touch gestures for mobile pan/zoom

## issues
- None yet
