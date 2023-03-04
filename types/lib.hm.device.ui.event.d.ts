declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmUI {
      interface IHmUIEventType {
        CLICK_UP: number
        CLICK_DOWN: number
        MOVE_IN: number
        MOVE_OUT: number
      }

      interface IHmUIEvent {
        x: number
        y: number
        type: HmUIEventType
        target: IHmUIWidget
      }

      interface IHmUIEventListener {
        (evnet: IHmUIEvent): void
      }

      type HmUIEventType = number
    }
  }
}
