import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.SUPERHERO_TOKEN;

  return {
    plugins: [react()],
    server: {
      proxy: {
        // 1. Прокси к SuperheroAPI — текстовые запросы
        "/api/superhero": {
          target: "https://www.superheroapi.com",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => {
            const url = new URL(path, "http://localhost");
            const apiPath = url.searchParams.get("path") || "";
            return `/api.php/${token}${apiPath}`;
          },
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              delete proxyRes.headers["location"];
            });
          },
        },

        // 2. Прокси к superherodb для картинок
        // (картинки не идут напрямую с их сервера, потому что он банит наш IP)
        "/api/image": {
          target: "https://www.superherodb.com",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => {
            const url = new URL(path, "http://localhost");
            const imageUrl = url.searchParams.get("url") || "";
            try {
              const parsed = new URL(imageUrl);
              // Возвращаем только pathname (без хоста — он в target)
              return parsed.pathname;
            } catch {
              return "/";
            }
          },
          configure: (proxy) => {
            // Притворяемся браузером — иначе superherodb может вернуть 403
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader(
                "User-Agent",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
              );
              proxyReq.setHeader("Referer", "https://www.superherodb.com/");
            });
          },
        },
      },
    },
  };
});