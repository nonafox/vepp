import Vepp from '../src'

Page({
    build() {
        let { data: t } = new Vepp({
            ui: `
                #TEXT    text: mytext, align_h: w * 0.5, align_v: h, color: 0xffffff
            `,
            data: {
                w: hmSetting.getDeviceInfo().width,
                h: hmSetting.getDeviceInfo().height,
                mytext: 'hello, world'
            }
        })
        setInterval(function () {
            t.mytext = (Math.random() * 100).toFixed() + ''
        }, 1000)
    }
})