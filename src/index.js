import './polyfill/device-polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { newFunction } from './function.js'

export default class Vepp {
    constructor(opts) {
        this.ui = opts.html || ''
        this.data = createProxy(opts.data || {}, this.update, this)
        this.deps = {}
        this.parse(this.ui)
    }
    parse(rcode) {
        let lines = rcode.split('\n')
        for (let line in lines) {
            let code = lines[line]
            let reg = /\s*#([A-Z_]+)\s+(.*)\s*/,
                { 1: tag, 2: attrs } = code.match(reg)
            let attrsParser = function () {
                return newFunction(`
                    with (this.data) {
                        return { ${attrs} }
                    }
                `).call(this)
            }
            let nattrs
            let deps = createReactiveContext(function () {
                nattrs = attrsParser()
            }, this)

            let widget = hmUI.createWidget(hmUI.widget[tag], {})
            let attrsPusher = (arr) => {
                for (let k in arr) {
                    let v = arr[k]
                    widget.setProperty(hmUI.prop[k.toUpperCase()], v)
                }
            }
            attrsPusher(nattrs)

            let updater = () => attrsPusher(attrsParser())
            for (let k in deps) {
                if (! (k in this.deps))
                    this.deps[k] = []
                this.deps[k].push(updater)
            }
        }
    }
    update() {
        for (let k in this.deps) {
            let v = this.deps[k]
            for (let k2 in v) {
                let v2 = v[k2]
                v2()
            }
        }
    }
}