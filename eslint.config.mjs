// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-electron/**',
      '**/coverage/**',
      '**/compiled/**',
      '**/templates/**',
      'commitlint.config.js',
      'eslint.config.mjs',
      '**/postcss.config.mjs',
      '**/.heroui-docs/**',
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
    files: ['**/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic
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
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        },
        {
          selector: 'class',
          format: ['PascalCase']
        },
        {
          selector: 'enum',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['PascalCase']
        },
        {
          selector: ['method', 'function'],
          format: ['camelCase']
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase']
        }
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              'public-static-field',
              'protected-static-field',
              'private-static-field',
              '#private-static-field',

              'public-instance-field',
              'protected-instance-field',
              'private-instance-field',
              '#private-instance-field',

              'constructor',

              ['public-get', 'public-set'],
              ['protected-get', 'protected-set'],
              ['private-get', 'private-set'],

              'public-static-method',
              'public-instance-method',

              'protected-static-method',
              'protected-instance-method',

              'private-static-method',
              'private-instance-method',
              '#private-static-method',
              '#private-instance-method'
            ]
          }
        }
      ],
      '@stylistic/lines-between-class-members': ['error', 'always'],
      'no-undef': 'off'
    }
  },
  // React rules — scoped to editor package only
  {
    files: ['packages/entropy-editor/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: reactPlugin,
      // @ts-expect-error -- react-hooks flat config types are incompatible with defineConfig's Plugin type
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended?.rules,
      ...reactHooksPlugin.configs.recommended?.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  // Allow PascalCase function names in React components (TSX files)
  {
    files: ['**/src/**/*.tsx'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        },
        {
          selector: 'class',
          format: ['PascalCase']
        },
        {
          selector: 'enum',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['PascalCase']
        },
        {
          selector: ['method'],
          format: ['camelCase']
        },
        {
          selector: ['function'],
          format: ['camelCase', 'PascalCase']
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase']
        }
      ]
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
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@stylistic/lines-between-class-members': 'off'
    }
  },
  prettierConfig
);
