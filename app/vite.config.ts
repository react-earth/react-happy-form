import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import alias from '@rollup/plugin-alias';
import resolve from 'rollup-plugin-node-resolve';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'react-happy-form': '../..',
    },
  },
  build: {
    rollupOptions: {
      plugins: [resolve()],
    },
  },
});
