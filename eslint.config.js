// Anti-Gravity Supreme Architectural Fortress ESLint Configuration
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { m3TokensPlugin } from './scripts/eslint/m3-tokens-plugin.js';
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
    ...jsxA11yPlugin.flatConfigs.recommended,
    files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
    },
  },
  ...storybook.configs['flat/recommended'],
]);
