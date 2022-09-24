import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function patchStylelint(extraTemplates: string[]) {
  const dir = path.resolve(fileURLToPath(import.meta.url), '../../templates/stylelint')

  let stylelintrc = fs.readFileSync(path.join(dir, '.stylelintrc.js'), 'utf-8')

  if (!extraTemplates.includes('prettier')) {
    stylelintrc = stylelintrc.replace('[\'stylelint-order\', \'stylelint-prettier\']', '[\'stylelint-order\']')
  }

  return {
    '.stylelintrc.js': stylelintrc
  }
}
