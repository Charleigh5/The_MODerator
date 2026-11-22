import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Allow Vite HMR WebSocket and React Fast Refresh only during local dev serve.
// Production builds keep the strict CSP defined in index.html untouched.
function devCspPlugin() {
  return {
    name: "moderator-dev-csp",
    apply: "serve",
    transformIndexHtml(html) {
      return html
        .replace(
          "script-src 'self';",
          "script-src 'self' 'unsafe-inline';"
        )
        .replace(
          "connect-src 'self'",
          "connect-src 'self' ws://localhost:* ws://127.0.0.1:*"
        );
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), devCspPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});
