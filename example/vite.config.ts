import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/geoserver': {
        target: 'http://localhost:8080', // tu backend
        changeOrigin: true,              // ajusta el Host de la petición al del target
        secure: false,                   // si el backend usa https con cert autofirmado
        // rewrite opcional: elimina el prefijo /api si el backend no lo tiene
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
