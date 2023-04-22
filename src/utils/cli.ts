import fs from 'fs'

export class CLIUtil {
    public static priorAttrs: string[] = ['ok_text', 'cancel_text']
    public static laterAttrs: string[] = ['init']

    public static delDir(path: string): void {
        let arr = fs.readdirSync(path)
        for (let k in arr) {
            let v = path + '/' + arr[k]
            if (fs.statSync(v).isDirectory()) {
                this.delDir(v)
            }
            else {
                fs.unlinkSync(v)
            }
        }
        fs.rmdirSync(path)
    }
}