import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
      },
    },
  },
  plugins: [
    // Serve static files from public/ before Vite's SPA fallback/transform intercepts them
    {
      name: 'serve-public-static',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0];
          if (url && url !== '/' && url !== '/index.html') {
            const publicPath = path.resolve(__dirname, 'public', url.slice(1));
            const exists = fs.existsSync(publicPath);
            const isFile = exists && fs.statSync(publicPath).isFile();
            const ext = path.extname(publicPath).toLowerCase();
            if (isFile && (ext === '.html' || ext === '.js')) {
              const mimeMap: Record<string, string> = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
              };
              res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
              fs.createReadStream(publicPath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
