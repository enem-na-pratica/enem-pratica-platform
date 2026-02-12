import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      complexity: ['error', 8],
      'max-depth': ['error', 3],
      'max-lines-per-function': [
        'warn',
        { max: 40, skipBlankLines: true, skipComments: true },
      ],
      'max-params': ['error', 3],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],

      'no-else-return': 'error',
      'no-magic-numbers': [
        'warn',
        { ignore: [0, 1], ignoreArrayIndexes: true },
      ],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      'react/destructuring-assignment': ['error', 'always'],
    },
  },
  prettierConfig,
]);

export default eslintConfig;
