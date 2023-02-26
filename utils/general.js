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
    tmpPrefix: '$tmp__',
    
    randomText(len = 6) {
        let sets = 'abcdefghijklmnopqrstuvwxyz0123456789',
            res = ''
        for (let k = 0; k < len; k ++) {
            let c = sets[Math.floor(Math.random() * sets.length)]
            res += c
        }
        return res
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
    isScriptQuote(text, k) {
        return (text[k] == `'` || text[k] == `"` || text[k] == '`') && text[k - 1] != '\\'
    },
    voidChar: '\uffff',
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
                    addup += quoteStarter + this.voidChar + repsid + this.voidChar
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
                addup = addup.replace(this.voidChar + k + this.voidChar, v)
            }
            return addup
        }
        else {
            let res = [], v
            while (v = regexp.exec(addup)) {
                res.push(v)
                if (! /\/.*\/[a-z]*g[a-z]*$/i.test(regexp.toString()))
                    break
            }
            return res
        }
    }
}