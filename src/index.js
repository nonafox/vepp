import './polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { defaultConfig } from './config.js'

export default class Vepp {
    constructor(opts, builtin = false) {
        if (! builtin) {
            throw new Error(`Invalid usage of Vepp.`)
        }
        this.ui = opts.ui || []
        this.data = createProxy(opts.data || {}, this.update, this)
        this.deps = {}
        this.parse(hmUI, this.ui)
    }
    dep(key, func) {
        if (! (key in this.deps))
            this.deps[key] = new Set()
        this.deps[key].add(func)
    }
    parse(ctor, json) {
        try {
            const t = this

            for (let n in json) {
                const comp = json[n]
                const tag = comp.$tag.toUpperCase()

                const widget = ctor.createWidget(
                    hmUI.widget[tag],
                    defaultConfig[tag] || defaultConfig[null]
                )
                const eventsBuf = {}, depsBuf = new Set()
                
                for (let k in comp) {
                    let v = comp[k], cv
                    const handledFunc = typeof v == 'string'
                        ? new Function(
                            `with(this){return(${v})}`
                        )
                        : null
                    const update = () => {
                        return createReactiveContext(function () {
                            cv = handledFunc.call(this.data)
                        }, t)
                    }

                    if (k.startsWith('@')) {
                        let rk = hmUI.event[k.substring(1).toUpperCase()]
                        update()
                        if (rk in eventsBuf)
                            widget.removeEventListener(rk, eventsBuf[rk])
                        widget.addEventListener(rk, cv)
                        eventsBuf[rk] = cv
                    }
                    else if (k.startsWith('$')) {
                        let rk = k.substring(1)
                        if (rk == 'children') {
                            if (widget.createWidget) {
                                this.parse(widget, v)
                            }
                        }
                    }
                    else {
                        let rk = hmUI.prop[k.toUpperCase()]
                        const propUpdater = () => {
                            const deps = update()
                            widget.setProperty(rk, cv)
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
        catch (ex) {
            throw new Error(`Error when initializing Vepp: ` + ex)
        }
    }
    update(key) {
        try {
            if (! (key in this.deps))
                this.deps[key] = new Set()
            let v = this.deps[key]
            for (let depItem of v) {
                depItem.call(this)
            }
        }
        catch (ex) {
            throw new Error(`Error when Vepp does update: ` + ex)
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