import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'
import { Vepp } from './main.js'

class Deps {
    private deps: { [_: string]: Set<Function> } = {}

    public add(key: string, func: Function) {
        if (! (key in this.deps))
            this.deps[key] = new Set<Function>()
        this.deps[key].add(func)
    }
    public notify(key: string, _this: any): void {
        if (key in this.deps) {
            for (let v of this.deps[key])
                v.call(_this, key)
        }
    }
}

let reactiveContext: Function | null = null
export function createReactiveContext(func: (key: string | null) => void, _this: any): void {
    let handling = false
    const debts: (string | null)[] = []
    let handler = (key: string | null) => {
        if (handling) {
            debts.push(key)
            return
        }
        handling = true

        const oldContext = reactiveContext
        reactiveContext = handler
        func.call(_this, key)
        reactiveContext = oldContext

        if (debts.length > 0) {
            let buf = debts[0]
            debts.splice(0, 1)
            handler(buf)
        }
        handling = false
    }
    handler('')
}

export function createProxy(obj: T_JSON, _this: any, key: string | null = null, deps: Deps | null = null): any {
    const rdeps = deps || new Deps()

    for (let k in obj) {
        let v = obj[k]
        if (GUtil.isPlainObject(v)) {
            obj[k] = createProxy(v, _this, key || k, rdeps)
        }
    }
    
    const proxy = new Proxy<T_JSON>(obj, {
        get(t: T_JSON, k: string | symbol): any {
            const rk = key || k
            if (reactiveContext && typeof rk == 'string')
                rdeps.add(rk, reactiveContext)
            return t[k]
        },
        set(t: T_JSON, k: string | symbol, v: any): boolean {
            const rk = key || k
            if (t[k] !== v) {
                if (GUtil.isPlainObject(v) && typeof rk == 'string')
                    t[k] = createProxy(v, _this, rk, rdeps)
                else
                    t[k] = v
                if (typeof rk == 'string')
                    rdeps.notify(rk, _this)
            }
            return true
        },
        deleteProperty(t: T_JSON, k: string | symbol): boolean {
            const rk = key || k
            delete t[k]
            if (typeof rk == 'string')
                rdeps.notify(rk, _this)
            return true
        },
        getOwnPropertyDescriptor(t: T_JSON, k: string | symbol): PropertyDescriptor | undefined {
            return Object.getOwnPropertyDescriptor(t, k)
        },
        ownKeys(t: T_JSON): (string | symbol)[] {
            return Reflect.ownKeys(t)
        },
        has(t: T_JSON, k: string | symbol) {
            return k in t
        }
    })

    return proxy
}

const arrayProto = Array.prototype as any
const oldArraySplice = arrayProto.splice
arrayProto.splice = function (...args: any[]) {
    Vepp.rest()
    oldArraySplice.call(this, ...args)
    Vepp.wake()
    return this
}
arrayProto.has = arrayProto.includes
Object.defineProperty(arrayProto, 'size', {
    get() {
        return this.length
    },
    writable: false,
    enumerable: false,
    configurable: false
})
arrayProto.add = function (this: any, item: any): any {
    if (! this.includes(item))
        this.push(item)
    return this
}
arrayProto.delete = function (this: any, item: any): boolean {
    if ((item = this.indexOf(item)) >= 0)
        return ! void this.splice(item, 1)
    return false
}