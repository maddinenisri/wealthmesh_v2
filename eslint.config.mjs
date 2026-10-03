import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import vue from 'eslint-plugin-vue';

const maintainability = {
  complexity: ['error', 10],
  'max-depth': ['error', 2],
  'no-nested-ternary': 'error',
  'max-lines-per-function': [
    'error',
    { max: 40, skipBlankLines: true, skipComments: true, IIFEs: true },
  ],
};
export default tseslint.config(
  { ignores: ['**/dist/**', '**/cache/**', '**/node_modules/**', '**/.runtime/**'] },
  js.configs.recommended,
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: maintainability,
  },
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      ...maintainability,
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: maintainability,
  },
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { project: './frontend/tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    rules: { ...maintainability, '@typescript-eslint/no-floating-promises': 'error' },
  },
  {
    files: ['frontend/src/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
);
