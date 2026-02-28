import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Serve static sub-pages (public/*/index.html) in dev — Vite's SPA fallback
    // would otherwise catch these routes and return the React app.
    {
      name: 'serve-static-subpages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0]
          const staticPages = {
            '/': 'public/landing/index.html',
            '/privacy': 'public/privacy/index.html',
            '/privacy/': 'public/privacy/index.html',
            '/landing': 'public/landing/index.html',
            '/landing/': 'public/landing/index.html',
          }
          if (staticPages[url]) {
            res.setHeader('Content-Type', 'text/html')
            res.end(fs.readFileSync(path.resolve(__dirname, staticPages[url])))
            return
          }
          next()
        })
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // Don't intercept navigation to root, /landing, or /privacy — separate static pages
        navigateFallbackDenylist: [/^\/$/, /^\/landing/, /^\/privacy/],
      },
      manifest: {
        name: 'Spin or Stream',
        short_name: 'Spin or Stream',
        description: 'Know exactly what to buy before you spend a dollar.',
        theme_color: '#1c1814',
        background_color: '#1c1814',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/app',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
