import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ensure .htaccess is copied to dist folder
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy .htaccess to dist
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
