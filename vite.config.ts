import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // ← importante! equivale a 0.0.0.0
    port: 5173, // ou a porta que quiser expor
    strictPort: true,
    allowedHosts: [
      "indicadores-frontend.mknqjp.easypanel.host",
      "indicadores.robotize.app.br",
    ],
    proxy: {
      // Requisições que começam com /api vão para o backend
      "/api": {
        target: "http://indicadores_server:3333/", // seu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // Exemplo extra: proxy para WebSocket
      "/socket": {
        target: "ws://localhost:3333",
        ws: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      "indicadores-frontend.mknqjp.easypanel.host",
      "indicadores.robotize.app.br",
    ],
  },
});
