import { defineConfig } from 'eslint/config'
import factory from '@vexip-ui/eslint-config'

export default defineConfig([
  ...factory({
    ignores: [
      '*.css',
      '*.pcss',
      '*.scss',
      '*.svg',
    ],
  }),
])
