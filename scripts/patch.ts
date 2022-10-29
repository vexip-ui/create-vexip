// import { resolve } from 'node:path'
// import { readFileSync, writeFileSync } from 'node:fs'
// import { fileURLToPath } from 'node:url'

// const cjsBridge = `
// import __cjs_url__ from 'url';
// import __cjs_path__ from 'path';
// import __cjs_mod__ from 'module';
// const __filename = __cjs_url__.fileURLToPath(import.meta.url);
// const __dirname = __cjs_path__.dirname(__filename);
// const require = __cjs_mod__.createRequire(import.meta.url);
// `

// const indexPath = resolve(fileURLToPath(import.meta.url), '../../dist/index.mjs')

// let indexCodes = readFileSync(indexPath, 'utf-8')
// indexCodes = cjsBridge + indexCodes

// writeFileSync(indexPath, indexCodes, 'utf-8')
