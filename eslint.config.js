// Anti-Gravity Supreme Architectural Fortress ESLint Configuration
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { createA11yConfig } from './scripts/eslint/a11y-config.js';
import css from '@eslint/css';
import { m3TokensPlugin } from './scripts/eslint/m3-tokens-plugin.js';
import { cssTokensPlugin } from './scripts/eslint/css-tokens-plugin.js';
import {
  restrictedImportsRule,
  restrictedSyntaxRules,
} from './scripts/eslint/restricted-rules.js';

export default defineConfig([
  globalIgnores([
    'dist',
    'styled-system',
    'storybook-static',
    '.agents',
    'coverage',
    '.wireit',
    'node_modules',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Complexity and Cognitive Strictness
      complexity: ['error', 8],
      'max-lines': [
        'error',
        { max: 256, skipBlankLines: true, skipComments: true },
      ],
      'max-lines-per-function': [
        'error',
        { max: 64, skipBlankLines: true, skipComments: true },
      ],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 3],

      // TypeScript Mathematical Supremacy
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-hooks/exhaustive-deps': 'error',

      // Deprecated Library & Architecture Import Enforcements
      'no-restricted-imports': restrictedImportsRule,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'm3-tokens': m3TokensPlugin,
    },
    rules: {
      'no-restricted-syntax': ['error', ...restrictedSyntaxRules],
      'm3-tokens/no-hardcoded-colors': 'error',
      'm3-tokens/enforce-motion-tokens': 'error',
      'm3-tokens/enforce-shape-tokens': 'error',
      'm3-tokens/enforce-typography-tokens': 'error',
    },
  },
  {
    files: ['src/tokens/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}'],
    rules: {
      'm3-tokens/no-hardcoded-colors': 'off',
    },
  },
  createA11yConfig(jsxA11yPlugin),
  {
    files: ['**/*.css'],
    language: 'css/css',
    ...css.configs.recommended,
    plugins: {
      ...css.configs.recommended.plugins,
      'css-tokens': cssTokensPlugin,
    },
    rules: {
      ...css.configs.recommended.rules,
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
      'css/prefer-logical-properties': 'error',
      'css/selector-complexity': [
        'error',
        { maxCompounds: 4, maxCombinators: 3 },
      ],
      'css/use-baseline': 'error',
      'css-tokens/no-unscoped-component-override': 'error',
      'css-tokens/no-scoped-important': 'error',
      'css-tokens/no-raw-colors': 'error',
      'css-tokens/no-unperformant-transitions': 'error',
      'css-tokens/no-raw-font-family': 'error',
      'css-tokens/no-tailwind-directives': 'error',
    },
  },
  {
    files: ['src/theme/**/*.css'],
    rules: {
      'css-tokens/no-raw-colors': 'off',
      'css-tokens/no-raw-font-family': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]);
