import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This allows external access
    port: process.env.PORT || 3000
  },
  preview: {
    host: '0.0.0.0', // Important for production preview
    port: process.env.PORT || 3000
  }
})