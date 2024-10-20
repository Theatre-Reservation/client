import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { VitePWA } from 'vite-plugin-pwa' // Import the PWA plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects',
          dest: ''  // This will copy the _redirects file to the root of the build output directory
        }
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the app when new content is available
      manifest: {
        name: 'Flash Tickets',
        short_name: 'App',
        description: 'A theatre reservation system.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Ensure it behaves like a native app
        start_url: '/', // Start the app from the root URL
        icons: [
          {
            src: './pwa-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // Cache for 30 days
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // Cache for 7 days
              }
            }
          }
        ]
      }
    })
  ]
})
