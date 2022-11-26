# Vepp
A simple framework for ZeppOS programs, using some of parts of my other project [Vior](https://github.com/jwhgzs/vior).

# Before start
What Vepp will do is to build UI and update it reactively, just like Vue, Vior and many other JS frameworks. But there is a big problem, that is in ZeppOS, `eval` and `new Function()` are both disabled. It is so limited that you cannot use Vepp in the same way as Vue and Vior completely. That is why Vepp is whole independent from Vior.

# Getting started
Here is a example for ZeppOS watchface program:
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
                    $.visible="show">
                </text>
            `
        })
        setInterval(function () {
            vepp.data.test = Math.random() + ''
        }, 1000)
    }
})
```
As you see, Vepp's constructor takes 2 options: `data` option and `html` option. Easy to understand, `data` allows you to initialize your reactive variables, and `html` allows you to create your widgets in HTML way.
Vepp allows you to define functions in `data` option. In fact, you must define your functions in it.
`html` option is a lot different compares to Vior. First, HTML tags stand for widget names in ZeppOS, e.g. `text`, `img`, `circle`. Second, HTML attributes stand for widget properties and events. Here are HTML attributes' format rules:
- `name="string"`                  // string property
- `:name="expression"`             // property with Zepp's constants (hmUI.xxx.xxx)
- `#name="expression"`             // number property
- `$name="expression"`             // property that binds with reactive variable
- `\[prefix\].name="value"`        // property that cannot be set with 'hmUI.prop.MORE' flag. this can be used with other formats above
Besides, Vepp prepares polyfills for you. For example, you can use `setTimeout()` and `setInterval()` freely with the help with Vepp!