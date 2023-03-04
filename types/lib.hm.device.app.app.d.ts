declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace App {
      type AppOptions<TCustom extends CustomOption = CustomOption> = Partial<ILifeCycle> &
        InstanceMethods &
        TCustom

      type AppInstance<TCustom extends CustomOption = CustomOption> =
        OptionalInterface<ILifeCycle> & InstanceProperties & InstanceMethods & TCustom

      interface ILifeCycle {
        onCreate: () => void
        onDestroy: () => void
      }

      interface InstanceProperties {
        _options: AppOptions
      }

      interface InstanceMethods {
        onError: () => void
        onPageNotFound: () => void
        onUnhandledRejection: () => void
      }

      type CustomOption = Record<string, any>

      type Constructor = {
        (opts: AppOptions): void
      }
    }
  }
}

declare let App: HmWearableProgram.DeviceSide.App.Constructor
