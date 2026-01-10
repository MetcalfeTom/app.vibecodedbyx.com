import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
