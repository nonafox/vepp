import './polyfills/index.js'

import { T_JSON } from '../utils/general.js'
import { createProxy, createReactiveContext } from './proxy.js'
import { needFuckWidgets, defaultConfig } from './config.js'

export type T_VeppCtorUIOption = { [_: string]: string | T_VeppCtorUIOption[] }

interface I_VeppCtorOption {
    ui: T_VeppCtorUIOption[]
    data: Map<string, any>
}

export class Vepp {
    private inited: boolean = false
    private deps: { [_: string]: Set<Function> } = {}
    private ui: T_VeppCtorUIOption[]
    public data: any

    public constructor(opts: I_VeppCtorOption, builtin: boolean = false) {
        if (! builtin) {
            throw new Error(`Invalid usage of Vepp.`)
        }
        this.ui = opts.ui || []
        this.data = createProxy(opts.data || {}, this.update, this)
    }
    private dep(key: string, func: Function): void {
        if (! (key in this.deps))
            this.deps[key] = new Set()
        this.deps[key].add(func)
    }
    public init(json: T_VeppCtorUIOption[] = this.ui, ctor: any = hmUI): void {
        try {
            const t = this

            for (let comp of json) {
                const tag = (comp.$tag as string).toUpperCase()
                const needToFuck = needFuckWidgets.indexOf(tag) >= 0
                
                const defaultProps = Object.assign(
                    {}, defaultConfig[tag] || defaultConfig['']
                )
                const widget = ctor.createWidget(
                    (hmUI.widget as T_JSON)[tag],
                    defaultProps
                )
                if (! widget)
                    break
                const eventsBuf: { [_: string]: Function } = {},
                    depsBuf = new Set(),
                    xpropsBuf: { [_: string]: any } | null = needToFuck
                        ? {
                            x: defaultProps.x,
                            y: defaultProps.y,
                            w: defaultProps.w,
                            h: defaultProps.h
                        }
                        : null
                let initEvent = null
                
                for (let k in comp) {
                    let v = comp[k], cv: any
                    const handledFunc = typeof v == 'string'
                        ? new Function(
                            '$vepp', '$widget',
                            `with(this){return(${v})}`
                        )
                        : null
                    const update = typeof v == 'string'
                        ? () => {
                            return createReactiveContext(function (this: T_JSON) {
                                cv = handledFunc!.call(this.data, this, widget)
                            }, t)
                        }
                        : null

                    if (k.startsWith('@')) {
                        let rk2 = k.substring(1),
                            rk = (hmUI.event as T_JSON)[rk2.toUpperCase()]
                        update!()
                        if (rk2 == 'vepp_init') {
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
                                this.init(v as T_VeppCtorUIOption[], widget)
                            }
                        }
                    }
                    else {
                        let rk = (hmUI.prop as T_JSON)[k.toUpperCase()]
                        const propUpdater = () => {
                            const deps = update!()
                            if (typeof rk == 'number') {
                                widget.setProperty(rk, cv)
                                if (needToFuck
                                        && (k == 'x' || k == 'y' || k == 'w' || k == 'h'))
                                    xpropsBuf![k] = cv
                            }
                            else if (needToFuck) {
                                xpropsBuf![k] = cv
                                widget.setProperty(hmUI.prop.MORE, xpropsBuf)
                                delete xpropsBuf![k]
                            }
                            else {
                                widget.setProperty(hmUI.prop.MORE, {
                                    [k]: cv
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
        
        this.inited = true
    }
    private update(key: string): void {
        if (! this.inited) return
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
    public watch(key: string, callback: Function): void {
        if (! (key in this.deps))
            this.deps[key] = new Set()
        this.deps[key].add(callback)
    }
    public unwatch(key: string, callback: Function): void {
        if (key in this.deps)
            this.deps[key].delete(callback)
    }
}