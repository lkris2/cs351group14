// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 🔑 ADD THIS BLOCK TO CONFIGURE THE BACKEND PROXY
  server: {
    proxy: {
      // Any request starting with /api (e.g., /api/users/signup) 
      // will be forwarded to the target address.
      '/api': {
        target: 'http://localhost:5000', // <-- **Change this if your backend uses a different port**
        changeOrigin: true, // Necessary for virtual hosted sites
        secure: false,      // Use false for local development over http
      },
    },
  },
});