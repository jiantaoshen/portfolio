import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],

    server: {
      proxy: {
        "/api/local": {
          target: "http://localhost:5080",
          changeOrigin: true,
        },
      },
    },
  },

  site: "https://jiantao-dev.vercel.app",

  integrations: [sitemap(), react()],


});