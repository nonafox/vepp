declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace Selector {
      interface ProxyWidget {
        getId(): number
        getType(): number
        on(): void
        off(): void
        trigger(): void
        setVisibility(show: boolean): boolean
        getVisibility(): boolean
        [k: string]: any
      }

      interface ISelector {
        (id: string, context: any): ProxyWidget
        (ele: HmUI.IHmUIWidget | HmUI.IHmUIWidget[], context: any): ProxyWidget
      }
    }
  }
}

declare let $: HmWearableProgram.DeviceSide.Selector.ISelector
