import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "http://ticket.dev",
    //     changeOrigin: true,
    //     secure: process.env.NODE_ENV !== "test",
    //   },
    // },
  },
});
