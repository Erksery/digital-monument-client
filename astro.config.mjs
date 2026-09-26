import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [react()],

  adapter: node({
    mode: "standalone",
  }),

  output: "server",

  server: {
    port: 4321,
    host: true,
  },

  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://api:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});
