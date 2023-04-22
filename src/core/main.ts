import './polyfills.js'

import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'
import { createProxy, createReactiveContext } from './proxy.js'
import { needFuckWidgets, defaultConfig } from './config.js'

export type T_VeppCtorUIOption = { [_: string]: string | T_VeppCtorUIOption[] }

interface I_VeppCtorOption {
    ui: T_VeppCtorUIOption[]
    data: T_JSON
}

export class Vepp {
    private ui: T_VeppCtorUIOption[]
    public data: any
    public static restStack: number = 0
    public static util: GUtil = GUtil

    public constructor(opts: I_VeppCtorOption, builtin: boolean = false) {
        if (! builtin) {
            throw new Error(`Invalid usage of Vepp.`)
        }
        this.ui = opts.ui || []
        this.data = createProxy(opts.data || {}, this)
    }
    public init(json: T_VeppCtorUIOption[] = this.ui, ctor: any = hmUI): void {
        try {
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
                    const funcCalc = () => {
                        cv = handledFunc!.call(this.data, this, widget)
                    }

                    if (k.startsWith('@')) {
                        let rk2 = k.substring(1),
                            rk = (hmUI.event as T_JSON)[rk2.toUpperCase()]
                        funcCalc()
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
                            if (Vepp.restStack) return
                            funcCalc()
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
                        }
                        if (GUtil.noTrackProps.includes(k))
                            propUpdater()
                        else
                            createReactiveContext(propUpdater, this)
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
    public watch(dest: string | Function): any {
        let ret
        createReactiveContext(function (this: Vepp) {
            if (Vepp.restStack) return
            ret = typeof dest == 'string' ? this.data[dest] : dest.call(this.data, this)
        }, this)
        return ret
    }
    public static rest(): void {
        Vepp.restStack ++
    }
    public static wake(): void {
        Vepp.restStack --
    }
}