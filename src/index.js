import './polyfill.js'

import { createProxy, createReactiveContext } from './proxy.js'
import { needFuckWidgets, defaultConfig } from './config.js'

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
                const needToFuck = needFuckWidgets.indexOf(tag) >= 0
                
                const defaultProps = Object.assign(
                    {}, defaultConfig[tag] || defaultConfig[null]
                )
                const widget = ctor.createWidget(
                    hmUI.widget[tag],
                    defaultProps
                )
                if (! widget)
                    break
                const eventsBuf = {}, depsBuf = new Set(),
                    xpropsBuf = needToFuck
                        ? {
                            x: defaultProps.x,
                            y: defaultProps.y,
                            w: defaultProps.w,
                            h: defaultProps.h
                        }
                        : null
                let initEvent = null
                
                for (let k in comp) {
                    let v = comp[k], cv
                    const handledFunc = typeof v == 'string'
                        ? new Function(
                            '$vepp', '$', '$widget',
                            `with($){return(${v})}`
                        )
                        : null
                    const update = typeof v == 'string'
                        ? () => {
                            return createReactiveContext(function () {
                                cv = handledFunc.call(this, this, this.data, widget)
                            }, t)
                        }
                        : null

                    if (k.startsWith('@')) {
                        let rk2 = k.substring(1),
                            rk = hmUI.event[rk2.toUpperCase()]
                        update()
                        if (rk2 == '@init') {
                            initEvent = cv
                        }
                        else {
                            if (rk in eventsBuf)
                                widget.removeEventListener(rk, eventsBuf[rk])
                            widget.addEventListener(rk, cv)
                            eventsBuf[rk] = cv
                        }
                    }
                    else if (k.startsWith('$')) {
                        let rk = k.substring(1)
                        if (rk == 'children') {
                            if (v.length && widget.createWidget) {
                                this.parse(widget, v)
                            }
                        }
                    }
                    else {
                        let rk = hmUI.prop[k.toUpperCase()],
                            rk2 = k.toLowerCase()
                        const propUpdater = () => {
                            const deps = update()
                            if (typeof rk == 'number') {
                                widget.setProperty(rk, cv)
                                if (needToFuck
                                        && (rk2 == 'x' || rk2 == 'y' || rk2 == 'w' || rk2 == 'h'))
                                    xpropsBuf[rk2] = cv
                            }
                            else if (needToFuck) {
                                xpropsBuf[rk2] = cv
                                widget.setProperty(hmUI.prop.MORE, xpropsBuf)
                                delete xpropsBuf[rk2]
                            }
                            else {
                                widget.setProperty(hmUI.prop.MORE, {
                                    [rk2]: cv
                                })
                            }
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
                
                if (typeof initEvent == 'function')
                    initEvent(widget)
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