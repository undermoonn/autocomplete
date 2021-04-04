const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const resolve = (...args) => path.resolve(__dirname, ...args)

// move types files
const AutoCompleteTypePath = resolve(
  '../dist/src/packages/auto-complete/index.d.ts'
)
const AutoCompleteTypeTargetPath = resolve('../dist/AutoComplete.d.ts')
const EntryScript = resolve('../dist/index.js')

fs.copyFileSync(AutoCompleteTypePath, AutoCompleteTypeTargetPath)
fs.renameSync(resolve('../dist/vue3-fancy-autocomplete.es.js'), EntryScript)

const IndexTypes = `
import AutoComplete from './AutoComplete'
export { AutoComplete }
`.trim()
fs.writeFileSync(resolve('../dist/index.d.ts'), IndexTypes, {
  encoding: 'utf-8'
})

// inject css to js
let js = fs.readFileSync(EntryScript, {
  encoding: 'utf-8'
})
js = 'import "./style.css";' + js
fs.writeFileSync(EntryScript, js, { encoding: 'utf-8' })

// clean files
fs.rmSync(resolve('../dist/favicon.ico'))
rimraf.sync(resolve('../dist/scripts'))
rimraf.sync(resolve('../dist/src'))
