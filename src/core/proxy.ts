import { GeneralUtil as GUtil, T_JSON } from '../utils/general.js'

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
export function createReactiveContext(func: Function, _this: any): void {
    let handler = () => {
        reactiveContext = handler
        func.call(_this)
        reactiveContext = null
    }
    handler()
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
                    t[k] = createProxy(v, _this, rk)
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