declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace SecondaryWidget {
      type SecondaryWidgetOptions<
        TData extends DataOption = DataOption,
        TCustom extends CustomOption = CustomOption,
      > = Partial<ILifeCycle> &
        ThisType<InstanceMethods & InstanceProperties> &
        Data<TData> &
        TCustom

      type SecondaryWidgetInstance<
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
        _options: SecondaryWidgetOptions
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
        (opts: SecondaryWidgetOptions): void
      }
    }
  }
}

declare let SecondaryWidget: HmWearableProgram.DeviceSide.SecondaryWidget.Constructor
