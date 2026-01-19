# Quine Viz

## log
- 2026-01-19: Initial creation - self-displaying source code visualizer

## features
- Displays its own complete HTML source code
- Syntax highlighting for HTML/CSS/JS
- Line numbers
- Run button injects and executes the source
- Output displayed in sandboxed iframe
- Clear output button
- Stats: line count, char count, file size
- Responsive split-panel layout

## design
- Tokyo Night color scheme
- JetBrains Mono for code
- Space Grotesk for UI
- Gradient title and run button
- Dark IDE aesthetic

## how it works
- Uses document.documentElement.outerHTML to capture own source
- Simple regex-based syntax highlighting
- Creates Blob URL from source for execution
- Iframe sandbox allows scripts but isolates execution
- Recursive: running creates nested quine instances

## syntax highlighting
- Tags: red/pink
- Attributes: purple
- Strings: green
- Comments: gray italic
- Keywords: purple
- Functions: blue
- Numbers: orange
- Properties: cyan

## todos
- Add edit mode to modify source before running
- Add diff view showing changes
- Add execution counter
- Add recursion depth indicator
- Add copy source button

## issues
- None yet
