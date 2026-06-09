import { defineConfig } from 'vite';
import path from 'path';

// Builds the static GitHub Pages demo site into ./ghpages.
// Requires ./scripts/bootstrap.sh to have been run first so each
// package's dist/ output exists.
export default defineConfig({
  base: './',
  build: {
    outDir: './ghpages',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: path.resolve(__dirname, 'index.html'),
        'donation-form': path.resolve(__dirname, 'packages/donation-form/demo/index.html'),
        'donation-form-recaptcha': path.resolve(__dirname, 'packages/donation-form/demo/recaptcha.html'),
        'edit-donation': path.resolve(__dirname, 'packages/edit-donation/demo/index.html'),
        'banner-thermometer': path.resolve(__dirname, 'packages/banner-thermometer/demo/index.html'),
        'form-section': path.resolve(__dirname, 'packages/form-section/demo/index.html'),
        'currency-validator': path.resolve(__dirname, 'packages/currency-validator/demo/index.html'),
      },
    },
  },
});
