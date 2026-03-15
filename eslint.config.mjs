import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import vitest from '@vitest/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/compiled/',
      '**/templates/',
      'commitlint.config.js',
      'eslint.config.mjs'
    ]
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-template': 'error',
      'camelcase': 'error',
      'no-debugger': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.js'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: ['packages/entropy-cli/**/*'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
);
