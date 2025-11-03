import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react()],
  publicDir: "public",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    // Only generate sourcemaps in dev builds to help with debugging,
    //  but we not ship .map in prod
    sourcemap: mode === "development",
    assetsDir: "assets",
    // Target modern JS features supported by Electron’s Chromium (smaller, faster output)
    target: "es2022",
    // Bundle all CSS into one file (avoids multiple requests under file:// in Electron)
    cssCodeSplit: false,
    // Use esbuild for minification (fast + safe default)
    minify: "esbuild",
    // Raise chunk size warning threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Force all node_modules deps into a single vendor.js file
        // → fewer file:// requests, faster startup in Electron
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
