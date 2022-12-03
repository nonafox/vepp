import './polyfill/device-polyfill.js'
import { getGlobal } from './polyfill/global.js'

const global = getGlobal()

const functionCtor = (function () {}).constructor
global.Function = function (...args) {
    return new functionCtor(...args)
}

const consoleTime = {}
global.console.time = function (tag) {
    if (tag in consoleTime)
        console.log(`Timer '${tag}' already exists`)
    consoleTime[tag] = new Date().valueOf()
}
global.console.timeEnd = function (tag) {
    if (! (tag in consoleTime)) {
        console.log(`Timer '${tag}' does not exist`)
    } else {
        console.log(`${tag}: ` + (new Date().valueOf() - consoleTime[tag]) + ' ms')
        delete consoleTime[tag]
    }
}