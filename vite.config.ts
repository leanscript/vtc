import { fileURLToPath, URL } from 'node:url'
import * as path from "path"

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'vtc',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ["vue", "pinia", "@tailwindcss", "yup", "autoprefixer", "postcss", "tailwindcss"],
      output: {
        globals: {
          vue: "Vue",
          pinia: "pinia"
        }
      }
    }
  },
})
