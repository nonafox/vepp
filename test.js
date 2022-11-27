import { createProxy } from './src/proxy'

let a = createProxy({a: {aa: 1, bb: {cc: 3}}}, function (k) {
    console.log('changed: ' + k)
}, globalThis)
a.bb.cc = 4