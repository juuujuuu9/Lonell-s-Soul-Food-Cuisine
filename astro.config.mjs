import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import clerk from "@clerk/astro";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

// .env.local overrides .env (Vite loadEnv order). Secrets stay on process.env, not import.meta.env.
const mode = process.env.MODE ?? process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
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
