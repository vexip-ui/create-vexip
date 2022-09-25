import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import { reset, lightGreen, red, cyan, yellow } from 'kolorist'
import prompts from 'prompts'
import { patchCommitlint } from './patch-commitlint'
import { patchStylelint } from './patch-stylelint'

interface Template {
  name: string,
  display: string,
  color: (message: string | number) => string
}

interface PromptResult {
  projectName: string,
  overwrite: boolean,
  packageName: string,
  template: string,
  extraTemplates: string[],
  commitlint: boolean
}

const args = minimist<{
  t?: string,
  template?: string,
  e?: string | string[],
  extra?: string | string[]
}>(process.argv.slice(2), { string: ['_'] })

const cwd = process.cwd()

const templates: Template[] = [
  {
    name: 'vite-ts',
    display: 'Vite + TypeScript',
    color: cyan
  }
]
const templateNames = templates.map(t => t.name)

const extraTemplates: Template[] = [
  {
    name: 'eslint',
    display: 'ESlint',
    color: yellow
  },
  {
    name: 'stylelint',
    display: 'Stylelint',
    color: yellow
  },
  {
    name: 'prettier',
    display: 'Prettier',
    color: yellow
  },
  {
    name: 'router',
    display: 'Vue Router',
    color: lightGreen
  }
]
const extraTemplateNames = extraTemplates.map(t => t.name)

const defaultTargetDir = 'vexip-ui-project'

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore'
}

async function main() {
  const argTargetDir = formatTargetDir(args._[0])
  const argTemplate = args.template || args.t
  const argExtraTemplates = (args.extra || args.e ? ensureArray(args.extra || args.e) : [])
    .filter(name => name && extraTemplateNames.includes(name))

  let targetDir = argTargetDir || defaultTargetDir

  const getProjectName = () => targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result: PromptResult

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: state => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          }
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory '${targetDir}'`) +
            ` is not empty. Remove existing files and continue?`
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker'
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          type: argTemplate && templateNames.includes(argTemplate) ? null : 'select',
          name: 'template',
          message:
              typeof argTemplate === 'string' && !templateNames.includes(argTemplate)
                ? reset(
                    `'${argTemplate}' isn't a valid template. Please choose from below: `
                  )
                : reset('Select a template:'),
          initial: 0,
          choices: templates.map(t => ({
            title: t.color(t.display || t.name),
            value: t.name
          }))
        },
        {
          type: 'multiselect',
          name: 'extraTemplates',
          message: reset('Select extra teamplates:'),
          choices: extraTemplates.map(t => ({
            title: t.color(t.display || t.name),
            value: t.name,
            selected: argExtraTemplates.includes(t.name)
          }))
        },
        {
          type: extra => extra.find((t: string) => ['eslint', 'stylelint', 'prettier'].includes(t)) ? 'confirm' : null,
          name: 'commitlint',
          message: reset('Using commitlint and husky?')
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (error) {
    console.error(error)
    return
  }

  const { overwrite, packageName, template, extraTemplates: extraTemps, commitlint } = result
  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  if (commitlint) {
    extraTemps.push('commitlint')
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  // const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../templates', template)

  const write = (file: string, content?: string, dir = templateDir) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)

    if (content) {
      fs.writeFileSync(targetPath, content, 'utf-8')
    } else {
      copy(path.join(dir, file), targetPath)
    }
  }

  for (const file of fs.readdirSync(templateDir).filter((f) => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
  )

  pkg.name = packageName || getProjectName()

  extraTemps.forEach(name => {
    const dir = path.resolve(fileURLToPath(import.meta.url), '../../templates', name)

    for (const file of fs.readdirSync(dir).filter((f) => f !== 'package.json')) {
      write(file, undefined, dir)
    }

    const extraPkg = JSON.parse(
      fs.readFileSync(path.join(dir, `package.json`), 'utf-8')
    )

    const { scripts = {}, devDependencies = {}, dependencies = {}, extra } = extraPkg

    if (extra) {
      Object.keys(extraPkg.extra).forEach(extraName => {
        if (extraTemps.includes(extraName) || extraName === template) {
          Object.assign(devDependencies, extra[extraName].devDependencies ?? {})
          Object.assign(dependencies, extra[extraName].dependencies ?? {})
        }
      })
    }

    Object.assign(pkg.scripts, scripts)
    Object.assign(pkg.devDependencies, devDependencies)
    Object.assign(pkg.dependencies, dependencies)
  })

  const patchFiles: Record<string, string> = {}

  if (extraTemps.includes('stylelint')) {
    Object.assign(patchFiles, patchStylelint(extraTemps))
  }

  if (commitlint) {
    Object.assign(patchFiles, patchCommitlint(extraTemps))
  }

  Object.keys(patchFiles).forEach(name => {
    write(name, patchFiles[name])
  })

  ;[
    { key: 'dependencies', origin: pkg.dependencies },
    { key: 'devDependencies', origin: pkg.devDependencies }
  ].forEach(({ key, origin }) => {
    const map: Record<string, string> = {}
    const names = Object.keys(origin).sort((prev, next) => prev.localeCompare(next))

    names.forEach(name => {
      map[name] = origin[name]
    })

    pkg[key] = map
  })

  write('package.json', JSON.stringify(pkg, null, 2))

  console.log(`\nDone. Now run:\n`)

  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }

  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }

  console.log()
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function ensureArray<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value]
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)

  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') continue

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined

  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)

    copy(srcFile, destFile)
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)

  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

main().catch(error => {
  console.error(error)
})
