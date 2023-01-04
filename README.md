<h1>Database sempai</h1>

[![Discord Server](https://img.shields.io/discord/796504104565211187?color=7289da&logo=discord&logoColor=white)](https://discord.gg/EuSbT5HH8b)
[![NPM Version](https://img.shields.io/npm/v/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)
[![NPM Downloads](https://img.shields.io/npm/dt/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)

### Установка
```js
npm i database-sempai@2.0.1
```

### Подключение база данных Sql
```js
const { CreateSql } = require('database-sempai');

const db = new CreateSql({
  path: "./database-sql",
  // можете дать другое название
  table: ["main", "test"]
  // можете назвать как хотите
  // только всегда указывайте название таблицы в []. ["name", "users"]
})
```

### Подключение база данных Json
```js
const { CreateJson } = require('database-sempai');

const db = new CreateSql({
  path: "./database-json",
  // можете дать другое название
  table: ["main", "test"]
  // можете назвать как хотите
  // только всегда указывайте название таблицы в []. ["name", "users"]
})
```

#### Функции
`add('table', 'key', 'value')` - добавит к старому значению, новое значение

`set('table', 'key', 'value')` - изменит значение переменной, если переменной нет она создаться автоматически

`get('table', 'key', false/true)` - выдаст значение переменной

`all('table')` - покажет всё содержимое таблицы

`delete('table', 'key')` - удалит переменною

`deleteAll('table')` - удалит всё содержимое таблицы

`has('table', 'key')` - проверит существует ли переменная

`ping()` - покажет задержку в ms

#### Примеры
```js
db.set('main', 'sempai', 0)
// Переменная создана

db.get('main', 'sempai')
// Вернёт: 0
db.get('main', 'sempai', true)
// Вернёт {key: "sempai", value: 0}
db.get('main', 'sempai', true).value
// Вернёт: 0

db.add('main', 'sempai', '10')
// Добавит к переменной "sempai" 10
db.get('main', 'sempai')
// Вернёт: 010

db.all('main')
// Вернёт: {
//  "sempai": "010"
//}

db.has('main', 'sempai')
// Вернёт true
db.has('main', 'name')
// Вернёт false

db.set('main', 'weredok', '15')
// Создаём переменную
db.delete('main', 'weredok')
// Удаляем переменную
db.get('main', 'weredok')
// Вернёт: undefined, потому что переменная удаленна

db.deleteAll('main')
// Удалит все переменные в таблице

db.ping()
// Вернёт задержку в ms
```

В противных случаях: `undefined`

<h1>Database sempai</h1>

[![Discord Server](https://img.shields.io/discord/796504104565211187?color=7289da&logo=discord&logoColor=white)](https://discord.gg/EuSbT5HH8b)
[![NPM Version](https://img.shields.io/npm/v/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)
[![NPM Downloads](https://img.shields.io/npm/dt/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)

### Installation
 ```js
 npm i database-sempai@2.0.1
 ```

 ### Sql database connection
 ```js
 const { CreateSql } = require('database-sempai');

 const db = new CreateSql({
   path: "./database-sql",
   // you can give another name
   table: ["main", "test"]
   // you can call it whatever you want
   // just always put the table name in [].  ["name", "users"]
 })
 ```

 ### Json database connection
 ```js
 const { CreateJson } = require('database-sempai');

 const db = new CreateSql({
   path: "./database-json",
   // you can give another name
   table: ["main", "test"]
   // you can call it whatever you want
   // just always put the table name in [].  ["name", "users"]
 })
 ```

 #### Functions
 `add('table', 'key', 'value')` - add new value to old value

 `set('table', 'key', 'value')` - change the value of the variable, if the variable does not exist, it will be created automatically

 `get('table', 'key', false/true)` - will return the value of the variable

 `all('table')` - show the entire contents of the table

 `delete('table', 'key')` - delete a variable

 `deleteAll('table')` - delete all contents of the table

 `has('table', 'key')` - check if variable exists

 `ping()` - show delay in ms

 #### Examples
 ```js
 db.set('main', 'sempai', 0)
 // Variable created

 db.get('main', 'sempai')
 // Returns: 0
 db.get('main', 'sempai', true)
 // Returns {key: "sempai", value: 0}
 db.get('main', 'sempai', true).value
 // Returns: 0

 db.add('main', 'sempai', '10')
 // Add 10 to "sempai" variable
 db.get('main', 'sempai')
 // Returns: 010

 db.all('main')
 // Returns: {
 // "sempai": "010"
 //}

 db.has('main', 'sempai')
 // Returns true
 db.has('main', 'name')
 // Returns false

 db.set('main', 'weredok', '15')
 // Create a variable
 db.delete('main', 'weredok')
 // Delete the variable
 db.get('main', 'weredok')
 // Returns: undefined because the variable is deleted

 db.deleteAll('main')
 // Delete all variables in the table

 db.ping()
 // Return delay in ms
 ```

 Otherwise: `undefined`
