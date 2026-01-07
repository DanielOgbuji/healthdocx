import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router', 'react-redux', '@reduxjs/toolkit'],
          ui: ['@chakra-ui/react', '@chakra-ui/hooks', '@emotion/react', 'motion', 'react-icons'],
          dnd: ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', 'react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend'],
        },
      },
    },
  },
})
