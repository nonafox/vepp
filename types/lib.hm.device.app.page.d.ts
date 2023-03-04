declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace Page {
      type PageOptions<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = Partial<ILifeCycle> &
        ThisType<InstanceMethods & InstanceProperties> &
        Data<TData> &
        TCustom

      type PageInstance<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = OptionalInterface<ILifeCycle> &
        InstanceProperties &
        InstanceMethods &
        Data<TData> &
        TCustom

      interface ILifeCycle {
        onInit: () => void
        onDataRestore?: () => void
        build: () => void
        onDataSave?: () => void
        onDestroy: () => void
      }

      interface InstanceProperties {
        _options: PageOptions
      }

      interface InstanceMethods {
        build: () => void
      }

      interface Data<D extends DataOption> {
        state: D
      }

      type DataOption = Record<string, any>
      type CustomOption = Record<string, any>

      type Constructor = {
        (opts: PageOptions): void
      }
    }
  }
}

// type PageOptions = Partial<{
//   state: Record<string, unknown>
//   onInit: () => void
//   onReady: () => void
//   onShow: () => void
//   onHide: () => void
//   onDestroy: () => void
//   build(vm: IPage): IWidget
//   [k: string]: unknown
// }>

// interface IPage extends PageOptions {
//   _options: PageOptions
//   setState: (state: Record<string, unknown>) => void
//   _render: (vm: IPage) => IWidget[]
//   getPage: () => IPage
// }

declare let Page: HmWearableProgram.DeviceSide.Page.Constructor
