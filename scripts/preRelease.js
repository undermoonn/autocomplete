const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')
const currentVersion = require('../package.json').version
const { prompt } = require('enquirer')

const versionIncrements = ['patch', 'minor', 'major']

const inc = i => semver.inc(currentVersion, i)
const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const step = msg => console.log(chalk.cyan(msg))

async function main() {
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`)
  })

  const targetVersion = release.match(/\((.*)\)/)[1]

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) {
    return
  }

  await run(bin('jest'), ['--clearCache'])
  await run('yarn', ['test'])

  updateVersion(targetVersion)

  await run(`yarn`, ['changelog'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }
}

function updateVersion(version) {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

main()
