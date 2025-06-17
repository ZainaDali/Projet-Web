import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // Hook pour copier le fichier _redirects après build
  closeBundle: () => {
    const source = './public/_redirects';
    const destination = './dist/_redirects';
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log('✅ Copied _redirects to dist');
    } else {
      console.warn('⚠️ No _redirects file found in public/');
    }
  },
});
