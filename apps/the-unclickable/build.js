/**
 * Simple Build Script - Bundles modules into a single file
 * Works without native binaries (sandbox-friendly)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read source files
const css = readFileSync(join(__dirname, 'src/style.css'), 'utf-8')
const messages = readFileSync(join(__dirname, 'src/messages.js'), 'utf-8')
const consoleJs = readFileSync(join(__dirname, 'src/console.js'), 'utf-8')
const game = readFileSync(join(__dirname, 'src/game.js'), 'utf-8')
const html = readFileSync(join(__dirname, 'src/index.html'), 'utf-8')

// Remove import/export statements and combine
const cleanMessages = messages
  .replace(/export\s+/g, '')
  .replace(/^\/\*[\s\S]*?\*\/\n*/m, '')

const cleanConsole = consoleJs
  .replace(/export\s+/g, '')
  .replace(/^\/\*[\s\S]*?\*\/\n*/m, '')

const cleanGame = game
  .replace(/import[\s\S]*?from\s+['"][^'"]+['"]\s*/g, '')
  .replace(/export\s+/g, '')
  .replace(/^\/\*[\s\S]*?\*\/\n*/m, '')

// Combine all JS
const combinedJs = `
// Messages Module
${cleanMessages}

// Console Module
${cleanConsole}

// Game Module
${cleanGame}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initGame)
`

// Create bundled HTML
const bundledHtml = html
  .replace('</head>', `<style>\n${css}\n</style>\n</head>`)
  .replace('<script type="module" src="./main.js"></script>', `<script>\n${combinedJs}\n</script>`)

// Create dist directory
const distDir = join(__dirname, 'dist')
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

// Write bundled file
writeFileSync(join(distDir, 'index.html'), bundledHtml)

console.log('✅ Build complete! Output: dist/index.html')
