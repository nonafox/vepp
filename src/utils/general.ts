export type T_JSON = { [_: string | symbol]: any }
export type T_FREE = { [_: string]: any }

export class GeneralUtil {
    public static ext: string = '.vepp'
    public static selfClosingTags: string[] = []
    public static textOnlyTags: string[] = ['script']
    public static tmpPrefix: string = '$$'
    private static voidChar: string = '\uffff'
    
    public static randomText(len: number = 6): string {
        let sets = 'abcdefghijklmnopqrstuvwxyz0123456789',
            res = ''
        for (let k = 0; k < len; k ++) {
            let c = sets[Math.floor(Math.random() * sets.length)]
            res += c
        }
        return res
    }
    public static isPlainObject(obj: any): boolean {
        return obj && (obj.constructor === Object || Array.isArray(obj))
    }
    private static deepCopyRaw(obj: any, dest?: any): any {
        if (! this.isPlainObject(obj))
            return obj
        if (Array.isArray(obj)) {
            dest = dest || []
            if (Array.isArray(dest)) {
                for (let v of obj) {
                    dest.push(this.deepCopyRaw(v))
                }
            }
            else {
                let k = 0
                for (let v of obj) {
                    dest[k] = this.deepCopyRaw(v)
                    k ++
                }
            }
        }
        else {
            dest = dest || {}
            for (let k in obj) {
                dest[k] = this.deepCopyRaw(obj[k])
            }
        }
        return dest
    }
    public static deepCopy(...objs: any[]): any {
        if (objs.length == 1)
            return this.deepCopyRaw(objs[0])
        const ret = {}
        for (let v of objs) {
            this.deepCopyRaw(v, ret)
        }
        return ret
    }
    private static isScriptQuote(text: string, k: number): boolean {
        return (text[k] == `'` || text[k] == `"` || text[k] == '`') && text[k - 1] != '\\'
    }
    public static scriptReg(script: string, regexp: RegExp, replace?: string): string | RegExpExecArray[] {
        let quoteStarter = null,
            addup = ''
        
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
                }
                else {
                    reps[repsid] += v
                }
            }
        }
        
        if (replace) {
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
    public static diff(
                buf: Set<any>, newest: Set<any>,
                addsCallback: (key: any) => void, delsCallback: (key: any) => void
            ): void {
        const adds: Set<(key: any) => void> = new Set,
            dels: Set<(key: any) => void> = new Set
        for (let v of buf) {
            if (! newest.has(v)) {
                dels.add(v)
                buf.delete(v)
            }
        }
        for (let v of newest) {
            if (! buf.has(v)) {
                adds.add(v)
                buf.add(v)
            }
        }
        for (let v of dels)
            delsCallback(v)
        for (let v of adds)
            addsCallback(v)
    }
}