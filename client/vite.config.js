// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     assetsInlineLimit: 0,
//   },
//   server: {
//      mimeTypes: {
//         js: 'application/javascript',
//      },
//   },
//   optimizeDeps: {
//     exclude: ['node_modules/process'],
//   },
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [react()],
});
