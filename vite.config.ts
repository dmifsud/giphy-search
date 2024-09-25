import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const API_URL = 'https://api.giphy.com/v1/';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string; }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    server: {
      port: Number(env.VITE_PORT),
      proxy: {
        '/gifs': {
          target: API_URL,
          changeOrigin: true,
        },
      }
    },
    plugins: [react()],
  });

}


