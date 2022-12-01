export function isPlainObject(obj) {
    return obj && (obj.constructor === Object || Array.isArray(obj))
}

const functionCtor = (function () {}).constructor
export function newFunction(...args) {
    return new functionCtor(...args)
}