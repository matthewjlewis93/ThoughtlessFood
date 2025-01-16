import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: "https://4pm9081m.usw3.devtunnels.ms:8080/",
        changeOrigin: true
      }
    }
  }
})
