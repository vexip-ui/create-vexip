import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import minimist from 'minimist'
import { logger, release, run } from '@vexip-ui/scripts'

const args = minimist<{
  d?: boolean,
  dry?: boolean,
  p: string,
  preid?: string
}>(process.argv.slice(2))

const isDryRun = args.dry || args.d

const rootDir = resolve(fileURLToPath(import.meta.url), '../..')

release({
  pkgDir: rootDir,
  isDryRun,
  preId: args.preid,
  publish: true,
  runTest: () => run('pnpm', ['test']),
  runBuild: () => run('pnpm', ['build']),
  runChangelog: () => run('pnpm', ['changelog']),
}).catch(error => {
  logger.error(error)
  process.exit(1)
})
