declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace WatchFace {
      type WatchFaceOptions<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = Partial<ILifeCycle> &
        ThisType<InstanceMethods & InstanceProperties> &
        Data<TData> &
        TCustom

      type WatchFaceInstance<
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
        _options: WatchFaceOptions
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
        (opts: WatchFaceOptions): void
      }
    }
  }
}

// type WatchFaceOptions = Partial<{
//   state: Record<string, unknown>
//   onInit: () => void
//   onReady: () => void
//   onShow: () => void
//   onHide: () => void
//   onDestroy: () => void
//   build(vm: IWatchFace): IWidget
//   [k: string]: unknown
// }>

// interface IWatchFace extends WatchFaceOptions {
//   _options: WatchFaceOptions
//   setState: (state: Record<string, unknown>) => void
//   _render: (vm: IWatchFace) => IWidget[]
//   getWatchFace: () => IWatchFace
// }

declare let WatchFace: HmWearableProgram.DeviceSide.WatchFace.Constructor
