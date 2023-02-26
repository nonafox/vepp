import Util from '../utils/general.js'

let reactiveContext = null, reactiveDeps = new Set()
export function createReactiveContext(func, _this) {
    reactiveContext = () => func.call(_this)
    reactiveDeps = new Set()
    reactiveContext()
    reactiveContext = null
    return reactiveDeps
}

export function createProxy(obj, notifier, _this, key = null) {
    for (let k in obj) {
        let v = obj[k]
        if (Util.isPlainObject(v)) {
            obj[k] = createProxy(v, notifier, _this, key || k)
        }
    }
    
    const proxy = new Proxy(obj, {
        get(t, k) {
            const rk = key || k
            if (reactiveContext && typeof rk == 'string')
                reactiveDeps.add(rk)
            const raw = t[k]
            if (typeof raw == 'function')
                return (...args) => raw.call(proxy, args)
            return raw
        },
        set(t, k, v) {
            if (t[k] !== v) {
                if (Util.isPlainObject(v))
                    t[k] = createProxy(v, notifier, _this, key || k)
                else
                    t[k] = v
                notifier.call(_this, key || k)
            }
            return true
        },
        deleteProperty(t, k) {
            delete t[k]
            notifier.call(_this, key || k)
            return true
        },
        getOwnPropertyDescriptor(t, k) {
            return Object.getOwnPropertyDescriptor(t, k)
        },
        ownKeys(t) {
            return Reflect.ownKeys(t)
        },
        has(t, k) {
            return k in t
        }
    })
    return proxy
}