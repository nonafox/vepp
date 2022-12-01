# Vepp
A light JavaScript framework for ZeppOS, be maked to solve the rubbish widget system in native ZeppOS.

# Languagues
- English (current)
- [Chinese](https://github.com/jwhgzs/vepp/blob/master/README.chinese.md)

# Before start
You have to know, in ZeppOS, there are so many hard-to-solve limits:

- `eval()` and `new Function()`'s limits
- Rubbish widget system
- Rubbish running efficiency

But maybe you don't believe, Vepp solves them:

- Skip `new Function()`'s limit by a special way
- Build a pefect widget system in your favourite way
- Make codes short, easy and fast

Now, start learning and enjoy!

# Quick start
```javascript
import Vepp from 'vepp'

Page({
    build() {
        let { data: t } = new Vepp({
            // use VML (Vepp Markup Language) to create widgets and set their properties or events declaratively:
            // #TAG    propName: expression, '@eventName': expression, ...
            // in fact, the part after `#TAG` is just like JSON!
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
        
        // use `veppIns.data.xxx` to get or set your reactive variables
        // by the way, Vepp prepare polyfills for you. you can use some functions like `setInterval()` freely!
        setInterval(function () {
            t.mytext = 'Random: ' + (Math.random() * 100).toFixed()
        }, 1000)
    }
})
```