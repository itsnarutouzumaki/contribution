// Import Tailwind CSS plugin for Vite
import tailwindcss from "@tailwindcss/vite";
// Import Vite's configuration helper
import { defineConfig } from "vite";
// Import React plugin for Vite
import react from "@vitejs/plugin-react";

// Export Vite configuration
export default defineConfig({
  // Register plugins: React and Tailwind CSS
  plugins: [react(), tailwindcss()],
  build: {
    // Output directory for the build files
    outDir: "dist",
    // Clean the output directory before each build
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Use readable filenames for entry points (no hashes)
        entryFileNames: "assets/[name].js",
        // Use readable filenames for code-split chunks
        chunkFileNames: "assets/[name].js",
        // Use readable filenames for static assets
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // Set base path for assets (important for Netlify and similar deployments)
  base: "/",
});
