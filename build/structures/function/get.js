import * as fs from "fs";
import * as path from "path";
export function get(file, table, dir) {
    let db = fs.readFileSync(path.join(process.cwd(), dir, table, file), "utf8");
    db = typeof db == "string" ? JSON.parse(db) : db;
    return db;
}
//# sourceMappingURL=get.js.map