import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@entropy-engine/entropy-game-engine': resolve(__dirname, '../../packages/entropy-game-engine/src')
    }
  },
  server: {
    port: 8082,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
