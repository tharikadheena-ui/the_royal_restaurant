import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function cBackendBridge() {
  return {
    name: 'c-backend-bridge',
    configureServer(server) {
      server.middlewares.use('/api/seat', (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const groupSize = url.searchParams.get('group_size') || '2';
        const custId = url.searchParams.get('cust_id') || '101';
        const occupied = url.searchParams.get('occupied') || '';

        const exePath = path.resolve(__dirname, '../restaurant_system.exe');
        execFile(exePath, ['--seat', groupSize, custId, occupied], (error, stdout) => {
          res.setHeader('Content-Type', 'application/json');
          if (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ status: 'error', message: error.message }));
            return;
          }
          res.end(stdout.trim());
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cBackendBridge(),
  ],
})
