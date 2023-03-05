import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'

let reactiveContext: Function | null = null, reactiveDeps: Set<string> = new Set()
export function createReactiveContext(func: Function, _this: any): Set<string> {
    reactiveContext = () => func.call(_this)
    reactiveDeps = new Set()
    reactiveContext()
    reactiveContext = null
    return reactiveDeps
}

export function createProxy(obj: T_JSON, notifier: Function, _this: any, key: string | null = null): any {
    for (let k in obj) {
        let v = obj[k]
        if (GUtil.isPlainObject(v)) {
            obj[k] = createProxy(v, notifier, _this, key || k)
        }
    }
    
    const proxy = new Proxy(obj, {
        get(t: T_JSON, k: string | symbol): any {
            const rk = key || k
            if (reactiveContext && typeof rk == 'string')
                reactiveDeps.add(rk)
            return t[k]
        },
        set(t: T_JSON, k: string | symbol, v: any): boolean {
            const rk = key || k
            if (t[k] !== v) {
                if (GUtil.isPlainObject(v) && typeof rk == 'string')
                    t[k] = createProxy(v, notifier, _this, rk)
                else
                    t[k] = v
                if (typeof rk == 'string')
                    notifier.call(_this, rk)
            }
            return true
        },
        deleteProperty(t: T_JSON, k: string | symbol): boolean {
            const rk = key || k
            delete t[k]
            if (typeof rk == 'string')
                notifier.call(_this, rk)
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