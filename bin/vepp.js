#!/usr/bin/env node
import program from 'commander'
import path from 'path'
import url from 'url'
import fs from 'fs'

globalThis.__dirname = path.dirname(url.fileURLToPath(import.meta.url))
let packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
)

program
    .version(packageJson.version)
    .command('init', 'initialize a Vepp project.')
    .command('compile', 'compile the current Vepp project.')
    .command('auto', 'enable automatically compiling on current Vepp project.')
    .parse(process.argv)