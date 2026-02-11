import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  assetsInclude: ['**/*.glb'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.loca.lt', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        plataforma: resolve(__dirname, 'plataforma.html'),
        integraciones: resolve(__dirname, 'integraciones.html'),
        cumplimiento: resolve(__dirname, 'cumplimiento.html'),
        empresa: resolve(__dirname, 'empresa.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        terminos: resolve(__dirname, 'legal/terminos.html'),
        privacidad: resolve(__dirname, 'legal/privacidad.html'),
        cookies: resolve(__dirname, 'legal/cookies.html'),
      },
    },
  },
})
