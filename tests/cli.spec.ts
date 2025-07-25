import { join } from 'node:path'

import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { execaCommandSync } from 'execa'
import { mkdirpSync, remove, writeFileSync } from 'fs-extra'

import type { ExecaSyncReturnValue, SyncOptions } from 'execa'

const CLI_PATH = join(__dirname, '..')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

const run = (args: string[], options: SyncOptions = {}): ExecaSyncReturnValue => {
  return execaCommandSync(`node ${CLI_PATH} ${args.join(' ')}`, options)
}

const createNonEmptyDir = () => {
  const pkgJson = join(genPath, 'package.json')

  mkdirpSync(genPath)
  writeFileSync(pkgJson, '{ "foo": "bar" }')
}

beforeAll(() => remove(genPath))
afterEach(() => remove(genPath))

describe('test cli', () => {
  it('prompts for the project name if none supplied', () => {
    const { stdout } = run([])
    expect(stdout).toContain('Project name:')
  })

  it('prompts for the framework if none supplied when target dir is current directory', () => {
    mkdirpSync(genPath)
    const { stdout } = run(['.'], { cwd: genPath })
    expect(stdout).toContain('Select a template:')
  })

  it('prompts for the framework if none supplied', () => {
    const { stdout } = run([projectName])
    expect(stdout).toContain('Select a template:')
  })

  it('prompts for the framework on not supplying a value for --template', () => {
    const { stdout } = run([projectName, '--template'])
    expect(stdout).toContain('Select a template:')
  })

  it('prompts for the framework on supplying an invalid template', () => {
    const { stdout } = run([projectName, '--template', 'unknown'])
    expect(stdout).toContain("'unknown' isn't a valid template. Please choose from below:")
  })

  it('asks to overwrite non-empty target directory', () => {
    createNonEmptyDir()
    const { stdout } = run([projectName], { cwd: __dirname })
    expect(stdout).toContain(`Target directory '${projectName}' is not empty.`)
  })

  it('asks to overwrite non-empty current directory', () => {
    createNonEmptyDir()
    const { stdout } = run(['.'], { cwd: genPath })
    expect(stdout).toContain('Current directory is not empty.')
  })

  it('asks to select extra templates if has specified template', () => {
    const { stdout } = run([projectName, '--template', 'vite-ts'], {
      cwd: __dirname,
    })
    expect(stdout).toContain('Select extra templates:')
  })

  it('skip prompts if specify extra templates', () => {
    const { stdout } = run([projectName, '--template', 'vite-ts', '--extra'], {
      cwd: __dirname,
    })
    expect(stdout).toContain('Use commitlint and husky?')
  })
})
