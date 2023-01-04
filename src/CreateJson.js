const fs = require('fs');
const path = require('path');
const { EventEmitter } = require("events");
const cipher = require("../util/cipher.js");
const decoding = require("../util/decoding.js");
const DatabaseError = require("../util/DatabaseError.js");

const get = (table, dir) => {
  let db = fs.readFileSync(path.join(process.cwd(), dir, table, "storage.json"), "utf8");
    db = typeof db == "string" ? JSON.parse(db) : db;
      return db;
};

const set = (table, dir, db) => {
  let content = JSON.stringify(db);
    fs.writeFileSync(path.join(process.cwd(), dir, table, "storage.json"), content);
};
    
class CreateJson extends EventEmitter {
  constructor(options) {
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
      // параметр table указывайте в [], если нет будет ошибка или же эта хрень не будет работать нормально
    }
  }

  set(table, key, value, encryption = false) {
    let db = get(table, this.path);
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      db[key] = cipher(value, this.key);
    } else {
      db[key] = value;
    }
    set(table, this.path, db);
    // Эта функция создаёт или же меняет содержимое переменной
    // table - таблица
    // key - название переменной у которой мы хотим изменить значение
    // value - новое значение переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  get(table, key, encryption = false) {
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    if (encryption === true) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      return cipher(db[key], this.key);
    } else if (encryption === false) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      return decoding(db[key], this.key);
    } else if (encryption === "normal") {
      return db[key];
    }
    // Эта функция выдаёт содержимое переменнои
    // table - таблица
    // key - название переменной
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false - разшифровать, normal - выдаст просто значение
  }
  
  all(table) {
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    return db;
    // table - название таблицы у которой мы хотим вывести всё содержимое в json формате
  }
  
  add(table, key, value, encryption = false) {
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    if (encryption) {
      if (!this.key) throw new DatabaseError("You need to specify 'key' in the class CreateJson");
      db[key] = cipher(value, this.key) + db[key];
    } else {
      db[key] = value + db[key];
    }
    set(table, this.path, db);
    // Эта функция додаёт новое значение, не изменяя старое
    // table - таблица
    // key - название переменной для которой мы будем добавлять содержимое
    // value - новое содержимое которое будет добавлено к старому
    // encryption - если вы хотите зашифровать значение переменной, указывайте true, если нет false (не необязательно)
  }
  
  delete(table, key, oldValue) {
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    let values = db[key];
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
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
      fs.writeFileSync(path.join(process.cwd(), this.path, table, "storage.json"), "{}");
    // Эта функция удалит всё содержимое таблицы. Будьте осторожны
  }
  
  has(table, key) {
    if(!fs.existsSync(path.join(process.cwd(), this.path, table, "storage.json"))) throw new DatabaseError("Invalid table name: " + table);
    let db = get(table, this.path);
    return db[key] === undefined ? true : false;
    // Эта функция проверяет, существует ли указанная переменная, выдаёт логическое выражение:
    // true - указанная переменная существует
    // false - указанная переменная не существует
    // table - таблица
    // key - название переменной
  }
  
  ping() {
    const start = Date.now();
    return Date.now() - start;
    // Эта функция выдаёт задержку в миллисекундах
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
  
module.exports = CreateJson;
