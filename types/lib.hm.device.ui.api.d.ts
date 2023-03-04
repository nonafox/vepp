declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmUI {
      interface IHmUIPropertyType {
        MORE: number
        X: number
        Y: number
        W: number
        H: number
        POS_X: number
        POS_Y: number
        ANGLE: number
        CENTER_X: number
        CENTER_Y: number

        // string
        SRC: number
        // string
        TEXT: number

        // number
        TEXT_SIZE: number

        COLOR: number

        START_ANGLE: number
        END_ANGLE: number
        LINE_WIDTH: number

        LINE_PROGRESS_START_X: number
        LINE_PROGRESS_START_Y: number
        LINE_PROGRESS_END_X: number
        LINE_PROGRESS_END_Y: number
        LINE_PROGRESS_PROGRESS: number

        // string
        LINE_PROGRESS_SRC_BG: number
        // string
        LINE_PROGRESS_SRC_PROGRESS: number
        // string
        LINE_PROGRESS_SRC_INDICATOR: number

        // 省略方式
        // string
        WORD_WRAP: number

        // 指定属性
        // string
        ID: number

        // 用户可以自己存放数据
        // string
        DATASET: number

        // 是否可见
        VISIBLE: number
      }

      interface IHmUIWidgetType {
        GROUP: number
        IMG: number
        TEXT: number
        ARC: number
        FILL_RECT: number
        STROKE_RECT: number
        TEXT_IMG: number
        ARC_PROGRESS: number
        IMG_PROGRESS: number
        IMG_LEVEL: number
        IMG_ANIM: number
        BUTTON: number
        CIRCLE: number
        DIALOG: number

        SCROLL_LIST: number
        SLIDE_SWITCH: number
        CYCLE_LIST: number
        CYCLE_IMAGE_TEXT_LIST: number
        IMG_POINTER: number

        CHECKBOX_GROUP: number
        STATE_BUTTON: number
        RADIO_GROUP: number
      }

      type HmUIAttributeType = number
      type HmUIStyleType = number
      type HmUIPropertyType = number
      type HmUIPropertyValue = string | number | boolean | undefined

      interface IHmUIWidget {
        getId(): number
        getType(): number
        setProperty(prop: HmUIPropertyType, val: HmUIPropertyValue): boolean
        getProperty<T>(prop: HmUIPropertyType): T | undefined
        addEventListener(eventType: HmUIEventType, listener: IHmUIEventListener): boolean
        removeEventListener(eventType?: HmUIEventType, listener?: IHmUIEventListener): boolean
        triggerEvent(eventType: HmUIEventType): boolean
        getVisibility(): boolean
        setVisibility(show: boolean): boolean
      }

      type HmUIWidgetOptions = Record<
        string,
        number | string | IHmUIEventListener | undefined | null | Record<string, any>
      >

      type HmUIWidgetType = number
      interface IHmUIFunction {
        createWidget(widgetType: HmUIWidgetType, options: HmUIWidgetOptions): IHmUIWidget
        deleteWidget(widget: IHmUIWidget): boolean
        destory(): void
        appContext: DeviceSide.AppContext.HmAppContext
        moduleContext: DeviceSide.AppContext.HmAppModule
      }

      interface IHmUIAlign {
        TOP: number
        BOTTOM: number
        LEFT: number
        RIGHT: number
        CENTER_H: number
        CENTER_V: number
      }

      interface IHmUIWrapTextStyle {
        WRAP: number
        CHAR_WRAP: number
        ELLIPSIS: number
        NONE: number
      }
      interface IHmUI extends IHmUIFunction {
        widget: IHmUIWidgetType
        prop: IHmUIPropertyType
        event: IHmUIEventType
        align: IHmUIAlign
        text_style: IHmUIWrapTextStyle
        getRtlLayout(): boolean
        relayoutRtl(): void
      }
    }
  }
}

declare let hmUI: HmWearableProgram.DeviceSide.HmUI.IHmUI
