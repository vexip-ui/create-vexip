import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  // stub: true,
  rollup: {
    inlineDependencies: true,
    // cjsBridge: true,
    esbuild: {
      // minify: true,
      sourceMap: true
    }
  },
  alias: {
    // we can always use non-transpiled code since we support 14.18.0+
    prompts: 'prompts/lib/index.js'
  }
})
