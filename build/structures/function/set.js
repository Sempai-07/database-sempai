import * as fs from "fs";
import * as path from "path";
export function set(file, table, dir, db, encryption = false) {
    let content = JSON.stringify(db);
    fs.writeFileSync(path.join(process.cwd(), dir, table, file), content);
}
//# sourceMappingURL=set.js.map