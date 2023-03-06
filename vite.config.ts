import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import ReactPlugin from '@vitejs/plugin-react';
import electron from 'vite-electron-plugin';
import { loadViteEnv } from 'vite-electron-plugin/plugin';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true });

  const sourcemap = command === 'serve';

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      ReactPlugin({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin', ['@babel/plugin-proposal-decorators', { legacy: true }]],
        },
      }),
      svgr({
        exportAsDefault: true,
        svgrOptions: {
          icon: true,
        },
      }),
      electron({
        include: ['electron'],
        transformOptions: {
          sourcemap,
        },
        plugins: [
          // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
          loadViteEnv(),
        ],
      }),
      // Use Node.js API in the Renderer-process
      renderer({
        nodeIntegration: true,
      }),
    ],
    clearScreen: false,
  };
});
