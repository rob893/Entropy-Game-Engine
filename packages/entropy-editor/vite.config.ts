import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

 
export default defineConfig({
  plugins: [
     
    react(),
    electron([
      {
        entry: 'src/main/core/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      },
      {
        entry: 'src/main/ipc/preload.ts',
        onstart({ reload }): void {
          reload();
        },
        vite: {
          build: {
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }

          return undefined;
        }
      }
    }
  }
});
