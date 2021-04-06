import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
const { resolve } = require('path')
const ts = require('rollup-plugin-typescript2')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), jsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8800
  },
  build: {
    lib: {
      entry: resolve(__dirname, './scripts/buildEntry.ts'),
      name: 'AutoComplete',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@vue/runtime-core', '@vue/reactivity'],
      plugins: [
        ts({
          check: false,
          tsconfig: 'tsconfig.json',
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              declarationMap: false
            },
            exclude: ['**/__tests__']
          }
        })
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
