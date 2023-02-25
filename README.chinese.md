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
敬请期待……

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