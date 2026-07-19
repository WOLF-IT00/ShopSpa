import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL;

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      ...(apiUrl
        ? {
            proxy: {
              "/api": {
                target: apiUrl,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            },
          }
        : {}),
    },
  };
});
