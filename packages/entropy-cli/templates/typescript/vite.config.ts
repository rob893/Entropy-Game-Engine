import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
