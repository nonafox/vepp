import './polyfill/device-polyfill.js'

import { createProxy } from './proxy.js'
import TDom from './tdom.js'
import Util from './util.js'

export default class Vepp {
    constructor(opts) {
        this.html = opts.html || ''
        this.data = createProxy(opts.data || {}, this.update, this)
        this.deps = {}
        
        this.tdom = new TDom()
        let tree = this.tdom.read(this.html)
        this.tree = this.init(typeof tree == 'object' ? tree : [])
    }
    init(tree, widgetCtor = hmUI) {
        if (! Array.isArray(tree))
            return this.init(tree.children)
        
        for (let k in tree) {
            let v = tree[k]
            if (! v.tag) {
                delete tree[k]
                continue
            }
            
            let tag = v.tag.toUpperCase(),
                type = hmUI.widget[tag]
            let attrs = v.attrs, nattrs = Object.assign({
                x: 0,
                y: 0,
                w: Util.deviceWidth,
                h: Util.deviceHeight
            }, Util.defaultOpts[tag])
            for (let k2 in attrs) {
                let v2 = attrs[k2]
                if (k2.charAt(0) == ':') {
                    k2 = k2.substring(1)
                    let vs = v2.split('.')
                    vs.splice(0, 1)
                    v2 = hmUI[vs[0]]
                    v2 = ! v2 ? {} : v2
                    v2 = v2[vs[1]]
                    nattrs[k2] = v2
                } else if (k2.charAt(0) == '#') {
                    k2 = k2.substring(1)
                    if (v2.charAt(v2.length - 1) == '%') {
                        let perc = Number(v2.substring(0, v2.length - 1)) / 100
                        if (k2 == 'x' || k2 == 'w')
                            perc *= Util.deviceWidth
                        else if (k2 == 'y' || k2 == 'h')
                            perc *= Util.deviceHeight
                        nattrs[k2] = perc
                    } else {
                        nattrs[k2] = Number(v2)
                    }
                } else if (k2.charAt(0) == '$') {
                    k2 = k2.substring(1)
                    nattrs[k2] = this.data[v2]
                    let t = this
                    if (! (v2 in this.deps))
                        this.deps[v2] = []
                    this.deps[v2].push(() => {
                        if (k2.charAt(0) == '.')
                            k2 = k2.substring(1)
                        let pid = hmUI.prop[k2.toUpperCase()]
                        v.dom.setProperty(pid, t.data[v2])
                    })
                } else {
                    nattrs[k2] = v2
                }
            }
            v.dom = widgetCtor.createWidget(type, nattrs)

            for (let k2 in v.attrs) {
                let v2 = v.attrs[k2]
                if (k2.charAt(0) == '@') {
                    delete v.attrs[k2]
                    k2 = k2.substring(1).toUpperCase()
                    v.dom.addEventListener(hmUI.event[k2], this.data[v2])
                } else if (k2.charAt(0) == '.') {
                    delete v.attrs[k2]
                    k2 = k2.substring(1).toUpperCase()
                    v.dom.setProperty(hmUI.prop[k2], v2)
                }
            }
            
            if (tag == 'GROUP') {
                this.init(v.children, v.dom)
            }
        }
        return tree
    }
    update(key) {
        let list = this.deps[key] || []
        for (let k in list) {
            let v = list[k]
            v()
        }
    }
}