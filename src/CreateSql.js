const fs = require('fs');
const path = require('path');
//const DatabaseError = require("./DatabaseError.js") попойже в v2.0.2

const get = (table, dir) => {
  let db = fs.readFileSync(path.join(process.cwd(), dir, table, "storage.sql"), "utf8");
    db = typeof db == "string" ? JSON.parse(db) : db;
      return db;
};

const set = (table, dir, db) => {
  let content = JSON.stringify(db);
    fs.writeFileSync(path.join(process.cwd(), dir, table, "storage.sql"), content);
};
    
class CreateSql {
  constructor(options) {
    this.path = options.path || ["database"],
    this.table = options.table || ["main"];

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
      // параметр table указывайте в [], если нет будет ошибка или же эта хрень не будет работать нормально
    }

  set(table, key, value) {
    let db = get(table, this.path);
    db[key] = new Object({"key": key, "value": value})
    set(table, this.path, db);
    // Эта функция создаёт или же меняет содержимое переменной
    // key - название переменной у которой мы хотим изменить значение
    // value - новое значение переменной
  }
  
  get(table, key, json = false) {
    let db = get(table, this.path);
    return json === true ? db[key] : db[key]['value'];
    // Эта функция выдаёт содержимое переменнои
    // Если json будет true вам выдастся {key: "название", value: "содержимое"}, чтобы достать инфу вы просто делаете: get("test", true).value
    // Если json будет false (по умолчанию тож стоит false), оно просто вам выдаст содержимое переменной
  }
  
  all(table) {
    let db = get(table, this.path);
    return db;
    // table - название таблицы у которой мы хотим вывести всё содержимое в json формате
  }
  
  add(table, key, value) {
    let db = get(table, this.path);
    let oldValue = db[key]['value'];
    db[key] = new Object({"key": key, "value": oldValue + value});
    set(table, this.path, db);
    // Эта функция додаёт новое значение, не изменяя старое
    // key - название переменной для которой мы будем добавлять содержимое
    // value - новое содержимое которое будет добавлено к старому
  }
  
  delete(table, key) {
    let db = get(table, this.path);
    delete db[key];
    set(table, this.path, db);
    // Эта функция удаляет переменною с таблицы
  }
  
  deleteAll(table) {
      fs.writeFileSync(path.join(process.cwd(), this.path, table, "storage.sql"), "{}");
    // Эта функция удалит всё содержимое table. Будьте осторожны
  }
  
  has(table, key) {
    let db = get(table, this.path);
    return db[key] === undefined ? false : true;
    // Эта функция проверяет, существует ли указанная переменная, выдаёт логическое выражение:
    // true - указанная переменная существует
    // false - указанная переменная не существует
  }
  
  ping() {
    const start = Date.now();
    return Date.now() - start;
    // Эта функция выдаёт задержку в миллисекундах
  }
  }
  
module.exports = CreateSql;