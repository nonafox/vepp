declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace AppRouter {
      interface IHmAppStartParams {
        appid: number
      }

      interface IHmAppGoToParams {
        file: string
        params: string
      }
      interface IHmAppFunction {
        startApp(params: IHmAppStartParams): void
        gotoPage(params: IHmAppGoToParams): void
        goBack(): void
      }

      type Dictionary<T> = { [key: string]: T }
      interface Location {
        path: string
        // query?: Dictionary<string | (string | null)[] | null | undefined>
        params?: Dictionary<string>
      }

      interface IRouter {
        push: (location: Location) => void
        replace: (location: Location) => void
        go: () => void
      }
    }
  }
}

declare let hmApp: HmWearableProgram.DeviceSide.AppRouter.IHmAppFunction
