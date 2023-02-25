import Util from './general.js'

export default class TDom {
    isValidName(text) {
        return /^[a-zA-Z0-9\-_\$\@\:]+$/.test(text)
    }
    isQuote(v) {
        return v == `'` || v == `"`
    }
    isVoidChar(char) {
        return ! char || char == ' ' || char == '\t' || char == '\n' || char == '\r'
    }
    readPath(res, path) {
        let tmp = res
        for (let k in path) {
            let v = path[k]
            tmp = tmp.children[v]
        }
        return tmp
    }
    pushPath(res, path, value) {
        let tmp = res
        for (let k in path) {
            let v = path[k]
            if (path.length - 1 > k)
                tmp = tmp.children[v]
        }
        tmp.children[path[path.length - 1]] = value
    }
    nextSibilingPath(path) {
        let tmp = Util.deepCopy(path)
        tmp[path.length ? path.length - 1 : 0] = (path[path.length - 1] || 0) + 1
        return tmp
    }
    nextChildPath(res, path) {
        let tmp = Util.deepCopy(path)
        tmp.push(this.readPath(res, path).children.length)
        return tmp
    }
    nextPath(res, openedPaths, oldPath) {
        if (openedPaths.indexOf(oldPath) < 0)
            return this.nextSibilingPath(oldPath)
        else
            return this.nextChildPath(res, oldPath)
    }
    read(src) {
        let arr = (src + ' ').split('')
        let VNodeTemplate = Util.VNodeTemplate,
            res = Util.deepCopy(VNodeTemplate, { type: 'root' }),
            currentPath = [-1], currentVNode = {}, openedPaths = [], status = 'common',
            quoteStarter = null, quoteText = '', quoteAvailable = false, tagStatus = false,
            isEndTag = false, isSelfClosingTag = false, isTextOnly = false, currentTag = '',
            currentAttrsRaw = '', currentAttrs = {}, isTagRead = false, isComment = false,
            commentText = ''
        
        for (let k = 0; k < arr.length; k ++) {
            let v = arr[k]
            
            if (status == 'common') {
                if (! isComment) {
                    if (tagStatus) {
                        if (! isTagRead && this.isValidName(v)) {
                            currentTag += v
                        }
                        else if (! isTagRead && ! this.isValidName(v) && currentTag) {
                            isTagRead = true
                            currentTag = currentTag.toLowerCase()
                            currentVNode.tag = currentTag
                            
                            isSelfClosingTag = Util.selfClosingTags.indexOf(currentTag) >= 0
                            isTextOnly = Util.textOnlyTags.indexOf(currentTag) >= 0
                            if (isSelfClosingTag)
                                openedPaths.splice(openedPaths.indexOf(currentPath), 1)
                        }
                        else if (isTagRead
                                && (this.isValidName(v) || this.isQuote(v))) {
                            if (this.isQuote(v)) {
                                quoteStarter = v
                                status = 'quote'
                            }
                            else if (v != '=') {
                                currentAttrsRaw += v
                            }
                        }
                        if (! isEndTag && v == '>' && quoteAvailable) {
                            currentAttrs[currentAttrsRaw] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                        if (! isEndTag && (this.isVoidChar(v) || v == '>')
                                && quoteAvailable) {
                            currentAttrs[currentAttrsRaw] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                        else if (! isEndTag && (this.isVoidChar(v) || v == '>')
                                && currentAttrsRaw) {
                            currentAttrs[currentAttrsRaw] = ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                    }
                    let path = openedPaths[openedPaths.length - 1],
                        tag = this.readPath(res, path).tag || '',
                        isValidEndTag = '</' + tag == src.substr(k, tag.length + 2)
                    if ((! isTextOnly && v == '<') || (isTextOnly && isValidEndTag)) {
                        if (! isTextOnly && src.substr(k, `<!--`.length) == `<!--`) {
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
                            currentVNode = Util.deepCopy(VNodeTemplate)
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
                        if (! lastNode.tag && lastNode.type == 'text') {
                            currentVNode.text += v
                            this.pushPath(res, currentPath, currentVNode)
                        } else {
                            currentPath = this.nextPath(res, openedPaths, currentPath)
                            currentVNode = Util.deepCopy(
                                VNodeTemplate,
                                { type: 'text', text: v }
                            )
                            this.pushPath(res, currentPath, currentVNode)
                        }
                    }
                }
                else if (src.substr(k, `-->`.length) == `-->`) {
                    currentPath = this.nextPath(res, openedPaths, currentPath)
                    currentVNode = Util.deepCopy(
                        VNodeTemplate,
                        { type: 'comment', text: commentText }
                    )
                    this.pushPath(res, currentPath, currentVNode)
                    isComment = false
                    commentText = ''
                    k += `-->`.length - 1
                }
                else {
                    commentText += v
                }
            }
            else if (status == 'quote') {
                quoteAvailable = true
                if (v == quoteStarter) {
                    quoteStarter = null
                    status = 'common'
                    continue
                }
                quoteText += v
            }
        }
        
        if (openedPaths.length || status != 'common')
            return `Node tags tree is not valid, maybe there are some unclosed tags.`
        
        res.children.pop()
        return res
    }
    patch(tree, plainMode = false) {
        if (! Array.isArray(tree))
            return this.patch(tree.children, plainMode)
        
        let res = ''
        for (let k in tree) {
            let v = tree[k],
                singleTag = Util.selfClosingTags.indexOf(v.tag) >= 0
            
            if (v.tag) {
                let children = v.children.length
                        ? this.patch(v.children, Util.textOnlyTags.indexOf(v.tag) >= 0)
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
            else if (v.type == 'text') {
                if (plainMode)
                    res += v.text
                else
                    res += v.text
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/(\s|&nbsp;)+/g, ' ')
            }
            else if (v.type == 'comment') {
                res += `<!--${v.text}-->`
            }
        }
        
        return res
    }
}