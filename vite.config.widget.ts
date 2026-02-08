import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/tailored-widget.ts'),
      name: 'Tailored',
      formats: ['iife'],
      fileName: () => 'tailored.min.js',
    },
    outDir: 'dist/widget',
    emptyOutDir: true,
    copyPublicDir: false,
    minify: 'esbuild',
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
