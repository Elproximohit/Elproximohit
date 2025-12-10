import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid TypeScript error about missing cwd property
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    root: '.', // Define la raíz del proyecto
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})