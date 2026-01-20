import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Increase limit AFTER proper code splitting
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react";
          }

          // PDF related (very heavy)
          if (id.includes("pdf")) {
            return "pdf";
          }

          // Axios / fetch libs
          if (id.includes("axios")) {
            return "vendor";
          }

          // All remaining node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
