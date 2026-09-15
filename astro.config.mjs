import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

import contentEditorIntegration from "./tools/content-editor/integration";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],

    output: "static",

    build: {
      inlineStylesheets: "always",
    },

    server: {
      proxy: {
        "/api/local": {
          target: "http://localhost:5080",
          changeOrigin: true,
        },
      },
    },
  },

  site: "https://www.jiantao.dev",

  integrations: [sitemap(), react(), contentEditorIntegration()],
});