# Vepp
一个为ZeppOS打造的轻量JavaScript框架。其起初目的是改善原生ZeppOS中控件系统的糟糕体验，使开发更加现代化。

# 多语言
- [English](https://github.com/jwhgzs/vepp/blob/master/README.md)
- 中文（当前）

# 开始之前
首先你得知道，在ZeppOS中有很多难解决的开发限制：

- `eval()` 和 `new Function()` 被初级禁用
- 糟糕的控件系统
- 糟糕的运行效率（也许是普遍的硬件问题）

你可能不相信， Vepp 使这些问题迎刃而解！

- 巧妙地绕过 `new Function()` 的禁用限制
- 重新打造一个完美的控件系统
- 尽量精简代码，提高代码效率
- 采用 CLI 方式提前编译 VML 语法（见下~），提高运行效率

现在，让我们开始吧~

# 快速开始
让我们先来看看用 Vepp 开发的 ZeppOS 程序长什么样吧：

```html
<!-- 这就是传说中的、名为 VML (Vepp Markup Language) 的骚气语法！你可以创建后缀为 .vepp 的文件来使用它 -->

<!-- 每个元素都代表对应的 ZeppOS 控件 -->
<!-- 如 Vue 等框架中的语法：用 :name="expression" 来设置响应性属性，用 name="text" 来设置静态字符串属性，用 @name="statements" 来注册事件。 -->
<text :text="txt + '~'" @click_up="test()"></text>

<!-- 你需要在特殊元素 script 中编写你的 JS 代码 -->
<script>
    // $vepp 指向 Vepp 实例
    // $     指向 $vepp.data ，即你所有的响应性变量
    $.txt = 'hello, world'
    $.test = function () {
        $.txt += '!'
    }
	
    let watcher = () => {
        console.log(`variable 'txt' first changed.`)
    	// 用 $vepp.unwatch(key, func) 来取消监听变量
        $vepp.unwatch('txt', watcher)
    }
    // 用 $vepp.watch(key, func) 来监听响应性变量
    $vepp.watch('txt', watcher)
</script>
```

很惊讶吧？我当然猜到了——这是 Vepp 最引以为傲的一点，贴近 Vue 等主流前端框架的设计思路和特性，对有过前端开发经历的各位很友好哦！

你就要去试啦？稍等一下，还没介绍完呢——由于这骚气 VML 的语法，你需要 VeppCLI 的一臂之力。来看看 Vepp “独具特色”的使用指南：

```bash
# Vepp 把核心部分和 CLI 部分合并在一个 NPM 包里了~
# 警告：在 ZeppOS 项目里直接 import 全局包是不管用的哦！所以才需要像我这样，分别在你的项目和全局都安装一次
npm install vepp
npm install vepp -g
```

安装好了，接下来就试试编译吧……

```bash
vepp init test-project
cd ./test-project
vepp compile
```

OK 啦！你也可以使用观察者模式， Vepp 会监听文件更改并自动进行编译！

```bash
# 警告： Vepp 的观察者模式不能和其他应用的观察者模式（如 ZeppCLI 的）一起使用，否则可能会监听失效！
vepp auto
```

对于进阶者，你可以安装 Vepp 的 VSCode 扩展，体验更多开发乐趣！

# Polyfills
Vepp 为你准备了多样的polyfills，具体如下：

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