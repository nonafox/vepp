export const DEVICE_WIDTH = hmSetting.getDeviceInfo().width
export const DEVICE_HEIGHT = hmSetting.getDeviceInfo().height

export const needToFuckWidgets = [
    'button', 'fill_rect', 'radio_group', 'checkbox_group'
]
export const defaultConfig: { [k: string]: { [k2: string]: any } } = {
    '': {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT
    },
    TEXT: {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        color: 0xffffff
    },
    BUTTON: {
        x: 0,
        y: 0,
        w: 100,
        h: 40
    }
}