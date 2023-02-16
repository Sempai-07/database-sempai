import * as fs from "fs"
import * as path from "path"
export function set(file: string, table: string, dir: string, db: any, encryption = false) {
 let content = JSON.stringify(db);
 fs.writeFileSync(path.join(process.cwd(), dir, table, file), content);
}