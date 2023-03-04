#!/usr/bin/env node
import path from 'path'
import program from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'
import watch from 'node-watch'

import { GeneralUtil as GUtil } from '../utils/general.js'

program.parse(process.argv)
let rpath = path.resolve('.')

console.log(chalk.bgBlue('NOTICE! If this does not work as usual, please make sure that other file watchers (like ZeppCLI) are not working!'))

let handler = (_: any = null, fname: string = '') => {
    let spath = path.relative(rpath, fname)
    if (fname && (path.extname(fname) != GUtil.ext || spath.indexOf('node_modules/') >= 0))
        return
    if (fname)
        console.log(chalk.blue(`- file changed: ${spath}`))
    let spinner = ora('compiling...').start()
    console.log()
    console.time('* time')
    try { execSync(`vepp compile`) } catch (ex) {
        console.log(chalk.red(`error when compiling! please simply run 'vepp compile' to display the errors.`))
        process.exit(1)
    }
    console.log(chalk.green(`* compiled automatically!`))
    console.timeEnd('* time')
    spinner.stop()
}
watch(rpath, { recursive: true }, handler)

handler()