import './polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { defaultConfig, DEVICE_WIDTH, DEVICE_HEIGHT } from './config.js'

export default class Vepp {
    constructor(opts) {
        this.ui = opts.ui || ''
        this.data = createProxy(opts.data || {}, this.update, this)
        this.deps = {}
        this.parse(this.ui)
    }
    parse(rcode) {
        let lines = rcode.split('\n')
        for (let line in lines) {
            let code = lines[line]
            let reg = /\s*#([A-Z_]+)\s+(.*)\s*/,
                matched = code.match(reg)
            if (! matched)
                continue
            let { 1: tag, 2: attrs } = matched, t = this
            
            let attrsParser0 = new Function(`
                with (this.data) {
                    return { ${attrs} }
                }
            `)
            let attrsParser = function () {
                let res, deps
                deps = createReactiveContext(function () {
                    res = attrsParser0.call(this)
                }, t)
                return { res: res, deps: deps }
            }
            let nattrs = {}, events = {}, deps = []
            ;({ res: nattrs, deps } = attrsParser())

            let widget = hmUI.createWidget(hmUI.widget[tag], Object.assign(defaultConfig[tag] || defaultConfig[null], nattrs))
            let attrsPusher = (arr) => {
                for (let k in arr) {
                    let v = arr[k]
                    if (k[0] == '@') {
                        let id = hmUI.event[k.substring(1).toUpperCase()]
                        if (events[id])
                            widget.removeEventListener(id, v)
                        widget.addEventListener(id, v)
                        events[id] = v
                        delete nattrs[k]
                    } else {
                        if (nattrs[k] === v)
                            continue
                        widget.setProperty(hmUI.prop[k.toUpperCase()], v)
                        nattrs[k] = v
                    }
                }
            }
            attrsPusher(nattrs)

            let updater = () => {
                let { res: nattrs, deps: ndeps } = attrsParser()
                attrsPusher(nattrs)
                for (let k in ndeps) {
                    let v = ndeps[k]
                    if (deps.indexOf(v) < 0) {
                        if (! (v in this.deps))
                            this.deps[v] = []
                        this.deps[v].push(updater)
                        deps.push(v)
                    }
                }
            }
            for (let k in deps) {
                let v = deps[k]
                if (! (v in this.deps))
                    this.deps[v] = []
                this.deps[v].push(updater)
            }
        }
    }
    update(key) {
        let v = this.deps[key]
        for (let k2 in v) {
            let v2 = v[k2]
            v2.call(this)
        }
    }
    watch(key, callback) {
        if (! (key in this.deps))
            this.deps[key] = [];
        this.deps[key].push(callback)
    }
    unwatch(key, callback) {
        if (key in this.deps) {
            let i = this.deps[key].indexOf(callback)
            if (i >= 0)
                this.deps[key].splice(i, 1)
        }
    }
}