import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'MagiVueProvider',
      fileName: 'index'
    },
    outDir: '../../dist/magi/vue',
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue', '@aioha/aioha', '@aioha/magi'],
      output: {
        globals: {
          vue: 'vue',
          '@aioha/aioha': 'aioha',
          '@aioha/magi': 'magi'
        }
      }
    }
  }
})
