export function createProxy(obj, notifier, _this) {
    return new Proxy(obj, {
        get(t, k) {
            return t[k]
        },
        set(t, k, v) {
            if (typeof v == 'function')
                t[k] = (...args) => v.call(_this, ...args)
            else
                t[k] = v
            notifier.call(_this)
            return true
        },
        deleteProperty(t, k) {
            delete t[k]
            notifier.call(_this)
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