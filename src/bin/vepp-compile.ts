#!/usr/bin/env node
import path from 'path'
import program from 'commander'
import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'

import { T_VeppCtorUIOption } from '../core/main.js'
import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'
import { VMLParser, VMLNode, VMLNodeAttrs } from '../utils/vml.js'
import { CLIUtil as CUtil } from '../utils/cli.js'

program.parse(process.argv)
let rpath = path.resolve('.') + '/'

console.time('* time')
let spinner = ora('compiling project...').start()
console.log()

let walk = (dir: string, handler: Function) => {
    let arr = fs.readdirSync(dir)
    for (let k in arr) {
        let v = arr[k]
        let cpath = dir + v
        let stat = fs.statSync(cpath)
        if (stat.isDirectory())
            walk(cpath + '/', handler)
        else if (path.extname(cpath) == GUtil.ext)
            handler(cpath)
    }
}
let err = (msg: string) => {
    console.log(chalk.red('* Error when compiling: ' + msg))
    process.exit(1)
}
let warn = (msg: string) => {
    console.log(chalk.yellow('* Warning when compiling: ' + msg))
}
let compileUI = (fpath: string, vml: VMLNode[], dest: T_VeppCtorUIOption[], data: T_JSON, pid: string = 'ROOT') => {
    for (let k in vml) {
        let v = vml[k]
        let tag = v.tag
        if (tag == 'script')
            err(`ignored 'script' element: ` + fpath)
        else if (! tag) continue

        let id = GUtil.tmpPrefix + GUtil.randomText()
        let props: VMLNodeAttrs = GUtil.deepCopy(v.attrs) as VMLNodeAttrs
        for (let k2 in props) {
            let v2 = props[k2]
            if (! k2.startsWith(':') && ! k2.startsWith('@')) {
                delete props[k2]
                k2 = ':' + k2
                v2 = `\`${v2.replace('`', '\\`')}\``
                props[k2] = v2
            }
        }
        for (let k2 in props) {
            let v2 = props[k2]
            if (k2.startsWith(':')) {
                delete props[k2]
                k2 = k2.substring(1)
                props[k2] = v2
            }
        }
        for (let k2 in props) {
            let v2 = props[k2]
            if (! k2.startsWith('@')) {
                if (k2 == 'vepp_value') {
                    if (tag == 'radio_group' || tag == 'checkbox_group') {
                        const tmpid = id + '_options', tmpid2 = id + '_buf'
                        if ('init' in props)
                            err(`ignored 'init' property: ` + fpath)
                        data[tmpid] = {}
                        data[tmpid2] = null
                        const oldcode = props.check_func
                            ? `(${props.check_func})(...$args)`
                            : ''
                        if (tag == 'radio_group') {
                            props.init = props.checked = `${tmpid}[${v2}]`
                            props.check_func = `(...$args)=>{if($args[2])${v2}=Object.keys(${tmpid})[$args[1]];${oldcode}}`
                        }
                        else {
                            props.init = `${tmpid}[${v2}[0]]`
                            if (! ('@vepp_init' in props))
                                props['@vepp_init'] = ''
                            props['@vepp_init'] = `$vepp.watch(()=>{$vepp.constructor.util.diff(${tmpid2},${v2},v=>$widget.setProperty(hmUI.prop.CHECKED,${tmpid}[v]),v=>$widget.setProperty(hmUI.prop.UNCHECKED,${tmpid}[v]))});${props['@vepp_init']}`
                            props.check_func = `(...$args)=>{!${tmpid2}&&(${tmpid2}=new Set([${v2}[0]]));(()=>{const k=$args[2]?'add':'delete',v=Object.keys(${tmpid})[$args[1]];v&&(${tmpid2}[k](v),${v2}[k](v))})();${oldcode}}`
                        }
                    }
                    else if (tag == 'state_button') {
                        const tmpid = pid + '_options'
                        if (! (tmpid in data))
                            err(`invalid 'vepp_value' property: ` + fpath)
                        if (! ('@vepp_init' in props))
                            props['@vepp_init'] = ''
                        props['@vepp_init'] = `${tmpid}[${v2}]=$widget;${props['@vepp_init']}`
                    }
                    else if (tag == 'slide_switch') {
                        props.checked = `${v2}`
                        const oldcode = props.checked_change_func
                            ? `(${props.checked_change_func})(...$args)`
                            : ''
                        props.checked_change_func = `(...$args)=>{${v2}=$args[1];${oldcode}}`
                    }
                    else {
                        err(`invalid 'vepp_value' property: ` + fpath)
                    }
                }
            }
        }
        for (let k2 in props) {
            let v2 = props[k2]
            if (k2.startsWith('@')) {
                props[k2] = `($arg)=>{${v2}}`
            }
        }
        let children: T_VeppCtorUIOption[] = []
        compileUI(fpath, v.children, children, data, id)

        let d: VMLNodeAttrs = Object.assign(
            props,
            {
                $tag: tag,
                $children: children
            }
        )
        let buf1: VMLNodeAttrs = {}, buf2: VMLNodeAttrs = {}
        for (let k2 in d) {
            let v2 = d[k2]
            if (CUtil.priorAttrs.includes(k2))
                buf1[k2] = v2
            else
                buf2[k2] = v2
        }
        d = Object.assign(buf1, buf2)
        for (let k2 in d) {
            if (k2.endsWith('_func')) {
                let v2 = d[k2]
                delete d[k2]
                d[k2] = v2
            }
        }
        for (let k2 of CUtil.laterAttrs) {
            if (k2 in d) {
                let v2 = d[k2]
                delete d[k2]
                d[k2] = v2
            }
        }
        dest.push(d)
    }
}
let compile = (fpath: string) => {
    let src = fs.readFileSync(fpath, 'utf-8')
    let rfname = path.basename(fpath)
    let fname = rfname.substring(0, rfname.length - path.extname(fpath).length)
    let c_my = '', c_mypre = '', c_gen = ''
    let vml: VMLNode[] | undefined, tmp: VMLNode | string
    const ui: T_VeppCtorUIOption[] = [], data: T_JSON = { $w: 0, $h: 0 }
    tmp = VMLParser.read(src)
    try { vml = (tmp as VMLNode).children } catch {}
    if (! vml) {
        err(tmp + ': ' + fpath)
        return
    }
    
    let k = 0
    for (let v of vml) {
        if (v.tag == 'script' && 0 in v.children) {
            if ('pre' in v.attrs)
                c_mypre += v.children[0].text
            else
                c_my += v.children[0].text
            vml.splice(k, 1)
        }
        k ++
    }
    let ids = GUtil.scriptReg(c_my, /this\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\b/ig) as RegExpExecArray[]
    for (let v of ids) {
        data[v[1]] = null
    }
    compileUI(fpath, vml, ui, data)
    
    c_gen += `$vepp = new ${GUtil.tmpPrefix}Vepp({ ui: ${JSON.stringify(ui)}, data: {} }, true); `
    c_gen += `let $pre_data = ${JSON.stringify(data)}; for (let k in $pre_data) { $vepp.data[k] = $pre_data[k]; }; $pre_data = null; (function () { ${c_mypre} }).call($vepp.data); $vepp.init(); `
    c_gen += `(function () { this.$w = $w; this.$h = $h; ${c_my}; }).call($vepp.data); `
    
    let aname = path.dirname(fpath) + '/' + fname + '.js'
    let res = `var { width: $w, height: $h } = hmSetting.getDeviceInfo(); import { Vepp as ${GUtil.tmpPrefix}Vepp } from 'vepp/dist/core/main.js'; var $vepp; Page({ build() { ${c_gen} }, onDestroy() { $vepp = null; } });`
    fs.writeFileSync(aname, res)
}
if (fs.existsSync(rpath + 'page/'))
    walk(rpath + 'page/', compile)
if (fs.existsSync(rpath + 'watchface/'))
    walk(rpath + 'watchface/', compile)

spinner.stop()
console.log(chalk.green('* compilation complete!'))
console.timeEnd('* time')