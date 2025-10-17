import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No alias; keep it simple for Cloudflare Pages
export default defineConfig({
  plugins: [react()],
});
