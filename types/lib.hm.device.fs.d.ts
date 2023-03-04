declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace FS {
      interface IHmFsFlagType {
        O_RDWR: number
        O_CREAT: number
        O_TRUNC: number
        SEEK_SET: number
      }

      interface IHmFsFunction {
        open: (name: string, flag: number) => number
        close: (fd: number) => void
        seek: (fd: number, pos: number, whence: number) => void
        read: (fd: number, pos: number, buff: ArrayBuffer, len: number | undefined) => void
        write: (fd: number, pos: number, buff: ArrayBuffer, len: number | undefined) => void
        remove: (name: string) => void
        rename: (name: string, new_name: string) => void
        mkdir: (name: string) => void
        readdir: (name: string) => void
      }

      interface IHmFs extends IHmFsFlagType, IHmFsFunction {}
    }
  }
}
declare let hmFS: HmWearableProgram.DeviceSide.FS.IHmFs
