import './device-polyfill.js'
import { getGlobal } from './global.js'

const glob = getGlobal()

const functionCtor = (function () {}).constructor
glob.Function = function (...args) {
    return new functionCtor(...args)
}

const consoleTime = {}
glob.console.time = function (tag) {
    if (tag in consoleTime)
        console.log(`Timer '${tag}' already exists`)
    consoleTime[tag] = new Date().valueOf()
}
glob.console.timeEnd = function (tag) {
    if (! (tag in consoleTime)) {
        console.log(`Timer '${tag}' does not exist`)
    } else {
        console.log(`${tag}: ` + (new Date().valueOf() - consoleTime[tag]) + ' ms')
        delete consoleTime[tag]
    }
}