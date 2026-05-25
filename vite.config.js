import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set base to '/massar-app/' or '/' for custom domain / Vercel / Netlify
  base: '/massar-app/',
})
