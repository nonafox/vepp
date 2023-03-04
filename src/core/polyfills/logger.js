import { getGlobal } from './global.js'

let globalNS = getGlobal()

if (!globalNS.Logger) {
  if (typeof DeviceRuntimeCore !== 'undefined') {
    globalNS.Logger = DeviceRuntimeCore.HmLogger
  } else {
    if (typeof Logger !== 'undefined') {

    }
    // console.connect = () => {
    //   // pass
    // }
    // globalNS.Logger = {
    //   getLogger() {
    //     return console
    //   },
    // }
  }
}
