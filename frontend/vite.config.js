import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true, // Habilita el uso de polling para entornos como Docker o WSL
    },
    host: true, // Permite acceder desde la red local
    port: 3000, // Configura el puerto del servidor
  },
})
