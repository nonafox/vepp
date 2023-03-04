declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace AppWidget {
      type AppWidgetOptions<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = Partial<ILifeCycle> &
        ThisType<InstanceMethods & InstanceProperties> &
        Data<TData> &
        TCustom

      type AppWidgetInstance<
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
        _options: AppWidgetOptions
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
        (opts: AppWidgetOptions): void
      }
    }
  }
}

declare let AppWidget: HmWearableProgram.DeviceSide.AppWidget.Constructor
