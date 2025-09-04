import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        injectOptions: {
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
              },
            },
          ],
        },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});