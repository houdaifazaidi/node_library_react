import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/books': {
        target: 'https://node-library-books.vercel.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/books/, ''),
      },
      '/api/customers': {
        target: 'https://node-library-customers.vercel.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/customers/, ''),
      },
      '/api/orders': {
        target: 'https://node-library-orders.vercel.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/orders/, ''),
      },
    },
  },
})
