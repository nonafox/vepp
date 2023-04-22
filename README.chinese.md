# Vepp

一个为 ZeppOS 打造的轻量级 TypeScript 框架。其起初目的是改善原生 ZeppOS 中控件系统的糟糕体验，使开发更加现代化。

# 多语言

- [English](https://github.com/jwhgzs/vepp/blob/master/README.md)
- 中文（当前）

# 开始之前

首先你得知道，在 ZeppOS 中有很多难解决的开发限制：

- `eval()` 和 `new Function()` 被禁用
- 糟糕的控件系统
- 糟糕的运行效率（也许是普遍的硬件问题）
- 坑人的 API 特性

你可能不相信， Vepp 使这些问题迎刃而解！

- 巧妙地绕过 `new Function()` 的禁用限制
- 重新打造一个完美的控件系统
- 尽量精简代码，提高代码效率
- 采用 CLI 方式提前编译 VML 语法（见下~），提高运行效率
- 更改 API 特性，使其陷阱更少

现在，让我们开始吧~

# 快速开始

让我们先来看看用 Vepp 开发的 ZeppOS 程序长什么样吧：

```html
<!-- 这里用的是一种骚气的语法—— VML (Vepp Markup Language)，用 .vepp 作后缀即可启用 VML ！ -->

<!-- 每个普通 VML 元素代表一个 ZeppOS 原生控件 -->
<!-- 每个普通 VML property 代表原生 ZeppOS 中控件的 parameter 或 property -->
<text
    :h="
        // 我们有两个内置变量 $w 和 $h ，它们分别指向设备的宽、高
        $h * 0.5
    "
    :text="
        /* 用 :name='expression' 的形式定义响应性 property */
        txt + '~'
    "
    @click-up="
        /* 用 @name='statements' 的形式定义事件 */
        // 通过内置变量 $arg 获取事件参数
        test($arg);
        // 通过内置变量 $widget 获取当前控件对象（原生的 ZeppOS 控件对象）
        console.log('ID of the widget: ' + $widget.getId());
    "
    @vepp-init="
        // vepp_init 是一个内置事件，其在当前控件第一次被渲染后触发
        console.log('first rendered!!!')
    ">
</text>
<!-- 当然，你也可以直接这样： name="text" 来定义静态的、字符串的属性！ -->

<!-- 用特殊元素 script 来编写你的 JS 代码 -->
<!-- 下面这种 script 元素带有 pre 属性，表示其代码在 Vepp 实例创建之前执行 -->
<script pre>
    /* 请务必在这里定义你的响应性变量，因为如果在下一个不带有 pre 属性的 script 元素内定义它们，它们可能在第一次渲染前并未定义、初始化，以致渲染出错 */
    // this        ：指向你所有的响应性变量
    this.txt = 'hello, world'
    // 不用担心 lambda 表达式的 this 指向问题， Vepp 早已为你解决！
    this.test = (arg) => {
        console.log('event argument: ' + JSON.stringify(arg))
        this.txt += '!'
    }
</script>
<!-- 这种 script 元素不带有 pre 属性，也就是说这里的代码会在 Vepp 实例创建之后（也即第一次渲染后）执行 -->
<script>
    // $vepp      ：指向 Vepp 实例
    // this       ：相当于 $vepp.data ，指向你所有的响应性变量
    let watcher = () => {
        console.log(`variable 'txt' was changed as: ` + this.txt)
    }
    // 用 $vepp.watch(func) 来监听变量
    // 当被 func 依赖的变量发生更改时，func 将被重新执行
    $vepp.watch(watcher)
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

# 进阶功能

### 双向绑定

尽管 Vepp 的设计大体上遵循原生 ZeppOS 的接口，力求使原生 API 的特征都能在 Vepp 中映射。但是对于有些很令人难受的控件 API（比如表单、列表等），我们还是自己动手、丰衣足食吧！

让我们先来看个表单的小例子：

```html
<!-- 通过特殊 property `vepp_value` 来实现表单的双向绑定 -->
<!-- 注意！目前只适配了 radio_group, checkbox_group 控件的双向绑定功能，更多精彩敬请期待！ -->

<checkbox-group
        :h="64"
        select-src="select.png"
        unselect-src="unselect.png"
        :vepp-value="checked">
    <state-button :x="40" :y="200" :w="64" :h="64" vepp-value="A"></state-button>
    <state-button :x="190" :y="200" :w="64" :h="64" vepp-value="B"></state-button>
    <state-button :x="340" :y="200" :w="64" :h="64" vepp-value="C"></state-button>
</checkbox-group>
<text :y="100" :h="100" :text="'checked: ' + checked"></text>
<button :y="400" :h="100" text="check all" :click-func="()=>{checked=['A','B','C']}"></button>

<script pre>
    this.checked = ['B']
</script>
```

够简单了吧？除了设置名为 `vepp_value` 的 property ，你无需写任何逻辑代码即可实现表单的数据流。我认为没有必要介绍更多详细内容了！

# Polyfills

Vepp 为你准备了多样、实用的 polyfills ，这里给出它们的列表：

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

# 其他

- Vepp 的依赖追踪仅限于 `Array` 和纯粹 `Object` （构造函数为 `Object` 的对象），其他诸如 `Map` 、 `Set` 等未做适配
- VML 中的字符 `-` 和 `_` 等效； VML 对大小写不敏感
- VML 的特殊属性 `vepp_value` 不具有响应性
- VML 的特殊属性 `vepp_value` 有双重含义：在 `state_button` 控件上其表现为声明选项值，在形如 `xxx_group` 的表单父控件上表现为对属性指定的变量进行双向绑定
- VML 中在 `xxx_group` 控件上定义的 `vepp_value` 特殊属性的值在不同具体表单控件上的要求不同：如在单选框 `radio_group` 上使用 `vepp_value` 属性，需要填入一个任意变量；在多选框 `checkbox_group` 上使用则需填入一个数组变量