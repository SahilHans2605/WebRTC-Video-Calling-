import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",

    // 🔥 THIS is the real fix
    allowedHosts: [
      ".ngrok-free.dev"
    ],

    strictPort: true,

    proxy: {
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true
      }
    }
  }
});
