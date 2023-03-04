#!/usr/bin/env node
import path from 'path'
import download from 'download-git-repo'
import program from 'commander'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'
import { execSync } from 'child_process'
import inquirer from 'inquirer'

import { CLIUtil as CUtil } from '../utils/cli.js'

program
    .usage(`<project-name>`)
    .parse(process.argv)

let projectName = program.args[0]
if (! projectName) {
    console.log(chalk.red(`missing argument 'project-name'!`))
    process.exit(1)
}
let choose = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: 'please choose your app type:',
    choices: [
        'app', 'watchface'
    ]
}])
choose = choose.type

let rpath = path.resolve(projectName)

console.time('* time')
let spinner = ora('downloading template...').start()
console.log()
if (fs.existsSync(rpath))
    CUtil.delDir(rpath)

download('jwhgzs/vepp-template', rpath, { clone: false }, function (err: any) {
    try {
        spinner.stop()
        if (err) {
            console.log(chalk.red('* downloaded failed!'))
            process.exit(1)
        }
        const tmpSuffix = '_______tmp'
        console.log(chalk.green('* downloaded successfully!'))
        if (fs.existsSync(rpath + tmpSuffix))
            CUtil.delDir(rpath + tmpSuffix)
        fs.renameSync(rpath + '/' + choose, rpath + tmpSuffix)
        CUtil.delDir(rpath)
        fs.renameSync(rpath + tmpSuffix, rpath)
        
        spinner = ora('installing dependencies...').start()
        console.log()
        execSync(`cd ${rpath} && npm install`)
        spinner.stop()
        console.log(chalk.green('* installed successfully!'))
        console.timeEnd('* time')
    }
    catch (ex) {
        console.log(chalk.red('* initialization failed!' + ex))
    }
})