import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function patchCommitlint(extraTemplates: string[]) {
  const dir = path.resolve(fileURLToPath(import.meta.url), '../../templates/commitlint')
  const lintstagedrc = JSON.parse(
    fs.readFileSync(path.join(dir, '.husky', '.lintstagedrc'), 'utf-8'),
  )
  const fileTypes = Object.keys(lintstagedrc)

  if (!extraTemplates.includes('prettier')) {
    fileTypes.forEach(type => {
      lintstagedrc[type].filter((command: string) => !command.startsWith('prettier'))
    })
  }

  if (!extraTemplates.includes('eslint')) {
    fileTypes.forEach(type => {
      lintstagedrc[type].filter((command: string) => !command.startsWith('eslint'))
    })
  }

  if (!extraTemplates.includes('stylelint')) {
    fileTypes.forEach(type => {
      lintstagedrc[type].filter((command: string) => !command.startsWith('stylelint'))
    })
  }

  fileTypes.forEach(type => {
    if (!lintstagedrc[type].length) {
      delete lintstagedrc[type]
    }
  })

  return {
    '.husky/.lintstagedrc': JSON.stringify(lintstagedrc, null, 2),
  }
}
