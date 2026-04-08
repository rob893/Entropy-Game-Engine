import { resolve } from 'path';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  base: '/entropy/sample-game-3/',
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
};

export default config;
