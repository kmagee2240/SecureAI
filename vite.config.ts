import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/webhook": {
        target: "https://mkiki3.app.n8n.cloud",
        changeOrigin: true,
      },
    },
  },
});
