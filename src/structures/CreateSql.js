const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const cipher = require("../util/cipher.js");
const decoding = require("../util/decoding.js");
const DatabaseError = require("../util/DatabaseError.js");

const keys = (obj) => {
   if (typeof(obj) === 'object') return Object.keys(obj)
   else return [];
};

const valuess = (obj) => {
   if (typeof(obj) === 'object') return Object.values(obj)
   else return [];
};

const get = (table, dir) => {
  let db = fs.readFileSync(path.join(process.cwd(), dir, table, "storage.sql"), "utf8");
      db = typeof db == "string" ? JSON.parse(db) : db;
    return db;
};

const set = (table, dir, db, encryption = false) => {
  let content = JSON.stringify(db);
    fs.writeFileSync(path.join(process.cwd(), dir, table, "storage.sql"), content);
};
    
class CreateSql extends EventEmitter {
  constructor(options) {
    super();
    this.path = options.path || "database",
    this.table = options.table || ["main"],
    this.key = options.key;
    // Эта строка отвечает за кодеровку текста, точнее это ключ. Это необязательно, если вы не укажете это, оно будет отключено, иначе будет включено шифрование данных (значение), если вы потеряли/забыли свой ключ, вы потеряете свои данные
    
    if (fs.existsSync(path.join(process.cwd(), this.path)) === false) {
      fs.mkdirSync(path.join(process.cwd(), this.path));
    }
    let table_file = this.table;
    if(Array.isArray(table_file)) {
    for (var i = 0; i < table_file.length; i++) {
      if (fs.existsSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`)) === false) {
        fs.mkdirSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`));
      }
      if (fs.existsSync(path.join(process.cwd(), this.path, table_file[i], "storage.sql")) === false) {
          fs.writeFileSync(path.join(process.cwd(), this.path, table_file[i], "storage.sql"), "{}");
      }
      // параметр table указывайте в []
    }
    } else {
      console.log(new DatabaseError("Invalid array table"));
      process.exit();
    }
    }

  set(table, key, value,  encryption = false) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    let values = value;
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateSql");
      db[key] = new Object({"key": key, "value": cipher(values, this.key)});
    } else if (encryption === false) {
      db[key] = new Object({"key": key, "value": values});
    } else {
      console.log(new TypeError("Invalid type 'set'"));
    }
    set(table, this.path, db);
    // Эта функция создаёт или же меняет содержимое переменной
    // table - таблица
    // key - название переменной у которой мы хотим изменить значение
    // value - новое значение переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  get(table, key, encryption = "default") {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    let values = db[key]['value'];
    if (encryption === true) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateSql");
      return cipher(values, this.key);
    } else if (encryption === false) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      return decoding(values, this.key);
    } else if (encryption === "default") {
      return values;
    } else {
      console.log(new TypeError("Invalid type 'get'"));
    }
    // Эта функция выдаёт содержимое переменнои
    // table - таблица
    // key - название переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false - разшифровать, normal - выдаст просто значение
  }
  
  all(table) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    return db;
    // table - название таблицы у которой мы хотим вывести всё содержимое в json формате
  }
  
  add(table, key, value, encryption = false) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    let oldValue = db[key]['value'];
    let values = value;
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateSql");
      db[key] = new Object({"key": key, "value": oldValue + cipher(value, this.key)});
    } else if (encryption === false) {
      db[key] = new Object({"key": key, "value": oldValue + value});
    } else {
      console.log(new TypeError("Invalid type 'get'"));
    }
    set(table, this.path, db);
    // Эта функция додаёт новое значение, не изменяя старое
    // table - таблица
    // key - название переменной для которой мы будем добавлять содержимое
    // value - новое содержимое которое будет добавлено к старому
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  delete(table, key, oldValue) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    let values = db[key]['value'];
    delete db[key];
    set(table, this.path, db);
    if (oldValue) {
      return values;
    }
    // Эта функция удаляет переменною с таблицы
    // table - таблица
    // key - название переменной
    // oldValue - если вы хотите вернуть в последний раз значение переменной, укажите true, если нет false (необязательно)
  }
  
  deleteAll(table) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    fs.writeFileSync(path.join(process.cwd(), this.path, table, "storage.sql"), "{}");
    // Эта функция удалит всё содержимое таблицы. Будьте осторожны
  }
  
  has(table, key) {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    return db[key] === undefined ? false : true;
    // Эта функция проверяет, существует ли указанная переменная, выдаёт логическое выражение:
    // true - указанная переменная существует
    // false - указанная переменная не существует
    // table - таблица
    // key - название переменной
  }
  
  info(table, type = 'ping') {
    if(!this.table.find(a => a === table)) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    const start = Date.now();
    if (type === 'keys') return keys(db)
    else if (type === 'values') return valuess(db)
    else if (type === 'count') return keys(db).length
    else if (type === 'ping') return Date.now() - start
    else console.log(new TypeError("Invalid type info"));
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
        // Если вы хотите чтобы событие "ready" сработало, нужно в конце вашего кода вставить <Data>.connect()
  }
  
module.exports = CreateSql;