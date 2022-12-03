export function isPlainObject(obj) {
    return obj && (obj.constructor === Object || Array.isArray(obj))
}