import './polyfill/device-polyfill.js'
import { getGlobal } from './polyfill/global.js'

const global = getGlobal()

const functionCtor = (function () {}).constructor
global.Function = function (...args) {
    return new functionCtor(...args)
}