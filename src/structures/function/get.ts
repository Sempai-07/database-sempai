import * as fs from "fs"
import * as path from "path"
export function get(file: string, table: string, dir: string) {
  let db: any = fs.readFileSync(path.join(process.cwd(), dir, table, file), "utf8");
  db = typeof db == "string" ? JSON.parse(db) : db;
    return db;
}