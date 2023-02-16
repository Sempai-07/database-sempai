import * as fs from "fs";
import * as path from "path";
import { EventEmitter } from "events";
import { get, set, keys, val } from "./function/index.js";
import { encryptions } from "../util/encryptions.js";
import { decoding } from "../util/decoding.js";
import { DatabaseError } from "../util/DatabaseError.js";
export class CreateSql extends EventEmitter {
    constructor(options) {
        super();
        this.path = options.path || "database",
            this.table = options.table || ["main"],
            this.key = options.key;
        if (fs.existsSync(path.join(process.cwd(), this.path)) === false) {
            fs.mkdirSync(path.join(process.cwd(), this.path));
        }
        let table_file = this.table;
        for (var i = 0; i < table_file.length; i++) {
            if (fs.existsSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`)) === false) {
                fs.mkdirSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`));
            }
            if (fs.existsSync(path.join(process.cwd(), this.path, table_file[i], "storage.sql")) === false) {
                fs.writeFileSync(path.join(process.cwd(), this.path, table_file[i], "storage.sql"), "{}");
            }
        }
    }
    set(table, key, value, encryption = false) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        let values = value;
        if (encryption) {
            if (!this.key)
                throw new DatabaseError("You need to specify 'key' in the class CreateSql");
            db[key] = new Object({ "key": key, "value": encryptions(values, this.key) });
        }
        else if (encryption === false) {
            db[key] = new Object({ "key": key, "value": values });
        }
        else {
            console.log(new TypeError("Invalid type 'set'"));
        }
        set("storage.sql", table, this.path, db);
    }
    get(table, key, encryption = "default") {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        let values = db[key]['value'];
        if (encryption === true) {
            if (!this.key)
                throw new DatabaseError("You need to specify 'key' in the class CreateSql");
            return encryptions(values, this.key);
        }
        else if (encryption === false) {
            if (!this.key)
                throw new DatabaseError("You need to specify 'key' in the class CreateJson");
            return decoding(values, this.key);
        }
        else if (encryption === "default") {
            return values;
        }
        else {
            console.log(new TypeError("Invalid type 'get'"));
        }
    }
    all(table) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        return db;
    }
    add(table, key, value, encryption = false) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        let oldValue = db[key]['value'];
        let values = value;
        if (encryption) {
            if (!this.key)
                throw new DatabaseError("You need to specify 'key' in the class CreateSql");
            db[key] = new Object({ "key": key, "value": oldValue + encryptions(value, this.key) });
        }
        else if (encryption === false) {
            db[key] = new Object({ "key": key, "value": oldValue + value });
        }
        else {
            console.log(new TypeError("Invalid type 'get'"));
        }
        set("storage.sql", table, this.path, db);
    }
    delete(table, key, oldValue) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        let values = db[key]['value'];
        delete db[key];
        set("storage.sql", table, this.path, db);
        if (oldValue) {
            return values;
        }
    }
    deleteAll(table) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        fs.writeFileSync(path.join(process.cwd(), this.path, table, "storage.sql"), "{}");
    }
    has(table, key) {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        return db[key] === undefined ? false : true;
    }
    info(table, type = 'ping') {
        if (!this.table.find(a => a === table))
            throw new DatabaseError("Invalid table name: " + table);
        let db = get("storage.sql", table, this.path);
        const start = Date.now();
        if (type === 'keys')
            return keys(db);
        else if (type === 'values')
            return val(db);
        else if (type === 'count')
            return keys(db).length;
        else if (type === 'ping')
            return Date.now() - start;
        else
            console.log(new TypeError("Invalid type info"));
    }
    isTable(table) {
        return this.table.find(a => a === table) === undefined ? false : true;
    }
    get Events() {
        return {
            READY: "ready"
        };
    }
    connect() {
        this.emit(this.Events.READY);
    }
}
//# sourceMappingURL=CreateSql.js.map