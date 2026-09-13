/// <reference types="vitest/config" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
  import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [mdx(), react()],
  resolve: {
    alias: {
      'styled-system': path.resolve(dirname, './styled-system'),
    },
  },
  optimizeDeps: {
    include: [
      '@m3e/icons/rounded/arrow_back',
      '@m3e/icons/rounded/arrow_forward',
      '@m3e/icons/rounded/auto_stories',
      '@m3e/icons/rounded/download',
      '@m3e/icons/rounded/pause',
      '@m3e/icons/rounded/picture_as_pdf',
      '@m3e/icons/rounded/play_arrow',
      '@m3e/icons/rounded/skip_next',
      '@m3e/icons/rounded/skip_previous',
      '@m3e/icons/rounded/view_column',
      '@m3e/icons/rounded/view_day',
      '@m3e/react/button',
      '@m3e/react/card',
      '@m3e/react/chips',
      '@m3e/react/fab',
      '@m3e/react/icon',
      '@m3e/react/icon-button',
      '@m3e/react/shape',
      '@m3e/react/skeleton',
      '@m3e/react/switch',
      'maplibre-gl',
      'react-map-gl/maplibre',
    ],
  },
  server: {
    fs: {
      allow: [dirname, path.resolve(dirname, 'node_modules')],
    },
  },
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'Reapti',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        /^@m3e\//,
        /^lit/,
        /^@lit\//,
        'maplibre-gl',
        'react-map-gl',
        'react-map-gl/maplibre',
        'ogl',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/types/**',
        'src/content/**',
        'src/main.tsx',
        'src/**/types.ts',
        'src/**/*.types.ts',
      ],
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 95,
        statements: 95,
        perFile: true,
      },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'src/**/*.{test,spec}.{ts,tsx}',
            'tests/unit/**/*.{test,spec}.{ts,tsx}',
          ],
          environment: 'node',
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            disableAddonDocs: false,
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
