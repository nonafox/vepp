const functionCtor = (function () {}).constructor

export function newFunction(...args) {
    return new functionCtor(...args)
}