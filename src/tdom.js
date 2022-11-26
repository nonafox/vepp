import Util from './util.js'

export default class TDom {
    isValidName(text) {
        return /^[!a-zA-Z0-9\-_\$\@\:\#\.]+$/.test(text)
    }
    isQuote(arr, char) {
        return arr[arr.indexOf(char) - 1] != '\\' && (char == `'` || char == `"`)
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
    nextSibilingPath(res, path) {
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
            return this.nextSibilingPath(res, oldPath)
        else
            return this.nextChildPath(res, oldPath)
    }
    parentPath(res, path) {
        let tmp = Util.deepCopy(path)
        tmp.splice(-1, 1)
        return tmp
    }
    read(src) {
        let arr = src.split('')
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
                        } else if (! isTagRead && ! this.isValidName(v) && currentTag) {
                            isTagRead = true
                            currentTag = currentTag.toLowerCase()
                            currentVNode.tag = currentTag
                        } else if (isTagRead && (this.isValidName(v) || this.isQuote(arr, v))) {
                            if (this.isQuote(arr, v)) {
                                quoteStarter = v
                                status = 'quote'
                            } else if (v != '=') {
                                currentAttrsRaw += v
                            }
                        }
                        if (! isEndTag && v == '>' && quoteAvailable) {
                            currentAttrs[currentAttrsRaw] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        }
                        if (! isEndTag && (this.isVoidChar(v) || v == '>') && quoteAvailable) {
                            currentAttrs[currentAttrsRaw] = quoteText || ''
                            quoteText = currentAttrsRaw = ''
                            quoteAvailable = false
                        } else if (! isEndTag && (this.isVoidChar(v) || v == '>') && currentAttrsRaw) {
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
                        } else {
                            tagStatus = true
                            currentTag = currentAttrsRaw = ''
                            currentAttrs = {}
                            isTagRead = false
                            currentPath = this.nextPath(res, openedPaths, currentPath)
                            currentVNode = Util.deepCopy(VNodeTemplate)
                            openedPaths.push(currentPath)
                            this.pushPath(res, currentPath, currentVNode)
                        }
                    } else if ((tagStatus || isEndTag) && v == '>') {
                        if (! isEndTag && Util.realLength(currentAttrs))
                            currentVNode.attrs = currentAttrs
                        
                        tagStatus = false
                        isEndTag = false
                        isSelfClosingTag = false
                    } else if (! tagStatus) {
                        let lastNode = this.readPath(res, currentPath) || {}
                        if (! lastNode.tag && lastNode.type == 'text') {
                            currentVNode.text += v
                            this.pushPath(res, currentPath, currentVNode)
                        } else {
                            currentPath = this.nextPath(res, openedPaths, currentPath)
                            currentVNode = Util.deepCopy(VNodeTemplate, { type: 'text', text: v })
                            this.pushPath(res, currentPath, currentVNode)
                        }
                    }
                } else if (src.substr(k, `-->`.length) == `-->`) {
                    currentPath = this.nextPath(res, openedPaths, currentPath)
                    currentVNode = Util.deepCopy(VNodeTemplate, { type: 'comment', text: commentText })
                    this.pushPath(res, currentPath, currentVNode)
                    isComment = false
                    commentText = ''
                    k += `-->`.length - 1
                } else {
                    commentText += v
                }
            } else if (status == 'quote') {
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
        
        return res
    }
}