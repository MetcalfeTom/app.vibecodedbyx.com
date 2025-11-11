# File Generator

## Log
- 2025-11-11: Created file generator tool
- Generates multiple text files with customizable content
- Downloads as ZIP file
- Live at https://app.vibecodedbyx.com/file-generator

## About
Web tool to generate and download multiple text files at once, packaged in a ZIP file.

## Features
- Generate 1-1000 files at once
- Customizable file prefix
- Customizable file extension
- Template system with variables:
  - `{n}` - File number
  - `{timestamp}` - Generation timestamp
  - `{random}` - Random ID
- Downloads as ZIP file using JSZip library
- Clean, simple interface

## Technical Implementation
- Uses JSZip library (3.10.1) to create ZIP files in browser
- Client-side file generation (no server needed)
- Blob download with URL.createObjectURL()

## Issues
None

## Todos
- Could add more template variables
- Could add different content per file (CSV import)
- Could add file size estimation before download
