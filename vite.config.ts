import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        '@lib' : resolve(__dirname, './src/lib')
    }
  },
  build: {
    outDir: 'build'
  },
  define: {
    'process.env': process.env
  }
})
