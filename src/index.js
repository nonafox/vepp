import './polyfill/device-polyfill'

import { createProxy } from './proxy.js'
import TDom from './tdom.js'
import Util from './util.js'

export default class Vepp {
    constructor(opts) {
        this.html = opts.html || ''
        this.data = createProxy(opts.data || {}, this.update, this)
        for (let k in this.data) {
            let v = this.data[k], _this = this
            if (typeof v == 'function') {
                this.data[k] = (...args) => {
                    v.call(_this, ...args)
                }
            }
        }
        
        this.tdom = new TDom()
        let tree = this.tdom.read(this.html)
        this.tree = this.init(typeof tree == 'object' ? tree : [])
    }
    formatAttrs(_attrs) {
        if (! _attrs)
            return {}
        let attrs = Object.assign({}, _attrs)
        for (let k in attrs) {
            let v = attrs[k]
            if (k.charAt(0) == ':') {
                delete attrs[k]
                k = k.substring(1)
                let vs = v.split('.')
                vs.splice(0, 1)
                v = hmUI[vs[0]]
                v = ! v ? {} : v
                v = v[vs[1]]
                attrs[k] = v
            } else if (k.charAt(0) == '#') {
                delete attrs[k]
                k = k.substring(1)
                if (v.charAt(v.length - 1) == '%') {
                    let perc = Number(v.substring(0, v.length - 1)) / 100
                    if (k == 'x' || k == 'w')
                        perc *= Util.deviceWidth
                    else if (k == 'y' || k == 'h')
                        perc *= Util.deviceHeight
                    attrs[k] = perc
                } else {
                    attrs[k] = Number(v)
                }
            } else if (k.charAt(0) == '$') {
                delete attrs[k]
                k = k.substring(1)
                attrs[k] = this.data[v]
            }
        }
        return attrs
    }
    init(_tree, deepCopy = true, widgetCtor = hmUI) {
        if (! Array.isArray(_tree))
            return this.init(_tree.children)
        let tree = deepCopy ? Object.assign([], _tree) : _tree
        
        for (let k in tree) {
            let v = tree[k]
            if (! v.tag) {
                delete tree[k]
                continue
            }

            let tag = v.tag.toUpperCase(),
                type = hmUI.widget[tag]
            let t = this, oattrs = v.attrs
            let opts_func = () => Object.assign({
                x: 0,
                y: 0,
                w: Util.deviceWidth,
                h: Util.deviceHeight
            }, t.formatAttrs(Util.defaultOpts[tag]), t.formatAttrs(oattrs))
            v.attrs = opts_func()
            v.dom = widgetCtor.createWidget(type, v.attrs)

            for (let k2 in v.attrs) {
                let v2 = v.attrs[k2]
                if (k2.charAt(0) == '@') {
                    delete v.attrs[k]
                    k2 = k2.substring(1).toUpperCase()
                    v.dom.addEventListener(hmUI.event[k2], this.data[v2])
                }
            }
            let props_func = (vv) => {
                for (let k2 in vv.attrs) {
                    let v2 = vv.attrs[k2]
                    if (k2.charAt(0) == '.') {
                        delete vv.attrs[k2]
                        k2 = k2.substring(1).toUpperCase()
                        vv.dom.setProperty(hmUI.prop[k2], v2)
                    }
                }
            }
            props_func(v)
            v.updater = (vv) => {
                let nattrs = opts_func()
                vv.dom.setProperty(hmUI.prop.MORE, nattrs)
                vv.attrs = nattrs
                props_func(vv)
            }

            if (tag == 'GROUP') {
                this.init(v.children, false, v.dom)
            }
        }
        return tree
    }
    update() {
        for (let k in this.tree) {
            let v = this.tree[k]
            v.updater(v)

            if (v.tag.toUpperCase() == 'GROUP') {
                for (let k2 in v.children) {
                    let v2 = v.children[k2]
                    v2.updater(v2)
                }
            }
        }
    }
}