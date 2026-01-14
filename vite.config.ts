import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": resolve(__dirname, "src/api"),
      "@features": resolve(__dirname, "src/features"),
      "@services": resolve(__dirname, "src/services"),
      "@lib": resolve(__dirname, "src/lib"),
      "@test": resolve(__dirname, "src/test"),
    },
  },
});
