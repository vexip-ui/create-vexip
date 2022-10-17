import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  clean: true,
  format: 'esm',
  outExtension: () => ({ js: '.mjs' }),
  onSuccess: 'tsx ./scripts/patch.ts'
  // noExternal: ['kolorist', 'minimist', 'node-gyp', 'npm-check-updates', 'prompts']
})
