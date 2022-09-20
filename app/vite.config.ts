import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), alias()],
  resolve: {
    alias: {
      'react-happy-form': path.resolve(__dirname, '..'),
    },
  },
});
