export default {
    ext: '.vepp',
    selfClosingTags: [],
    textOnlyTags: ['script'],
    VNodeTemplate: {
        tag: null,
        type: 'common',
        attrs: {},
        text: null,
        children: []
    },
    
    randomText(len = 6) {
        let sets = 'abcdefghijklmnopqrstuvwxyz0123456789',
            res = ''
        for (let k = 0; k < len; k ++) {
            let c = sets[Math.floor(Math.random() * sets.length)]
            res += c
        }
        return res
    },
    triggerError(desc, name, code, ex) {
        console.group('[Vepp error]:')
        console.group('Type:')
        console.log(desc || '[unknown]')
        console.groupEnd()
        console.group('Position:')
        console.log(name || '[unknown]')
        console.groupEnd()
        console.group('Code:')
        console.log(code || '[unknown]')
        console.groupEnd()
        console.group('Error:')
        console.log(ex || '[unknown]')
        console.groupEnd()
        console.groupEnd()
        console.log('%c\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
                    'display: block; width: 100%; line-height: 0.25rem; background-color: #ddd;')
        throw new Error('[Vior error]')
    },
    isPlainObject(obj) {
        return obj && (obj.constructor === Object || Array.isArray(obj))
    },
    _deepCopy(obj) {
        if (! this.isPlainObject(obj))
            return obj
        let res = Array.isArray(obj) ? [] : {},
            keys = Object.keys(obj)
        for (let kk = 0; kk < keys.length; kk ++) {
            let k = keys[kk],
                v = obj[k]
            res[k] = this._deepCopy(v)
        }
        return res
    },
    deepCopy(...objs) {
        if (objs.length === 1)
            return this._deepCopy(objs[0])
        
        let res = Array.isArray(objs[0]) ? [] : {}
        for (let k in objs) {
            let v = objs[k]
            let keys = Object.keys(v)
            for (let kk = 0; kk < keys.length; kk ++) {
                let k2 = keys[kk],
                    v2 = v[k2]
                res[k2] = this._deepCopy(v2)
            }
        }
        
        return res
    },
    deepCompare(a1, a2) {
        if (a1 === a2)
            return true
        if (this.isPlainObject(a1) && this.isPlainObject(a2)) {
            if (Array.isArray(a1) && Array.isArray(a2) && a1.length != a2.length)
                return false
            let res = true
            let keys = Object.keys(a1)
            for (let kk = 0; kk < keys.length; kk ++) {
                let k = keys[kk]
                res = res && (() => {
                    let v1 = a1[k],
                        v2 = a2[k]
                    if (this.isPlainObject(v1) && this.isPlainObject(v2)) {
                        if (! this.deepCompare(v1, v2))
                            return false
                    } else if (v1 !== v2) {
                        return false
                    }
                    return true
                })()
            }
            return res && this.realLength(a1) === this.realLength(a2)
        }
        else {
            return false
        }
    },
    deepIndexof(arr, item) {
        let keys = Object.keys(arr)
        for (let kk = 0; kk < keys.length; kk ++) {
            let k = keys[kk],
                v = arr[k]
            if (this.deepCompare(v, item))
                return k
        }
        return undefined
    },
    realLength(arr) {
        return Object.keys(arr).length
    },
    firstCharUpper(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1)
    },
    firstCharLower(text) {
        return text.substr(0, 1).toLowerCase() + text.substr(1)
    },
    camel2KebabCase(text) {
        let tmp = this.firstCharLower(text).replace(/([A-Z]{1})/g, '-$1').split('-')
        let keys = Object.keys(tmp)
        for (let kk = 0; kk < keys.length; kk ++) {
            let k = keys[kk]
            tmp[k] = tmp[k].toLowerCase()
        }
        return tmp.join('-')
    },
    kebab2CamelCase(text) {
        let tmp = text.split('-'), res = ''
        let keys = Object.keys(tmp)
        for (let kk = 0; kk < keys.length; kk ++) {
            let k = keys[kk],
                v = tmp[k]
            res += this.firstCharUpper(v)
        }
        return res
    },
    isScriptQuote(text, k) {
        return (text[k] == `'` || text[k] == `"` || text[k] == '`') && text[k - 1] != '\\'
    },
    scriptReg(_script, regexp, replace = null) {
        let script = _script.split(''), quoteStarter = null, addup = ''
        
        let reps = [], repsid = -1
        for (let k = 0; k < script.length; k ++) {
            let v = script[k]
            if (! quoteStarter) {
                if (! this.isScriptQuote(script, k)) {
                    addup += v
                }
                else {
                    quoteStarter = v
                    repsid ++
                    reps[repsid] = ''
                    addup += quoteStarter + '\uffff' + repsid + '\uffff'
                }
            }
            else {
                if (this.isScriptQuote(script, k) && v == quoteStarter) {
                    addup += v
                    quoteStarter = null
                } else {
                    reps[repsid] += v
                }
            }
        }
        
        if (replace !== null) {
            addup = addup.replace(regexp, replace)
            for (let k in reps) {
                let v = reps[k]
                addup = addup.replace('\uffff' + k + '\uffff', v)
            }
            return addup
        }
        else {
            let res = [], v
            while (v = regexp.exec(addup)) {
                res.push(v)
                if (! /\/.*g.*$/i.test(regexp.toString()))
                    break
            }
            return res
        }
    }
}