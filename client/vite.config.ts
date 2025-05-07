import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base config shared between dev and prod
const baseConfig = {
  plugins: [react(), tailwindcss()],
}

// Dev config
const devConfig = {
  ...baseConfig,
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:6969',
        changeOrigin: true
      }
    },
    allowedHosts: ['one.sce']
  }
}

// Prod config
const prodConfig = {
  ...baseConfig,
  base: '/eats',
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return command === 'serve' ? devConfig : prodConfig
})
