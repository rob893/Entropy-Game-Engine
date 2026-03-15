import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      '@entropy-engine/entropy-game-engine': resolve(__dirname, '../../packages/entropy-game-engine/src')
    }
  },
  server: {
    port: 8080,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
};
