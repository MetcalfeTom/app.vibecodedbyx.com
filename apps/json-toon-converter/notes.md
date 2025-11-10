# JSON ↔ TOON Converter

## Log
- 2025-11-10: Initial creation of JSON to TOON converter app
- Implemented bidirectional conversion between JSON and TOON formats
- TOON (Token-Oriented Object Notation) is an AI-optimized data format that reduces tokens by 30-60%
- Added full UI with copy, swap, and clear functionality
- Generated OG image for social sharing
- App tested and working at https://app.vibecodedbyx.com/json-toon-converter

## Features
- JSON to TOON conversion
- TOON to JSON conversion
- Swap button to exchange content between panels
- Copy buttons for easy clipboard access
- Example data pre-loaded
- Error and success messages
- Mobile and desktop responsive design
- Information panel explaining TOON format

## TOON Format Rules Implemented
- Array of objects: `key[count]{columns}:` followed by CSV rows
- Single object: `key{columns}:` followed by single CSV row
- Simple array: `key[count]:` followed by comma-separated values
- Simple value: `key:` followed by value
- Handles quoted strings with commas or special characters
- Parses numbers, booleans, and null values

## Issues
- None currently known

## Todos
- Consider adding more complex nested object support
- Add download/upload file functionality
- Add syntax highlighting for better readability
- Add keyboard shortcuts (Ctrl+Enter to convert)
