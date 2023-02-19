# Vepp
一个为ZeppOS打造的轻量JavaScript框架。其起初目的是改善原生ZeppOS中控件系统的糟糕体验，使开发更加现代化。

# 多语言
- [English](https://github.com/jwhgzs/vepp/blob/master/README.md)
- 中文（当前）

# 开始之前
首先你得知道，在ZeppOS中有很多难解决的开发限制：

- `eval()`和`new Function()`被初级禁用
- 糟糕的控件系统
- 糟糕的运行效率（也许是普遍的硬件问题）

你可能不相信，Vepp使这些问题迎刃而解！

- 巧妙地绕过`new Function()`的禁用限制
- 以开发者友好的方式重新打造控件系统（套壳）
- 尽量精简代码，提高代码效率

现在，让我们开始吧~

# 快速开始
```javascript
import Vepp from 'vepp'

Page({
    build() {
        let { data: t } = new Vepp({
            // 使用 VML (Vepp Markup Language) 创建控件、声明式定义properties和events，形式如下：
            // #TAG    propName: expression, '@eventName': expression, ...
            // 不知你是否发现，#TAG 之后的部分跟很像JSON！
            // 特别提示！！ VML 中各键的处理是按顺序的，当你不注意时这可能导致一些莫名其妙的错误，请特别小心！
            ui: `
                #TEXT    h: DEVICE_HEIGHT * 0.5, text: mytext, '@click_up': myfunc
            `,
            data: {
                DEVICE_WIDTH: hmSetting.getDeviceInfo().width,
                DEVICE_HEIGHT: hmSetting.getDeviceInfo().height,
                mytext: 'hello, world',
                myfunc() {
                    console.log(this.mytext)
                }
            }
        })

        // 使用 veppIns.watch(...) 来监听变量更变
        // 对应地，可以使用 veppIns.unwatch(...) 取消监听
        let tmp = () => {
            console.log('mytext changed!')
            t.unwatch('mytext', tmp)
        }
        t.watch('mytext', tmp)
        
        // 用 veppIns.data.xxx 的形式对动态变量进行取值或赋值
        // 另外，Vepp为你准备了多样的polyfills，这意味着你可以自由地使用 setInterval(...) 等等！请参见下文获取详细信息
        setInterval(function () {
            t.mytext = 'Random: ' + (Math.random() * 100).toFixed()
        }, 1000)
    }
})
```

# Polyfills
Vepp为你准备了多样的polyfills，具体如下：

- class `Buffer`
- class `Function`
- class `Logger`
- function `setTimeout`
- function `clearTimeout`
- function `setInterval`
- function `clearInterval`
- function `setImmediate`
- function `clearImmediate`
- function `console.time`
- function `console.timeEnd`