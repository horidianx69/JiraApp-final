import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,                 // Only real JS issues
      reactHooks.configs['recommended-latest'], // Rules for React hooks
      reactRefresh.configs.vite,             // Vite + React fast refresh
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // ⚠️ Only warn for unused vars instead of error
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',    // allow unused args if they start with _
        varsIgnorePattern: '^[A-Z_]' // allow constants / placeholders
      }],

      // ⚠️ Warn but don’t error if console.log is present
      'no-console': 'warn',

      // ✅ Keep important ones as errors
      'no-undef': 'error',          // using variables that don’t exist
      'react-hooks/rules-of-hooks': 'error', // must follow hooks rules
      'react-hooks/exhaustive-deps': 'warn', // missing deps in useEffect

      // 📴 Turn off rules that are mostly style-preference
      'react/prop-types': 'off',    // no need if using TypeScript or not strict
      'no-mixed-spaces-and-tabs': 'off',
    },
  },
])
