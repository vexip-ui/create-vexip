import { parseDependencies, resolvePackage } from 'taze'

import type { PackageMeta } from 'taze'

export async function updatePackageDeps(pkg: any, root: string) {
  const packageMeta: PackageMeta = {
    name: 'test',
    version: '0.0.0',
    relative: './',
    filepath: 'package.json',
    raw: pkg,
    deps: [
      ...parseDependencies(pkg, 'dependencies', () => true),
      ...parseDependencies(pkg, 'devDependencies', () => true)
    ],
    resolved: []
  }

  await resolvePackage(packageMeta, {
    cwd: root,
    loglevel: '',
    mode: 'latest',
    write: false,
    all: true
  })

  const { resolved } = packageMeta
  const { dependencies, devDependencies } = pkg

  for (const meta of resolved) {
    const { name, targetVersion } = meta

    if (dependencies[name]) {
      dependencies[name] = targetVersion
    }

    if (devDependencies[name]) {
      devDependencies[name] = targetVersion
    }
  }
}
