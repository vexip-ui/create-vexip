import { defineConfig } from 'eslint/config'
import factory from '@vexip-ui/eslint-config'

export default defineConfig([
  {
    ignores: [
      '*.css',
      '*.pcss',
      '*.scss',
      '*.svg',
    ],
  },
  {
    extends: [factory()],
  },
  {
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
      'no-sequences': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
])
