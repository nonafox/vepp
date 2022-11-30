import './polyfill/device-polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { newFunction } from './function.js'
import { defaultConfig, DEVICE_WIDTH, DEVICE_HEIGHT } from './defaultConfig.js'

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
            
            let attrsParser0 = newFunction(`
                with (this.data) {
                    return { ${attrs} }
                }
            `)
            let attrsParser = function () {
                return attrsParser0.call(t)
            }
            let nattrs = {}
            let deps = createReactiveContext(function () {
                nattrs = attrsParser()
            }, this)

            let widget = hmUI.createWidget(hmUI.widget[tag], Object.assign(defaultConfig[tag] || {
                x: 0,
                y: 0,
                w: DEVICE_WIDTH,
                h: DEVICE_HEIGHT
            }, nattrs))
            let attrsPusher = (arr) => {
                for (let k in arr) {
                    let v = arr[k]
                    widget.setProperty(hmUI.prop[k.toUpperCase()], v)
                }
            }
            attrsPusher(nattrs)

            let updater = () => attrsPusher(attrsParser())
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
            v2()
        }
    }
}