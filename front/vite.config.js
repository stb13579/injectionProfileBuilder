import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Important for correct asset paths
  server: {
    port: process.env.PORT || 3000
  }
})