declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmSensor {
      interface HmSensorTagWidgetMap {
        // 控件
        time: [IHmSensorOptions, IHmSensorWidget]
        battery: [IHmSensorOptions, IHmSensorWidget]
        step: [IHmSensorOptions, IHmSensorWidget]
        calories: [IHmSensorOptions, IHmSensorWidget]
        heart: [IHmSensorOptions, IHmSensorWidget]
        PAI: [IHmSensorOptions, IHmSensorWidget]
        distance: [IHmSensorOptions, IHmSensorWidget]
        stand: [IHmSensorOptions, IHmSensorWidget]
        weather: [IHmSensorOptions, IHmSensorWidget]
        activity: [IHmSensorOptions, IHmSensorWidget]
        fatButting: [IHmSensorOptions, IHmSensorWidget]
        sun: [IHmSensorOptions, IHmSensorWidget]
        wind: [IHmSensorOptions, IHmSensorWidget]
        pressure: [IHmSensorOptions, IHmSensorWidget]
        spo2: [IHmSensorOptions, IHmSensorWidget]
        bodyTemp: [IHmSensorOptions, IHmSensorWidget]
        stress: [IHmSensorOptions, IHmSensorWidget]
      }

      type ISensorWidgetFactory = {
        [k in keyof HmSensorTagWidgetMap]: (
          opts: HmSensorTagWidgetMap[k][0],
        ) => HmSensorTagWidgetMap[k][1]
      }
    }
  }
}

declare let s: HmWearableProgram.DeviceSide.HmSensor.ISensorWidgetFactory
