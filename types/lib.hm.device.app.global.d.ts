declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace Global {
      interface HmAppManager {
        apps: AppContext.HmAppContext[]
        currentApp: AppContext.HmAppContext
      }
    }
  }
}

declare const __$$hmAppManager$$__: HmWearableProgram.DeviceSide.Global.HmAppManager
