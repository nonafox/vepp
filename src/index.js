import './polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { defaultConfig } from './config.js'

export default class Vepp {
    constructor(opts) {
        this.ui = opts.ui || []
        this.data = createProxy(opts.data || {}, this.update, this)
        this.deps = {}
        this.parse(this.ui)
    }
    dep(key, func) {
        if (! (key in this.deps))
            this.deps[key] = new Set()
        this.deps[key].add(func)
    }
    parse(json) {
        const t = this

        for (let n in json) {
            const comp = json[n]
            const tag = comp.$tag.toUpperCase()

            const widget = hmUI.createWidget(
                hmUI.widget[tag],
                defaultConfig[tag] || defaultConfig[null]
            )
            const eventsBuf = {}, depsBuf = new Set()
            
            for (let k in comp) {
                let v
                const handledFunc = new Function(
                    `with(this){return(${comp[k]})}`
                )
                const update = () => {
                    return createReactiveContext(function () {
                        v = handledFunc.call(this.data)
                    }, t)
                }

                if (k.startsWith('@')) {
                    let rk = hmUI.event[k.substring(1).toUpperCase()]
                    update()
                    if (rk in eventsBuf)
                        widget.removeEventListener(rk, eventsBuf[rk])
                    widget.addEventListener(rk, v)
                    eventsBuf[rk] = v
                }
                else if (k.startsWith('$')) {
                    let rk = k.substring(1)
                    if (rk != 'tag') {}
                }
                else {
                    let rk = hmUI.prop[k.toUpperCase()]
                    const propUpdater = () => {
                        const deps = update()
                        widget.setProperty(rk, v)
                        for (let depKey of deps) {
                            if (! depsBuf.has(depKey)) {
                                t.dep(depKey, propUpdater)
                                depsBuf.add(depKey)
                            }
                        }
                    }
                    propUpdater()
                }
            }
        }
    }
    update(key) {
        let v = this.deps[key]
        for (let depItem of v) {
            depItem.call(this)
        }
    }
    watch(key, callback) {
        if (! (key in this.deps))
            this.deps[key] = new Set()
        this.deps[key].add(callback)
    }
    unwatch(key, callback) {
        if (key in this.deps)
            this.deps[key].delete(callback)
    }
}