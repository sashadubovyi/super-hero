import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.SUPERHERO_TOKEN;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/superhero": {
          target: "https://www.superheroapi.com",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => {
            const url = new URL(path, "http://localhost");
            const apiPath = url.searchParams.get("path") || "";
            // ВАЖНО: реальный путь к API — /api.php/, а не /api/
            return `/api.php/${token}${apiPath}`;
          },
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              delete proxyRes.headers["location"];
            });
          },
        },
      },
    },
  };
});