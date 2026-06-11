import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import clerk from "@clerk/astro";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

// Load env files onto process.env so server-side code (db, api, etc.) can use them
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, env);

export default defineConfig({
  output: "static",
  site: env.PUBLIC_SITE_URL || "https://lonellssoulfood.com",
  adapter: vercel(),
  integrations: [
    clerk(),
    sitemap({
      filter: (page) => {
        const allowed = new Set(["/", "/menu/", "/contact/"]);
        return allowed.has(new URL(page).pathname);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
