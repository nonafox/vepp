#!/usr/bin/env node
import path from 'path'
import program from 'commander'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'

import Util from '../utils/general.js'
import TDom from '../utils/tdom.js'
let tdom = new TDom()

program.parse(process.argv)
let rpath = path.resolve('.') + '/'

console.time('* time')
let spinner = ora('compiling project...').start()
console.log()

let walk = (dir, handler) => {
    let arr = fs.readdirSync(dir)
    for (let k in arr) {
        let v = arr[k]
        let cpath = dir + v
        let stat = fs.statSync(cpath)
        if (stat.isDirectory())
            walk(cpath + '/', handler)
        else if (path.extname(cpath) == Util.ext)
            handler(cpath)
    }
}
let err = (msg) => {
    console.log(chalk.red(msg))
    process.exit(1)
}
let warn = (msg) => {
    console.log(chalk.yellow(msg))
    process.exit(1)
}
let compileUI = (fpath, html, ui) => {
    for (let k in html) {
        let v = html[k]
        if (v.tag == 'script') {
            warn(`ignored invalid 'script' element: ` + fpath)
            continue
        }
        else if (! v.tag) continue

        let props = Util.deepCopy(v.attrs)
        for (let k2 in props) {
            let v2 = props[k2]
            if (k2.startsWith(':')) {
                delete props[k2]
                k2 = k2.substring(1)
                props[k2] = v2
            }
            else if (k2.startsWith('@')) {
                props[k2] = `($arg)=>{${v2}}`
            }
            else {
                v2 = v2.replace('`', '\\`')
                props[k2] = `\`${v2}\``
            }
        }

        ui.push(Object.assign(
            props,
            {
                $tag: v.tag
            }
        ))
    }
}
let compile = (fpath) => {
    let src = fs.readFileSync(fpath, 'utf-8')
    let rfname = path.basename(fpath)
    let fname = rfname.substring(0, rfname.length - path.extname(fpath).length)
    let c_my = '', c_gen = ''
    let html, ui = [], data = {}
    try { html = tdom.read(src).children } catch {}
    if (! html)
        err('invalid .vepp file: ' + fpath)
    
    for (let k in html) {
        let v = html[k]
        if (v.tag == 'script' && 0 in v.children) {
            c_my += v.children[0].text
            html.splice(k, 1)
        }
    }
    let ids = Util.scriptReg(c_my, /\b\$\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g)
    for (let i = 0; i < ids.length; i ++) {
        let v = ids[i][1]
        data[v] = null
    }
    compileUI(fpath, html, ui)
    
    c_gen += `$vepp = new Vepp({ ui: ${JSON.stringify(ui)}, data: ${JSON.stringify(data)} }, true); `
    c_gen += `void (function ($) { ${c_my} })($vepp.data); `
    
    let aname = path.dirname(fpath) + '/' + fname + '.js'
    let res = `import Vepp from 'vepp'; var $vepp; Page({ build() { ${c_gen} }, onDestroy() { $vepp = null; } });`
    fs.writeFileSync(aname, res)
}
walk(rpath + 'page/', compile)
walk(rpath + 'watchface/', compile)

spinner.stop()
console.log(chalk.green('* compile complete!'))
console.timeEnd('* time')