const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const cipher = require("../util/cipher.js");
const decoding = require("../util/decoding.js");
const { ErrorType, ErrorKey, ErrorExtension, ErrorTable } = require("../util/ErrorCollection.js");

function getFolderList(folderPath) {
  const folderList = [];
  const items = fs.readdirSync(path.join(process.cwd(), folderPath), { withFileTypes: true });

  items.forEach((item) => {
    if (item.isDirectory()) {
      folderList.push(item.name);
    }
  });

  return folderList;
}

const keys = (obj) => {
   if (typeof(obj) === 'object') return Object.keys(obj)
   else return [];
};

const valuess = (obj) => {
   if (typeof(obj) === 'object') return Object.values(obj)
   else return [];
};

const get = (table, dir, extname) => {
  let db = fs.readFileSync(path.join(process.cwd(), dir, table, "storage" + extname), "utf8");
      db = typeof db == "string" ? JSON.parse(db) : db;
    return db;
};

const set = (table, dir, db, extname, encryption = false) => {
  let content = JSON.stringify(db);
    fs.writeFileSync(path.join(process.cwd(), dir, table, "storage" + extname), content);
};
    
class CreateStorage extends EventEmitter {
  constructor(options = {}) {
    super();
    this.path = options.path ?? "database",
    this.table = options.table ?? ["main"],
    this.extname = options.extname ?? ".sql"
    this.key = options.key;
    

    if (fs.existsSync(path.join(process.cwd(), this.path)) === false) {
      fs.mkdirSync(path.join(process.cwd(), this.path));
    }
    let table_file = this.table;
    if(Array.isArray(table_file) === false) throw new ErrorTable("Invalid table array");
    if(!this.extname) throw new ErrorExtension("Invalid extension");
    
    for (var i = 0; i < table_file.length; i++) {
      if (fs.existsSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`)) === false) {
        fs.mkdirSync(path.join(process.cwd(), `${this.path}/${table_file[i]}`));
      }
      if (fs.existsSync(path.join(process.cwd(), this.path, table_file[i], `storage${this.extname}`)) === false) {
      fs.writeFileSync(path.join(process.cwd(), this.path, table_file[i], `storage${this.extname}`), "{}");
     }
    }
   }

   set(table, key, value, encryption = false) {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    const getValue = this.get(table, key)
    let db = get(table, this.path, this.extname);
    let values = value;
    if (encryption) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      db[key] = new Object({"key": key, "value": cipher(values, this.key)});
    } else if (encryption === false) {
      db[key] = new Object({"key": key, "value": values});
    } else {
      throw new ErrorType("Invalid type 'set'");
    }
    const newValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: value,
      encryption: encryption
    };
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: getValue,
    }
    set(table, this.path, db, this.extname);
    this.emit("update", newValue, oldValue);
  }

  get(table, key, encryption = "default") {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    let db = get(table, this.path, this.extname);
    if (this.has(table, key)) {
    let values = db[key]['value'];
    if (encryption === true) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      return cipher(values, this.key);
    } else if (encryption === false) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      return decoding(values, this.key);
    } else if (encryption === "default") {
      return values;
    } else {
      throw new ErrorType("Invalid type 'get'");
    }
   } else {
    return undefined;
   }
  }
  
  getIf(table, key, condition, encryption = "default") {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    let db = get(table, this.path, this.extname);
    if (this.has(table, key)) {
    let values = db[key]['value'];
    let shouldUpdate = eval(condition);
    if (shouldUpdate) {
    if (encryption === true) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      return cipher(values, this.key);
    } else if (encryption === false) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      return decoding(values, this.key);
    } else if (encryption === "default") {
      return values;
    } else {
      throw new ErrorType("Invalid type 'get'");
    }
   } else {
    return null;
   }
  } else {
    return undefined;
   }
  }
  
  all(table, sortBy = null) {
  if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
  let db = get(table, this.path, this.extname);
  return db;
  }
  
  findByValue(table, query, encryption = "default") {
  if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
  let db = get(table, this.path, this.extname);
  let result = [];
  for (const key in db) {
    let value = db[key]['value'];
    if (encryption === true) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      value = decoding(value, this.key);
    }
    if (typeof value === 'string' && value.includes(query)) {
      result = result.concat(db[key]);
    }
  }
  return result;
}

  setIf(table, key, value, condition, encryption = false) {
  if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
  let db = get(table, this.path, this.extname);
  if (this.has(table, key)) {
    let values = db[key]['value'];
    let shouldUpdate = eval(condition);
    if (shouldUpdate) {
      if (encryption) {
        if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
        db[key]['value'] = cipher(value, this.key);
      } else {
        db[key]['value'] = value;
      }
      const newValue = {
        table: table,
        path: this.path,
        extname: this.extname,
        key: key,
        value: value,
        encryption: encryption
      };
      const oldValue = {
        table: table,
        path: this.path,
        extname: this.extname,
        key: key,
        value: values,
      }
      set(table, this.path, db, this.extname);
      this.emit("update", newValue, oldValue);
      return null;
    } else {
     return undefined;
    }
   } else {
    throw new ErrorKey("Invalid key name: " + key);
  }
 }
 
   
  addIf(table, key, value, condition, encryption = false) {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    const getValue = this.get(table, key)
    let db = get(table, this.path, this.extname);
    if (this.has(table, key)) {
    let oldValues = db[key]['value'];
    let values = value;
    let shouldUpdate = eval(condition);
    if (shouldUpdate) {
    if (encryption) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      db[key] = new Object({"key": key, "value": oldValues + cipher(value, this.key)});
    } else if (encryption === false) {
      db[key] = new Object({"key": key, "value": oldValues + value});
    } else {
      throw new ErrorType("Invalid type 'get'")
    }
     const newValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: oldValues + value,
      encryption: encryption
    };
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: getValue,
    }
     set(table, this.path, db, this.extname);
     this.emit("update", newValue, oldValue);
     return null;
    } else {
     return undefined;
    }
   } else {
    throw new ErrorKey("Invalid key name: " + key);
  }
 }

  
  add(table, key, value, encryption = false) {
    if(!this.table.find(a => a === table)) throw new ErrorType("Invalid table name: " + table);
    const getValue = this.get(table, key)
    let db = get(table, this.path, this.extname);
    let oldValues = db[key]['value'];
    let values = value;
    if (encryption) {
      if (!this.key) throw new ErrorKey("You need to specify 'key' in the class CreateStorage");
      db[key] = new Object({"key": key, "value": oldValues + cipher(value, this.key)});
    } else if (encryption === false) {
      db[key] = new Object({"key": key, "value": oldValues + value});
    } else {
      throw new ErrorType("Invalid type 'get'")
    }
     const newValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: oldValues + value,
      encryption: encryption
    };
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: getValue,
    }
    set(table, this.path, db, this.extname);
    this.emit("update", newValue, oldValue);
  }
  
  delete(table, key, oldValues) {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    let db = get(table, this.path, this.extname);
    let values = this.get(table, key);
    const oldValue = {
      table: table,
      path: this.path,
      extname: this.extname,
      key: key,
      value: values,
    }
    delete db[key];
    set(table, this.path, db, this.extname);
    this.emit("delete", oldValue);
    if (oldValues) {
      return values;
    }
  }
  
  deleteAll(table) {
  if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
  let db = {};
  const oldValue = {
    table: table,
    path: this.path,
    extname: this.extname,
    value: this.all(table),
  };
  set(table, this.path, db, this.extname);
  this.emit("deleteAll", oldValue);
 }
  
  has(table, key) {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
    let db = get(table, this.path, this.extname);
    return db[key] === undefined ? false : true;
  }
  
  forEach(table, callback) {
    if(!this.table.find(a => a === table)) throw new ErrorTable("Invalid table name: " + table);
     const db = get(table, this.path, this.extname);
     for (const key in db) {
      const value = db[key].value;
      callback(value, key, db);
     }
   }
   
  get getPath() {
   return this.path;
 }
   
  setPath(newPath) {
  if (fs.existsSync(path.join(process.cwd(), newPath)) === false) {
    fs.mkdirSync(path.join(process.cwd(), newPath));
    for (const tableName of this.table) {
      fs.mkdirSync(path.join(process.cwd(), newPath, tableName));
      fs.writeFileSync(path.join(process.cwd(), newPath, tableName, `storage${this.extname}`), "{}");
    }
  } else {
    for (const tableName of this.table) {
      if (fs.existsSync(path.join(process.cwd(), newPath, tableName)) === false) {
        fs.mkdirSync(path.join(process.cwd(), newPath, tableName));
        fs.writeFileSync(path.join(process.cwd(), newPath, tableName, `storage${this.extname}`), "{}");
      }
    }
  }
  this.path = newPath;
 }
  
  hasTable(tableName) {
   return this.table.includes(tableName);
  }
  
  get getTables() {
   return this.table;
  }
   
  setTable(oldTableName, newTableName) {
  if (fs.existsSync(path.join(process.cwd(), this.path, oldTableName)) === true) {
    fs.renameSync(path.join(process.cwd(), this.path, oldTableName), path.join(process.cwd(), this.path, newTableName));
    this.table = this.table.map(name => name === oldTableName ? newTableName : name);
  }
 }

  createTable(tableName) {
  if (fs.existsSync(path.join(process.cwd(), this.path, tableName)) === false) {
    fs.mkdirSync(path.join(process.cwd(), this.path, tableName));
    fs.writeFileSync(path.join(process.cwd(), this.path, tableName, `storage${this.extname}`), "{}");
    this.table.push(tableName);
    const pathTable = path.join(process.cwd(), this.path, tableName)
    const newTable = {
      name: tableName,
      path: pathTable,
      table: this.table
    }
    this.emit("createTable", newTable)
   }
  }
  
  isTable(table) {
   return this.table.find(a => a === table) === undefined ? false : true;
  }

  connect() {
   this.emit("ready");
   }
  }
  
module.exports = CreateStorage;