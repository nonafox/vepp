const glob: any = globalThis

if (! glob.Buffer)
    glob.Buffer = DeviceRuntimeCore.Buffer
if (! glob.Logger)
    glob.Buffer = DeviceRuntimeCore.HmLogger

if (! glob.setTimeout) {
    glob.setTimeout = (func: Function, interval: number = 1) => {
        const tmp = timer.createTimer(
            interval,
            Number.MAX_SAFE_INTEGER,
            () => {
                glob.clearTimeout(tmp)
                func()
            },
            {}
        )
        return tmp
    }
    glob.setInterval = (func: Function, interval: number) => {
        return timer.createTimer(
            1,
            interval,
            () => func(),
            {}
        )
    }
    glob.setImmediate = (func: Function) => glob.setTimeout(func)
    glob.clearTimeout = glob.clearInterval = glob.clearImmediate = (ref: any) => timer.stopTimer(ref)
}

const functionCtor: any = (function () {}).constructor
glob.Function = function (...args) {
    return new functionCtor(...args)
} as FunctionConstructor

const consoleTime: { [_: string]: number } = {}
glob.console.time = function (tag: string) {
    if (tag in consoleTime)
        console.log(`Timer '${tag}' already exists`)
    consoleTime[tag] = new Date().valueOf()
}
glob.console.timeEnd = function (tag: string) {
    if (! (tag in consoleTime)) {
        console.log(`Timer '${tag}' does not exist`)
    }
    else {
        console.log(`${tag}: ${new Date().valueOf() - consoleTime[tag]} ms`)
        delete consoleTime[tag]
    }
}