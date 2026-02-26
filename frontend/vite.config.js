import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // Don't intercept navigation to /landing — it's a separate static page
        navigateFallbackDenylist: [/^\/landing/],
      },
      manifest: {
        name: 'Spin or Stream',
        short_name: 'Spin or Stream',
        description: 'Know exactly what to buy before you spend a dollar.',
        theme_color: '#1c1814',
        background_color: '#1c1814',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
