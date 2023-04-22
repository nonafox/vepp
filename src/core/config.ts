import { T_FREE } from '../utils/general'

export const DEVICE_WIDTH = hmSetting.getDeviceInfo().width
export const DEVICE_HEIGHT = hmSetting.getDeviceInfo().height

export const needToFuckWidgets = [
    'button', 'fill_rect', 'radio_group', 'checkbox_group', 'slide_switch'
]
export const needToFuckProps = [
    'x', 'y', 'w', 'h', 'slide_select_x', 'slide_un_select_x'
]
export const defaultConfig: { [_: string]: T_FREE } = {
    '': {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT
    },
    text: {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        color: 0xffffff
    },
    button: {
        x: 0,
        y: 0,
        w: 100,
        h: 40
    },
    slide_switch: {
        x: 0,
        y: 0,
        w: 96,
        h: 64,
        slide_select_x: 40,
        slide_un_select_x: 8
    }
}