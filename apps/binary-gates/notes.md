# Binary Gates

## log
- 2026-04-02: Initial build. Visual 8-bit binary converter with sliding gate toggles. Decimal and text modes, hex/octal/binary representations. IBM Plex Mono + Bricolage Grotesque typography. Dark techy aesthetic with green-on-dark gate glow. CSS-only animations (cubic-bezier bounce on gate slider). Grid background pattern.

## features
- 8 interactive bit gates with sliding toggle animation
- Decimal mode: type 0-255, gates update; click gates, decimal updates
- Text mode: type any text, see full binary breakdown with colored bits, gates show last character
- Decimal, binary, hex, octal representation cards
- Bit labels (b7-b0) and power-of-2 labels on each gate
- Mobile responsive (smaller gates on narrow screens)

## issues
- Text mode only handles ASCII (charCode & 0xFF), no full Unicode support
- Gate clicks disabled in text mode (would be confusing)

## todos
- Add copy-to-clipboard on representation cards
- Add ASCII table quick-reference toggle
- Consider 16-bit or 32-bit extended mode
- Add keyboard shortcuts (arrow keys to navigate gates, space to toggle)
- Consider adding bitwise operation demos (AND, OR, XOR, NOT)
