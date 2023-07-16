import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import { cipher } from "../util/cipher.js";
import { decoding } from "../util/decoding.js";
import {
  ErrorType,
  ErrorKey,
  ErrorExtension,
  ErrorTable,
} from "../util/ErrorCollection.js";

function keys(obj: any): any[] {
  if (typeof obj === "object") return Object.keys(obj);
  else return [];
}

function valuess(obj: any): any[] {
  if (typeof obj === "object") return Object.values(obj);
  else return [];
}

async function get(table: string, dir: string, extname: string): Promise<any> {
  const filePath = path.join(process.cwd(), dir, table, "storage" + extname);
  try {
    let data = await fs.promises.readFile(filePath, "utf8");
    data = typeof data == "string" ? JSON.parse(data) : data;
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

async function set(
  table: string,
  dir: string,
  db: any,
  extname: string,
  encryption = false
): Promise<void> {
  const content = JSON.stringify(db);
  const filePath = path.join(process.cwd(), dir, table, "storage" + extname);
  try {
    await fs.promises.writeFile(filePath, content);
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

class CreateStorage<K, V> extends EventEmitter {
  path: string;
  table: string[];
  extname: string;
  key: string;
  constructor(options?: {
    path?: string;
    table?: string[];
    extname?: string;
    key?: string;
  }) {
    super();
    (this.path = options?.path ?? "database"),
      (this.table = options?.table ?? ["main"]),
      (this.extname = options?.extname ?? ".sql");
    this.key = options?.key as string;

    if (fs.existsSync(path.join(process.cwd(), this.path)) === false) {
      fs.promises.mkdir(path.join(process.cwd(), this.path));
    }
    let table_file: string[] = this.table;
    if (Array.isArray(table_file) === false)
      throw new ErrorTable("Invalid table array");
    if (!this.extname) throw new ErrorExtension("Invalid extension");

    for (var i = 0; i < table_file.length; i++) {
      if (
        fs.existsSync(
          path.join(process.cwd(), `${this.path}/${table_file[i]}`)
        ) === false
      ) {
        fs.promises.mkdir(
          path.join(process.cwd(), `${this.path}/${table_file[i]}`)
        );
      }
      if (
        fs.existsSync(
          path.join(
            process.cwd(),
            this.path,
            table_file[i],
            `storage${this.extname}`
          )
        ) === false
      ) {
        fs.promises.writeFile(
          path.join(
            process.cwd(),
            this.path,
            table_file[i],
            `storage${this.extname}`
          ),
          "{}"
        );
      }
    }
  }

  async set(table: string, key: K, value: V, encryption = false) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const getValue = await this.get(table, key);
    let db = await get(table, this.path, this.extname);
    let values = value;
    if (encryption) {
      if (!this.key)
        throw new ErrorKey(
          "You need to specify 'key' in the class CreateStorage"
        );
      db[key] = new Object({
        key: key,
        value: cipher(values as string, this.key),
      });
    } else if (encryption === false) {
      db[key] = new Object({
        key: key,
        value: values,
      });
    } else {
      throw new ErrorType("Invalid type 'set'");
    }
    const newValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: value,
      encryption: encryption,
    };
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: getValue,
    };
    await set(table, this.path, db, this.extname);
    this.emit("update", newValue, oldValue);
  }

  async get(table: string, key: K, encryption: string | boolean = "default") {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = await get(table, this.path, this.extname);
    if (await this.has(table, key)) {
      let values = db[key]["value"];
      if (encryption === true) {
        if (!this.key)
          throw new ErrorKey(
            "You need to specify 'key' in the class CreateStorage"
          );
        return await cipher(values, this.key);
      } else if (encryption === false) {
        if (!this.key)
          throw new ErrorKey(
            "You need to specify 'key' in the class CreateStorage"
          );
        return await decoding(values, this.key);
      } else if (encryption === "default") {
        return await values;
      } else {
        throw new ErrorType("Invalid type 'get'");
      }
    } else {
      return undefined;
    }
  }

  async all(table: string) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = await get(table, this.path, this.extname);
    return db;
  }

  async findByValue(
    table: string,
    query: any,
    encryption: string | boolean = "default"
  ) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = await get(table, this.path, this.extname);
    let result: any[] = [];
    for (const key in db) {
      let value = db[key]["value"];
      if (encryption === true) {
        if (!this.key)
          throw new ErrorKey(
            "You need to specify 'key' in the class CreateStorage"
          );
        value = decoding(value, this.key);
      }
      if (typeof value === "string" && value.includes(query)) {
        result = result.concat(db[key]);
      }
    }
    return result;
  }

  async add(table: string, key: K, value: V, encryption = false) {
    if (!this.table.find((a) => a === table))
      throw new ErrorType("Invalid table name: " + table);
    const getValue = await this.get(table, key);
    let db = await get(table, this.path, this.extname);
    let oldValues = db[key]["value"];
    let values = value;
    if (encryption) {
      if (!this.key)
        throw new ErrorKey(
          "You need to specify 'key' in the class CreateStorage"
        );
      db[key] = new Object({
        key: key,
        value: oldValues + cipher(value as string, this.key),
      });
    } else if (encryption === false) {
      db[key] = new Object({
        key: key,
        value: oldValues + value,
      });
    } else {
      throw new ErrorType("Invalid type 'get'");
    }
    const newValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: oldValues + value,
      encryption: encryption,
    };
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: getValue,
    };
    set(table, this.path, db, this.extname);
    this.emit("update", newValue, oldValue);
  }

  async delete(table: string, key: K, oldValues: boolean) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = await get(table, this.path, this.extname);
    let values = await this.get(table, key);
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: values,
    };
    delete db[key];
    await set(table, this.path, db, this.extname);
    this.emit("delete", oldValue);
    if (oldValues) {
      return values;
    }
  }

  async clear(table: string) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = {};
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      value: this.all(table),
    };
    await set(table, this.path, db, this.extname);
    this.emit("deleteAll", oldValue);
  }

  async has(table: string, key: K) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    let db = await get(table, this.path, this.extname);
    return db[key] === undefined ? false : true;
  }

  async forEach(table: string, callback: (value: V, key: K, db: any) => void) {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    for (const key in db) {
      const value = db[key].value;
      callback(value, key as K, db);
    }
  }

  async filter(
    table: string,
    filterFn: (value: V, key: K, db: any) => boolean
  ): Promise<[K, V][]> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const filteredEntries: [K, V][] = [];

    for (const key in db) {
      const value = db[key].value;
      if (filterFn(value, key as K, db)) {
        filteredEntries.push([key as K, value]);
      }
    }

    return filteredEntries;
  }

  async at(table: string, key: K): Promise<V | any[] | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    if (db[key]?.value !== undefined) {
      return db[key]?.value;
    } else if (typeof key === "number") {
      let res: any[] = [];
      for (const key in db) {
        const value = db[key]?.value;
        res.push({ key, value });
      }
      return res.at(key);
    }
  }

  async randomAt(table: string): Promise<V | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const keys = Object.keys(db);
    if (keys.length === 0) return undefined;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return db[randomKey]?.value;
  }

  async endKey(table: string): Promise<K | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const keys = Object.keys(db);
    return keys.length > 0 ? (keys.at(-1) as K) : undefined;
  }

  async endValue(table: string): Promise<V | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const values = Object.values(db);
    return values.length > 0
      ? (values.at(-1) as { value: V; key: K }).value
      : undefined;
  }

  async firtsKey(table: string): Promise<K | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const keys = Object.keys(db);
    return keys.length > 0 ? (keys.at(0) as K) : undefined;
  }

  async firtsValue(table: string): Promise<V | undefined> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    const values = Object.values(db);
    return values.length > 0
      ? (values.at(0) as { value: V; key: K }).value
      : undefined;
  }

  async includes(table: string, value: V): Promise<boolean> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    for (const key in db) {
      if (db[key].value === value) {
        return true;
      }
    }
    return false;
  }

  async keys(table: string): Promise<K[]> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    let res: K[] = [];
    for (const key in db) {
      res.push(key as K);
    }
    return res;
  }

  async values(table: string): Promise<V[]> {
    if (!this.table.find((a) => a === table))
      throw new ErrorTable("Invalid table name: " + table);
    const db = await get(table, this.path, this.extname);
    let res: V[] = [];
    for (const key in db) {
      res.push(db[key].value);
    }
    return res;
  }

  async length(table: string): Promise<{ key: number; value: number }> {
    const key = await this.keys(table);
    const value = await this.values(table);
    return { key: key.length, value: value.length };
  }

  get getPath() {
    return this.path;
  }

  hasTable(tableName: string) {
    return this.table.includes(tableName);
  }

  get getTables() {
    return this.table;
  }

  isTable(table: string) {
    return this.table.find((a) => a === table) === undefined ? false : true;
  }

  connect() {
    this.emit("ready");
  }
}

export { CreateStorage };
