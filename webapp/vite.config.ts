import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["tipok-web-app-auto.onrender.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3333",
        changeOrigin: true
      }
    }
  },
})
