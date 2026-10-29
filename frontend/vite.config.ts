import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/tasks': 'http://3.106.199.1:8080',
      '/login': 'http://3.106.199.1:8080',
      '/register': 'http://3.106.199.1:8080',
    },
  },
})