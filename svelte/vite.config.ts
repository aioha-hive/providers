import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'AiohaSvelteProvider',
      formats: ['es'],
      fileName: (format) => `index.${format}.js`
    },
    outDir: '../dist/svelte',
    emptyOutDir: true,
    rollupOptions: {
      external: ['svelte', '@aioha/aioha'],
      output: {
        globals: {
          svelte: 'svelte',
          '@aioha/aioha': 'aioha'
        }
      }
    }
  }
})
