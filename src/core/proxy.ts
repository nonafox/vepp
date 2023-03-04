import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'

let reactiveContext: Function | null = null, reactiveDeps: Set<string> = new Set()
export function createReactiveContext(func: Function, _this: any): Set<string> {
    reactiveContext = () => func.call(_this)
    reactiveDeps = new Set()
    reactiveContext()
    reactiveContext = null
    return reactiveDeps
}

export function createProxy(obj: T_JSON, notifier: Function, _this: any, key?: string): any {
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
            const raw = t[k]
            if (typeof raw == 'function')
                return (...args: any[]) => raw.call(proxy, ...args)
            return raw
        },
        set(t: T_JSON, k: string | symbol, v: any): boolean {
            if (t[k] !== v) {
                if (GUtil.isPlainObject(v) && typeof k == 'string')
                    t[k] = createProxy(v, notifier, _this, key || k)
                else
                    t[k] = v
                notifier.call(_this, key || k)
            }
            return true
        },
        deleteProperty(t: T_JSON, k: string | symbol): boolean {
            delete t[k]
            notifier.call(_this, key || k)
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