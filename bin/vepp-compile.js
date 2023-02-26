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
    console.log(chalk.red('* Error when compiling: ' + msg))
    process.exit(1)
}
let warn = (msg) => {
    console.log(chalk.yellow('* Warning when compiling: ' + msg))
}
let compileUI = (fpath, html, ui, data, pid = 'ROOT') => {
    for (let k in html) {
        let v = html[k]
        let tag = v.tag ? v.tag.replace('-', '_') : null
        if (tag == 'script') {
            err(`invalid 'script' element: ` + fpath)
            continue
        }
        else if (! tag) continue

        let id = Util.tmpPrefix + Util.randomText()
        let props = Util.deepCopy(v.attrs)
        for (let k2 in props) {
            let v2 = props[k2], ok2 = k2
            k2 = k2.replace('-', '_')
            if (k2.startsWith(':')) {
                delete props[ok2]
                k2 = k2.substring(1)
                if (k2 == ':value') {
                    if (tag == 'radio_group') {
                        let tmpid = id + '_radios'
                        if (! (tmpid in data))
                            data[tmpid] = {}
                        props.init = props.checked = `${tmpid}[${v2}]`
                        let oldcode = props['check_func']
                            ? `(${props['check_func']})(...$args)`
                            : ''
                        props['check_func'] = `(...$args)=>{if($args[2]){${v2}=Object.keys(${tmpid})[$args[1]]};${oldcode}}`
                    }
                    else if (tag == 'state_button') {
                        let tmpid = pid + '_radios'
                        if (! (tmpid in data))
                            err(`invalid ':value' property: ` + fpath)
                        if (! ('@@init' in props))
                            props['@@init'] = ''
                        props['@@init'] = `${tmpid}[${v2}]=$widget;` + props['@@init']
                    }
                    else {
                        err(`invalid ':value' property: ` + fpath)
                    }
                }
                else {
                    props[k2] = v2
                }
            }
            else if (! k2.startsWith('@')) {
                delete props[ok2]
                v2 = v2.replace('`', '\\`')
                props[k2] = `\`${v2}\``
            }
        }
        for (let k2 in props) {
            let v2 = props[k2]
            if (k2.startsWith('@')) {
                props[k2] = `($arg)=>{${v2}}`
            }
        }
        let children = []
        compileUI(fpath, v.children, children, data, id)

        let d = Object.assign(
            props,
            {
                $tag: tag,
                $children: children
            }
        )
        if ('init' in d) {
            let v2 = d.init
            delete d.init
            d.init = v2
        }
        ui.push(d)
    }
}
let compile = (fpath) => {
    let src = fs.readFileSync(fpath, 'utf-8')
    let rfname = path.basename(fpath)
    let fname = rfname.substring(0, rfname.length - path.extname(fpath).length)
    let c_my = '', c_mypre = '', c_gen = ''
    let html, ui = [], data = {
        $w: 0, $h: 0
    }
    try { html = tdom.read(src).children } catch {}
    if (! html)
        err('invalid .vepp file: ' + fpath)
    
    for (let k in html) {
        let v = html[k]
        if (v.tag == 'script' && 0 in v.children) {
            if ('pre' in v.attrs)
                c_mypre += v.children[0].text
            else
                c_my += v.children[0].text
            html.splice(k, 1)
        }
    }
    let ids = Util.scriptReg(c_my, /\$\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g)
    for (let v of ids) {
        data[v[1]] = null
    }
    compileUI(fpath, html, ui, data)
    
    c_gen += `let $pre_data = ${JSON.stringify(data)}; (function () { ${c_mypre} }).call($pre_data); `
    c_gen += `$vepp = new Vepp({ ui: ${JSON.stringify(ui)}, data: $pre_data }, true); $pre_data = null; `
    c_gen += `(function () { this.$w = $w; this.$h = $h; ${c_my}; }).call($vepp.data); `
    
    let aname = path.dirname(fpath) + '/' + fname + '.js'
    let res = `var { width: $w, height: $h } = hmSetting.getDeviceInfo(); import Vepp from 'vepp'; var $vepp; Page({ build() { ${c_gen} }, onDestroy() { $vepp = null; } });`
    fs.writeFileSync(aname, res)
}
if (fs.existsSync(rpath + 'page/'))
    walk(rpath + 'page/', compile)
if (fs.existsSync(rpath + 'watchface/'))
    walk(rpath + 'watchface/', compile)

spinner.stop()
console.log(chalk.green('* compilation complete!'))
console.timeEnd('* time')