declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmSensor {
      interface IHmSensorType {
        TIME: number
        BATTERY: number
        STEP: number
        CALORIE: number
        HEART: number
        PAI: number
        DISTANCE: number
        STAND: number
        WEATHER: number
        ACTIVITY: number
        FAT_BURRING: number
        SUN: number
        WIND: number
        PRESSURE: number
        SPO2: number
        BODY_TEMP: number
        STRESS: number
      }

      interface IHmSensorEventType {
        UPDATE: number
        CHANGE: number
      }

      type HmSensorEventType = number

      interface IHmSensorOptions {
        [k: string]: any
        frequency?: number
        current?: number
        target?: number
      }

      interface HmSensorCallback {
        (args: any): void
      }

      interface IHmSensorWidget {
        name: string
        addEventListener(type: HmSensorEventType, callback: HmSensorCallback): void
        removeEventListener(type: HmSensorEventType, callback: HmSensorCallback): void
        start(): void
        stop(): void
      }

      type HmSensorWidgetType = number

      interface IHmSensorFunction {
        createSensor(id: HmSensorWidgetType, options: IHmSensorOptions): IHmSensorWidget
        deleteSensor(sensor: IHmSensorWidget): void

        appContext: DeviceSide.AppContext.HmAppContext
        moduleContext: DeviceSide.AppContext.HmAppModule
      }

      interface IHmSensor extends IHmSensorFunction {
        id: IHmSensorType
        event: IHmSensorEventType
      }
    }
  }
}

declare let hmSensor: HmWearableProgram.DeviceSide.HmSensor.IHmSensor
