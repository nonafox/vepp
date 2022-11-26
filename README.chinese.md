# Vepp
为ZeppOS准备的，小巧、高效的JS框架。部分代码（如`util.js`）来自于我另一个项目——[Vior](https://github.com/jwhgzs/vior)。

# 多语言
- [English](https://github.com/jwhgzs/vepp/blob/master/README.md)
- 中文（当前）

# 开始之前
Vepp的主要功能是以对大多数JS开发者友好的方式完成UI的构建、更新。和Vue、Vior等框架一样，Vepp以响应性为核心。ZeppOS虽以JS为主语言，但其中有很多限制，如`eval()`、`new Function()`被禁用，而且ZeppOS纯JS的UI接口非常臃肿。于是我在Vior框架的代码库以及思路的基础上，重新完成了这个用于ZeppOS的JS框架。不过由于限制诸多，在使用上还是跟Vue、Vior有很大差距。

# 快速开始
让我们从一个watchface表盘实例开始。
```javascript
import Vepp from '../../vepp/src/index'

WatchFace({
    build() {
        let vepp = new Vepp({
            data: {
                test: 'abcde',
                show: true,
                onclick() {
                    console.log('onclick!!')
                    this.data.show = false
                }
            },
            html: `
                <text $text="test"
                    #color="0x66ff33"
                    @click_up="onclick"
                    #w="50%"
                    #h="50%"
                    $.visible="show"
                    :text_style=".text_style.NONE">
                </text>
            `
        })
        setInterval(function () {
            vepp.data.test = Math.random() + ''
        }, 1000)
    }
})
```
可以看到，Vepp的options有两个：`data`和`html`。顾名思义，通过`data` option初始化响应性变量、函数，通过`html` option以HTML的形式初始化UI界面。不同于Vior，Vepp中的响应性变量、函数都必须在`data` option中定义。

在`html` option中，HTML元素、属性的使用与Vior大有不同。HTML元素标签名对应ZeppOS中的控件名（如`text`、`img`、`circle`）；HTML属性格式如下：

- `name="string"`                  // 字符串属性
- `:name="expression"`             // 带有ZeppOS常量的属性（形如 `hmUI.xxx.xxx`）
- `#name="expression"`             // 数字属性
- `$name="expression"`             // 响应性属性
- `[prefix].name="value"`          // 单设属性标记，标记该属性不能用`hmUI.prop.MORE`方式批量设置。该格式可与上述任一其他格式并存。`[prefix]`可选值：` ` `:` `#` `$`

另外，Vepp自带了许多实用的polyfills。如`setTimeout()`和`setInterval()`可以直接正常使用！