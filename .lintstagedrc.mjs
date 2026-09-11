export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': [
    'eslint --fix --cache --cache-location node_modules/.cache/eslint/',
    'prettier --write --cache',
  ],
  '*.css': ['prettier --write --cache'],
  '*.md': ['markdownlint-cli2 --fix', 'prettier --write --cache'],
  '*.mdx': ['prettier --write --cache'],
  '*.{json,yml,yaml}': ['prettier --write --cache'],
};
