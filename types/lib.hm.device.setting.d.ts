declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmSetting {
      interface Screen {
        width: number,
        height: number
      }

      interface IHmSetting {
        getLanguage: () => number
        getDeviceInfo: () => Screen
      }
    }
  }
}

declare let hmSetting: HmWearableProgram.DeviceSide.HmSetting.IHmSetting
