import fs from 'fs'

export default {
    delDir(path) {
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