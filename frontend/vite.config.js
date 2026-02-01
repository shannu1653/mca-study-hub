import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    // 🔑 VERY IMPORTANT: force single React instance
    dedupe: ["react", "react-dom"],
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // 📄 PDF related (heavy)
          if (id.includes("pdf")) {
            return "pdf";
          }

          // 🌐 Axios & common vendors
          if (id.includes("axios")) {
            return "vendor";
          }

          // 📦 All remaining node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
