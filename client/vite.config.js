import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5234",
        changeOrigin: true,
      }
    }
  }
})