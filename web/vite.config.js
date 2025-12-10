import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { histroyApiFallback: true }
  // base: "/",  // IMPORTANT: reset this
});
