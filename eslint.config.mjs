// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/compiled/**',
      '**/templates/**',
      'commitlint.config.js',
      'eslint.config.mjs',
      '@types/**'
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.eslint.json'],
        tsconfigRootDir
      }
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/first': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [{ group: ['@/*'], message: 'Use relative paths instead of the @/ alias.' }]
        }
      ],
      'no-var': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      'no-undef': 'off'
    }
  },
  // Relaxed rules for test files
  {
    files: ['**/src/**/__tests__/**/*.{ts,tsx}', '**/src/**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/require-await': 'off'
    }
  },
  prettierConfig
);
