import { isPlainObject } from './util.js'

let reactiveContext = null, reactiveDeps = []
export function createReactiveContext(func, _this) {
    reactiveContext = () => func.call(_this)
    reactiveDeps = []
    reactiveContext()
    reactiveContext = null
    return reactiveDeps
}

export function createProxy(obj, notifier, _this, key = null) {
    for (let k in obj) {
        let v = obj[k]
        if (isPlainObject(v)) {
            obj[k] = createProxy(v, notifier, _this, key || k)
        }
    }
    
    const proxy = new Proxy(obj, {
        get(t, k) {
            let ck = key || k
            if (ck && reactiveContext && reactiveDeps.indexOf(ck) < 0)
                reactiveDeps.push(ck)
            if (typeof t[k] == 'function')
                return (...args) => t[k].call(proxy, ...args)
            else
                return t[k]
        },
        set(t, k, v) {
            if (t[k] !== v) {
                if (isPlainObject(v))
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
            return {
                enumerable: true,
                configurable: true
            }
        },
        ownKeys(t) {
            return Object.keys(t)
        },
        has(t, k) {
            return k in t
        }
    })
    return proxy
}