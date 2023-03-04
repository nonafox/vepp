declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace AppContext {
      interface HmApi {
        getApp(): App.AppInstance
        getPid(): number
      }

      interface HmAppModule {
        id: number
        module:
          | WatchWidget.WatchWidgetInstance
          | AppWidget.AppWidgetInstance
          | Page.PageInstance
          | WatchFace.WatchFaceInstance
          | SecondaryWidget.SecondaryWidgetInstance
      }

      interface HmAppContext {
        pid: number
        app: App.AppInstance
        router: AppRouter.IRouter
        current: HmAppModule
      }
    }
  }
}

declare let __$$app$$__: HmWearableProgram.DeviceSide.AppContext.HmAppContext
declare let __$$module$$__: HmWearableProgram.DeviceSide.AppContext.HmAppModule
