import * as fs from "fs"
import * as path from "path"
import { EventEmitter } from "events"
import { get, set, keys, val } from "./function/index.js"
import { encryptions } from "../util/encryptions.js"
import { decoding } from "../util/decoding.js"
import { DatabaseError } from "../util/DatabaseError.js"

    
export class CreateJson extends EventEmitter {
 path: string
 table: string[]
 key?: string
  constructor(options: any) {
    super();
    this.path = options.path || ["database"],
    this.table = options.table || ["main"],
    this.key = options.key;
    // Эта строка отвечает за кодеровку текста, точнее это ключ. Это необязательно, если вы не укажете это, оно будет отключено, иначе будет включено шифрование данных (значение), если вы потеряли/забыли свой ключ, вы потеряете свои данные

    if (fs.existsSync(path.join(process.cwd(), this.path)) === false) {
      fs.mkdirSync(path.join(process.cwd(), this.path));
    }
    let table_file = this.table;
    for (var i = 0; i < table_file.length; i++) {
      if (fs.existsSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`)) === false) {
        fs.mkdirSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`));
      }
      if (fs.existsSync(path.join(process.cwd(), this.path, table_file[i], "storage.json")) === false) {
          fs.writeFileSync(path.join(process.cwd(), this.path, table_file[i], "storage.json"), "{}");
      }
      // параметр table указывайте в []
      }
  }

  set(table: string, key: string, value: any, encryption: boolean = false) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      db[key] = encryptions(value, this.key);
    } else if (encryption === false) {
      db[key] = value;
    } else {
      console.log(new TypeError("Invalid type 'set'"));
    }
    set("storage.json", table, this.path, db);
    // Эта функция создаёт или же меняет содержимое переменной
    // table - таблица
    // key - название переменной у которой мы хотим изменить значение
    // value - новое значение переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  get(table: string, key: string, encryption: any = 'default') {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    if (encryption === true) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      return encryptions(db[key], this.key);
    } else if (encryption === false) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      return decoding(db[key], this.key);
    } else if (encryption === "default") {
      return db[key];
    } else {
      console.log(new TypeError("Invalid type 'get'"));
    }
    // Эта функция выдаёт содержимое переменнои
    // table - таблица
    // key - название переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false - разшифровать, normal - выдаст просто значение
  }
  
  all(table: string) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    return db;
    // table - название таблицы у которой мы хотим вывести всё содержимое в json формате
  }
  
  add(table: string, key: string, value: any, encryption: boolean = false) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      db[key] = encryptions(value, this.key) + db[key];
    } else if (encryption === false) {
      db[key] = value + db[key];
    } else {
      console.log(new TypeError("Invalid type 'add'"));
    }
    set("storage.json", table, this.path, db);
    // Эта функция додаёт новое значение, не изменяя старое
    // table - таблица
    // key - название переменной для которой мы будем добавлять содержимое
    // value - новое содержимое которое будет добавлено к старому
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  delete(table: string, key: string, oldValue: boolean) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    let values = db[key];
    delete db[key];
    set("storage.json", table, this.path, db);
    if (oldValue) {
      return values;
    }
    // Эта функция удаляет переменною с таблицы
    // table - таблица
    // key - название переменной
    // oldValue - если вы хотите вернуть в последний раз значение переменной, укажите true, если нет false (необязательно)
  }
  
  deleteAll(table: string) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
      fs.writeFileSync(path.join(process.cwd(), this.path, table, "storage.json"), "{}");
    // Эта функция удалит всё содержимое таблицы. Будьте осторожны
  }
  
  has(table: string, key: string) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    return db[key] === undefined ? true : false;
    // Эта функция проверяет, существует ли указанная переменная, выдаёт логическое выражение:
    // true - указанная переменная существует
    // false - указанная переменная не существует
    // table - таблица
    // key - название переменной
  }
  
  info(table: string, type: string = 'ping') {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get("storage.json", table, this.path);
    const start = Date.now();
    if (type === 'keys') return keys(db)
    else if (type === 'values') return val(db)
    else if (type === 'count') return keys(db).length.toString()
    else if (type === 'ping') return (Date.now() - start).toString()
    else console.log(new TypeError("Invalid type 'info'"));
  }
  
  isTable(table: string) {
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
        // Если вы хотите чтобы событие "ready" сработало, нужно в конце вашего кода вставить <Data>.connect()
  }