import { GeneralUtil as GUtil } from './general.js'

export enum VMLNodeType {
    root, common, text, comment
}

export type VMLNodeAttrs = { [_: string]: string }

export class VMLNode {
    public type: VMLNodeType = VMLNodeType.common
    public tag: string | null = null
    public attrs: VMLNodeAttrs = {}
    public text: string | null = null
    public children: VMLNode[] = []
}

enum VMLParserStatus {
    common, quote
}

export class VMLParser {
    private static isValidName(text: string): boolean {
        return /^[a-zA-Z\-_\@\:][a-zA-Z0-9\-_\@\:]*$/.test(text)
    }
    private static isQuote(v: string): boolean {
        return v == `'` || v == `"`
    }
    private static isVoidChar(char: string): boolean {
        return ! char || char == ' ' || char == '\t' || char == '\n' || char == '\r'
    }
    private static readPath(res: VMLNode, path: number[]): VMLNode {
        for (let v of path) {
            res = res.children[v]
        }
        return res
    }
    private static pushPath(res: VMLNode, path: number[], value: VMLNode): void {
        let k = 0
        for (let v of path) {
            if (path.length - 1 > k)
                res = res.children[v]
            k ++
        }
        res.children[path[path.length - 1]] = value
    }
    private static nextSibilingPath(path: number[]): number[] {
        let tmp = GUtil.deepCopy(path)
        tmp[path.length ? path.length - 1 : 0] = (path[path.length - 1] || 0) + 1
        return tmp
    }
    private static nextChildPath(res: VMLNode, path: number[]): number[] {
        let tmp = GUtil.deepCopy(path)
        tmp.push(this.readPath(res, path).children.length)
        return tmp
    }
    private static nextPath(res: VMLNode, openedPaths: number[][], oldPath: number[]): number[] {
        if (openedPaths.indexOf(oldPath) < 0)
            return this.nextSibilingPath(oldPath)
        else
            return this.nextChildPath(res, oldPath)
    }
    public static read(src: string): VMLNode | string {
        let arr = (src + ' ').split('')

        const res = new VMLNode(), openedPaths = []
        res.type = VMLNodeType.root
        let currentPath = [-1], currentVNode = new VMLNode(), status = VMLParserStatus.common
        let quoteStarter = null, quoteText = '', quoteAvailable = false
        let tagStatus = false, isEndTag = false, isSelfClosingTag = false, currentTag = '', isTagRead = false
        let currentAttrsRaw = '', currentAttrs: VMLNodeAttrs = {}
        let isComment = false, commentText = ''
        let isTextOnly = false
        
        for (let k = 0; k < arr.length; k ++) {
            let v = arr[k]
            
            if (status == VMLParserStatus.common) {
                if (! isComment) {
                    if (tagStatus) {
                        if (! isTagRead && this.isValidName(v)) {
                            currentTag += v
                        }
                        else if (! isTagRead && ! this.isValidName(v) && currentTag) {
                            isTagRead = true
                            currentTag = currentTag.toLowerCase()
                            currentVNode.tag = currentTag
                            
                            isSelfClosingTag = GUtil.selfClosingTags.indexOf(currentTag) >= 0
                            isTextOnly = GUtil.textOnlyTags.indexOf(currentTag) >= 0
                            if (isSelfClosingTag)
                                openedPaths.splice(openedPaths.indexOf(currentPath), 1)
                        }
                        else if (isTagRead
                                && (this.isValidName(v) || this.isQuote(v))) {
                            if (this.isQuote(v)) {
                                quoteStarter = v
                                status = VMLParserStatus.quote
                            }
                            else if (v != '=') {
                                currentAttrsRaw += v
                            }
                        }
                        if (! isEndTag && v == '>' && quoteAvailable) {
                            currentAttrs[currentAttrsRaw.toLowerCase()] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                        if (! isEndTag && (this.isVoidChar(v) || v == '>')
                                && quoteAvailable) {
                            currentAttrs[currentAttrsRaw.toLowerCase()] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                        else if (! isEndTag && (this.isVoidChar(v) || v == '>')
                                && currentAttrsRaw) {
                            currentAttrs[currentAttrsRaw.toLowerCase()] = ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                    }
                    let path = openedPaths[openedPaths.length - 1],
                        tag = this.readPath(res, path).tag || '',
                        isValidEndTag = '</' + tag == src.substring(k, tag.length + 2 + k)
                    if ((! isTextOnly && v == '<') || (isTextOnly && isValidEndTag)) {
                        if (! isTextOnly && src.substring(k, `<!--`.length + k) == `<!--`) {
                            isComment = true
                            commentText = ''
                            k += `<!--`.length - 1
                            continue
                        }
                        
                        if (arr[k + 1] == '/') {
                            tagStatus = true
                            isEndTag = true
                            if (isValidEndTag)
                                openedPaths.splice(-1, 1)
                            else
                                return `Find unexpected ending tag.`
                            currentPath = path
                            currentVNode = this.readPath(res, path)
                            isTextOnly = false
                        }
                        else {
                            tagStatus = true
                            currentTag = currentAttrsRaw = ''
                            currentAttrs = {}
                            isTagRead = false
                            currentPath = this.nextPath(res, openedPaths, currentPath)
                            currentVNode = new VMLNode()
                            openedPaths.push(currentPath)
                            this.pushPath(res, currentPath, currentVNode)
                        }
                    }
                    else if ((tagStatus || isEndTag) && v == '>') {
                        if (! isEndTag && Object.keys(currentAttrs).length)
                            currentVNode.attrs = currentAttrs
                        
                        tagStatus = false
                        isEndTag = false
                        isSelfClosingTag = false
                    }
                    else if (! tagStatus) {
                        let lastNode = this.readPath(res, currentPath) || {}
                        if (! lastNode.tag && lastNode.type == VMLNodeType.text) {
                            currentVNode.text += v
                            this.pushPath(res, currentPath, currentVNode)
                        }
                        else {
                            currentPath = this.nextPath(res, openedPaths, currentPath)
                            currentVNode = new VMLNode()
                            currentVNode.type = VMLNodeType.text
                            currentVNode.text = v
                            this.pushPath(res, currentPath, currentVNode)
                        }
                    }
                }
                else if (src.substring(k, `-->`.length + k) == `-->`) {
                    currentPath = this.nextPath(res, openedPaths, currentPath)
                    currentVNode = new VMLNode()
                    currentVNode.type = VMLNodeType.comment
                    currentVNode.text = commentText
                    this.pushPath(res, currentPath, currentVNode)
                    isComment = false
                    commentText = ''
                    k += `-->`.length - 1
                }
                else {
                    commentText += v
                }
            }
            else if (status == VMLParserStatus.quote) {
                quoteAvailable = true
                if (v == quoteStarter) {
                    quoteStarter = null
                    status = VMLParserStatus.common
                    continue
                }
                quoteText += v
            }
        }
        
        if (openedPaths.length || status != VMLParserStatus.common)
            return `Node tags tree is not valid, maybe there are some unclosed tags.`
        
        res.children.pop()
        return res
    }
    public static patch(tree: VMLNode | VMLNode[], plainMode = false): string {
        if (! Array.isArray(tree))
            return this.patch(tree.children, plainMode)
        
        let res = ''
        for (let k in tree) {
            let v = tree[k],
                singleTag = GUtil.selfClosingTags.indexOf(v.tag!) >= 0
            
            if (v.tag) {
                let children = v.children.length
                        ? this.patch(v.children, GUtil.textOnlyTags.indexOf(v.tag) >= 0)
                        : '',
                    attrs = ''
                for (let k2 in v.attrs) {
                    let v2 = v.attrs[k2] + ''
                    v2 = v2.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
                    if (v2 !== '')
                        attrs += ` ${k2}="${v2}"`
                    else
                        attrs += ` ${k2}`
                }
                let slash = singleTag && v.tag != '!doctype' ? '/' : ''
                let rtag = singleTag ? '' : `</${v.tag}>`
                res += `<${v.tag}${attrs}${slash}>${children}${rtag}`
            }
            else if (v.type == VMLNodeType.text) {
                if (plainMode)
                    res += v.text
                else
                    res += v.text!
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/(\s|&nbsp;)+/g, ' ')
            }
            else if (v.type == VMLNodeType.comment) {
                res += `<!--${v.text}-->`
            }
        }
        
        return res
    }
}