import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  
  return {
    plugins: [react()],
    define: {
      'process.env': env
    },
    server: {
      port: env.PORT ? parseInt(env.PORT) : 3000
    },
    preview: {
      port: env.PORT ? parseInt(env.PORT) : 3000
    }
  }
})