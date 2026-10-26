import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier/flat'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import a11y from 'eslint-plugin-jsx-a11y'
import reactRefresh from 'eslint-plugin-react-refresh'
import security from 'eslint-plugin-security'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  security.configs.recommended,
  globalIgnores([
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    'server/dist/',
    
    'public/',
    '*.config.js',
    '.env*',
    'next-env.d.ts',
    'server/**/*.d.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-regexp': 'warn',

      ...a11y.configs.recommended.rules,
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/interactive-supports-focus': 'warn',

      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],

      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^react',
              '^@?\\w',
              '@assets/',
              '@test/',
              '@api/',
              '@store/',
              '@hooks/',
              '@interfaces/',
              '@i18n/',
              '@constants/',
              '@helpers/',
              '@linkedDataSchema/',
              '@components/',
              '@styles/',
              '^\\.',
              '^\\.\\.',
              '\\.css',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  {
    // Repo tooling: every path is derived from the repo root, there is no user input.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      // Keys come from our own JSON catalogues, never from user input.
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // File paths are built from config and constants, never from request input.
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    files: ['tests/**/*.ts', '*.config.{ts,mts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    // A named export declared inline is preferred, not mandated: where a framework resolves a
    // module by its default binding (Next route modules, next-intl's request config, config
    // files) the default is a contract and stays.
    files: ['src/**/*.{ts,tsx}', 'server/src/**/*.ts', 'tests/**/*.{ts,tsx}'],
    ignores: [
      '**/*.d.ts',
      '**/*.config.{ts,mts,mjs,js}',
      'src/app/**/{page,layout,loading,error,global-error,not-found,template,default}.{ts,tsx}',
      'src/app/**/{icon,apple-icon,opengraph-image,twitter-image,manifest,sitemap,robots}.{ts,tsx}',
      'src/i18n/request.ts',
      // Vitest resolves globalSetup by its default export.
      'tests/setup/**',
    ],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'ExportDefaultDeclaration',
          message:
            'Prefer a named export declared inline (`export const Foo = …`). Keep the default only where a framework requires it and add the path to the `ignores` list in eslint.config.mjs.',
        },
        {
          selector: 'ExportNamedDeclaration[source=null][declaration=null]',
          message:
            'Prefer declaring the export inline (`export const Foo = …`) over a trailing `export { Foo }`. Re-exporting from another module is fine.',
        },
      ],
    },
  },
  {
    files: [
      '**/app/**/page.{ts,tsx}',
      '**/app/**/layout.{ts,tsx}',
      '**/app/**/loading.{ts,tsx}',
      '**/app/**/error.{ts,tsx}',
      '**/app/**/not-found.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'metadata',
            'generateMetadata',
            'generateStaticParams',
            'viewport',
            'generateViewport',
            'dynamic',
            'revalidate',
            'dynamicParams',
          ],
        },
      ],
    },
  },
])

export default eslintConfig
