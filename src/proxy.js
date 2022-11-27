import Util from './util.js'

export function createProxy(obj, notifier, _this, key = null) {
    for (let k in obj) {
        let v = obj[k]
        if (Util.isPlainObject(v)) {
            obj[k] = createProxy(v, notifier, _this, key || k)
        }
    }
    
    return new Proxy(obj, {
        get(t, k) {
            return t[k]
        },
        set(t, k, v) {
            if (typeof v == 'function')
                t[k] = (...args) => v.call(_this, ...args)
            else if (Util.isPlainObject(v))
                t[k] = createProxy(v, notifier, _this, key || k)
            else
                t[k] = v
            notifier.call(_this, key || k)
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
}