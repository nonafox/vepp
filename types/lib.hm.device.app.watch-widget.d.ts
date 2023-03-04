declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace WatchWidget {
      type WatchWidgetOptions<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = Partial<ILifeCycle> &
        ThisType<InstanceMethods & InstanceProperties> &
        Data<TData> &
        TCustom

      type WatchWidgetInstance<
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
        _options: WatchWidgetOptions
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
        (opts: WatchWidgetOptions): void
      }
    }
  }
}

// type WatchWidgetOptions = Partial<{
//   state: Record<string, unknown>
//   onInit: () => void
//   onReady: () => void
//   onShow: () => void
//   onHide: () => void
//   onDestroy: () => void
//   build(vm: IWatchWidget): IWidget
//   [k: string]: unknown
// }>

// interface IWatchWidget extends WatchWidgetOptions {
//   _options: WatchWidgetOptions
//   setState: (state: Record<string, unknown>) => void
//   _render: (vm: IWatchWidget) => IWidget[]
//   getWatchWidget: () => IWatchWidget
// }

declare let WatchWidget: HmWearableProgram.DeviceSide.WatchWidget.Constructor
